/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				[uuid].js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	{useRouter}							from	'next/router';
import	useSWR								from	'swr';
import	{request}							from	'graphql-request';
import	{ethers}											from	'ethers';

import	{Portal, Transition}				from	'@headlessui/react';
import	FullConfetti						from	'react-confetti';
import	useUI								from	'contexts/useUI';
import	useWeb3								from	'contexts/useWeb3';
import	useAchievements						from	'contexts/useAchievements';
import	Badge								from	'components/Badges';
import	Leaderboard							from	'components/DetailsLeaderboard';
import	{fetcher}							from	'utils';

// What: ASSY is a DeFi token index allowing to gain exposure to Aave, Synthetix, Sushiswap and Yfi with a single token. Portfolio allocation between each token is managed automatically & dynamically to maximize returns by increasing (or decreasing) exposure to the most (or least) performing assets.

// Challenge: own at least 50 ASSY 

// Technical explanation: checking on chain if your address own (or has owned) 50 ASSY


const graphFetcher = query => request('https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork', query)

// function App () {
//   const { data, error } = useSWR(
//     `{
//       Movie(title: "Inception") {
//         releaseDate
//         actors {
//           name
//         }
//       }
//     }`,
//     fetcher
//   )
//   // ...
// }


function	ClaimableButtom(props) {
	const	STATUS = {UNDEFINED: 0, PENDING: 1, UNLOCKED: 2};
	const	[buttonStatus, set_buttonStatus] = useState(0);
	const	buttonRef = useRef();

	function	onClick(e) {
		e.preventDefault();
		if (buttonStatus === STATUS.PENDING) {
			return;
		}
		if (buttonStatus === STATUS.UNLOCKED) {
			props.confetti.set({active: true, x: e.pageX, y: e.pageY});
			setTimeout(() => props.confetti.set({active: false, x: e.pageX, y: e.pageY}), 100);
			return;
		}

		set_buttonStatus(STATUS.PENDING);
		props.onClaim(({status}) => {
			if (status === 'SUCCESS') {
				set_buttonStatus(STATUS.UNLOCKED);
				props.confetti.set({active: true, x: e.pageX, y: e.pageY});
				setTimeout(() => props.confetti.set({active: false, x: e.pageX, y: e.pageY}), 100);
			} else if (status === 'ERROR') {
				set_buttonStatus(STATUS.UNDEFINED);
			}
		})
	}

	return (
		<button
			ref={buttonRef}
			onClick={onClick}
			disabled={buttonStatus === STATUS.PENDING}
			className={`relative mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md bg-white sm:w-auto text-base font-medium ${buttonStatus === STATUS.PENDING ? 'cursor-wait' : 'cursor-pointer'}`}>
			<p className={'flex items-center'} style={buttonStatus === STATUS.PENDING ? {opacity: 1} : {opacity: 1} }>
				{buttonStatus === STATUS.UNLOCKED ?
					<>
						<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="url(#gradient)"><linearGradient id="gradient"><stop offset="0%" stopColor={'rgba(20,184,166,1)'} /><stop offset="50%" stopColor={'rgba(139,92,246,1)'} /><stop offset="100%" stopColor={'rgba(236,72,153,1)'} /></linearGradient><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
						</svg>
						<span className={'ml-2 text-gradient font-medium'}>{'Unlocked !'}</span>
					</>
				: null}
				{buttonStatus === STATUS.UNDEFINED ?
					<>
						<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
						<span className={'ml-2 text-gray-700'}>{'Claim'}</span>
					</>
				: null}
			</p>
			{buttonStatus === STATUS.PENDING ?
				<>
					<svg className={'w-4 h-4 opacity-0'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
					<span className={'ml-2 opacity-0'}>{'Claim'}</span>
					<div className={'flex flex-row justify-center items-center absolute inset-0'}>
						<div className={`w-2 h-2 rounded-full bg-gray-700 animate-pulse`} />
						<div className={`w-2 h-2 rounded-full bg-gray-700 animate-pulse mx-2`} style={{animationDelay: '1s'}} />
						<div className={`w-2 h-2 rounded-full bg-gray-700 animate-pulse`} />
					</div>
				</>
			: null}
		</button>
	);
};

function	StatusButton(props) {
	const	{confetti} = useUI();

	if (props.isClaimed) {
		return (
			<div
				onClick={(e) => {
					e.preventDefault();
					confetti.set({active: true, x: e.pageX, y: e.pageY});
					setTimeout(() => confetti.set({active: false, x: e.pageX, y: e.pageY}), 100);
				}}
				className={'relative mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md bg-white sm:w-auto text-base font-medium'}>
				<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="url(#gradient)"><linearGradient id="gradient"><stop offset="0%" stopColor={'rgba(20,184,166,1)'} /><stop offset="50%" stopColor={'rgba(139,92,246,1)'} /><stop offset="100%" stopColor={'rgba(236,72,153,1)'} /></linearGradient><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
				</svg>
				<span className={'text-gradient ml-2'}>{'Unlocked !'}</span>
			</div>
		);
	}
	if (props.unlocked) {
		return (
			<ClaimableButtom onClaim={() => null} confetti={confetti} />
		)
	}
	return (
		<button
			className={'mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md bg-white sm:w-auto text-base font-medium text-gray-700 cursor-not-allowed'}>
			<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
			<span className={'ml-2'}>{'Locked'}</span>
		</button>
	)
}

function	PageHeader({achievement, isClaimed}) {
	return (
		<header style={{background: achievement.background}}>
			<div className={'max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'}>
				<div className={'pt-12 pb-36'}>
					<div className={'mx-auto px-4 sm:px-6 lg:px-8'}>
						<div className={'max-auto px-12 w-auto text-center'}>
							<h1 className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'}>
								{achievement.title}
							</h1>
							<p className={'mt-4 max-w-2xl text-xl text-white text-opacity-80 lg:mx-auto'}>
								{achievement.description}
							</p>
							<StatusButton {...achievement} isClaimed={isClaimed} />
						</div>
					</div>
		  		</div>
			</div>
			{isClaimed ? <FullConfetti
				width={typeof(window) !== 'undefined' && window.innerWidth || 1920}
				height={358} /> : null}
	  </header>
	);
}

function	Swap() {
	const	{address, actions} = useWeb3();
	const	[swapToken0, set_swapToken0] = useState(0);
	const	[swapToken1, set_swapToken1] = useState(50);

	/**************************************************************************
	**	We may need some informations to be able to perform the action, thanks
	**	to graphQL.
	**	This part may change a lot (should we use a graph ? Which pair ? Which
	**	uri ?).
	**************************************************************************/
	const {data: sushiswapData} = useSWR(`{
		pair(id: "0x46acb1187a6d83e26c0bb46a57ffeaf23ad7851e") {
			id,
			token0{id},
			token1{id},
			reserveETH,
			token0Price,
			token1Price	
		}}`,
		graphFetcher
	);

	useEffect(() => {
		if (sushiswapData?.pair) {
			set_swapToken0((sushiswapData.pair?.token0Price || 0) * 50)
			set_swapToken1(50);
		}
	}, [sushiswapData])

	return (
		<section aria-label={'swap'} className={'flex flex-row justify-between items-center'}>
			<div className={'w-full'}>
				<div className={'relative rounded-md shadow'}>
					<div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'}>
					<span className={'text-gray-500'}>{'Ξ'}</span>
					</div>
					<input
						type={'text'}
						name={'price'}
						id={'price'}
						value={swapToken0}
						onChange={(e) => {
							set_swapToken0(e.target.value);
							set_swapToken1(e.target.value * sushiPair.token1Price);
						}}
						className={'focus:ring-teal-500 focus:border-teal-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md'}
						placeholder={'0.00'}
						aria-describedby={'price-currency'} />
					<div className={'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'}>
						<span className={'text-gray-500 sm:text-sm'} id={'price-currency'}>{'ETH'}</span>
					</div>
				</div>
			</div>
			<div className={'mx-8'}>
				<div>
					<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
				</div>
			</div>
			<div className={'w-full'}>
				<div className={'relative rounded-md shadow'}>
					<div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'}>
						<span className={'text-gray-500'}>{'🍑'}</span>
					</div>
					<input
						type={'number'}
						name={'price-assy'}
						id={'price-assy'}
						className={'focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md'}
						value={swapToken1}
						onChange={(e) => {
							set_swapToken1(e.target.value);
							set_swapToken0(e.target.value * sushiPair.token0Price);
						}}
						placeholder={'0.00'}
						aria-describedby={'price-assy-currency'} />
					<div className={'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'}>
						<span className={'text-gray-500 sm:text-sm'} id={'price-assy-currency'}>{'ASSY'}</span>
					</div>
				</div>
			</div>
			<div className={'mx-8'}>
				<div>
					<button
						onClick={() => {
							const	wei = swapToken0*10e17
							actions.swapOnSushiswap(
								undefined,
								[
									String(wei),
									[
										sushiswapData?.pair?.token0?.id,
										sushiswapData?.pair?.token1?.id,
									],
									address,
									'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
								],
								(e) => console.log(e)
							)
						}}
						type={'button'} className={'shadow inline-flex items-center px-3 py-2.5 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}>
						<svg className={'mr-2 -ml-0.5 h-4 w-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
						{'Swap'}
					</button>
				</div>
			</div>
		</section>
	)
}


function	SectionStatus({achievement, numberOfClaims, currentAddressClaim}) {
	const	{poolSize} = useAchievements();

	function	formatPercent(amount) {
		return (new Intl.NumberFormat('fr-FR', {style: 'percent', maximumFractionDigits: 1}).format(amount))
	}

	return (
		<section aria-labelledby={'profile-overview-title'}>
			<div className='rounded-lg bg-white overflow-hidden shadow'>
				<div className='bg-white p-6'>
					<div className='sm:flex sm:items-center sm:justify-between'>
						<div className={'w-full flex flex-col'}>

							<div aria-label={'collections'} className={'flex flex-row'}>
								<div className={'flow-root ml-24'}>
									{achievement.badges.map((e, i) => <Badge key={`${e}_${i}`} defaultSelected disable type={e} />)}
								</div>
							</div>

							<div aria-label={'descriptions'} className={'flex flex-row'}>
								<div className={'flex flex-row w-1/3 pr-2'}>
									<div className={'flex-shrink-0 -mt-4'}>
										<div
											style={{background: achievement.background}}
											className={'mx-auto h-20 w-20 text-5xl flex justify-center items-center rounded-full text-white'}>
											{achievement.icon}
										</div>
									</div>
									<div className={'ml-4 mt-1'}>
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
								<div className={'flex flex-col w-2/3 pl-2 '}>
									<div className={'flex mb-4'}>
										<p className={'text-base font-normal text-gray-800 prose-xl prose-teal'}>
											ASSY is a DeFi token index allowing to gain exposure to <a href={'https://aave.com/'} target={'_blank'} className={'font-medium hover:underline cursor-pointer'}>Aave</a>, <a href={'https://www.synthetix.io/'} target={'_blank'} className={'font-medium hover:underline cursor-pointer'}>Synthetix</a>, <a href={'https://sushi.com/'} target={'_blank'} className={'font-medium hover:underline cursor-pointer'}>Sushiswap</a> and <a href={'https://yearn.finance/'} target={'_blank'} className={'font-medium hover:underline cursor-pointer'}>YFI</a> with a single token. Portfolio allocation between each token is managed automatically & dynamically to maximize returns by increasing (or decreasing) exposure to the most (or least) performing assets.
										</p>
									</div>
									<div>
										<Swap />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={'border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x'}>
					<div className='px-6 py-5 text-sm font-medium text-center'>
						<span className={'text-gray-900'}>{'1 '}</span>
						<span className={'text-gray-600'}>{'Reward Token'}</span>
					</div>

					<div className='px-6 py-5 text-sm font-medium text-center'>
						<span className={'text-gray-900'}>{numberOfClaims}</span>
						<span className={'text-gray-600'}>{' Unlocks'}</span>
					</div>

					<div className='px-6 py-5 text-sm font-medium text-center'>
						<span className={'text-gray-900'}>{`${poolSize > 0 ? formatPercent(numberOfClaims / poolSize) : '100%'} `}</span>
						<span className={'text-gray-600'}>{'Ratio'}</span>
					</div>
				</div>
			</div>
		</section>
	);
}

function	PageContent(props) {
	const	[numberOfClaims, set_numberOfClaims] = useState(props.numberOfClaims);

	return (
		<main className={'-mt-24 pb-8'}>
			<div className={'max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'}>
				<div className={'grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8'}>
					<div className={'grid grid-cols-1 gap-4 lg:col-span-3'}>
						<SectionStatus
							achievement={props.achievement}
							numberOfClaims={numberOfClaims}
							currentAddressClaim={props.currentAddressClaim} />
					</div>
					<div className={'grid grid-cols-1 gap-4 lg:col-span-3'}>
						<Leaderboard
							claims={props.claims}
							set_numberOfClaims={set_numberOfClaims}
							achievementKey={props.key} />
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
		router?.query?.key ? `${process.env.API_URI}/achievement/withclaims/${router.query.key}` : null,
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
		address && router?.query?.key ? `${process.env.API_URI}/claim/${router.query.key}/${address}` : null,
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
		<>
		{/* <div className={'fixed top-0 bg-white z-40 w-full'} style={{height: 54}} /> */}
		<div className={'bg-gray-50'}>
			<div style={{marginTop: -50}}>
				<div ref={headerRef} className={'headerAnim'}>
					<PageHeader achievement={achievement} isClaimed={currentAddressClaim !== undefined} />
				</div>
				<div ref={contentRef} className={'contentAnim'}>
					<PageContent
						achievementKey={router?.query?.key}
						achievement={achievement}
						claims={claims}
						numberOfClaims={numberOfClaims}
						currentAddressClaim={currentAddressClaim} />
				</div>
			</div>
		</div>
		</>
	)
}

export async function getStaticPaths() {
	const	achievementsList = await fetcher(`${process.env.API_URI}/achievements`)
	const	achievements = achievementsList.map((achievement) => ({params: {achievement, key: achievement.key}}))

	return	{paths: achievements, fallback: false}
}

export async function getStaticProps({params}) {
	const	{achievement, claims} = await fetcher(`${process.env.API_URI}/achievement/withclaims/${params.key}`)

	return {props: {achievement, claims}}
}


export default Page;
