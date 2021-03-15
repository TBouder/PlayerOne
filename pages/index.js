/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				prices.js
******************************************************************************/

import	{useState, useEffect, useLayoutEffect}				from	'react';
import	Image								from	'next/image';
import	{motion}							from	'framer-motion';
import	FlipMove							from	'react-flip-move';
import	AchievementCard						from	'components/AchievementCard';
import	useWeb3								from	'contexts/useWeb3';
import	Badge, {getBadgeList}				from	'components/Badges';

const sortBy = (arr, k) => arr.concat().sort((b, a) => (a[k] > b[k]) ? 1 : ((a[k] < b[k]) ? -1 : 0));
const partition = (arr, criteria) => arr.reduce((acc, i) => (acc[criteria(i) ? 0 : 1].push(i), acc), [[], []]);
const hasIntersection = (a, ...arr) => [...new Set(a)].some(v => arr.some(b => b.includes(v)));

function	SectionAchievements({type, list, onDetails = () => null}) {
	const	[achievementList, set_achievementList] = useState(list);
	const	[badgeList, set_badgeList] = useState([...new Set(getBadgeList())]);
	const	[nonce, set_nonce] = useState(0);

	useLayoutEffect(() => {
		const	[inList, outList] = partition(list, e => hasIntersection(e.badges, badgeList));
		const	sortByUnlocked = sortBy(inList, 'unlocked');
		set_achievementList([...sortByUnlocked, ...outList.map(e => ({...e, hidden: true}))]);
	}, [nonce, list]);

	if (list.length === 0) {
		return null;
	}
	return (
		<section className={'mt-12'} aria-label={`achievements-${type}`}>
			<div className={'mb-5'}>
				<div className={'pb-5 border-b border-gray-200'}>
					<h3 className={'text-lg leading-6 font-medium text-gray-400'}>
						{type}
					</h3>
					<div className={'mt-2'}>
						{getBadgeList().map((t, index) => (
							<Badge
								key={t}
								type={t}
								defaultSelected
								onClick={() => {
									const	_badgeList = badgeList;
									const	_index = _badgeList.indexOf(t);
									if (_index > -1) {
										_badgeList.splice(_index, 1);
									} else {
										_badgeList.push(t);
									}
									set_badgeList(_badgeList); 
									setTimeout(() => set_nonce(n => n + 1), 0);
								}}
								/>
							)
						)}
					</div>
				</div>
			</div>
			<motion.div initial={'initial'} animate={'enter'} exit={'exit'}>
				<FlipMove
					enterAnimation={'fade'}
					leaveAnimation={'fade'}
					maintainContainerHeight
					className={'mx-auto grid gap-5 gap-y-6 lg:gap-y-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7'}>
					{achievementList.map((each) => (
						<AchievementCard
							key={each.UUID}
							hidden={each.hidden}
							set_details={(e) => each.unlocked ? onDetails(e) : null}
							{...each} />
					))}
				</FlipMove>
			</motion.div>
		</section>
	);
}

function	Page() {
	const	{providerType, connect, walletType, achievements, achievementsVersion, achievementsCheckProgress} = useWeb3();
	const	[unlocked, set_unlocked] = useState(achievements.filter(e => e.unlocked).length);
	const	[myAchievements, set_myAchievements] = useState([...achievements]);
	const	[currentProviderType, set_currentProviderType] = useState(providerType);
	const	[details, set_details] = useState({open: false});


	useEffect(() => {
		set_currentProviderType(providerType);
	}, [providerType])

	useEffect(() => {
		set_myAchievements(achievements);
		set_unlocked(achievements.filter(e => e.unlocked).length);
	}, [achievementsVersion])

	return (
		<div className={'w-full pt-16 px-6 md:px-12 lg:px-16 xl:px-24'}>
			<div className={'py-6 bg-white'}>
				<div className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
					<div className={'lg:text-center'}>
						<h2 className={'text-base text-teal-600 font-semibold tracking-wide uppercase'}>
							{'Achievements'}
						</h2>
						<p className={'mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 text-gradient sm:text-4xl'}>
							{'No more unknow. So much wow.'}
						</p>
						<p className={'mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'}>
							{'Unlock unique achievements throughout your Degen life in the DEFI ecosystem, and become the first to get the golden NFT'}
						</p>
					</div>
				</div>

				<div className={'pt-12 pb-4 w-full'}>
					<div className={'w-full'}>
						{currentProviderType === walletType.NONE ? 
							<div className={'grid flex-col justify-center items-center w-full gap-y-4 md:flex md:gap-y-0 md:gap-x-4 md:flex-row'}>
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
						: null}
					</div>
					<div className={'w-full'}>
						{currentProviderType !== walletType.NONE ? 
							<div className={'flex flex-col w-full'}>
								<h3 className={'text-base text-teal-600 font-semibold tracking-wide uppercase mb-4 text-center'}>
									{`${(unlocked/myAchievements.length*100).toFixed(2)}% completed ${achievementsCheckProgress !== undefined ? `(${achievementsCheckProgress}/${myAchievements.length})` : ''}`}
								</h3>
								<div className={'rounded overflow-hidden h-2 mb-0.5 bg-gray-200 flex flex-row mx-6 md:mx-12 lg:mx-16 xl:mx-24'}>
									<div className={'h-full progressBarColor rounded transition-all duration-700'} style={{width: `calc(100% * ${unlocked/myAchievements.length})`}} />
								</div>
							</div> : null}
					</div>
				</div>


				<SectionAchievements 
					type={'Achievements'}
					list={myAchievements}
					onDetails={set_details}
				/>
			</div>
		</div>
	)
}


export default Page;
