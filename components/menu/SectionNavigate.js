/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday April 6th 2021
**	@Filename:				SectionNavigate.js
******************************************************************************/

import	Link					from	'next/link';
import	{useRouter}				from	'next/router';
import	{FontAwesomeIcon}		from	'@fortawesome/react-fontawesome'
import	{faCrown}				from	'@fortawesome/free-solid-svg-icons'

function	SectionNavigate({menuOpen, set_menuOpen}) {
	const	router = useRouter();

	return (
		<nav className={'flex flex-col w-full'}>
			<div className={'relative flex-row items-center text-left z-50 pointer-events-auto flex'}>
				{router.pathname === '/details/[slug]' ? <Link href={'/'} scroll={false} passHref>
					<svg className={'w-6 h-6 text-gray-400 hover:text-gray-900 cursor-pointer'} xmlns='http://www.w3.org/2000/svg' fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
				</Link> : null}
				{router.pathname !== '/details/[slug]' ?
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
							<div>
								<Link href={'/'} passHref>
									<div className={'cursor-pointer'}>
										<FontAwesomeIcon
											style={{width: 24, height: 24}}
											className={'text-gray-600'}
											icon={faCrown} />
									</div>
								</Link>
							</div>
							<div>
								<p className={'text-gray-600 hover:text-gray-900 leading-7 text-sm cursor-pointer mx-8'}>{'About'}</p>
							</div>
							<div>
								<Link href={'/leaderboard'} passHref>
									<p className={'text-gray-600 hover:text-gray-900 leading-7 text-sm cursor-pointer mr-8'}>
										{'Leaderboard'}
									</p>
								</Link>
							</div>
							<div>
								<p className={'text-gray-600 hover:text-gray-900 leading-7 text-sm cursor-pointer mr-8'}>{'Governance'}</p>
							</div>
						</div>
					</>
				: null}
			</div>
		</nav>
	);
}

export default SectionNavigate;