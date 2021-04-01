/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Sunday March 7th 2021
**	@Filename:				TopMenu.js
******************************************************************************/

import	{useState, useRef}			from	'react';
import	Image						from	'next/image';
import	Link						from	'next/link';
import	{useRouter}					from	'next/router';
import	{Transition}				from	'@headlessui/react';
import	useWeb3						from	'contexts/useWeb3';
import	useOnClickOutside			from	'hook/useOnClickOutside';

function	TopMenu() {
	const	refOutside = useRef();
	const	[open, set_open] = useState(false);
	const	{address, connect, deactivate, active, walletType} = useWeb3();
	const	router = useRouter();

	useOnClickOutside(refOutside, () => set_open(false));

	function	renderConnect() {
		if (active) {
			return (
				null
			);
		}
		return (
			<div role={'none'}>
				<button
					onClick={() => {
						connect(walletType.METAMASK);
						set_open(false);
					}}
					className={'flex flex-row w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
					role={'menuitem'}>
					<Image
						src={'/logoMetamask.svg'}
						alt={'metamask'}
						width={16}
						height={16} />
					<p className={'ml-2'}>
						{'Connect with Metamask'}
					</p>
				</button>
				<button
					onClick={() => {
						connect(walletType.WALLET_CONNECT);
						set_open(false);
					}}
					className={'flex flex-row w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
					role={'menuitem'}>
					<Image
						src={'/logoWalletConnect.svg'}
						alt={'wallet-connect'}
						width={16}
						height={16} />
					<p className={'ml-2'}>
						{'Connect with WalletConnect'}
					</p>
				</button>
			</div>
		)
	}

	return (
		<div className={'w-full py-2 px-4 fixed top-0 left-0 bg-white bg-opacity-90 pointer-events-none z-50'}>
			<div className={'max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-12 lg:px-12 xl:px-12'}>
				<div className={'relative flex flex-row items-center text-left z-50 pointer-events-auto'}>
					{router.pathname === '/details/[slug]' ? <Link href={'/'} scroll={false} passHref>
						<svg className={'w-6 h-6 text-gray-400 hover:text-gray-900 cursor-pointer'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
					</Link> : null}
					{router.pathname !== '/details/[slug]' ?
						<div className={'flex flex-row w-full items-baseline'}>
							<div>
								<Link href={'/'} passHref>
									<p className={'text-gray-400 hover:text-gray-900 leading-7 font-semibold cursor-pointer mr-8'}>
										{'Achievements.eth'}
									</p>
								</Link>
							</div>
							<div>
								<p className={'text-gray-400 hover:text-gray-900 leading-7 text-sm cursor-pointer mr-8'}>{'About'}</p>
							</div>
							<div>
								<Link href={'/leaderboard'} passHref>
									<p className={'text-gray-400 hover:text-gray-900 leading-7 text-sm cursor-pointer mr-8'}>
										{'Leaderboard'}
									</p>
								</Link>
							</div>
							<div>
								<p className={'text-gray-400 hover:text-gray-900 leading-7 text-sm cursor-pointer mr-8'}>{'Governance'}</p>
							</div>
						</div>
					: null}
				</div>
				<div
					className={'relative flex flex-row items-center text-left z-50 pointer-events-auto'}
					ref={refOutside}>
					<div className={'flex items-center'}>
						<button
							suppressHydrationWarning
							onClick={() => active ? deactivate() : set_open(!open)}
							type={'button'}
							className={'inline-flex border border-solid border-gray-200 px-4 py-2 items-center shadow-sm leading-4 font-normal rounded-md text-xs text-gray-700 bg-white hover:bg-gray-100'}
							id={'options-menu'}
							aria-expanded={'true'}
							aria-haspopup={'true'}>
							{address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Connect Wallet'}
							<svg className={`-mr-1 ml-2 h-5 w-5 text-gray-400 ${active ? 'hidden' : 'block'}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden={'true'}><path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' /></svg>
							<svg className={`-mr-1 ml-2 h-5 w-5 text-gray-400 ${!active ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
						</button>
					</div>

					<Transition
						show={open}
						enter={'transition ease-out duration-100'}
						enterFrom={'transform opacity-0 scale-95'}
						enterTo={'transform opacity-100 scale-100'}
						leave={'transition ease-in duration-75'}
						leaveFrom={'transform opacity-100 scale-100'}
						leaveTo={'transform opacity-0 scale-95'}>
						<div
							className={'origin-top-right absolute right-0 mt-5 w-64 rounded-md shadow-lg bg-white border-gray-200 border-solid border divide-y divide-gray-100 focus:outline-none'}
							role={'menu'}
							aria-orientation={'vertical'}
							aria-labelledby={'options-menu'}>
							{renderConnect()}
						</div>
					</Transition>
				</div>
			</div>
		</div>
	);
}


export default TopMenu;
