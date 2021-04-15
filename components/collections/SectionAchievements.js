/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionAchievements.js
******************************************************************************/

import	FlipMove										from	'react-flip-move';
import	AchievementCard									from	'components/AchievementCard';
import	useAchievements									from	'contexts/useAchievements';

function	SectionAchievements({slug}) {
	const	{elements} = useAchievements();

	return (
		<section className={'z-10 mt-0'} aria-label={`achievements`}>
			<FlipMove
				enterAnimation={'fade'}
				leaveAnimation={'fade'}
				maintainContainerHeight
				className={'mx-auto grid gap-5 gap-y-6 lg:gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
				{([
					...elements.claims || [],
					...elements.claimables || [],
					...elements.locked || []
				]).filter(e => slug === 'all' || e.collections.includes(slug)).map((each) => (
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