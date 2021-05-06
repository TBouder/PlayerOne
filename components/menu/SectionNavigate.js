/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday April 6th 2021
**	@Filename:				SectionNavigate.js
******************************************************************************/

import	Link					from	'next/link';
import	{useRouter}				from	'next/router';

function	SectionNavigate({menuOpen, set_menuOpen}) {
	const	router = useRouter();
	const	pathWithBack = ['/details/[slug]', '/collections/[slug]']

	return (
		<nav className={'flex flex-col w-full'}>
			<div className={'relative flex-row items-center text-left z-50 pointer-events-auto flex'}>
				{pathWithBack.includes(router.pathname) ?
					<div onClick={() => router.back()}>
						<svg className={'w-6 h-6 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer'} xmlns='http://www.w3.org/2000/svg' fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
					</div>
				: null}
				{!pathWithBack.includes(router.pathname) ?
					<>
						<div className={'absolute inset-y-0 left-0 flex items-center sm:hidden'}>
								<button
									onClick={() => set_menuOpen(!menuOpen)}
									type={'button'}
									className={'inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700'}
									aria-controls={'mobile-menu'}
									aria-expanded={'false'}>
								<span className="sr-only">Open main menu</span>
								<svg className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
								<svg className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
							</button>
						</div>
						<div className={'flex-1 hidden items-center justify-center sm:items-stretch sm:justify-start sm:flex'}>
							<Link href={'/'} passHref>
  								<div className={'hexagon'} />
								{/* <p className={'text-2xl cursor-pointer'}>{'🌕'}</p> */}
								{/* <div className={'cursor-pointer'}>
									<Image
										width={30}
										height={30}
										layout={'fixed'}
										src={'/coin.svg'} />
								</div> */}
							</Link>
							<div className={'flex items-center'}>
								<Link href={'/about'} passHref>
									<p className={'text-gray-600 hover:text-gray-900 dark:text-dark-white dark:hover:text-white text-sm cursor-pointer mx-8'}>{'About'}</p>
								</Link>
							</div>
							<div className={'flex items-center'}>
								<Link href={'/leaderboard'} passHref>
									<p className={'text-gray-600 hover:text-gray-900 dark:text-dark-white dark:hover:text-white text-sm cursor-pointer mr-8'}>
										{'Leaderboard'}
									</p>
								</Link>
							</div>
							<div className={'flex items-center'}>
								<p className={'text-gray-600 hover:text-gray-900 dark:text-dark-white dark:hover:text-white text-sm cursor-pointer mr-8'}>{'Governance'}</p>
							</div>
						</div>
					</>
				: null}
			</div>
		</nav>
	);
}

export default SectionNavigate;