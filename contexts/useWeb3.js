/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useWeb3.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	{ethers}											from	'ethers';
import	{useToasts}											from	'react-toast-notifications';
import	QRCodeModal											from	'@walletconnect/qrcode-modal';
import	WalletConnectProvider								from	'@walletconnect/web3-provider';
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
	if (chainID === 3 || chainID === '0x3') {
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
	const	[providerType, set_providerType] = useLocalStorage('providerType', walletType.NONE);
	const	[address, set_address] = useLocalStorage('address', '');
	const	[chainID, set_chainID] = useLocalStorage('chainID', -1);
	const	[walletData, set_walletData] = useState({erc20: undefined, transactions: undefined, ready: false});

	/**************************************************************************
	**	If user was connected with metamask, auto-reconnect
	**************************************************************************/
	useEffect(() => {
		if (nonce === 0) {
			connect(providerType);
			set_nonce(n => n + 1);
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
		const	web3Provider = window.ethereum || 'wss://eth-ropsten.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';
		// const	web3Provider = window.ethereum || 'wss://eth-mainnet.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';
		// 'wss://eth-ropsten.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';

		if (_providerType === walletType.METAMASK) {
			const	_provider = new ethers.providers.Web3Provider(web3Provider)
			await _provider.send('eth_requestAccounts');
			const	signer = await _provider.getSigner();
			const	_address = await signer.getAddress();
			const	_chainID = (await _provider.getNetwork()).chainId;

			onConnect(_provider, walletType.METAMASK, _chainID, _address);
			ethereum.on('accountsChanged', accounts => onChangeAccount(accounts[0]));
			ethereum.on('disconnect', () => disconnect());
			ethereum.on('chainChanged', _chainID => onChangeChain(_chainID, walletType.METAMASK));
		} else if (_providerType === walletType.WALLET_CONNECT) {
			const wcProvider = new WalletConnectProvider({
				rpc: {
					1: 'https://eth-mainnet.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf',
					3: 'https://eth-ropsten.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf',
				},
				bridge: 'https://bridge.walletconnect.org',
				qrcodeModal: QRCodeModal
			});
			await wcProvider.enable();

			const	_provider = new ethers.providers.Web3Provider(wcProvider)
			const	signer = await _provider.getSigner();
			const	_address = await signer.getAddress();
			const	_chainID = (await _provider.getNetwork()).chainId;

			onConnect(_provider, walletType.WALLET_CONNECT, _chainID, _address);
			_provider.provider.on('connect', accounts => onChangeAccount(accounts[0]));
			_provider.provider.on('disconnect', () => disconnect());
			_provider.provider.on('chainChanged', newChainID => onChangeChain(newChainID, walletType.WALLET_CONNECT));
			_provider.provider.on('accountsChanged', accounts => onChangeAccount(accounts[0]));
			_provider.provider.on('wc_sessionUpdate', newChainID => onChangeChain(newChainID, walletType.WALLET_CONNECT));
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
		set_chainID(parseInt(_chainID, 16));

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
	async function	onChangeAccount(_account) {
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_address(toAddress(_account));
		set_shouldReset();

		fetchERC20(etherscanBaseDomain(chainID), _account).then((walletDataERC20) => {
			set_walletData(wc => ({
				transactions: wc.transactions,
				erc20: walletDataERC20.result || [],
				ready: Boolean(wc.transactions && walletDataERC20.result)
			}));
		});
		fetchTx(etherscanBaseDomain(chainID), _account).then((walletDataTransactions) => {
			set_walletData(wc => ({
				transactions: walletDataTransactions.result || [],
				erc20: wc.erc20,
				ready: Boolean(walletDataTransactions.result && wc.erc20)
			}));
		});
	}
	async function	onChangeChain(_chainID, wallet, _provider = provider) {
		if (wallet === walletType.METAMASK) {
			const	web3Provider = window.ethereum || 'wss://eth-ropsten.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';
			const	_provider = new ethers.providers.Web3Provider(web3Provider);
			await _provider.send('eth_requestAccounts');
			const	signer = await _provider.getSigner();
			const	_address = await signer.getAddress();

			set_walletData({erc20: undefined, transactions: undefined, ready: false});
			set_provider(_provider);
			set_chainID(parseInt(_chainID, 16))
			set_address(toAddress(_address));
			set_shouldReset();

			fetchERC20(etherscanBaseDomain(_chainID), _address).then((walletDataERC20) => {
				set_walletData(wc => ({
					transactions: wc.transactions,
					erc20: walletDataERC20.result || [],
					ready: Boolean(wc.transactions && walletDataERC20.result)
				}));
			});
			fetchTx(etherscanBaseDomain(_chainID), _address).then((walletDataTransactions) => {
				set_walletData(wc => ({
					transactions: walletDataTransactions.result || [],
					erc20: wc.erc20,
					ready: Boolean(walletDataTransactions.result && wc.erc20)
				}));
			});

			ethereum.removeAllListeners()
			ethereum.on('accountsChanged', accounts => onChangeAccount(undefined, accounts[0]));
			ethereum.on('disconnect', () => disconnect());
			ethereum.on('chainChanged', _chainID => onChangeChain(_chainID));
		} else if (wallet === walletType.WALLET_CONNECT) {
			const wcProvider = new WalletConnectProvider({
				chainId: _chainID,
				rpc: {
					1: 'https://eth-mainnet.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf',
					3: 'https://eth-ropsten.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf',
				},
				bridge: 'https://bridge.walletconnect.org',
				qrcodeModal: QRCodeModal
			});
			await wcProvider.enable();
			const	_provider = new ethers.providers.Web3Provider(wcProvider)
			const	signer = await _provider.getSigner();
			const	_address = await signer.getAddress();
			set_chainID(_chainID);
			onConnect(_provider, walletType.WALLET_CONNECT, _chainID, _address);
			set_shouldReset();
		}
	}

	/**************************************************************************
	**	Web3 actions
	**************************************************************************/
	async function	sign(domain, types, value, callback = () => null) {
		try {
			const	signer = provider.getSigner();
			const	signature = await signer._signTypedData(domain, types, value);
			callback(signature);
		} catch (error) {
			addToast(error.message, {appearance: 'error'});
			console.error(error)
		}
	}
	async function	claim(tokenAddress, txPayload, gasPrice, callback = () => null) {
		const	CLAIM_ABI = ["function claim(address validator, address requestor, uint256 achievement, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public"];
		const	signer = provider.getSigner();
		const	contract = new ethers.Contract(tokenAddress, CLAIM_ABI, signer);
		let		transactionResponse = undefined;

		try {
			if (gasPrice && walletType === walletType.METAMASK) {
				transactionResponse = await contract.functions.claim(...txPayload, gasPrice);
			} else {
				transactionResponse = await contract.functions.claim(...txPayload);
			}
		} catch (error) {
			console.log(txPayload)

			if (error?.error?.message) {
				const	errorMessage = error.error.message.replace(`execution reverted: `, '');
				if (errorMessage === 'Achievement already unlocked') {
					return callback({status: 'SUCCESS'});
				} else {
					addToast(errorMessage, {appearance: 'error'});
				}
			} else {
				addToast(`Impossible to perform the tx`, {appearance: 'error'});
			}
			return callback({status: 'ERROR'});
		}
	
		callback({status: 'SEND_TRANSACTION'})
		if (transactionResponse.wait) {
			try {
				const	receipt = await transactionResponse.wait(1);
				if (receipt && receipt.status === 1) {
					return callback({status: 'SUCCESS'});
				}
				return callback({status: 'ERROR'});
			} catch(error) {
				return addToast(`Transaction reverted`, {appearance: 'error'});
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
				chainID,
				actions: {
					sign,
					claim
				}
			}} />
	)
}

export const useWeb3 = () => useContext(Web3Context)
export default useWeb3;
