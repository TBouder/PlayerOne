/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionAchievements.js
******************************************************************************/

import	AchievementCard									from	'components/AchievementCard';

function	SectionAchievements({achievements}) {
	return (
		<section className={'z-10 mt-0'} aria-label={`achievements`}>
			<div className={'mx-auto grid gap-5 gap-y-6 lg:gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'}>
				{achievements.map((each) => (
					<AchievementCard
						key={each.key}
						achievement={each}
						claimable={each.status === 'CLAIMABLE'}
						claimed={each.status === 'CLAIMED'} />
				))}
			</div>
		</section>
	);
}

export default SectionAchievements;