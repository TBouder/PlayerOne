/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday April 6th 2021
**	@Filename:				ContextMenuLogin.js
******************************************************************************/

import	Image				from	'next/image';
import	{Transition}		from	'@headlessui/react';
import	useWeb3				from	'contexts/useWeb3';
import	useUI				from	'contexts/useUI';

function	ContextTheme({set_open}) {
	const	{theme} = useUI();

	return (
		<li
			onClick={() => {
				set_open(false);
				theme.switch();
			}}
			className={'transition-all px-2 py-2 text-gray-400 dark:text-dark-background-600 dark:text-opacity-75 flex items-center hover:bg-gray-200 hover:text-gray-800 cursor-pointer border-t border-solid border-gray-200'}>
			{theme.get === 'light' ?
				<svg xmlns="http://www.w3.org/2000/svg" className={'h-4 w-4 inline'} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> :
				<svg xmlns="http://www.w3.org/2000/svg" className={'h-4 w-4 inline'} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
			}
			<p className={'ml-2 text-sm inline'}>
				{`Switch to ${theme.get === 'light' ? 'dark' : 'light'} mode`}
			</p>
		</li>
	);
}

function	ContextMenuLoginWallet({set_open}) {
	const	{set_walletModal} = useUI();

	return (
		<li
			onClick={() => {
				set_open(false);
				set_walletModal(true);
			}}
			className={'px-2 py-2 text-gray-400 dark:text-dark-background-600 dark:text-opacity-75 flex items-center hover:bg-gray-200 hover:text-gray-800 cursor-pointer border-t border-solid border-gray-200'}>
			<svg xmlns="http://www.w3.org/2000/svg" className={'h-4 w-4 inline'} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
			<p className={'ml-2 text-sm inline'}>
				{`Connect your wallet`}
			</p>
		</li>
	)
}

function	ContextMenuLogin({set_open}) {
	return (
		<div className={'absolute z-10 right-0 mt-6 px-2 w-max max-w-xs sm:px-0'}>
			<div className={'rounded-md shadow-lg overflow-auto'}>
				<div className={'relative grid gap-2'}>
					<div className={'bg-white'}>
						<ul>
							<ContextMenuLoginWallet set_open={set_open} />
							<ContextTheme set_open={set_open} />
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

function	ContextMenuLoginController({open, set_open}) {
	return (
		<Transition
			show={open}
			enter={'transition ease-out duration-200'}
			enterFrom={'opacity-0 translate-y-1'}
			enterTo={'opacity-100 translate-y-0'}
			leave={'transition ease-in duration-150'}
			leaveFrom={'opacity-100 translate-y-0'}
			leaveTo={'opacity-0 translate-y-1'}>
			<ContextMenuLogin set_open={set_open} />
		</Transition>
	);
}

export default ContextMenuLoginController;