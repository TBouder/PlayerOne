/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useWeb3.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	{ethers}											from	'ethers';
import	{useToasts}											from	'react-toast-notifications';
import	WalletConnect										from	'@walletconnect/client';
import	QRCodeModal											from	'@walletconnect/qrcode-modal';
import	useLocalStorage										from	'hook/useLocalStorage';
import	{fetcher, toAddress}								from	'utils';

const	ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || 'M63TWVTHMKIBXEQHXHKEF87RU16GSMQV9S';
function	fetchERC20(baseUri, address) {
	return fetcher(`${baseUri}?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}`)
};
function	fetchTx(baseUri, address) {
	return fetcher(`${baseUri}?module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}`)
};

function	etherscanBaseDomain(chainID = 1) {
	if (chainID === 3) {
		return (`https://api-ropsten.etherscan.io/api`);
	}
	return (`https://api.etherscan.io/api`);
}

const Web3Context = createContext();
export const Web3ContextApp = ({children, set_shouldReset}) => {
	const	{addToast} = useToasts();
	const	walletType = {NONE: -1, METAMASK: 0, WALLET_CONNECT: 1};
	const	[nonce, set_nonce] = useState(0);
	const	[provider, set_provider] = useState(undefined);
	const	[connector, set_connector] = useState(undefined);
	const	[providerType, set_providerType] = useLocalStorage('providerType', walletType.NONE);
	const	[address, set_address] = useLocalStorage('address', '');
	const	[chainID, set_chainID] = useLocalStorage('chainID', -1);
	const	[walletData, set_walletData] = useState({erc20: undefined, transactions: undefined, ready: false});

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
	**	disconnect
	**	What should we do when the user choose to disconnect it's wallet, 
	**	from the UI or from it's wallet approval ?
	**	Spoiler : reset the app state to default
	**************************************************************************/
	function	disconnect(error) {
		if (error) {
			addToast(error, {appearance: 'error'});
			return console.error(error);
		}
		set_provider(undefined);
		set_connector(undefined);
		set_providerType(walletType.NONE);
		set_chainID(-1);
		set_address('');
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_shouldReset();
	}

	/**************************************************************************
	**	connect
	**	What should we do when the user choose to connect it's wallet ?
	**	Based on the providerType (AKA Metamask or WalletConnect), differents
	**	actions should be done.
	**	Then, depending on the providerType, a similar action, but different
	**	code is executed to set :
	**	- The provider for the web3 actions
	**	- The current address/account
	**	- The current chain
	**	Moreover, we are starting to listen to events (disconnect, changeAccount
	**	or changeChain).
	**************************************************************************/
	async function	connect(_providerType) {
		/******************************************************************
		**	First, connect the web3 provider (window.ethereum, for Brave or
		**	Metamask, and the alchemy provider in any other case).
		**	⚠️ An in house node is preferable
		**	⚠️ Alchemy is prefered because of it's archive node.
		**	⚠️ We should add some fallback for the web3provider
		******************************************************************/
		const	web3Provider = window.ethereum || 'wss://eth-mainnet.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';
		// 'wss://eth-ropsten.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';

		if (_providerType === walletType.METAMASK) {
			const	_provider = new ethers.providers.Web3Provider(web3Provider)
			await _provider.send('eth_requestAccounts');
			const	signer = await _provider.getSigner();
			const	address = await signer.getAddress();
			const	_chainID = (await _provider.getNetwork()).chainId;

			onConnect(_provider, walletType.METAMASK, _chainID, address);
			ethereum.on('accountsChanged', accounts => onChangeAccount(undefined, accounts[0]));
			ethereum.on('disconnect', () => disconnect());
			ethereum.on('chainChanged', _chainID => onChangeChain(_chainID));
		} else if (_providerType === walletType.WALLET_CONNECT) {
			const _connector = new WalletConnect({bridge: "https://bridge.walletconnect.org", qrcodeModal: QRCodeModal});

			/******************************************************************
			**	In order to prevent undefined behaviors, we kill the session
			**	if the user tries to create a new one's with an existing one
			**	already existing.
			******************************************************************/
			if (_connector.connected)
				await _connector.killSession();
			await _connector.createSession();
			set_connector(_connector)

			_connector.on('connect', (err, d) => {
				if (err) {
					addToast(err, {appearance: 'error'});
					return console.error(err)
				}
				const	_provider = new ethers.providers.AlchemyProvider('homestead', 'v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf')
				onConnect(_provider, walletType.WALLET_CONNECT, d.params[0].chainId, d.params[0].accounts[0]);
			});
			_connector.on('disconnect', () => disconnect());
			_connector.on('session_update', (_, d) => onChangeAccount(d.params[0].chainId, d.params[0].accounts[0]));
		}
	}

	/**************************************************************************
	**	onConnect
	**	Function triggered once the wallet is connected (aka the user has
	**	accepted the connection).
	**	Actually set the states for this application
	**	Try to fetch the needed data for this wallet, aka the etherscan
	**	transactions
	**************************************************************************/
	function	onConnect(_provider, _walletType, _chainID, _account) {
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_provider(_provider);
		set_providerType(_walletType);
		set_address(toAddress(_account));
		set_chainID(_chainID);

		fetchERC20(etherscanBaseDomain(_chainID), _account).then((walletDataERC20) => {
			set_walletData(wc => ({
				transactions: wc.transactions,
				erc20: walletDataERC20.result || [],
				ready: Boolean(wc.transactions && walletDataERC20.result)
			}));
		});
		fetchTx(etherscanBaseDomain(_chainID), _account).then((walletDataTransactions) => {
			set_walletData(wc => ({
				transactions: walletDataTransactions.result || [],
				erc20: wc.erc20,
				ready: Boolean(walletDataTransactions.result && wc.erc20)
			}));
		});
	}
	function	onChangeAccount(_chainID = chainID, _account) {
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_address(toAddress(_account));
		set_chainID(_chainID);
		set_shouldReset();

		fetchERC20(etherscanBaseDomain(_chainID), _account).then((walletDataERC20) => {
			set_walletData(wc => ({
				transactions: wc.transactions,
				erc20: walletDataERC20.result || [],
				ready: Boolean(wc.transactions && walletDataERC20.result)
			}));
		});
		fetchTx(etherscanBaseDomain(_chainID), _account).then((walletDataTransactions) => {
			set_walletData(wc => ({
				transactions: walletDataTransactions.result || [],
				erc20: wc.erc20,
				ready: Boolean(walletDataTransactions.result && wc.erc20)
			}));
		});
	}
	async function	onChangeChain(_chainID) {
		set_chainID(_chainID)
		if (providerType === walletType.METAMASK) {
			const	web3Provider = window.ethereum || 'wss://eth-ropsten.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';
			const	_provider = new ethers.providers.Web3Provider(web3Provider);
			await _provider.send('eth_requestAccounts');
			const	signer = await _provider.getSigner();
			const	address = await signer.getAddress();

			set_walletData({erc20: undefined, transactions: undefined, ready: false});
			set_provider(_provider);
			set_address(toAddress(address));
			set_chainID(_chainID);
			set_shouldReset();
	
			fetchERC20(etherscanBaseDomain(_chainID), address).then((walletDataERC20) => {
				set_walletData(wc => ({
					transactions: wc.transactions,
					erc20: walletDataERC20.result || [],
					ready: Boolean(wc.transactions && walletDataERC20.result)
				}));
			});
			fetchTx(etherscanBaseDomain(_chainID), address).then((walletDataTransactions) => {
				set_walletData(wc => ({
					transactions: walletDataTransactions.result || [],
					erc20: wc.erc20,
					ready: Boolean(walletDataTransactions.result && wc.erc20)
				}));
			});

			ethereum.on('accountsChanged', accounts => onChangeAccount(undefined, accounts[0]));
			ethereum.on('disconnect', () => disconnect());
			ethereum.on('chainChanged', _chainID => onChangeChain(_chainID));
		}
	}

	/**************************************************************************
	**	Web3 actions
	**************************************************************************/
	async function	sign(domain, types, value, callback = () => null) {
		if (providerType === walletType.WALLET_CONNECT) {
			connector.signPersonalMessage([address, JSON.stringify({domain, types, value})])
			.then(result => callback(result))
			.catch((error) => {
				addToast(error, {appearance: 'error'});
				console.error(error)
			})
		} else if (providerType === walletType.METAMASK) {
			try {
				const	signer = provider.getSigner();
				const	signature = await signer._signTypedData(domain, types, value);
				callback(signature);
			} catch (error) {
				addToast(error.message, {appearance: 'error'});
				console.error(error)
			}
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
					sign,
				}
			}} />
	)
}

export const useWeb3 = () => useContext(Web3Context)
export default useWeb3;
