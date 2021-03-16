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

const AchievementsContext = createContext();
export const AchievementsContextApp = ({children, achievementsList, restartIndex, checkIndex}) => {
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

	useEffect(() => {
		if (!achievements) {
			console.log(`heeeere`)
			set_achievements(achievementsList.map(e => ({...e})));
		}
	}, [achievementsList])

	useEffect(() => {
		if (restartIndex > 0) {
			set_achievementsCheckProgress({checking: false, progress: 0, total: 0});
			set_achievementsProgressNonce({previous: undefined, current: undefined});
			set_achievements(achievementsList.map(e => ({...e})))
			set_achievementsNonce(n => n + 1);
		}
	}, [restartIndex])
	
	/**************************************************************************
	**	Updating the achievements when we have the wallet history
	**************************************************************************/
	useEffect(() => {
		if (checkIndex > 0 && provider) {
			checkAchievements();
		}
	}, [checkIndex]);

	function	checkAchievements() {
		const	_achievements = achievements.map(e => ({...e}));
		const	progressUUID = UUID();
		set_achievementsProgressNonce(v => ({previous: v.previous === undefined ? progressUUID : undefined, current: progressUUID}));
		set_achievementsCheckProgress({checking: true, progress: 0, total: _achievements.length});
		recursiveCheckAchivements(_achievements, _achievements[0], 0);
	}
	async function	recursiveCheckAchivements(_achievements, achievement, index) {
		if (achievement === undefined) {
			set_achievementsProgressNonce({previous: undefined, current: undefined});
			set_achievementsCheckProgress({checking: false, progress: 0, total: 0});
			return;
		}

		achievement.unlocked = false;
		achievement.informations = {};
		if (achievement?.strategy?.name) {
			const	strategy = getStrategy(achievement.strategy.name);
			if (strategy !== undefined) {
				const	{unlocked, informations} = await strategy(provider, address, walletData, achievement?.strategy?.args);
				achievement.unlocked = unlocked;
				achievement.informations = informations || {};
			}
		}
		_achievements[index] = achievement;
		if (achievementsProgressNonce.current === achievementsProgressNonce.previous) {
			set_achievements(_achievements);
			set_achievementsNonce(v => v + 1);
			set_achievementsCheckProgress(v => ({checking: true, progress: v.progress + 1, total: v.total}));
			recursiveCheckAchivements(_achievements, _achievements[index + 1], index + 1);
		}
	}

	return (
		<AchievementsContext.Provider
			children={children}
			value={{
				achievements,
				achievementsNonce,
				achievementsCheckProgress,
			}} />
	)
}

export const useAchievements = () => useContext(AchievementsContext)
export default useAchievements;
