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
	const	{connect, active, walletType} = useWeb3();

	if (!active) {
		return null;
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
	);
}

function	ContextMenuLoginController({open, set_open}) {
	return (
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
				<ContextMenuLogin set_open={set_open} />
			</div>
		</Transition>
	);
}

export default ContextMenuLoginController;