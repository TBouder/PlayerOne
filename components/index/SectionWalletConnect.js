/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionWalletConnect.js
******************************************************************************/

import	Image											from	'next/image';
import	useWeb3											from	'contexts/useWeb3';

function	SectionWalletConnect() {
	const	{providerType, walletType, connect} = useWeb3();
	
	if (providerType !== walletType.NONE) {
		return null;
	}
	return (
		<>
			<div className={'grid flex-col justify-center items-center w-full gap-y-4 py-0 md:flex md:gap-y-0 md:gap-x-4 md:flex-row md:py-3'}>
				{(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) ? <button
					id={'with_metamask'}
					onClick={() => connect(walletType.METAMASK)}
					type={'button'}
					className={'inline-flex items-center px-4 py-4 border border-transparent shadow-sm leading-4 font-medium rounded-md text-white bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 justify-center md:justify-items-auto'}>
					<Image
						src={'/logoMetamask.svg'}
						alt={'wallet-connect'}
						width={16}
						height={16} />
					<p className={'pl-2'} style={{color: '#f6851b'}}>
						{'Connect with Metamask'}
					</p>
				</button> : null}
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
					<p className={'pl-2'} style={{color: 'rgb(65, 153, 252)'}}>
						{'Connect with WalletConnect'}
					</p>
				</button>
			</div>
		</>
	)
}

export default SectionWalletConnect;