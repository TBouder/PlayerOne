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

import	{useWeb3React}										from	'dependencies/@web3-react/core';
import	{InjectedConnector}									from	'dependencies/@web3-react/injected-connector';
import	{ConnectorEvent}									from	'dependencies/@web3-react/types';
import	{WalletConnectConnector}							from	'dependencies/@web3-react/walletconnect-connector';

import	useLocalStorage										from	'hook/useLocalStorage';
import	{bigNumber, fetcher, toAddress}								from	'utils';
import { Percent } from '@uniswap/sdk'

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
	const	web3 = useWeb3React();
	const	walletType = {NONE: -1, METAMASK: 0, WALLET_CONNECT: 1};
	const	[provider, set_provider] = useState(undefined);
	const	[rProvider, set_rProvider] = useState(undefined);
	const	[address, set_address] = useLocalStorage('address', '');
	const	[chainID, set_chainID] = useLocalStorage('chainID', -1);
	const	[nonce, set_nonce] = useState(0);
	const	[walletData, set_walletData] = useState({erc20: undefined, transactions: undefined, ready: false});

	const	{activate, active, library, connector, account, chainId, deactivate} = web3;

	useEffect(() => {
		if (active) {
			onActivate()
		} else {
			onDesactivate()
		}
	}, [active])

	useEffect(() => {
		if (nonce > 0) {
			fetchOnEtherscan(chainID, address);
		}
	}, [nonce])

	function	onActivate() {
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_provider(library);
		set_address(toAddress(account));
		set_chainID(parseInt(chainId, 16));
		fetchOnEtherscan(chainId, account);

		connector
			.on(ConnectorEvent.Update, onUpdate)
			.on(ConnectorEvent.Deactivate, onDesactivate)
	}
	function	onDesactivate() {
		set_address('');
		set_chainID(-1);
		set_provider(undefined);
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_shouldReset();
		if (connector !== undefined) {
			connector
				.off(ConnectorEvent.Update, onUpdate)
				.off(ConnectorEvent.Deactivate, onDesactivate)
		}
	}
	function	onUpdate(update) {
		set_walletData({erc20: undefined, transactions: undefined, ready: false});
		set_shouldReset();

		if (update.provider) {
			set_provider(library);
		}
		if (update.chainId) {
			set_chainID(parseInt(update.chainId, 16));
		}
		if (update.account) {
			set_address(toAddress(update.account));
		}
		set_nonce(n => n + 1);
	}

	function	fetchOnEtherscan(_chainID, _address) {
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
	}

	/**************************************************************************
	**	Init default provider
	**************************************************************************/
	useEffect(() => {
		const	_provider = new ethers.providers.AlchemyProvider('homestead', 'v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf')
		set_rProvider(_provider)
	}, [])

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

		if (_providerType === walletType.METAMASK) {
			if (active) {
				deactivate()
			}
			const	injected = new InjectedConnector({supportedChainIds: [1, 3, 1337]})
			activate(injected, undefined, true);
		} else if (_providerType === walletType.WALLET_CONNECT) {
			if (active) {
				deactivate()
			}
			const walletconnect = new WalletConnectConnector({
				rpc: {
					1: 'https://eth-mainnet.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf',
					3: 'https://eth-ropsten.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf',
				},
				chainId: 1,
				bridge: 'https://bridge.walletconnect.org',
				pollingInterval: 12000,
				qrcodeModal: QRCodeModal,
				qrcode: true,
			});
			activate(walletconnect, undefined, true);
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
	async function	swapOnSushiswap(contractAddress, txPayload, payableAmount, callback = () => null) {
		addToast(`This path is not completed yet`, {appearance: 'warning'});

		const	SUSHISWAP_ABI = [
			"function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
		];
		const	signer = provider.getSigner();
		const	contract = new ethers.Contract(contractAddress, SUSHISWAP_ABI, signer);
		let		transactionResponse = undefined;

		try {
			transactionResponse = await contract.swapETHForExactTokens(...txPayload, {value: payableAmount});
		} catch (error) {
			console.log(error)
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
				deactivate,
				walletType,
				walletData,
				provider,
				rProvider,
				chainID,
				active,
				actions: {
					sign,
					claim,
					swapOnSushiswap
				}
			}} />
	)
}

export const useWeb3 = () => useContext(Web3Context)
export default useWeb3;
