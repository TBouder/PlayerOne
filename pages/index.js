/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				prices.js
******************************************************************************/

import	{useState, useEffect}							from	'react';
import	Header											from	'components/index/Header';
import	SectionBanner									from	'components/index/SectionBanner';
import	SectionWalletConnect							from	'components/index/SectionWalletConnect';
import	SectionProgress									from	'components/index/SectionProgress';
import	SectionCollections								from	'components/index/SectionCollections';
import	SectionAchievements								from	'components/index/SectionAchievements';
import	useAchievements									from	'contexts/useAchievements';
import	{fetcher}										from	'utils'

function	Page(props) {
	const	{achievements, claims} = useAchievements();
	const	achievementsList = achievements || props.achievementsList;
	const	[unlockedCount, set_unlockedCount] = useState(claims?.length || 0);

	useEffect(() => {
		if (achievements) {
			set_unlockedCount(achievements.filter(e => e.unlocked).length)
		}
	}, [achievements]);

	return (
		<div className={'w-full pt-2 px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto'}>
			<div className={'py-6 bg-white'}>
				<Header />

				<section id={'wallet-connect-select'} aria-label={'wallet-connect-select'} className={'w-full pt-4'} suppressHydrationWarning>
					<SectionWalletConnect />
				</section>

				<section id={'achievement-progress'} aria-label={'achievement-progress'} className={'w-full'} suppressHydrationWarning>
					<SectionProgress
						unlocked={unlockedCount}
						myAchievements={achievements || achievementsList} />
				</section>

				<SectionBanner />

				<SectionCollections />

				<SectionAchievements type={'Achievements'} achievements={achievements || achievementsList} />
			</div>
		</div>
	)
}

export async function getStaticProps() {
	const	achievements = await fetcher(`${process.env.API_URI}/achievements`)

	return {props: {achievementsList: achievements || []}}
}

export default Page;
