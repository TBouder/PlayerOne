/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				prices.js
******************************************************************************/

import	{useState, useEffect}							from	'react';
import	Image											from	'next/image';
import	FlipMove										from	'react-flip-move';
import	{
	faCoins, faParachuteBox, faGasPump, faShapes,
	faUniversity, faAward}						from	'@fortawesome/free-solid-svg-icons'
import	{FontAwesomeIcon}								from	'@fortawesome/react-fontawesome'
import	AchievementCard									from	'components/AchievementCard';
import	SectionBanner									from	'components/SectionBanner';
import	useWeb3											from	'contexts/useWeb3';
import	useAchievements									from	'contexts/useAchievements';
import	{fetcher}										from	'utils'

function	SectionAchievements(props) {
	const	{achievements, set_achievements} = useAchievements();
	const	[achievementList, set_achievementList] = useState(achievements || props.achievements);

	useEffect(() => {
		if (achievements) {
			set_achievementList(achievements)
		}
	}, [achievements]);

	if (!achievementList || achievementList.length === 0) {
		return null;
	}
	return (
		<section className={'mt-16'} aria-label={`achievements`}>
			<div className={'pb-8 flex flex-row'}>
				<h3 className={'text-base leading-6 font-medium text-gray-400'}>
					{`Featured Achievements`}
				</h3>
				<div className={'bg-red-400 ml-2 rounded inline opacity-100'}>
					<p className={'text-white text-xs px-1.5 py-0.5 pt-1 font-semibold'}>{achievementList.length}</p>
				</div>
			</div>
			<FlipMove
				enterAnimation={'fade'}
				leaveAnimation={'fade'}
				maintainContainerHeight
				className={'mx-auto grid gap-5 gap-y-6 lg:gap-y-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}>
				{(achievementList).map((each) => (
					<AchievementCard
						key={each.UUID}
						hidden={each.hidden}
						achievement={each}
						unlocked={each.unlocked}
						informations={each.informations}
						onUpdate={(updatedAchievement) => {
							const	_achievements = achievements;
							const	index = _achievements.findIndex(e => e.UUID === each.UUID);
							if (index !== -1) {
								_achievements[index] = updatedAchievement;
								set_achievements(_achievements);
							}
						}} />
				))}
			</FlipMove>
		</section>
	);
}

function	PageHeader() {
	return (
		<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
			<div className={'lg:text-center'}>
				<p className={'text-3xl leading-8 font-extrabold tracking-tight text-gray-900 text-gradient sm:text-4xl'}>
					{'No more unknow. So much wow.'}
				</p>
				<p className={'mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'}>
					{'Unlock unique achievements throughout your Degen life in the DEFI ecosystem, and become the first to get the golden Reward'}
				</p>
			</div>
		</header>
	);
}

function	SectionWalletConnect() {
	const	{providerType, walletType, connect} = useWeb3();
	
	if (providerType !== walletType.NONE) {
		return null;
	}
	return (
		<>
			<div className={'grid flex-col justify-center items-center w-full gap-y-4 py-0 md:flex md:gap-y-0 md:gap-x-4 md:flex-row md:py-3'}>
				{(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) ? <button
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

function	SectionAchievementProgress({unlocked, myAchievements}) {
	const	{providerType, walletType} = useWeb3();
	const	{achievementsCheckProgress} = useAchievements();
	
	if (providerType === walletType.NONE) {
		return null;
	}
	return (
		<>
			<div className={'flex flex-col w-full'}>
				<h3 className={'text-base text-teal-600 font-semibold tracking-wide uppercase mb-4 text-center'}>
					{`${(unlocked/myAchievements.length*100).toFixed(2)}% completed`}
				</h3>
				<div className={'rounded overflow-hidden h-2 mb-0.5 bg-gray-200 flex flex-row mx-6 md:mx-12 lg:mx-16 xl:mx-24'}>
					<div className={'h-full progressBarColor rounded transition-all duration-700'} style={{width: `calc(100% * ${unlocked/myAchievements.length})`}} />
				</div>
				<p className={'text-gray-400 uppercase mt-2 text-center text-xs'}>
					&nbsp;{achievementsCheckProgress.checking ? `(${achievementsCheckProgress.progress}/${achievementsCheckProgress.total})` : ''}&nbsp;
				</p>
			</div>
		</>
	)
}

function	ItemCollection({selected, faIcon, title, onClick}) {
	if (selected) {
		return (
			<div className={'rounded-lg bg-teal-700 overflow-hidden w-full h-full transition-colors'}>
				<div className={'flex flex-col justify-center items-center p-4'}>
					<FontAwesomeIcon style={{width: 24, height: 24}} className={'mt-8 text-white'} icon={faIcon} />
					<p className={'mt-6 text-white font-medium'}>{title}</p>
				</div>
			</div>
		);
	}
	return (
		<div className={'rounded-lg bg-gray-200 overflow-hidden w-full h-full cursor-pointer group transition-colors'} onClick={onClick}>
			<div className={'flex flex-col justify-center items-center p-4'}>
				<FontAwesomeIcon
					style={{width: 24, height: 24}}
					className={'mt-8 text-gray-400 group-hover:animate-shake group-hover:text-teal-700 transition-colors'} icon={faIcon} />
				<p className={'mt-6 text-gray-400 font-medium'}>{title}</p>
			</div>
		</div>
	);
}
function	SectionCollections() {
	const	[selec, set_selec] = useState(0);

	return (
		<section id={'collections'} aria-label={'collections'} className={'w-full pt-16'}>
			<div className={'pb-8 w-full flex justify-between'}>
				<h3 className={'text-base leading-6 font-medium text-gray-400'}>
					{`Browse the collections`}
				</h3>
				<h3 className={'text-sm leading-6 font-normal text-teal-700 text-opacity-60 cursor-pointer hover:text-opacity-100 hover:underline'}>
					{`See all`}
				</h3>
			</div>
			<div className={'grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'}>
				<ItemCollection selected={selec === 0} onClick={() => set_selec(0)} faIcon={faAward} title={'All'} />
				<ItemCollection selected={selec === 1} onClick={() => set_selec(1)} faIcon={faShapes} title={'Ecosystem'} />
				<ItemCollection selected={selec === 2} onClick={() => set_selec(2)} faIcon={faCoins} title={'ERC-20'} />
				<ItemCollection selected={selec === 3} onClick={() => set_selec(3)} faIcon={faParachuteBox} title={'Airdrops'} />
				<ItemCollection selected={selec === 4} onClick={() => set_selec(4)} faIcon={faGasPump} title={'Fees'} />
				<ItemCollection selected={selec === 5} onClick={() => set_selec(5)} faIcon={faUniversity} title={'DeFI'} />
			</div>
		</section>
	);
}

function	Page(props) {
	const	{achievements, claims} = useAchievements();
	const	achievementsList = achievements || props.achievementsList;
	const	[unlockedCount, set_unlockedCount] = useState(claims?.length || 0);

	useEffect(() => {
		if (achievements) {
			set_unlockedCount(achievements.filter(e => e.unlocked).length)
		}
	}, [achievements]);

	return (
		<div className={'w-full pt-8 px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto'}>
			<div className={'py-6 bg-white'}>
				<PageHeader />

				<section id={'wallet-connect-select'} aria-label={'wallet-connect-select'} className={'w-full pt-4'} suppressHydrationWarning>
					<SectionWalletConnect />
				</section>
				<section id={'achievement-progress'} aria-label={'achievement-progress'} className={'w-full'} suppressHydrationWarning>
					<SectionAchievementProgress unlocked={unlockedCount} myAchievements={achievements || achievementsList} />
				</section>

				<SectionBanner />

				<SectionCollections />

				<SectionAchievements type={'Achievements'} achievements={achievements || achievementsList} />
			</div>
		</div>
	)
}

export async function getStaticProps() {
	const	achievements = await fetcher(`${process.env.API_URI}/achievements`)

	return {props: {achievementsList: achievements || []}}
}

export default Page;
