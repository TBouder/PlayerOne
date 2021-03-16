/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useWeb3.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	axios												from	'axios';
import	{ethers}											from	'ethers';
import	WalletConnect										from	'@walletconnect/client';
import	QRCodeModal											from	'@walletconnect/qrcode-modal';
import	useLocalStorage										from	'hook/useLocalStorage';

const fetcher = url => axios.get(url).then(res => res.data);

const	ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || 'M63TWVTHMKIBXEQHXHKEF87RU16GSMQV9S';
const	fetchERC20 = address => fetcher(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}`);
const	fetchTx = address => fetcher(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}`);

const Web3Context = createContext();
export const Web3ContextApp = ({children, onRestart, shouldRecheck}) => {
	const walletType = {
		NONE: -1,
		METAMASK: 0,
		WALLET_CONNECT: 1,
	};
	const	[nonce, set_nonce] = useState(0);
	const	[provider, set_provider] = useState(undefined);
	const	[connector, set_connector] = useState(undefined);
	const	[providerType, set_providerType] = useLocalStorage('providerType', walletType.NONE); //-1 none | 0 web3 | 1 wc
	const	[address, set_address] = useLocalStorage('address', '');
	const	[walletData, set_walletData] = useState({erc20: undefined, transactions: undefined, ready: false});

	useEffect(() => {
		if (walletData.ready) {
			shouldRecheck();
		}
	}, [walletData.ready])

	/**************************************************************************
	**	If user was connected with metamask, auto-reconnect
	**************************************************************************/
	useEffect(() => {
		if (nonce === 0) {
			if (providerType === walletType.METAMASK) {
				connect(walletType.METAMASK);
				set_nonce(n => n + 1);
			} else {
				set_address('');
				set_providerType(walletType.NONE);
				set_nonce(n => n + 1);
			}
		} else {
			set_nonce(n => n + 1);
		}
	}, []);

	/**************************************************************************
	**	Wallet & account management
	**************************************************************************/
	function	disconnect(error) {
		if (error)
			console.error(error);
		set_provider(undefined);
		set_connector(undefined);
		set_providerType(walletType.NONE);
		set_address('');
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		onRestart();
	}
	function	onConnect(_provider, _walletType, _account) {
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_provider(_provider);
		set_providerType(_walletType);
		set_address(_account);
		onRestart();

		fetchERC20(_account).then((walletDataERC20) => {
			set_walletData(wc => ({
				transactions: wc.transactions,
				erc20: walletDataERC20.result || [],
				ready: Boolean(wc.transactions && walletDataERC20.result)
			}));
		});
		fetchTx(_account).then((walletDataTransactions) => {
			set_walletData(wc => ({
				transactions: walletDataTransactions.result || [],
				erc20: wc.erc20,
				ready: Boolean(walletDataTransactions.result && wc.erc20)
			}));
		});
	}
	function	onChangeAccount(_account) {
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_address(_account);
		onRestart();

		fetchERC20(_account).then((walletDataERC20) => {
			set_walletData(wc => ({
				transactions: wc.transactions,
				erc20: walletDataERC20.result || [],
				ready: Boolean(wc.transactions && walletDataERC20.result)
			}));
		});
		fetchTx(_account).then((walletDataTransactions) => {
			set_walletData(wc => ({
				transactions: walletDataTransactions.result || [],
				erc20: wc.erc20,
				ready: Boolean(walletDataTransactions.result && wc.erc20)
			}));
		});
	}
	async function	connect(_providerType) {
		const	web3Provider = window.ethereum || 'wss://eth-mainnet.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';
		if (window.ethereum)
			await window.ethereum.enable();

		if (_providerType === walletType.METAMASK) {
			const	_provider = new ethers.providers.Web3Provider(web3Provider)
			const	signer = await _provider.getSigner();
			const	address = await signer.getAddress();
			onConnect(_provider, walletType.METAMASK, address);
			ethereum.on('accountsChanged', accounts => onChangeAccount(accounts[0]));
			ethereum.on('disconnect', () => disconnect());


		} else if (_providerType === walletType.WALLET_CONNECT) {
			const _connector = new WalletConnect({
				bridge: "https://bridge.walletconnect.org", // Required
				qrcodeModal: QRCodeModal,
			});
			if (_connector.connected)
				await _connector.killSession();
			await _connector.createSession();
			set_connector(_connector)

			_connector.on('connect', (err, d) => {
				if (err) {
					return console.error(err)
				}
				const	_provider = new ethers.providers.AlchemyProvider('homestead', 'v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf')
				onConnect(_provider, walletType.WALLET_CONNECT, d.params[0].accounts[0]);
			});
			_connector.on('disconnect', () => disconnect());
			_connector.on('session_update', (_, d) => onChangeAccount(d.params[0].accounts[0]));
		}
	}

	/**************************************************************************
	**	Web3 actions
	**************************************************************************/
	async function	sign(data, domain, types, value, callback = () => null) {
		if (providerType === walletType.WALLET_CONNECT) {
			connector.signPersonalMessage([address, data])
			.then(result => callback(result))
			.catch(error => console.error(error))
		} else if (providerType === walletType.METAMASK) {
			const	signer = provider.getSigner();
			const	signature = await signer._signTypedData(domain, types, value);
			callback(signature);
		}
	}

	return (
		<Web3Context.Provider
			children={children}
			value={{
				address,
				connect,
				disconnect,
				providerType,
				walletType,
				walletData,
				provider,
				actions: {
					sign
				}
			}} />
	)
}

export const useWeb3 = () => useContext(Web3Context)
export default useWeb3;
