/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useAchievements.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	useSWR												from	'swr';
import	axios												from	'axios';
import	{ethers}											from	'ethers';
import	{useToasts}											from	'react-toast-notifications';
import	useWeb3												from	'contexts/useWeb3';
import	{getStrategy}										from	'achievements/helpers';
import	UUID												from	'utils/uuid';
import	{bigNumber, fetcher, removeFromArray, sortBy}					from	'utils';

const	AchievementsContext = createContext();
export const AchievementsContextApp = ({children, achievementsList, shouldReset, set_shouldReset}) => {
	const	{addToast} = useToasts();
	const	{address, provider, rProvider, walletData, chainID, actions} = useWeb3();

	/**************************************************************************
	**	achievements: matches the local state to handle the achievements on the
	**	front-end
	**************************************************************************/
	const	[achievements, set_achievements] = useState();

	/**************************************************************************
	**	achievementsNonce: nonce matching the number of updates for the
	**	achievements state. achievements is an array, we need a nonce to get
	**	the update informations
	**************************************************************************/
	const	[achievementsNonce, set_achievementsNonce] = useState(0);

	/**************************************************************************
	**	achievementsCheckProgress: used to indicate to the user which
	**	achievement is being checked. Used with the progress bar
	**************************************************************************/
	const	[achievementsCheckProgress, set_achievementsCheckProgress] = useState({checking: false, progress: 0, total: 0});

	/**************************************************************************
	**	achievementsProgressNonce: used to continue or stop an achievement
	**	check process. If current != previous, then another process started
	**	and we need to abort the current one.
	**************************************************************************/
	const	[achievementsProgressNonce, set_achievementsProgressNonce] = useState({previous: undefined, current: undefined});

	/**************************************************************************
	**	claims: lists the claims for this user
	**************************************************************************/
	const	[claims, set_claims] = useState();
	const	[claimsAsMapping, set_claimsAsMapping] = useState({});

	/**************************************************************************
	**	pool: size of the pool of adresse which have interacted with this
	**	playground
	**************************************************************************/
	const	{data: poolSize} = useSWR(
		`${process.env.API_URI}/addresses/count`,
		fetcher,
		{focusThrottleInterval: 1000 * 10}
	);

	useEffect(async () => {
		if (achievements === undefined && (achievementsList === undefined || achievementsList.length === 0)) {
			const	list = await fetcher(`${process.env.API_URI}/achievements`)
			set_achievements(list);
		} else if (!achievements) {
			set_achievements(achievementsList.map(e => ({...e})));
		}
	}, [achievementsList])

	useEffect(async () => {
		if (address && claims === undefined && achievements !== undefined) {
			const	addressClaims = await fetcher(`${process.env.API_URI}/claims/address/${address}`);
			const	_claimsAsMapping = {};
			const	_achievements = achievements.map((achievement) => {
				const	_achievement = {...achievement};
				const	achievementClaim = addressClaims.find(e => e.achievementKey === achievement.key);
				if (achievementClaim) {
					_achievement.unlocked = true
					_achievement.claimed = !!achievementClaim
					_achievement.claim = achievementClaim
				}
				return _achievement;
			})

			set_claims(addressClaims || []);

			addressClaims.forEach(e => {_claimsAsMapping[e.achievement] = true;});
			set_claimsAsMapping(_claimsAsMapping);
			set_achievements(sortBy(_achievements, 'unlocked'));
			set_achievementsNonce(n => n + 1);
			set_achievementsCheckProgress({checking: false, progress: addressClaims.length, total: _achievements.length});
		}
	}, [address, achievements])

	useEffect(() => {
		if (shouldReset) {
			set_achievementsCheckProgress({checking: false, progress: 0, total: 0});
			set_achievementsProgressNonce({previous: undefined, current: undefined});
			set_achievements(achievementsList.map(e => ({...e})));
			set_claims(undefined);
			set_claimsAsMapping({});
			set_achievementsNonce(n => n + 1);
			set_shouldReset(false);
		}
	}, [shouldReset])

	/**************************************************************************
	**	Updating the achievements when we have the wallet history
	**************************************************************************/
	useEffect(() => {
		if (walletData.ready && provider) {
			if (claims !== undefined) {
				checkAchievements();
			}
		}
	}, [walletData.ready, claims]);

	function	checkAchievements() {
		if (!achievements) {
			return
		}
		const	_achievements = achievements.map(e => ({...e}));
		const	lockedStack = achievements.map(e => ({...e}));
		const	progressUUID = UUID();
		set_achievementsProgressNonce(v => ({previous: v.previous === undefined ? progressUUID : undefined, current: progressUUID}));
		set_achievementsCheckProgress({checking: true, progress: 0, total: _achievements.length});
		recursiveCheckAchivements(_achievements, [], lockedStack, _achievements[0], 0);
	}
	async function	recursiveCheckAchivements(_achievements, unlockedStack, lockedStack, achievement, index) {
		let	newLockedStack = lockedStack;

		if (achievement === undefined) {
			set_achievementsProgressNonce({previous: undefined, current: undefined});
			set_achievementsCheckProgress({checking: false, progress: 0, total: 0});
			return;
		}
		if (claimsAsMapping[achievement.key] && achievementsProgressNonce.current === achievementsProgressNonce.previous) {
			unlockedStack.push(achievement);
			newLockedStack = removeFromArray(lockedStack, 'UUID', achievement.UUID)

			setTimeout(() => set_achievements([...unlockedStack, ...newLockedStack]), 0);
			set_achievementsNonce(v => v + 1);
			set_achievementsCheckProgress(v => ({checking: true, progress: v.progress, total: v.total}));
			recursiveCheckAchivements(_achievements, unlockedStack, lockedStack, _achievements[index + 1], index + 1);
			return
		}
		if (achievement.unlocked && achievementsProgressNonce.current === achievementsProgressNonce.previous) {
			unlockedStack.push(achievement);
			newLockedStack = removeFromArray(lockedStack, 'UUID', achievement.UUID)

			setTimeout(() => set_achievements([...unlockedStack, ...newLockedStack]), 0);
			set_achievementsNonce(v => v + 1);
			set_achievementsCheckProgress(v => ({checking: true, progress: v.progress, total: v.total}));
			recursiveCheckAchivements(_achievements, unlockedStack, lockedStack, _achievements[index + 1], index + 1);
			return
		}

		achievement.unlocked = false;
		achievement.informations = {};
		if (achievement?.strategy?.name) {
			const	strategy = getStrategy(achievement.strategy.name);
			if (strategy !== undefined) {
				const	{unlocked, informations} = await strategy(provider, address, walletData, achievement?.strategy?.args);
				achievement.unlocked = unlocked;
				achievement.informations = informations || {};
				if (unlocked) {
					unlockedStack.push(achievement);
					newLockedStack = removeFromArray(lockedStack, 'UUID', achievement.UUID)
				}
			}
		}

		_achievements[index] = achievement;
		if (achievementsProgressNonce.current === achievementsProgressNonce.previous) {
			setTimeout(() => set_achievements([...unlockedStack, ...newLockedStack]), 0);
			set_achievementsNonce(v => v + 1);
			set_achievementsCheckProgress(v => ({checking: true, progress: v.progress + 1, total: v.total}));
			recursiveCheckAchivements(_achievements, unlockedStack, lockedStack, _achievements[index + 1], index + 1);
		}
	}

	async function	checkAchievement(achievement) {
		if (!achievement) {
			return null;
		}
		if (achievement.unlocked) {
			return achievement;
		}

		achievement.unlocked = false;
		achievement.informations = {};
		if (!achievement?.strategy?.name) {
			return null;
		}

		const	strategy = getStrategy(achievement.strategy.name);
		if (strategy === undefined) {
			return null;
		}
		const	{unlocked, informations} = await strategy(provider, address, walletData, achievement?.strategy?.args);
		achievement.unlocked = unlocked;
		achievement.informations = informations || {};
		return achievement;
	}
	async function	claimAchievement(achievementKey, callback = () => null) {
		const	achievement = achievements.find(e => e.key === achievementKey);
		const	isUnlocked = (await checkAchievement(achievement)).unlocked;
		if (!isUnlocked) {
			return callback({status: 'ERROR'});
		}

		/**********************************************************************
		**	Only for ropsten / testnets
		**	We need to get the gasPrice to provide an actual price estimation
		**********************************************************************/
		let	gasPrice = undefined;
		let	averageGasPrice = undefined;

		if (chainID !== 1 || chainID !== '0x1') {
			gasPrice = await fetcher(`https://ethgasstation.info/api/ethgasAPI.json?api-key=14139d139150b5687787a4bcd40aae485d6a380a9253ada65e6076a957df`)
			averageGasPrice = (gasPrice.average / 10);
			addToast(`Average gasPrice on mainnet: ${averageGasPrice}`, {appearance: 'info'});
		}

		/**********************************************************************
		**	We need the backend to generate a claim.
		**	Note: the backend will ask, to the smartcontract, is the user can
		**	claim the achievement (not already claimed), then check if the
		**	user matches the requirements (verification with the specific
		**	strategy)
		**********************************************************************/
		let	signatureResponse = undefined;
		try {
			signatureResponse = await axios.post(`${process.env.API_URI}/claim/signature`, {
				achievementKey: achievement.key,
				address: address,
			});
			callback({status: 'GET_SIGNATURE'})
			addToast(`Signature from validator (${signatureResponse.data.validator}) : ${signatureResponse.data.signature}`, {appearance: 'info'});
		} catch (error) {
			if (error?.response?.data?.error === 'achievement already claimed') {
				return callback({status: 'SUCCESS'});
			}
			addToast(error?.response?.data?.error || error.message, {appearance: 'error'});
			return callback({status: 'ERROR'});
		}

		/**********************************************************************
		**	Creating the claim transaction
		**********************************************************************/
		const	signature = signatureResponse.data.signature;
		const	tokenAddress = signatureResponse.data.contractAddress;
		const	validator = signatureResponse.data.validator;
		const	achievementHash = signatureResponse.data.achievement;
		const	amount = signatureResponse.data.amount;
		const	deadline = signatureResponse.data.deadline;
		const	r = signature.slice(0, 66);
		const	s = '0x' + signature.slice(66, 130);
		const	v = parseInt(signature.slice(130, 132), 16) + 27;

		/**********************************************************************
		**	Accessing the contract
		**********************************************************************/
		actions.claim(
			tokenAddress,
			[validator, address, achievementHash, amount, deadline, v, r, s],
			averageGasPrice ? {gasPrice: averageGasPrice * 1000000000} : undefined,
			callback
		);
	}

	async function	getTotalSupply(_provider) {
		const	TOTAL_SUPPLY_ABI = ["function totalSupply() external view returns (uint256)"];
		const	contract = new ethers.Contract('0x35017DC776c43Bcf8192Bb6Ba528348D32A57CB5', TOTAL_SUPPLY_ABI, _provider);
		const	totalSupply = await contract.functions.totalSupply();
		return (bigNumber.from(totalSupply[0]).div(bigNumber.from(10).pow(18)));
	}

	return (
		<AchievementsContext.Provider
			children={children}
			value={{
				claims,
				claimsAsMapping,
				poolSize: poolSize || 0,
				achievements,
				set_achievements,
				achievementsNonce,
				achievementsCheckProgress,
				actions: {
					check: checkAchievement,
					claim: claimAchievement,
					getTotalSupply: getTotalSupply,
				}
			}} />
	)
}

export const useAchievements = () => useContext(AchievementsContext)
export default useAchievements;
