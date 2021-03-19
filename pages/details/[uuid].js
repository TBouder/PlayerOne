/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				[uuid].js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	{useRouter}							from	'next/router';
import	useSWR								from	'swr';
import	useWeb3								from	'contexts/useWeb3';
import	useAchievements						from	'contexts/useAchievements';
import	Badge								from	'components/Badges';
import	Leaderboard							from	'components/DetailsLeaderboard';
import	{fetcher}							from	'utils';

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

function	SectionStatus({achievement, numberOfClaims, currentAddressClaim}) {
	const	{poolSize} = useAchievements();

	function	formatPercent(amount) {
		return (new Intl.NumberFormat('fr-FR', {style: 'percent', maximumFractionDigits: 1}).format(amount))
	}

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
								<span className={'text-xl font-bold text-gray-900 sm:text-2xl'}>
									{achievement.title}
									<p className={'text-sm font-normal text-gray-400 inline ml-2'}>
										{currentAddressClaim?.nonce ? `#${currentAddressClaim.nonce}` : ''}
									</p>
								</span>
								<p className={'text-sm font-medium text-gray-600'}>
									{currentAddressClaim?.date ? <time dateTime={currentAddressClaim?.date}>{new Date(currentAddressClaim?.date).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})}</time> : null}
								</p>
							</div>
						</div>
						<div className="mt-5 flex justify-center sm:mt-0">
							{currentAddressClaim ? null : <a href="#" className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
								{'Claim reward'}
							</a>}
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
						<span className="text-gray-900">{`${poolSize > 0 ? formatPercent(numberOfClaims / poolSize) : '100%'} `}</span>
						<span className="text-gray-600">{'Ratio'}</span>
					</div>
				</div>
			</div>
		</section>
	);
}

function	PageContent(props) {
	const	[numberOfClaims, set_numberOfClaims] = useState(props.numberOfClaims);

	return (
		<main className="-mt-24 pb-8">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
					<div className="grid grid-cols-1 gap-4 lg:col-span-3">
						<SectionStatus
							achievement={props.achievement}
							numberOfClaims={numberOfClaims}
							currentAddressClaim={props.currentAddressClaim} />

						<Leaderboard
							claims={props.claims}
							set_numberOfClaims={set_numberOfClaims}
							achievementUUID={props.achievementUUID} />
					</div>
				</div>
			</div>
		</main>
	);
}


function	Page(props) {
	const	{address} = useWeb3();

	/**************************************************************************
	**	First, we need the router in order to get the achievement UUID.
	**************************************************************************/
	const	router = useRouter();

	/**************************************************************************
	**	Based on the props received from the static props, we can initialize
	**	`achievement` (the informations about this achievement) and
	**	`claims` (the list of all the claims).
	**************************************************************************/
	const	[achievement, set_achievement] = useState(props.achievement);
	const	[claims, set_claims] = useState(props.claims);
	const	[numberOfClaims, set_numberOfClaims] = useState(props?.claims.length || 0);

	/**************************************************************************
	**	Then, we need to hydrate the default page's informations, aka data,
	**	which are `achievement` (the informations about this achievement) and
	**	`claims` (the list of all the claims).
	**************************************************************************/
	const	{data} = useSWR(
		router?.query?.uuid ? `${process.env.API_URI}/achievement/withclaims/${router.query.uuid}` : null,
		fetcher,
		{
			initialData: {achievement: props.achievement, claims: props.claims},
			revalidateOnMount: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		}
	);

	/**************************************************************************
	**	We should check if the current address has a claim, and use if to
	**	display some useful informations
	**************************************************************************/
	const	{data: currentAddressClaim} = useSWR(
		address && router?.query?.uuid ? `${process.env.API_URI}/claim/${router.query.uuid}/${address}` : null,
		fetcher,
		{
			shouldRetryOnError: false,
			revalidateOnMount: true,
			revalidateOnReconnect: true
		}
	);

	/**************************************************************************
	**	Effect to update the `achievement` and `claims` state when receiving
	**	data from swr.
	**************************************************************************/
	useEffect(() => {
		set_achievement(data.achievement);
		set_claims(data.claims);
		set_numberOfClaims(data.claims.length);
	}, [data])

	/**************************************************************************
	**	Used for the animations
	**************************************************************************/
	const	headerRef = useRef();
	const	contentRef = useRef();
	useEffect(() => {
		setTimeout(() => headerRef.current.className = `${headerRef.current.className} headerAnimOnMount`, 0);
		setTimeout(() => contentRef.current.className = `${contentRef.current.className} contentAnimOnMount`, 0);
	}, [])


	return (
		<div className={'bg-gray-50 min-h-screen'}>
			<div ref={headerRef} className={'headerAnim'}>
				<PageHeader achievement={achievement} />
			</div>
			<div ref={contentRef} className={'contentAnim'}>
				<PageContent
					achievementUUID={router?.query?.uuid}
					achievement={achievement}
					claims={claims}
					numberOfClaims={numberOfClaims}
					currentAddressClaim={currentAddressClaim} />
			</div>
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
