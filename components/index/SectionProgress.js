/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionProgress.js
******************************************************************************/

import	useWeb3					from	'contexts/useWeb3';
import	useAchievements			from	'contexts/useAchievements';

function	SectionProgress({unlocked, total}) {
	const	{active} = useWeb3();
	const	{achievementsCheckProgress} = useAchievements();
	
	if (!active) {
		return null;
	}
	return (
		<section aria-label={'achievement-progress'} id={'achievement-progress'} className={'flex flex-col w-full z-10'}>
			<h3 className={'text-base text-accent-900 text-opacity-80 font-semibold tracking-wide uppercase mb-4 text-center'}>
				{`${(unlocked/total*100).toFixed(2)}% completed`}
			</h3>
			<div className={'rounded overflow-hidden h-2 mb-0.5 bg-gray-200 flex flex-row mx-6 md:mx-12 lg:mx-16 xl:mx-24 z-10'}>
				<div className={'h-full progressBarColor rounded transition-all duration-700'} style={{width: `calc(100% * ${unlocked/total})`}} />
			</div>
			<p className={'text-gray-400 uppercase mt-2 text-center text-xs'}>
				&nbsp;{achievementsCheckProgress.checking ? `(${achievementsCheckProgress.progress}/${achievementsCheckProgress.total})` : ''}&nbsp;
			</p>
		</section>
	)
}


function	SectionProgress2({unlocked, total}) {
	const	{active} = useWeb3();
	const	{achievementsCheckProgress} = useAchievements();
	
	if (!active) {
		return null;
	}
	return (
		<section aria-label={'achievement-progress'} id={'achievement-progress'} className={'flex flex-col w-full z-10'}>
			<div className={'rounded overflow-hidden h-2 bg-gray-200 dark:bg-dark-background-400 flex flex-row mx-6 md:mx-12 lg:mx-16 xl:mx-24 z-10 relative'} style={{marginTop: 34}}>
				<div className={'h-full progressBarColor rounded transition-all duration-700'} style={{width: `calc(100% * ${unlocked/total})`}} />
				{/* <div className={'absolute inset-0 flex items-center justify-center'}>
					<h3 className={'text-xs text-white text-opacity-60 font-semibold tracking-wide uppercase text-center'} style={{fontSize: 2}}>
						{`${(unlocked/total*100).toFixed(2)}% completed`}
					</h3>
				</div> */}
			</div>
			<p className={'text-gray-400 uppercase mt-2 text-center text-xs'}>
				&nbsp;{achievementsCheckProgress.checking ? `(${achievementsCheckProgress.progress}/${achievementsCheckProgress.total})` : ''}&nbsp;
			</p>
		</section>
	)
}

export default SectionProgress;