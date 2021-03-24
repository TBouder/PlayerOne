/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useAchievements.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	useSWR												from	'swr';
import	{ethers}											from	'ethers';
import	axios												from	'axios';
import	{useToasts}											from	'react-toast-notifications';
import	useWeb3												from	'contexts/useWeb3';
import	{getStrategy}										from	'achievements/helpers';
import	UUID												from	'utils/uuid';
import	{fetcher, removeFromArray, sortBy}					from	'utils';

const	AchievementsContext = createContext();
export const AchievementsContextApp = ({children, achievementsList, shouldReset, set_shouldReset}) => {
	const	{addToast} = useToasts();
	const	{address, provider, walletData, chainID} = useWeb3();

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
			const	_achievements = achievements.map((achievement) => {
				const	_achievement = {...achievement};
				const	achievementClaim = addressClaims.find(e => e.achievementUUID === achievement.UUID);
				if (achievementClaim) {
					_achievement.unlocked = true
					_achievement.claimed = !!achievementClaim
					_achievement.claim = achievementClaim
				}
				return _achievement;
			})

			set_claims(addressClaims || []);
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
	async function	claimAchievement(achievementUUID, callback = () => null) {
		// const	shouldDisplayToast = process.env.NODE_ENV === 'development';
		const	shouldDisplayToast = false;
		const	achievement = achievements.find(e => e.UUID === achievementUUID);
		const	isUnlocked = (await checkAchievement(achievement)).unlocked;
		if (isUnlocked) {
			return callback({status: 'SUCCESS'});
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
			if (shouldDisplayToast) {
				addToast(`Average gasPrice on mainnet: ${averageGasPrice}`, {appearance: 'info'});
			}
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
				achievementUUID: achievement.UUID,
				address: address,
			});
			callback({status: 'GET_SIGNATURE'})
			if (shouldDisplayToast) {
				addToast(`Signature from validator (${signatureResponse.data.validator}) : ${signatureResponse.data.signature}`, {appearance: 'info'});
			}
		} catch (error) {
			if (shouldDisplayToast) {
				addToast(`You cannot claim this achievement`, {appearance: 'error'});
			}
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
		const	ERC20_ABI = ["function claim(address validator, address requestor, uint256 achievement, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public"];
		const	signer = provider.getSigner();
		const	contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
		let		transactionResponse = undefined;

		try {
			if (averageGasPrice) {
				transactionResponse = await contract.functions.claim(
					validator, address, achievementHash, amount, deadline,
					v, r, s,
					{gasPrice: averageGasPrice * 1000000000}
				);
			} else {
				transactionResponse = await contract.functions.claim(
					validator, address, achievementHash, amount, deadline,
					v, r, s
				);
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

	return (
		<AchievementsContext.Provider
			children={children}
			value={{
				claims,
				poolSize: poolSize || 0,
				achievements,
				set_achievements,
				achievementsNonce,
				achievementsCheckProgress,
				actions: {
					check: checkAchievement,
					claim: claimAchievement
				}
			}} />
	)
}

export const useAchievements = () => useContext(AchievementsContext)
export default useAchievements;
