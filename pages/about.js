/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday April 14th 2021
**	@Filename:				about.js
******************************************************************************/

import	{useRef, useState, useEffect}	from	'react';
import	Header							from	'components/index/Header';
import	SectionWhat						from	'components/about/SectionWhat';
import	SectionTeam						from	'components/about/SectionTeam';
import	SectionFAQ						from	'components/about/SectionFAQ';
import	useAchievements					from	'contexts/useAchievements';

function	Page() {
	const	{elements} = useAchievements();

	/**************************************************************************
	**	Used for the animations
	**************************************************************************/
	const	headerRef = useRef();
	const	contentRef = useRef();
	useEffect(() => {
		setTimeout(() => headerRef.current.className = `${headerRef.current.className} headerAnimOnMount`, 0);
		setTimeout(() => contentRef.current.className = `${contentRef.current.className} contentAnimOnMount`, 0);
	}, [])

	return (
		<main className={'dark:bg-dark-background-900'}>
			<div className={'w-full pt-2 px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto py-32 md:py-48 mt-12 md:-mt-28 relative'}>
				<div className={'py-6'}>
					<div ref={headerRef} className={'headerAnim'}>
						<Header />
						<div className={'relative z-0 -ml-10'}>
							<svg width={'404'} height={'300'} fill={'none'} viewBox={'0 0 404 300'} className={`absolute left-0 transform opacity-50`}><defs><pattern id={'64e643ad-2176-4f86-b3d7-f2c5da3b6a6d'} x={'0'} y={'0'} width={'20'} height={'20'} patternUnits={'userSpaceOnUse'}><rect x={'0'} y={'0'} width={'4'} height={'4'} rx={'2'} fill={'currentColor'} className={'text-gray-200 dark:text-dark-background-400'}></rect></pattern></defs><rect width={'404'} height={'300'} fill={'url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)'}></rect></svg>
						</div>
					</div>
					<div ref={contentRef} className={'contentAnim'}>
						<SectionWhat />
						<SectionTeam />
						<div className={'relative h-0 -ml-10'} style={{zIndex: -1}}>
							<svg width="404" height="500" fill="none" viewBox="0 0 404 500" className="hidden lg:block absolute left-full transform -translate-x-1/2 opacity-50 z-0"><defs><pattern id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" rx={'2'} fill="currentColor" className={'text-gray-200 dark:text-dark-background-400'}></rect></pattern></defs><rect width="404" height="500" fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"></rect></svg>
						</div>
						<SectionFAQ />
					</div>
				</div>
			</div>
		</main>
	)
}

export default Page;
