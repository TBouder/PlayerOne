/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useWeb3.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	axios										from	'axios';
import	useSWR, {mutate}							from	'swr';
import	Web3										from	'web3';
import	WalletConnect								from	'@walletconnect/client';
import	QRCodeModal									from	'@walletconnect/qrcode-modal';
import	useLocalStorage								from	'hook/useLocalStorage';
import	Achievements								from	'achievements/achievements';
import	UUID										from	'utils/uuid';

const fetcher = url => axios.get(url).then(res => res.data)
const Web3Context = createContext();
export const Web3ContextApp = ({children}) => {
	const	ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;
	const walletType = {
		NONE: -1,
		METAMASK: 0,
		WALLET_CONNECT: 1,
	};
	const	[nonce, set_nonce] = useState(0);
	const	[web3, set_web3] = useState(undefined);
	const	[provider, set_provider] = useState(undefined);
	const	[providerType, set_providerType] = useLocalStorage('providerType', walletType.NONE); //-1 none | 0 web3 | 1 wc
	const	[address, set_address] = useLocalStorage('address', '');
	const	[walletData, set_walletData] = useState(undefined);
	const	[achievements, set_achievements] = useState(Achievements());
	const	[achievementsVersion, set_achievementsVersion] = useState(0);
	const	[achievementsCheckProgress, set_achievementsCheckProgress] = useState(undefined);
	const	[actionID, set_actionID] = useState(undefined);
	const	[previousActionID, set_previousActionID] = useState(undefined);

	const	{data: walletDataERC20} = useSWR(
		nonce > 0 && address !== '' && (!walletData || (walletData && walletData.erc20 === undefined)) ?
			`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}` :
			null,
		fetcher
	);
	const	{data: walletDataTransactions} = useSWR(
		nonce > 0 && address !== '' && (!walletData || (walletData && walletData.transactions === undefined)) ?
			`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}` :
			null,
		fetcher
	);

	useEffect(() => walletDataERC20 ? set_walletData({...walletData, erc20: walletDataERC20.result || []}) : null,  [walletDataERC20])
	useEffect(() => walletDataTransactions ? set_walletData({...walletData, transactions: walletDataTransactions.result || []}) : null, [walletDataTransactions])

	/**************************************************************************
	**	If user was connected with metamask, auto-reconnect
	**************************************************************************/
	useEffect(() => {
		if (nonce === 0) {
			if (providerType === walletType.METAMASK) {
				connect(walletType.METAMASK);
			} else {
				set_address('');
				set_providerType(walletType.NONE);
			}
		}
	}, []);

	/**************************************************************************
	**	Updating the achievements when we have the wallet history
	**************************************************************************/
	useEffect(() => {
		if (walletData && walletData.erc20 && walletData.transactions)
			checkAchievements();
	}, [walletData]);

	function	checkAchievements() {
		if (nonce === 0)
			return;

		set_actionID(UUID());
		set_achievementsCheckProgress(0);
		if (previousActionID === undefined) {
			set_previousActionID(UUID());
		}
		const	_achievements = achievements;
		recursiveCheckAchivements(_achievements, _achievements[0], 0);
	}
	async function	recursiveCheckAchivements(_achievements, achievement, index) {
		if (achievement === undefined) {
			set_actionID(undefined);
			set_previousActionID(undefined);
			setTimeout(() => set_achievementsCheckProgress(undefined), 500);
			return;
		}
		if (achievement.checkAchievement) {
			const	{unlocked, informations} = await achievement.checkAchievement(web3, address, walletData);
			achievement.unlocked = unlocked;
			achievement.informations = informations || {};
		}
		_achievements[index] = achievement;
		if (actionID === previousActionID) {
			set_achievements(_achievements);
			set_achievementsVersion(v => v + 1);
			set_achievementsCheckProgress(v => v + 1);
			recursiveCheckAchivements(_achievements, _achievements[index + 1], index + 1);
		}
	}

	/**************************************************************************
	**	Wallet & account management
	**************************************************************************/
	function	disconnect(error) {
		if (error)
			console.error(error);
		set_address('');
		set_provider(undefined);
		set_providerType(walletType.NONE);
		set_nonce(0);
		set_achievements(Achievements());
		set_achievementsVersion(0);
		set_walletData(undefined);
	}
	function	onConnect(_provider, _walletType, _account) {
		set_web3(window.web3);
		set_provider(_provider);
		set_providerType(_walletType);
		set_address(_account);
		set_nonce(nonce + 1);
		mutate(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}`);
		mutate(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}`);
	}
	function	onChangeAccount(_account) {
		set_achievements(Achievements());
		set_achievementsVersion(0);
		set_walletData(undefined);
		set_address(_account);
		set_nonce(nonce + 1);
	}
	async function	connect(_providerType) {
		window.web3 = await new Web3(window.ethereum || Web3.givenProvider || 'wss://eth-mainnet.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf');
		
		if (_providerType === walletType.METAMASK) {
			await window.ethereum.enable();
			const	accounts = await window.web3.eth.getAccounts()
			onConnect(window.web3.currentProvider, walletType.METAMASK, accounts[0]);

			ethereum.on('accountsChanged', accounts => onChangeAccount(accounts[0]));
			ethereum.on('disconnect', () => disconnect());

		} else if (_providerType === walletType.WALLET_CONNECT) {
			const connector = new WalletConnect({
				bridge: 'https://bridge.walletconnect.org',
				qrcodeModal: QRCodeModal,
			});
	
			if (connector.connected)
				await connector.killSession();
			await connector.createSession();
			connector.on('connect', (err, d) => !err ? onConnect(connector, walletType.WALLET_CONNECT, d.params[0].accounts[0]) : null);
			connector.on('disconnect', () => disconnect());
			connector.on('session_update', (_, d) => onChangeAccount(d.params[0].accounts[0]));
		}
	}

	/**************************************************************************
	**	Web3 actions
	**************************************************************************/
	async function	sign(data, callback = () => null) {
		if (providerType === walletType.WALLET_CONNECT) {
			provider.signPersonalMessage([address, data])
			.then(result => callback(result))
			.catch(error => console.error(error))
		} else if (providerType === walletType.METAMASK) {
			provider.send({
				method: 'eth_signTypedData_v4',
				params: [address, data],
				from: address,
			}, function(err, result) {
				if (err) {
					return console.dir(err)
				} else if (result.error) {
					return console.error(result.error)
				}
				callback(result);
			});
		}
	}

	return (
		<Web3Context.Provider
			children={children}
			value={{
				web3,
				set_web3,
				address,
				connect,
				disconnect,
				providerType,
				walletType,
				achievements,
				achievementsVersion,
				achievementsCheckProgress,
				actions: {
					sign
				}
			}} />
	)
}

export const useWeb3 = () => useContext(Web3Context)
export default useWeb3;
