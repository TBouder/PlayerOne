/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday April 6th 2021
**	@Filename:				ContextMenuLogin.js
******************************************************************************/

import	Image				from	'next/image';
import	{Transition}		from	'@headlessui/react';
import	useWeb3				from	'contexts/useWeb3';

function	ContextMenuLogin({set_open}) {
	const	{connect, walletType} = useWeb3();

	return (
		<>
			<button
				onClick={() => {
					connect(walletType.METAMASK);
					set_open(false);
				}}
				className={'flex flex-row items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
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
				className={'flex flex-row items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
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
		</>
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
			<div className={'origin-top-right absolute z-10 right-0 transform mt-6 px-2 w-max max-w-xs sm:px-0'}>
				<div className={'rounded-md shadow-lg border-gray-200 border-solid border overflow-hidden bg-white'}>
					<ContextMenuLogin set_open={set_open} />
				</div>
			</div>
		</Transition>
	);
}

export default ContextMenuLoginController;