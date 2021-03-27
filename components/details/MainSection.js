/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				MainSection.js
******************************************************************************/

import	Leaderboard				from	'components/details/SectionLeaderboard';
import	SectionStatus			from	'components/details/SectionStatus';

function	MainSection(props) {
	return (
		<main className={'-mt-24 pb-8'}>
			<div className={'max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'}>
				<div className={'grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8'}>
					<div className={'grid grid-cols-1 gap-4 lg:col-span-3'}>
						<SectionStatus
							achievement={props.achievement}
							description={props.description}
							currentAddressClaim={props.currentAddressClaim} />
					</div>
					<div className={'grid grid-cols-1 gap-4 lg:col-span-3'}>
						<Leaderboard
							achievementKey={props.achievement.key}
							verificationCode={props.verificationCode}
							/>
					</div>
				</div>
			</div>
		</main>
	);
}

export default MainSection;