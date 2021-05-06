/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				Header.js
******************************************************************************/

import	{Fragment, useRef}				from	'react';
import	{Dialog, Transition}			from	'@headlessui/react';
import	Image							from	'next/image';
import	SectionBanner					from	'components/index/SectionBanner';
import	SectionProgress					from	'components/index/SectionProgress';
import	useAchievements					from	'contexts/useAchievements';
import	useWeb3							from	'contexts/useWeb3';
import	useUI							from	'contexts/useUI';

function	LoginModal() {
	const	walletConnectRef = useRef()
	const	{connect, walletType} = useWeb3();
	const	{walletModal, set_walletModal} = useUI();

	return (
		<Transition.Root show={walletModal} as={Fragment}>
			<Dialog
				as={'div'}
				static
				className={'fixed z-10 inset-0 overflow-y-auto'}
				style={{zIndex: 9999999}}
				initialFocus={walletConnectRef}
				open={walletModal}
				onClose={set_walletModal}>
				<div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
					<Transition.Child
						as={Fragment}
						enter={'ease-out duration-300'} enterFrom={'opacity-0'} enterTo={'opacity-100'}
						leave={'ease-in duration-200'} leaveFrom={'opacity-100'} leaveTo={'opacity-0'}>
						<Dialog.Overlay className={'fixed inset-0 bg-gray-400 bg-opacity-75 dark:bg-dark-background-900 dark:bg-opacity-75 transition-opacity'} />
					</Transition.Child>

					<span className={'hidden sm:inline-block sm:align-middle sm:h-screen'} aria-hidden={'true'}>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter={'ease-out duration-300'}
						enterFrom={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
						enterTo={'opacity-100 translate-y-0 sm:scale-100'}
						leave={'ease-in duration-200'}
						leaveFrom={'opacity-100 translate-y-0 sm:scale-100'}
						leaveTo={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}>
						<div className={'inline-block align-bottom dark:bg-dark-background-600 bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:mb-96'}>
							<div className={'dark:bg-dark-background-600 bg-white rounded-lg p-6 space-y-4'}>
								<div
									onClick={() => {
										connect(walletType.METAMASK);
										set_walletModal(false);
									}}
									className={'dark:bg-dark-background-900 dark:bg-opacity-20 dark:hover:bg-opacity-30 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md flex flex-col justify-center items-center transition-colors p-6 text-center'}>
									<div className="web3modal-icon">
										<Image src={'/logoMetamask.svg'} alt={'metamask'} width={45} height={45} />
									</div>
									<div className={'mt-2 font-bold text-2xl text-gray-700 dark:text-white'}>MetaMask</div>
									<div className={'mt-2 text-lg text-gray-500 dark:text-white dark:text-opacity-60'}>Connect to your MetaMask Wallet</div>
								</div>
								<div
									onClick={() => {
										connect(walletType.WALLET_CONNECT);
										set_walletModal(false);
									}}
									ref={walletConnectRef}
									className={'dark:bg-dark-background-900 dark:bg-opacity-20 dark:hover:bg-opacity-30 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md flex flex-col justify-center items-center transition-colors p-6 text-center'}>
									<div className='web3modal-icon'>
										<Image src={'/logoWalletConnect.svg'} alt={'walletConnect'} width={45} height={45} />
									</div>
									<div className={'mt-2 font-bold text-2xl text-gray-700 dark:text-white'}>WalletConnect</div>
									<div className={'mt-2 text-lg text-gray-500 dark:text-white dark:text-opacity-60'}>Scan with WalletConnect to connect</div>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

function	PageHeader() {
	const	{set_walletModal} = useUI();
	const	{active} = useWeb3();
	const	{elements} = useAchievements();

	return (
		<header className={'grid grid-cols-2 gap-12 mb-0 md:mb-16'}>
			<div className={'text-center md:text-left col-span-2 md:col-span-1 md:pr-16'}>
				<span className={'my-4 md:my-6 items-center justify-center font-extrabold relative'}>
					<p
						className={'mr-0 text-2xl md:text-4xl block mb-4 md:mb-8 text-gray-500 dark:text-dark-white dark:opacity-75 text-center md:text-left'}
						style={{fontFamily: 'monospace'}}>
						{'Are you ready,'}
					</p>
					<p
						className={'text-playerone-gradient mr-0 text-2xl md:text-5xl block text-center md:text-left'}
						style={{fontFamily: '"Press Start 2P"', lineHeight: 'unset'}}>
						{'PLAYER ONE'}
					</p>
				</span>
				<div
					className={'mt-4 md:mt-8 my-4 text-sm md:text-base text-gray-500 dark:text-dark-white dark:opacity-75 lg:mx-auto prose-sm text-center md:text-left'}
					style={{fontFamily: 'monospace'}}>
					<p>Player One offers every crypto user, from crypto noob to DeFi degen, a chance to highlight & value their crypto activity.</p>
					<p className={'hidden md:block'}>You will be able to participate in various challenges, to claim your rewards but also to spot the latest protocols or opportunities available in the crypto space.</p>
				</div>
				{
					active ?
					<SectionProgress
						unlocked={elements?.claims?.length + elements?.claimables?.length || 0}
						total={elements.count} />
					:
					<div
						className={'loginButton text-white mt-2 md:mt-4'}
						onClick={() => set_walletModal(true)}>
						{'Connect your wallet'}
					</div>
				}
			</div>
			<div className={'col-span-2 md:col-span-1 md:mt-12'}>
				<SectionBanner />
			</div>
			<LoginModal />
		</header>
	);
}

function	PageHeaderOld() {
	return (
		<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} style={{width: 'fit-content'}}>
			<div className={'text-center'}>
				<span className={'flex mx-auto flex-row my-4 md:my-6 items-center justify-center leading-8 font-extrabold tracking-tight relative'} style={{fontFamily: '"Press Start 2P"', lineHeight: 'unset', width: 'fit-content'}}>
					<p className={'text-playerone-gradient mr-0 tracking-wider md:tracking-extrem text-4xl sm:text-7xl'}>{'PLAYER'}</p>
					<p className={'text-accent-900 withNeon absolute -right-12 -bottom-8 md:-right-24 md:-bottom-16 text-6xl sm:text-9xl'} style={{fontFamily: 'Absolute Neon Script'}}>{'ONE'}</p>
				</span>
				<p className={'pt-8 my-4 max-w-2xl text-sm md:text-base text-gray-500 dark:text-dark-white dark:opacity-75 lg:mx-auto'}>
					{'Are you ready to claim your name ? Come and unlock unique achievements throughout your Degen life in the DEFI ecosystem, and become the first to get the golden Reward'}
				</p>
			</div>
		</header>
	);
}

function	PageHeaderOlder() {
	return (
		<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-opacity-10'} style={{width: 'fit-content'}}>
			<div className={'text-center'}>
				<span className={'flex flex-row my-4 md:my-6 items-center justify-center text-playerone-gradient text-3xl sm:text-6xl leading-8 font-extrabold tracking-tight'} style={{fontFamily: '"Press Start 2P"'}}>
					<p className={'mr-6'}>{'PLAYER'}</p>
					<p className={''}>{'ONE'}</p>
				</span>
				<p className={'my-4 max-w-2xl text-sm md:text-base text-gray-500 dark:text-dark-white dark:opacity-75 lg:mx-auto'}>
					{'Are you ready to claim your name ? Come and unlock unique achievements throughout your Degen life in the DEFI ecosystem, and become the first to get the golden Reward'}
				</p>
			</div>
		</header>
	);
}

export default PageHeader;