/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionAchievements.js
******************************************************************************/

import	FlipMove										from	'react-flip-move';
import	AchievementCard									from	'components/AchievementCard';
import	useAchievements									from	'contexts/useAchievements';

function	SectionAchievements() {
	const	{elements} = useAchievements();

	return (
		<section className={'mt-16 z-10'} aria-label={`achievements`}>
			<div className={'pb-8 flex flex-row'}>
				<h3 className={'text-base leading-6 font-medium text-gray-400'}>
					{`Featured Achievements`}
				</h3>
				<div className={'bg-red-400 ml-2 rounded inline opacity-100'}>
					<p className={'text-white text-xs px-1.5 py-0.5 pt-1 font-semibold'}>{elements.count}</p>
				</div>
			</div>
			<FlipMove
				enterAnimation={'fade'}
				leaveAnimation={'fade'}
				maintainContainerHeight
				className={'mx-auto grid gap-5 gap-y-6 lg:gap-y-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}>
				{([
					...elements.claims || [],
					...elements.claimables || [],
					...elements.locked || []
				]).map((each) => (
					<AchievementCard
						key={each.key}
						achievement={each}
						claimable={each.status === 'CLAIMABLE'}
						claimed={each.status === 'CLAIMED'} />
				))}
			</FlipMove>
		</section>
	);
}

export default SectionAchievements;