/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				prices.js
******************************************************************************/

import	{useRef, useState, useEffect}	from	'react';
import	Header							from	'components/index/Header';
import	SectionBanner					from	'components/index/SectionBanner';
import	SectionWalletConnect			from	'components/index/SectionWalletConnect';
import	SectionProgress					from	'components/index/SectionProgress';
import	SectionCollections				from	'components/index/SectionCollections';
import	SectionAchievements				from	'components/index/SectionAchievements';
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


	if (false) {
		return (
			<>
				<div ref={headerRef} className={'headerAnim'}>
					<section
						aria-label={'header'}
						className={'py-32 md:py-48 bg-accent-900 -mt-28 relative'}>
						{/* <ul className={'circles circlesMoreVisible pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul> */}
						<header className={'pt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
							<div className={'lg:text-center'}>
								<p className={'leading-8 font-extrabold tracking-tight text-white dark:text-dark-white opacity-60 text-4xl'}>
									{'Greetings'}
								</p>
								<p className={'text-7xl font-extrabold tracking-tight text-white dark:text-dark-white my-4 md:my-8'}>
									{'PLAYER ONE'}
								</p>
								<p className={'font-extrabold tracking-tight text-white dark:text-dark-white opacity-60 text-4xl'}>
									{'Are you ready to claim your name ?'}
								</p>
							</div>
							<section id={'wallet-connect-select'} aria-label={'wallet-connect-select'} className={'w-full pt-4'} suppressHydrationWarning>
								<SectionWalletConnect />
							</section>
							<section id={'achievement-progress'} aria-label={'achievement-progress'} className={'w-full z-10'} suppressHydrationWarning>
								<SectionProgress
									unlocked={elements?.claimables?.length || 0}
									total={elements.count} />
							</section>
						</header>
					</section>
					<div className={'w-full px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto relative -mt-48 pb-8'}>
						<SectionBanner />
					</div>
				</div>
				<main className={'dark:bg-dark-background-900'}>
					<div className={'w-full px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto pb-32 md:pb-48 relative'}>
						<div ref={contentRef} className={'contentAnim'}>
							<SectionCollections />
							<div className={'relative h-0 -ml-10'} style={{zIndex: -1}}>
								<svg width="404" height="500" fill="none" viewBox="0 0 404 500" className="hidden lg:block absolute left-full transform -translate-x-1/2 opacity-50 z-0"><defs><pattern id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" rx={'2'} fill="currentColor" className={'text-gray-200 dark:text-dark-background-400'}></rect></pattern></defs><rect width="404" height="500" fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"></rect></svg>
							</div>
							<SectionAchievements />
						</div>
					</div>
				</main>
			</>
		)
	}


	return (
		<main className={'dark:bg-dark-background-900'}>
			<div className={'w-full pt-2 px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto py-32 md:py-48 -mt-28 relative'}>
				<div className={'py-6'}>
					<div ref={headerRef} className={'headerAnim'}>
						<Header />
						<section id={'wallet-connect-select'} aria-label={'wallet-connect-select'} className={'w-full pt-4'} suppressHydrationWarning>
							<SectionWalletConnect />
						</section>
						
						<div className={'relative z-0 -ml-10'}>
							<svg width={'404'} height={'300'} fill={'none'} viewBox={'0 0 404 300'} className={`absolute left-0 transform opacity-50`}><defs><pattern id={'64e643ad-2176-4f86-b3d7-f2c5da3b6a6d'} x={'0'} y={'0'} width={'20'} height={'20'} patternUnits={'userSpaceOnUse'}><rect x={'0'} y={'0'} width={'4'} height={'4'} rx={'2'} fill={'currentColor'} className={'text-gray-200 dark:text-dark-background-400'}></rect></pattern></defs><rect width={'404'} height={'300'} fill={'url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)'}></rect></svg>
						</div>
						
						<section id={'achievement-progress'} aria-label={'achievement-progress'} className={'w-full z-10'} suppressHydrationWarning>
							<SectionProgress
								unlocked={elements?.claimables?.length || 0}
								total={elements.count} />
						</section>

						<SectionBanner />
					</div>
					<div ref={contentRef} className={'contentAnim'}>
						<SectionCollections />
						<div className={'relative h-0 -ml-10'} style={{zIndex: -1}}>
							<svg width="404" height="500" fill="none" viewBox="0 0 404 500" className="hidden lg:block absolute left-full transform -translate-x-1/2 opacity-50 z-0"><defs><pattern id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" rx={'2'} fill="currentColor" className={'text-gray-200 dark:text-dark-background-400'}></rect></pattern></defs><rect width="404" height="500" fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"></rect></svg>
						</div>
						<SectionAchievements />
					</div>
				</div>
			</div>
		</main>
	)
}

export default Page;
