/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionAchievements.js
******************************************************************************/

import	{useState, useEffect}							from	'react';
import	FlipMove										from	'react-flip-move';
import	AchievementCard									from	'components/AchievementCard';
import	useAchievements									from	'contexts/useAchievements';

function	SectionAchievements(props) {
	const	{achievements, set_achievements, claimsAsMapping} = useAchievements();
	const	[achievementList, set_achievementList] = useState(achievements || props.achievements);

	useEffect(() => {
		if (achievements) {
			set_achievementList(achievements)
		}
	}, [achievements]);

	if (!achievementList || achievementList.length === 0) {
		return null;
	}
	return (
		<section className={'mt-16 z-10'} aria-label={`achievements`}>
			<div className={'pb-8 flex flex-row'}>
				<h3 className={'text-base leading-6 font-medium text-gray-400'}>
					{`Featured Achievements`}
				</h3>
				<div className={'bg-red-400 ml-2 rounded inline opacity-100'}>
					<p className={'text-white text-xs px-1.5 py-0.5 pt-1 font-semibold'}>{achievementList.length}</p>
				</div>
			</div>
			<FlipMove
				enterAnimation={'fade'}
				leaveAnimation={'fade'}
				maintainContainerHeight
				className={'mx-auto grid gap-5 gap-y-6 lg:gap-y-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}>
				{(achievementList).map((each) => (
					<AchievementCard
						key={each.key}
						hidden={each.hidden}
						achievement={each}
						unlocked={each.unlocked}
						claimed={claimsAsMapping[each.key]}
						informations={each.informations}
						onUpdate={(updatedAchievement) => {
							const	_achievements = achievements;
							const	index = _achievements.findIndex(e => e.key === each.key);
							if (index !== -1) {
								_achievements[index] = updatedAchievement;
								set_achievements(_achievements);
							}
						}} />
				))}
			</FlipMove>
		</section>
	);
}

export default SectionAchievements;