/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useWeb3.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	axios												from	'axios';
import	useSWR, {mutate}									from	'swr';
import	{ethers}											from	'ethers';
import	WalletConnect										from	'@walletconnect/client';
import	QRCodeModal											from	'@walletconnect/qrcode-modal';
import	useLocalStorage										from	'hook/useLocalStorage';
import	Achievements										from	'achievements/achievements';
import	UUID												from	'utils/uuid';

const fetcher = url => fetch(url).then(r => r.json()).catch(e => console.error(e))

const Web3Context = createContext();
export const Web3ContextApp = ({children}) => {
	const	ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || 'M63TWVTHMKIBXEQHXHKEF87RU16GSMQV9S';
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
	const	[walletData, set_walletData] = useState(undefined);
	const	[achievements, set_achievements] = useState(Achievements());
	const	[achievementsVersion, set_achievementsVersion] = useState(0);
	const	[achievementsCheckProgress, set_achievementsCheckProgress] = useState(undefined);
	const	[actionID, set_actionID] = useState(undefined);
	const	[previousActionID, set_previousActionID] = useState(undefined);

	const	{data: walletDataERC20, mutate: mutateDataERC20} = useSWR(
		nonce > 0 && address !== '' && (!walletData || (walletData && !walletData.erc20)) ?
			`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}` :
			null,
		fetcher
	);
	const	{data: walletDataTransactions, mutate: mutateDataTransactions} = useSWR(
		nonce > 0 && address !== '' && (!walletData || (walletData && !walletData.transactions)) ?
			`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_KEY}` :
			null,
		fetcher
	);

	useEffect(() => {
		walletDataERC20 ? set_walletData(wc => ({...wc, erc20: walletDataERC20.result || []})) : null
	}, [walletDataERC20])
	useEffect(() => {
		walletDataTransactions ? set_walletData(wc => ({...wc, transactions: walletDataTransactions.result || []})) : null
	}, [walletDataTransactions])

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
			const	{unlocked, informations} = await achievement.checkAchievement(provider, address, walletData);
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
		set_nonce(0);
		set_provider(undefined);
		set_connector(undefined);
		set_providerType(walletType.NONE);
		set_address('');
		set_walletData(undefined);
		set_achievements(Achievements());
		set_achievementsVersion(0);
		set_achievementsCheckProgress(undefined);
		set_actionID(undefined);
		set_previousActionID(undefined);
	}
	function	onConnect(_provider, _walletType, _account) {
		set_achievements(Achievements());
		set_achievementsVersion(0);
		set_walletData(undefined);
		set_provider(_provider);
		set_providerType(_walletType);
		set_address(_account);
		set_nonce(n => n + 1);
		mutateDataERC20();
		mutateDataTransactions();
	}
	function	onChangeAccount(_account) {
		set_achievements(Achievements());
		set_achievementsVersion(0);
		set_walletData(undefined);
		set_address(_account);
		set_nonce(nonce + 1);
	}
	async function	connect(_providerType) {
		const	web3Provider = window.ethereum || 'wss://eth-mainnet.ws.alchemyapi.io/v2/v1u0JPu1HrHxMnXKOzxTDokxcwQzwyvf';
		if (_providerType === walletType.METAMASK) {
			const	_provider = new ethers.providers.Web3Provider(web3Provider)
			const	signer = _provider.getSigner();
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
				const	_provider = new ethers.providers.Web3Provider(web3Provider)
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
				provider,
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
