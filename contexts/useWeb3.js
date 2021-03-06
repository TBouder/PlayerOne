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
import	{useWeb3React}										from	'@web3-react-fork/core';
import	{InjectedConnector}									from	'@web3-react-fork/injected-connector';
import	{ConnectorEvent}									from	'@web3-react-fork/types';
import	{WalletConnectConnector}							from	'@web3-react-fork/walletconnect-connector';
import	useLocalStorage										from	'hook/useLocalStorage';
import	{fetcher, toAddress}								from	'utils';

const	ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;
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
	const	[ethMainnetProvider, set_ethMainnetProvider] = useState(undefined);
	const	[currentDeployProvider, set_currentDeployProvider] = useState(undefined);
	const	[address, set_address] = useLocalStorage('address', '');
	const	[chainID, set_chainID] = useLocalStorage('chainID', -1);
	const	[lastWallet, set_lastWallet] = useLocalStorage('lastWallet', walletType.NONE);
	const	[nonce, set_nonce] = useState(0);
	const	[walletData, set_walletData] = useState({erc20: undefined, transactions: undefined, ready: false});

	const	{activate, active, library, connector, account, chainId, deactivate} = web3;

	useEffect(() => {
		if (active)
			onActivate()
	}, [active])

	useEffect(() => {
		if (!active && lastWallet !== walletType.NONE) {
			connect(lastWallet);
		}
	}, [])

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
		set_lastWallet(walletType.NONE);
		if (connector !== undefined) {
			connector
				.off(ConnectorEvent.Update, onUpdate)
				.off(ConnectorEvent.Deactivate, onDesactivate)
		}
	}
	function	onUpdate(update) {
		if (update.provider) {
			set_provider(library);
		}
		if (update.chainId) {
			set_chainID(parseInt(update.chainId, 16));
		}
		if (update.account) {
			set_shouldReset();
			set_walletData({erc20: undefined, transactions: undefined, ready: false});
			set_address(toAddress(update.account));
			fetchOnEtherscan(update.chainId, update.account);
		}
		set_nonce(n => n + 1);
	}

	function	fetchOnEtherscan(_chainID, _address) {

		// //UNISWAP V2 -> ENTER LP
		// "0xe8e33700": "addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)",
		// "0xf305d719": "addLiquidityETH(address,uint256,uint256,uint256,address,uint256)",

		// //UNISWAP V2 -> LEAVE LP
		// "0xbaa2abde": "removeLiquidity(address,address,uint256,uint256,uint256,address,uint256)",
		// "0x02751cec": "removeLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
		// "0xded9382a": "removeLiquidityETHWithPermit(address,uint256,uint256,uint256,address,uint256,bool,uint8,bytes32,bytes32)",
		// "0x2195995c": "removeLiquidityWithPermit(address,address,uint256,uint256,uint256,address,uint256,bool,uint8,bytes32,bytes32)",

		// //UNISWAP V2 -> SWAP
		// "0xfb3bdb41": "swapETHForExactTokens(uint256,address[],address,uint256)",
		// "0x7ff36ab5": "swapExactETHForTokens(uint256,address[],address,uint256)",
		// "0x18cbafe5": "swapExactTokensForETH(uint256,uint256,address[],address,uint256)",
		// "0x38ed1739": "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
		// "0x4a25d94a": "swapTokensForExactETH(uint256,uint256,address[],address,uint256)",
		// "0x8803dbee": "swapTokensForExactTokens(uint256,uint256,address[],address,uint256)",
		fetchERC20(etherscanBaseDomain(_chainID), _address).then((walletDataERC20) => {
			set_walletData(wc => ({
				transactions: wc.transactions,
				erc20: walletDataERC20.result || [],
				ready: Boolean(wc.transactions && walletDataERC20.result)
			}));
		});
		fetchTx(etherscanBaseDomain(_chainID), _address).then(async (walletDataTransactions) => {
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
		const	_provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		set_ethMainnetProvider(_provider)

		const	_maticProvider = new ethers.providers.WebSocketProvider(`wss://rpc-mumbai.maticvigil.com/ws/v1/${process.env.MATICVIGIL_KEY}`)
		set_currentDeployProvider(_maticProvider)
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
		if (_providerType === walletType.METAMASK) {
			if (active) {
				deactivate()
			}
			const	injected = new InjectedConnector({
				supportedChainIds: [
					1, //ETH MAINNET
					3, // ETH ROPSTEN
					137, // MATIC MAINET
					80001, //MATIC TESTNET
					1337 // ETH MAJORNET
				]
			})
			activate(injected, undefined, true);
			set_lastWallet(walletType.METAMASK);
		} else if (_providerType === walletType.WALLET_CONNECT) {
			if (active) {
				deactivate()
			}
			const walletconnect = new WalletConnectConnector({
				rpc: {
					1: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
					3: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
					137: `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATICVIGIL_KEY}`,
					80001: `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATICVIGIL_KEY}`,
				},
				chainId: 1,
				bridge: 'https://bridge.walletconnect.org',
				pollingInterval: 12000,
				qrcodeModal: QRCodeModal,
				qrcode: true,
			});
			activate(walletconnect, undefined, true);
			set_lastWallet(walletType.WALLET_CONNECT);
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
	async function	claimMultiple(tokenAddress, txPayload, gasPrice, callback = () => null) {
		const	CLAIMS_ABI = ["function claim(address validator, address requestor, uint256[] memory _achievements, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public"];
		const	signer = provider.getSigner();
		const	contract = new ethers.Contract(tokenAddress, CLAIMS_ABI, signer);
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

		const	SWAP_ABI = [
			"function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
		];
		const	signer = provider.getSigner();
		const	contract = new ethers.Contract(contractAddress, SWAP_ABI, signer);
		let		transactionResponse = undefined;

		try {
			transactionResponse = await contract.swapETHForExactTokens(...txPayload, {value: payableAmount, from: address});
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
				onDesactivate,
				walletType,
				walletData,
				chainID,
				active,

				provider,
				currentRPCProvider: provider,
				ethMainnetProvider: ethMainnetProvider,
				currentDeployProvider: currentDeployProvider,

				actions: {
					sign,
					claim,
					claimMultiple,
					swapOnSushiswap
				}
			}} />
	)
}

export const useWeb3 = () => useContext(Web3Context)
export default useWeb3;
