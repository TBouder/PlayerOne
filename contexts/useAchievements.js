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
export const AchievementsContextApp = (props) => {
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
	**	claimables: lists the claimable for this user
	**************************************************************************/
	const	[claims, set_claims] = useState();
	const	[claimsAsMapping, set_claimsAsMapping] = useState({});
	const	[claimables, set_claimables] = useState();
	const	[claimablesAsMapping, set_claimablesAsMapping] = useState({});

	/**************************************************************************
	**	pool: size of the pool of adresse which have interacted with this
	**	playground
	**************************************************************************/
	const	{data: poolSize} = useSWR(
		`${process.env.API_URI}/addresses/count`,
		fetcher,
		{focusThrottleInterval: 1000 * 10}
	);

	/**************************************************************************
	**	This is a hack. Is it a good one ? I am not sure, but it seams to work.
	**	Only here for performance reason : the list of achievements is built at
	**	build time and, if we land on the index, we will have them as this
	**	component props (achievementsList). It will save us one API call & some
	**	time.
	**	We will then init the achievements based on this list.
	**************************************************************************/
	const	{data: achievementsList} = useSWR(`${process.env.API_URI}/achievements`, fetcher, {initialData: props.achievementsList});

	useEffect(() => {
		if (!achievements) {
			set_achievements(achievementsList.map(e => ({...e})));
		}
	}, [achievementsList])

	/**************************************************************************
	**	This effect will be launched once we got an address (aka we know which
	**	address is connected) + some achievements (we need to check them, so we
	**	need them). It will only be launched if claims is undefined, so not
	**	initialized, and will :
	**	- init the claims + claimMapping
	** 	- init the claimables + claimablesMapping
	**	- sort the achievements by `unlocked` (should we add a distinction
	**		between claim & claimable ?)
	**	- prepare the field for the achievement check
	**************************************************************************/
	async function	recomputeClaims() {
		const	{claims: addressClaims, claimables: addressClaimables} = await fetcher(`${process.env.API_URI}/address/${address}`);

		const	_claimsAsMapping = {};
		const	_claimablesAsMapping = {};
		const	_achievements = achievements.map((achievement) => {
			const	_achievement = {...achievement};
			const	achievementClaim = addressClaims.find(e => e.achievement === achievement.key);
			if (achievementClaim) {
				_achievement.unlocked = true
				_achievement.claimed = !!achievementClaim
				_achievement.claim = achievementClaim
				_claimsAsMapping[_achievement.key] = true
			} else {
				const	achievementClaimable = addressClaimables.find(e => e.achievement === achievement.key);
				if (achievementClaimable) {
					_achievement.unlocked = true
					_achievement.claimed = false
					_claimablesAsMapping[_achievement.key] = true
				}
			}
			return _achievement;
		})

		set_claims(addressClaims || []);
		set_claimsAsMapping(_claimsAsMapping);

		set_claimables(addressClaimables || []);
		set_claimablesAsMapping(_claimablesAsMapping);

		set_achievements(sortBy(_achievements, 'unlocked'));
		set_achievementsNonce(n => n + 1);
		set_achievementsCheckProgress({checking: false, progress: addressClaims.length + addressClaimables.length, total: _achievements.length});
	}
	useEffect(() => {
		if (address && claims === undefined && achievements !== undefined) {
			recomputeClaims();
		}
	}, [address, achievements])


	/**************************************************************************
	**	This effect function is called when we need to reset the state of the
	**	achievement context (on logout, on change account, on change chainID).
	**************************************************************************/
	useEffect(() => {
		if (props.shouldReset) {
			set_achievementsCheckProgress({checking: false, progress: 0, total: 0});
			set_achievementsProgressNonce({previous: undefined, current: undefined});
			set_achievements(achievementsList.map(e => ({...e})));
			set_claims(undefined);
			set_claimsAsMapping({});
			set_claimables(undefined);
			set_claimablesAsMapping({});
			set_achievementsNonce(n => n + 1);
			props.set_shouldReset(false);
		}
	}, [props.shouldReset])

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
		if (claimablesAsMapping[achievement.key] && achievementsProgressNonce.current === achievementsProgressNonce.previous) {
			unlockedStack.push(achievement);
			newLockedStack = removeFromArray(lockedStack, 'UUID', achievement.UUID);

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
					newLockedStack = removeFromArray(lockedStack, 'UUID', achievement.UUID);
					try {
						const	newClaimable = await axios.post(`${process.env.API_URI}/claimable`, {
							achievementKey: achievement.key,
							address: address,
						}).then(e => e.data);
						set_claimables(e => {e.push(newClaimable); return e});
						set_claimablesAsMapping(e => {e[achievement.key] = true; return e});
					} catch (error) {
						console.log(error)
					}
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
			(({status}) => {
				if (status === 'SUCCESS') {
					recomputeClaims();
				}
				callback({status})
			})
		);
	}
	async function	claimMultipleAchievement(achievementsKey, callback = () => null) {
		// const	achievement = achievements.find(e => e.key === achievementKey);
		// const	isUnlocked = (await checkAchievement(achievement)).unlocked;
		// if (!isUnlocked) {
		// 	return callback({status: 'ERROR'});
		// }

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
			signatureResponse = await axios.post(`${process.env.API_URI}/claim/multiple/signature`, {
				achievementsKey: achievementsKey,
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
		const	achievements = signatureResponse.data.achievements;
		const	amount = signatureResponse.data.amount;
		const	deadline = signatureResponse.data.deadline;
		const	r = signature.slice(0, 66);
		const	s = '0x' + signature.slice(66, 130);
		const	v = parseInt(signature.slice(130, 132), 16) + 27;

		/**********************************************************************
		**	Accessing the contract
		**********************************************************************/
		actions.claimMultiple(
			tokenAddress,
			[validator, address, achievements, amount, deadline, v, r, s],
			averageGasPrice ? {gasPrice: averageGasPrice * 1000000000} : undefined,
			(({status}) => {
				if (status === 'SUCCESS') {
					setTimeout(() => recomputeClaims(), 500);
				}
				callback({status})
			})
		);
	}
	async function	getTotalSupply(_provider) {
		const	TOTAL_SUPPLY_ABI = ["function totalSupply() external view returns (uint256)"];
		const	contract = new ethers.Contract('0x35017DC776c43Bcf8192Bb6Ba528348D32A57CB5', TOTAL_SUPPLY_ABI, _provider);
		const	totalSupply = await contract.functions.totalSupply();
		return (bigNumber.from(totalSupply[0]).div(bigNumber.from(10).pow(18)));
	}
	function	setAsClaimed(list) {
		let		_claims = claims;
		let		_claimables = claimables;
		const	_claimablesAsMapping = {};
		const	_claimsAsMapping = claimsAsMapping;

		Object.entries(claimablesAsMapping).map(([key, value]) => {
			const	index = list.findIndex(e => e.key === key);
			if (index >= 0) {
				_claimablesAsMapping[key] = false;
				_claimables = removeFromArray(_claimables, 'achievement', key);
				_claimsAsMapping[list[index].key] = true;
				_claims.push({
					achievements: list[index].key,
					address: address,
					date: new Date(),
					nonce: -1,
					validator: 'undefined'
				});
			} else {
				_claimablesAsMapping[key] = value;
			}
		});
		set_claimables(_claimables);
		set_claimablesAsMapping(_claimablesAsMapping);
		set_claims(_claims);
		set_claimsAsMapping(_claimsAsMapping);
		setTimeout(() => recomputeClaims(), 1000);
		setTimeout(() => recomputeClaims(), 2000);
	}

	return (
		<AchievementsContext.Provider
			children={props.children}
			value={{
				claims,
				claimsAsMapping,
				claimables,
				claimablesAsMapping,

				poolSize: poolSize || 0,
				achievements,
				set_achievements,
				achievementsNonce,
				achievementsCheckProgress,
				actions: {
					check: checkAchievement,
					claim: claimAchievement,
					claimMultiple: claimMultipleAchievement,
					getTotalSupply: getTotalSupply,
					setAsClaimed: setAsClaimed
				}
			}} />
	)
}

export const useAchievements = () => useContext(AchievementsContext)
export default useAchievements;
