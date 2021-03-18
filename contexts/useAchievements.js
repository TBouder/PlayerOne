/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useAchievements.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	useWeb3												from	'contexts/useWeb3';
import	{getStrategy}										from	'achievements/helpers';
import	UUID												from	'utils/uuid';
import	{fetcher, removeFromArray, sortBy}					from	'utils';

const	AchievementsContext = createContext();
export const AchievementsContextApp = ({children, achievementsList, shouldReset, set_shouldReset}) => {
	const	{address, provider, walletData} = useWeb3();

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
					_achievement.claim = {
						id: achievementClaim.nonce,
						count: 100,
						level: null,
						data: achievementClaim
					}
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

	return (
		<AchievementsContext.Provider
			children={children}
			value={{
				claims,
				achievements,
				set_achievements,
				achievementsNonce,
				achievementsCheckProgress,
			}} />
	)
}

export const useAchievements = () => useContext(AchievementsContext)
export default useAchievements;
