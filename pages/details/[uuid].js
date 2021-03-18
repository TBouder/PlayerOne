/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				[uuid].js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	{motion}							from	'framer-motion';
import	{ethers}							from	'ethers';
import	jazzicon							from	'@metamask/jazzicon';
import	Badge								from	'components/Badges';
import	{fetcher, randomInteger}			from	'utils';

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
	initial: {y: 100, opacity: 0, zIndex: 10},
	exit: {
		y: 100,
		opacity: 0,
	  	zIndex: 10,
		transition: {
			duration: 0.3,
			ease: easing
		}
	},
  	enter: {
		y: 0,
		opacity: 1,
	  	zIndex: 10,
	  	transition: {
			duration: 0.35,
			ease: easing
		}
	}
};
const headerVariants = {
	initial: { scale: 0.98, y: 30, opacity: 0, zIndex: 1 },
	enter: { scale: 1, y: 0, opacity: 1, zIndex: 1, transition: { duration: 0.35, ease: easing } },
	exit: {
	  scale: 0.98,
	  y: 30,
	  opacity: 0,
	  zIndex: 1,
	  transition: { duration: 0.2, ease: easing }
	}
};

const	claimDomain = {
	name: 'Degen Achievement',
	version: '1',
	chainId: 1,
	verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
};
const	claimTypes = {
	Achievement: [
		{name: 'action', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'unlock', type: 'Unlock'}
	],
	Unlock: [
		{name: 'blockNumber', type: 'string'},
		{name: 'hash', type: 'string'},
		{name: 'timestamp', type: 'string'},
		{name: 'details', type: 'string'}
	],
};

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

function	SectionStatus({achievement, isUnlocked, informationsData, numberOfClaims}) {
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
						<span className="text-gray-900">{numberOfClaims}</span>
						<span className="text-gray-600">{' Unlocks'}</span>
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

function jsNumberForAddress(address) {
	const addr = address.slice(2, 10);
	const seed = parseInt(addr, 16);
	return seed;
}

function	Leader({claim}) {
	const	jazziconRef = useRef();
	const	[validSignature, set_validSignature] = useState(true);
	const	numericRepresentation = jsNumberForAddress(claim.address);

	useEffect(() => {
		if (typeof(window) !== 'undefined') {
			if (jazziconRef.current.childNodes[0])
				jazziconRef.current.removeChild(jazziconRef.current.childNodes[0]); 
			jazziconRef.current.appendChild(jazzicon(64, numericRepresentation))
		}
		try {
			const	signer = ethers.utils.verifyTypedData(claimDomain, claimTypes, JSON.parse(claim.message), claim.signature);
			set_validSignature(signer === claim.address);
		} catch(e) {
			set_validSignature(false);
		}
	}, [])

	return (
		<li className={'py-4'}>
			<div className={'flex space-x-8'}>
				<div className={'flex-shrink-0'}>
					<div className={'w-16 h-16 rounded-full'} ref={jazziconRef} />
				</div>
				<div className={'flex-1 min-w-0'}>
					<p className={'text-sm font-medium text-gray-900 truncate'}>
						{claim.address}
					</p>
					<p className={'text-xs text-gray-500 truncate mt-1'}>
						{`${new Date(claim.date).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})} - # ${claim.nonce}`}
					</p>
					<div className={'w-full mt-2 bg-gray-100 py-1 px-2 rounded '}>
						<code className={'text-xs font-medium text-gray-900 break-all whitespace-pre-wrap inline'}>
							{claim.signature}
							<svg className={'w-4 h-4 text-green-600 inline ml-1'} style={{marginBottom: 2}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
						</code>
					</div>
				</div>
			</div>
		</li>
	);
}

function	PageContent({achievement, claims}) {
	const	[isUnlocked, set_isUnlocked] = useState(achievement.unlocked);
	const	[isClaimed, set_isClaimed] = useState(achievement.claimed);
	const	[claimData, set_claimData] = useState(achievement.claim);
	const	[informationsData, set_informationsData] = useState(achievement.informations);

	useEffect(() => set_isUnlocked(achievement.unlocked), [achievement.unlocked])
	useEffect(() => set_isClaimed(achievement.claimed), [achievement.claimed])
	useEffect(() => set_claimData(achievement.claim), [achievement.claim])
	useEffect(() => set_informationsData(achievement.informations || {}), [achievement.informations])

	return (
		<main className="-mt-24 pb-8">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
					<div className="grid grid-cols-1 gap-4 lg:col-span-3">
						<SectionStatus
							achievement={achievement}
							isUnlocked={isUnlocked}
							numberOfClaims={claims?.length || 0}
							informationsData={informationsData} />

						<section aria-labelledby="leaderboard">
							<div className="rounded-lg bg-white overflow-hidden shadow">
							<div className="p-6">
								<h2 className="text-base font-medium text-gray-900" id="leaderboard">{'Leaderboard'}</h2>
								<div className="flow-root mt-6">
								<ul className="-my-5 divide-y divide-gray-200">
									{claims.map((claim) => <Leader key={`leader_${claim.address}`} claim={claim} />)}
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


function	Page({achievement, claims}) {
	return (
		<div className={'bg-gray-50 min-h-screen'}>
			<motion.div initial="exit" animate="enter" exit="exit">
				<motion.div variants={headerVariants}>
					<PageHeader achievement={achievement} />
				</motion.div>
				<motion.div variants={textVariants}>
					<PageContent achievement={achievement} claims={claims} />
				</motion.div>
			</motion.div>
		</div>
	)
}

export async function getStaticPaths() {
	const	achievementsList = await fetcher(`${process.env.API_URI}/achievements`)
	const	achievements = achievementsList.map((achievement) => ({params: {achievement, uuid: achievement.UUID}}))

	return	{paths: achievements, fallback: false}
}

export async function getStaticProps({params}) {
	const	{achievement, claims} = await fetcher(`${process.env.API_URI}/achievement/withclaims/${params.uuid}`)

	return {props: {achievement, claims}}
}


export default Page;
