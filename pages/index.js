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
			<div className={'py-6'}>
				<Header />

				<section id={'wallet-connect-select'} aria-label={'wallet-connect-select'} className={'w-full pt-4'} suppressHydrationWarning>
					<SectionWalletConnect />
				</section>
				
				<div className={'relative z-0 -ml-10'}>
					<svg width={'404'} height={'300'} fill={'none'} viewBox={'0 0 404 300'} className={`absolute left-0 transform opacity-50`}><defs><pattern id={'64e643ad-2176-4f86-b3d7-f2c5da3b6a6d'} x={'0'} y={'0'} width={'20'} height={'20'} patternUnits={'userSpaceOnUse'}><rect x={'0'} y={'0'} width={'4'} height={'4'} fill={'currentColor'} className={'text-gray-200'}></rect></pattern></defs><rect width={'404'} height={'300'} fill={'url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)'}></rect></svg>
				</div>
				
				<section id={'achievement-progress'} aria-label={'achievement-progress'} className={'w-full z-10'} suppressHydrationWarning>
					<SectionProgress
						unlocked={unlockedCount}
						myAchievements={achievements || achievementsList} />
				</section>

				<SectionBanner />

				<SectionCollections />

				<div className={'relative h-0 -ml-10'} style={{zIndex: -1}}>
					<svg width="404" height="500" fill="none" viewBox="0 0 404 500" className="hidden lg:block absolute left-full transform -translate-x-1/2 opacity-50 z-0"><defs><pattern id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="currentColor" className="text-gray-200"></rect></pattern></defs><rect width="404" height="500" fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"></rect></svg>
				</div>


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
