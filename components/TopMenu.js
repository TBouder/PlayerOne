/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Sunday March 7th 2021
**	@Filename:				TopMenu.js
******************************************************************************/

import	{useState}				from	'react';
import	{useRouter}				from	'next/router';
import	Link					from	'next/link';
import	{Transition}			from	'@headlessui/react';
import	SectionNavigate			from	'components/menu/SectionNavigate';
import	SectionActions			from	'components/menu/SectionActions';

function	TopMenu() {
	const	router = useRouter();
	const	[menuOpen, set_menuOpen] = useState(false);

	return (
		<div className={'fixed top-0 w-full z-50'}>
			<div className={'py-2 px-4 bg-white dark:bg-dark-background-900 bg-opacity-95 pointer-events-none'}>
				<div className={'max-w-screen-2xl mx-auto flex justify-between items-center px-0 md:px-12 lg:px-12 xl:px-12'}>
					<SectionNavigate
						menuOpen={menuOpen}
						set_menuOpen={set_menuOpen} />
					<SectionActions />
				</div>
			</div>
			<Transition
				show={menuOpen}
				enter={'transition ease-out duration-200'}
				enterFrom={'opacity-0 translate-y-1'}
				enterTo={'opacity-100 translate-y-0'}
				leave={'transition ease-in duration-150'}
				leaveFrom={'opacity-100 translate-y-0'}
				leaveTo={'opacity-0 translate-y-1'}>
				<div className={'sm:hidden'} id={'mobile-menu'}>
					<div className={'px-2 pt-2 pb-3 space-y-1 bg-accent-900 rounded-b-md'}>
					<Link href={'/'} passHref>
						<a className={`${router.pathname === '/' ? 'text-accent-900 bg-white' : 'text-gray-200'} hover:text-white block px-3 py-2 rounded-md text-base font-medium`}>
							Home
						</a>
					</Link>

					<Link href={'/leaderboard'} passHref>
						<a className={`${router.pathname === '/leaderboard' ? 'text-accent-900 bg-white' : 'text-gray-200'} hover:text-white block px-3 py-2 rounded-md text-base font-medium`}>
							Leaderboard
						</a>
					</Link>

					<Link href={'/about'} passHref>
						<a className={`${router.pathname === '/about' ? 'text-accent-900 bg-white' : 'text-gray-200'} hover:text-white block px-3 py-2 rounded-md text-base font-medium`}>
							About
						</a>
					</Link>

					<Link href={'/governance'} passHref>
						<a className={`${router.pathname === '/governance' ? 'text-accent-900 bg-white' : 'text-gray-200'} hover:text-white block px-3 py-2 rounded-md text-base font-medium`}>
							Governance
						</a>
					</Link>
					</div>
				</div>
			</Transition>
		</div>
	);
}

export default TopMenu;
