/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				[uuid].js
******************************************************************************/

import	{useState, useEffect}				from	'react';
import	Image								from	'next/image';
import	{motion}							from	'framer-motion';
import	Achievements						from	'achievements/achievements';
import	Badge								from	'components/Badges';

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
	initial: {y: 100, opacity: 0},
	exit: {
		y: 100,
		opacity: 0,
		transition: {
			duration: 0.3,
			ease: easing
		}
	},
  	enter: {
		y: 0,
		opacity: 1,
		transition: {
			delay: 0.05,
			duration: 0.3,
			ease: easing
		}
	}
};
const headerVariants = {
	initial: { scale: 0.98, y: 30, opacity: 0 },
	enter: { scale: 1, y: 0, opacity: 1, transition: { duration: 0.35, ease: easing } },
	exit: {
	  scale: 0.98,
	  y: 30,
	  opacity: 0,
	  transition: { duration: 0.2, ease: easing }
	}
};

const	randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function	PageHeader({achievement}) {
	return (
		<header style={{background: achievement.background}}>
			<div className={'max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'}>
				<div className={'pt-24 pb-36'}>
					<div className={'mx-auto px-4 sm:px-6 lg:px-8'}>
						<div className={'max-auto px-12 w-auto text-center'}>
							<h1 className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'}>
								{achievement.title}
							</h1>
							<p className={'mt-4 max-w-2xl text-xl text-white text-opacity-80 lg:mx-auto'}>
								{achievement.description}
							</p>
						</div>
					</div>
		  		</div>
			</div>
	  </header>
	);
}

function	SectionStatus({achievement, isUnlocked, informationsData}) {
	return (
		<section aria-labelledby="profile-overview-title">
			<div className="rounded-lg bg-white overflow-hidden shadow">
				<div className="bg-white p-6">
					<div className="sm:flex sm:items-center sm:justify-between">
						<div className="sm:flex sm:space-x-5">
							<div className="flex-shrink-0">
								<div
									style={{background: achievement.background}}
									className={'mx-auto h-20 w-20 text-5xl flex justify-center items-center rounded-full text-white'}>
									{achievement.icon}
								</div>
							</div>
							<div className={'-mt-2'}>
								<div className={'flow-root mb-2'}>
									{achievement.badges.map((e, i) => <Badge key={`${e}_${i}`} defaultSelected disable type={e} />)}
								</div>
								<p className={'text-xl font-bold text-gray-900 sm:text-2xl'}>
									{achievement.title}
								</p>
								<p className={'text-sm font-medium text-gray-600'}>
									{isUnlocked && informationsData?.timestamp ? <time dateTime={informationsData.timestamp}>{new Date(informationsData.timestamp).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})}</time> : null}
								</p>
							</div>
						</div>
						<div className="mt-5 flex justify-center sm:mt-0">
							<a href="#" className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
								{'Claim reward'}
							</a>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
					<div className="px-6 py-5 text-sm font-medium text-center">
						<span className="text-gray-900">{'1 '}</span>
						<span className="text-gray-600">{'Reward Token'}</span>
					</div>

					<div className="px-6 py-5 text-sm font-medium text-center">
						<span className="text-gray-900">{'54 '}</span>
						<span className="text-gray-600">{'Unlocks'}</span>
					</div>

					<div className="px-6 py-5 text-sm font-medium text-center">
						<span className="text-gray-900">{'100% '}</span>
						<span className="text-gray-600">{'Ratio'}</span>
					</div>
				</div>
			</div>
		</section>
	);
}


function	PageContent({achievement}) {
	const	[isUnlocked, set_isUnlocked] = useState(achievement.unlocked);
	const	[isClaimed, set_isClaimed] = useState(achievement.claimed);
	const	[claimData, set_claimData] = useState(achievement.claim);
	const	[informationsData, set_informationsData] = useState(achievement.informations);

	useEffect(() => set_isUnlocked(achievement.unlocked), [achievement.unlocked])
	useEffect(() => set_isClaimed(achievement.claimed), [achievement.claimed])
	useEffect(() => set_claimData(achievement.claim), [achievement.claim])
	useEffect(() => set_informationsData(achievement.informations || {}), [achievement.informations])

	const	leaderboard = [
		{
			address: '0xFCEfA6C7BBd5857626E95D317b5b2cfeecFC93C3',
		},
		{
			address: '0x99024878Cbd7eea4661F5E49A22BB9410c847a74',
		},
		{
			address: '0x9E63B020ae098E73cF201EE1357EDc72DFEaA518',
		}
	]

	return (
		<main className="-mt-24 pb-8">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
					<div className="grid grid-cols-1 gap-4 lg:col-span-3">
						<SectionStatus achievement={achievement} isUnlocked={isUnlocked} informationsData={informationsData} />

						<section aria-labelledby="leaderboard">
							<div className="rounded-lg bg-white overflow-hidden shadow">
							<div className="p-6">
								<h2 className="text-base font-medium text-gray-900" id="leaderboard">{'Leaderboard'}</h2>
								<div className="flow-root mt-6">
								<ul className="-my-5 divide-y divide-gray-200">
									{leaderboard.map(e => (
										<li key={`leader_${e.address}`} className={'py-4'}>
											<div className={'flex items-center space-x-4'}>
												<div className={'flex-shrink-0'}>
													<Image
														width={64}
														height={64}
														objectFit={'cover'}
														className={'rounded-full'}
														src={`https://source.unsplash.com/200x200/?patern&key=${e.address}`}
														alt={e.address} />
												</div>
												<div className={'flex-1 min-w-0'}>
													<p className={'text-sm font-medium text-gray-900 truncate'}>
														{e.address}
													</p>
													<p className={'text-xs text-gray-500 truncate mt-1'}>
														{`${randomInteger(1, 1000)} RWD`}
													</p>
												</div>
												<div>
													<a href={'#'} className={'inline-flex items-center shadow-sm px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50'}>
														{'View profile'}
													</a>
												</div>
											</div>
										</li>	
									))}
								</ul>
								</div>
								<div className="mt-6">
								<a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
									View all
								</a>
								</div>
							</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</main>
	);
}


function	Page({achievement, isConnected}) {
	return (
		<div className={'bg-gray-50 min-h-screen'}>
			<motion.div initial="exit" animate="enter" exit="exit">
				<motion.div variants={headerVariants}>
					<PageHeader achievement={achievement} />
				</motion.div>
				<motion.div variants={textVariants}>
					<PageContent achievement={achievement} />
				</motion.div>
			</motion.div>
		</div>
	)
}

export async function getStaticPaths() {
	const	achievements = Achievements().map((achievement) => ({params: {achievement, uuid: achievement.UUID}}))
	return	{paths: achievements, fallback: false}
  }

export async function getStaticProps({params}) {
	const	achievement = Achievements().find(e => e.UUID === params.uuid);

	return	{props: {
		achievement: {
			UUID: achievement.UUID,
			title: achievement.title,
			description: achievement.description,
			icon: achievement.icon,
			background: achievement.background,
			badges: achievement.badges || [],
			unlocked: achievement.unlocked,
			claimed: achievement.claimed,
		}
	}}
}

export default Page;
