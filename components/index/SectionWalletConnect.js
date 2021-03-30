/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionWalletConnect.js
******************************************************************************/

import	{useState, useEffect}	from	'react';
import	Image					from	'next/image';
import	useWeb3					from	'contexts/useWeb3';

function	SectionWalletConnect() {
	const	[mount, set_mount] = useState(false);
	const	{active, walletType, connect} = useWeb3();
	
	useEffect(() => {
		set_mount(true);
	}, []);

	if (active) {
		return null;
	}

	return (
		<>
			<div className={'grid flex-col justify-center items-center w-full gap-y-4 py-0 md:flex md:gap-y-0 md:gap-x-4 md:flex-row md:py-3'}>
				<button
					id={'with_metamask'}
					onClick={() => connect(walletType.METAMASK)}
					type={'button'}
					style={{display: mount && typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask ? 'inline-flex' : 'none'}}
					className={'inline-flex items-center px-4 py-4 border border-transparent shadow-sm leading-4 font-medium rounded-md text-white bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 justify-center md:justify-items-auto'}>
					<Image
						src={'/logoMetamask.svg'}
						alt={'wallet-connect'}
						width={16}
						height={16} />
					<p id={'text_with_metamask'} className={'pl-2 text-metamask'}>
						{'Connect with Metamask'}
					</p>
				</button>
				<button
					id={'with_wallet_connect'}
					onClick={() => connect(walletType.WALLET_CONNECT)}
					type={'button'}
					className={'inline-flex items-center px-4 py-4 border border-transparent shadow-sm leading-4 font-medium rounded-md text-white bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 justify-center md:justify-items-auto'}>
					<Image
						src={'/logoWalletConnect.svg'}
						alt={'wallet-connect'}
						width={16}
						height={16} />
					<p id={'text_with_walletConnect'} className={'pl-2 text-walletConnect'}>
						{'Connect with WalletConnect'}
					</p>
				</button>
			</div>
		</>
	)
}

export default SectionWalletConnect;