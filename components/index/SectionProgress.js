/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionProgress.js
******************************************************************************/

import	useWeb3					from	'contexts/useWeb3';
import	useAchievements			from	'contexts/useAchievements';

function	SectionProgressOld({unlocked, total}) {
	const	{active} = useWeb3();
	const	{achievementsCheckProgress} = useAchievements();
	
	if (!active) {
		return null;
	}
	return (
		<section aria-label={'achievement-progress'} id={'achievement-progress'} className={'flex flex-col w-full z-10'}>
			<h3 className={'text-base text-accent-900 text-opacity-80 font-semibold tracking-wide uppercase mb-4 text-center'}>
				{`${((unlocked/total*100) || 0).toFixed(2)}% completed`}
			</h3>
			<div className={'rounded overflow-hidden h-2 mb-0.5 bg-gray-200 flex flex-row mx-6 md:mx-12 lg:mx-16 xl:mx-24 z-10'}>
				<div className={'h-full progressBarColor transition-all duration-700'} style={{width: `calc(100% * ${unlocked/total})`}} />
			</div>
			<p className={'text-gray-400 uppercase mt-2 text-center text-xs'}>
				&nbsp;{achievementsCheckProgress.checking ? `(${achievementsCheckProgress.progress}/${achievementsCheckProgress.total})` : ''}&nbsp;
			</p>
		</section>
	)
}

function	SectionProgress({unlocked, total}) {
	const	{active} = useWeb3();
	
	if (!active) {
		return null;
	}
	function	Slices() {
		const	limit = unlocked * 50 / [total || 1]
		let	res = [];
		for (let index = 0; index < 50; index++) {
			if (index < limit) {
				res.push(
					<div
						className={'h-full bg-accent-900 transition-all duration-700'}
						style={{width: `calc(100% * ${1/50})`}} />
				)
			} else {
				res.push(
					<div
						className={'h-full bg-dark-background-200 bg-opacity-20 transition-all duration-700'}
						style={{width: `calc(100% * ${1/50})`}} />
				)
			}
			
		}
		return res;
	}

	return (
		<section aria-label={'achievement-progress'} id={'achievement-progress'} className={'flex flex-col w-full z-10 pt-2 md:mt-12 md:pt-1.5'}>
			<div className={'h-4 mb-0.5 flex flex-row z-10 boerder border-accent-900 space-x-1px'}>
				<Slices />
			</div>
		</section>
	)
}

export default SectionProgress;