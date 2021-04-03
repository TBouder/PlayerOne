/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				prices.js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	Link								from	'next/link';
import	jazzicon							from	'@metamask/jazzicon';
import	useSWR								from	'swr';
import	{FontAwesomeIcon}					from	'@fortawesome/react-fontawesome'
import	{faCrown}							from	'@fortawesome/free-solid-svg-icons'
import	useWeb3								from	'contexts/useWeb3';
import	useAchievements						from	'contexts/useAchievements';
import	Header								from	'components/index/Header';
import	{randomInteger, fetcher, jsNumberForAddress, formatNumber}		from	'utils'

function	Head() {
	return (
		<li>
			<div className={'items-center px-4 py-4 sm:px-6 bg-gray-100 hidden md:flex'}>
				<div className={'text-sm text-center font-semibold text-gray-400 lining-nums w-10 mr-8'}>
					<FontAwesomeIcon
						style={{width: 24, height: 24}}
						className={'text-gray-200'}
						icon={faCrown} />
				</div>
				<div className={'min-w-0 flex-1 flex items-center'}>
					<div className={'px-1 text-sm font-semibold text-gray-600 lining-nums'}>
						{'Challengers'}
					</div>
				</div>

				<div className={'w-2/12 px-6 py-4 whitespace-nowrap text-center'}>
					<div className={'text-sm font-semibold text-gray-600 lining-nums'}>
						{`Achievements`}
					</div>
				</div>
				<div className={'w-2/12 px-6 py-4 whitespace-nowrap text-center'}>
					<div className={'text-sm font-semibold text-gray-600 lining-nums'}>
						{`Rewards from claims`}
					</div>
				</div> 
			</div>
			<div className={'items-center px-4 py-4 sm:px-6 bg-gray-100 flex md:hidden'}>
				<div className={'min-w-0 flex-1 flex items-center justify-center text-center'}>
					<div className={'px-1 text-sm font-semibold text-gray-600 lining-nums'}>
						{'Challengers'}
					</div>
				</div>
			</div>
		</li>
	);
}
function	Row({index, challenger, numberOfAchievements}) {
	const	{rProvider} = useWeb3();
	const	jazziconRef = useRef();
	const	[requestor, set_requestor] = useState(undefined);
	const	[isENS, set_isENS] = useState(false);
	const	numericRepresentation = jsNumberForAddress(challenger.address);

	useEffect(async () => {
		if (typeof(window) !== 'undefined') {
			if (jazziconRef.current.childNodes[0])
				jazziconRef.current.removeChild(jazziconRef.current.childNodes[0]); 
			jazziconRef.current.appendChild(jazzicon(40, numericRepresentation))
		}
		set_isENS(false);
		set_requestor(challenger.address);

		// if (rProvider) {
		// 	const	ENS = await rProvider.lookupAddress(challenger.address);
		// 	set_isENS(ENS ? true : false);
		// 	set_requestor(ENS || challenger.address);
		// }
	}, [rProvider])

	return (
		<li>
			<div className={'flex items-center px-4 py-4 sm:px-6 flex-col md:flex-row relative w-full'}>
				<div className={'text-sm text-center font-semibold text-gray-400 lining-nums w-10 mr-0 md:mr-8 absolute md:static top-6 left-6'}>
					{`#${index}`}
				</div>
				<div className={'flex-1 flex items-center w-full'}>
					<div className={'flex items-center flex-col md:flex-row mt-2 md:mt-0 w-full'}>
						<div className={'flex-shrink-0 h-10 w-10 mb-2 md:mb-0'}>
							<div className={'w-10 h-10 rounded-full'} ref={jazziconRef} />
						</div>
						<div className={'ml-4 flex flex-col justify-center w-full'}>
							<p className={`text-sm font-medium text-gray-900 ${requestor === undefined ? 'cpLine' : 'cpLine-after truncate'}`}>
								<a
									href={`https://etherscan.io/address/${requestor}`}
									target={'_blank'}
									className={'hover:text-teal-600 hover:underline cursor-pointer truncate'}>
									{requestor}
								</a>
							</p>
							<div className={`text-xs text-gray-400 ${isENS ? 'flex' : 'hidden'}`}>
								{challenger.address}
							</div>
						</div>
					</div>
				</div>


				<div className={'flex flex-row md:hidden'}>
					<div className={'text-left'}>
						<div className={'text-sm font-semibold text-gray-900 lining-nums'}>
							<span className={'text-gray-600 font-medium'}>{`Achievements : `}</span>
							{`${(challenger.achievements / numberOfAchievements * 100).toFixed(2)} %`}
						</div>
						<div className={'text-sm font-semibold text-gray-900 lining-nums'}>
							<span className={'text-gray-600 font-medium'}>{`Rewards : `}</span>
							{`${(challenger.rewards / 10000).toFixed(4)} 💎`}
						</div>
					</div>
				</div> 

				<div className={'hidden md:contents'}>
					<div className={'w-2/12 px-6 py-4 whitespace-nowrap text-center'}>
						<div className={'text-sm font-semibold text-gray-900 lining-nums'}>
							{`${(challenger.achievements / numberOfAchievements * 100).toFixed(2)} %`}
						</div>
					</div>
					<div className={'w-2/12 px-6 py-4 whitespace-nowrap text-center'}>
						<div className={'text-sm font-semibold text-gray-900 lining-nums'}>
							{`${(challenger.rewards / 10000).toFixed(4)} 💎`}
						</div>
					</div>
				</div> 
			</div>
		</li>
	)
}
function	Table({challengers, numberOfAchievements}) {
	return (
		<div className={'flex flex-col mt-16'} id={'challengers'}>
			<div className={'shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'}>
				<ul className={'bg-white divide-y divide-gray-200'}>
					<Head />
					{challengers.map((challenger, index) => (
						<Row
							key={challenger.address}
							index={index + 1}
							challenger={challenger}
							numberOfAchievements={numberOfAchievements} />	
					))}
				</ul>
			</div>
			<div className={'flex w-full items-center justify-center mt-6'}>
				<p className={'text-sm text-gray-400 hover:text-teal-600 cursor-pointer text-center hover:underline'}>
					{'Contact us to see more'}
				</p>
			</div>
		</div>
	);
}


function	ItemStatChallengers({count}) {
	return (
		<div className={'relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'}>
			<dt>
				<div className={'absolute bg-teal-500 rounded-md p-3'}>
					<svg className={'h-6 w-6 text-white'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'} aria-hidden={'true'}><path strokeLinecap={'round'} strokeLinejoin={'round'} stroke-width={'2'} d={'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'} /></svg>
				</div>
				<p className={'ml-16 text-sm font-medium text-gray-500 truncate'}>{'Total Challengers'}</p>
			</dt>

			<dd className={'ml-16 pb-6 flex items-baseline sm:pb-7'}>
				<p className={'text-2xl font-semibold text-gray-900'}>
					{count}
				</p>

				<div className={'absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6'}>
					<div className={'text-sm'}>
						<Link href={'#challengers'} passHref>
							<a className={'font-medium text-teal-600 hover:text-teal-500'}>
								{'Discover the challengers'}
							</a>
						</Link>
					</div>
				</div>
			</dd>
		</div>
	);
}
function	ItemStatAchievements({count}) {
	return (
		<div className={'relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'}>
			<dt>
				<div className={'absolute bg-teal-500 rounded-md p-3'}>
					<svg className={'h-6 w-6 text-white'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' /></svg>
				</div>
				<p className={'ml-16 text-sm font-medium text-gray-500 truncate'}>{'Total achievements'}</p>
			</dt>
			<dd className={'ml-16 pb-6 flex items-baseline sm:pb-7'}>
				<p className={'text-2xl font-semibold text-gray-900'}>
					{count}
				</p>

				<div className={'absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6'}>
					<div className={'text-sm'}>
						<Link href={'/'} passHref>
							<a className={'font-medium text-teal-600 hover:text-teal-500'}>
								{'View all'}
							</a>
						</Link>
					</div>
				</div>
			</dd>
		</div>
	);
}
function	ItemStatTotalSupply() {
	const	{rProvider} = useWeb3();
	const	{actions} = useAchievements();
	const	[totalSupply, set_totalSupply] = useState(0);

	useEffect(() => {
		if (rProvider) {
			actions.getTotalSupply(rProvider).then((supply) => {
				set_totalSupply(supply);
			})
		}
	}, [rProvider])

	return (
		<div className={'relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'}>
			<dt>
				<div className={'absolute bg-teal-500 rounded-md p-3'}>
					<svg className={'h-6 w-6 text-white'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' /><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' /></svg>
				</div>
				<p className={'ml-16 text-sm font-medium text-gray-500 truncate'}>{'Current supply'}</p>
			</dt>

			<dd className={'ml-16 pb-6 flex items-baseline sm:pb-7'}>
				<p className={'text-2xl font-semibold text-gray-900'}>
					{`${formatNumber(totalSupply)}`}
				</p>

				<div className={'absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6'}>
					<div className={'text-sm'}>
						<a
							href={'https://ropsten.etherscan.io/token/0x35017DC776c43Bcf8192Bb6Ba528348D32A57CB5'}
							target={'_blank'}
							className={'font-medium text-teal-600 hover:text-teal-500'}>
							{'Check token'}
						</a>
					</div>
				</div>
			</dd>
		</div>
	);
}
function	SectionStats({numberOfChallengers, numberOfAchievements}) {
	return (
		<div>
			<dl className={'mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
				<ItemStatChallengers count={numberOfChallengers}/>

				<ItemStatAchievements count={numberOfAchievements} />

				<ItemStatTotalSupply />
			</dl>
		</div>
	);
}

function	Page(props) {
	const	[bg, set_bg] = useState('rgb(255,71,62)')
	const	[color, set_color] = useState(1)
	const	initialData = {challengers: props.challengers, addressesCount: props.addressesCount, achievementsCount: props.achievementsCount};
	const	{data: {challengers, addressesCount, achievementsCount}} = useSWR(`${process.env.API_URI}/leaderboard`, fetcher, {initialData});

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
			<div ref={headerRef} className={'headerAnim'}>
				<div
					className={'py-32 md:py-48 progressBarColor -mt-28 relative'}
					style={{background: bg}}
					onClick={() => {
						if (bg === 'rgb(255,71,62)') {
							set_bg('linear-gradient(42deg, rgba(255,191,50,1) 0%, rgba(255,179,49,1) 75%, rgba(255,156,45,1) 100%)')
							set_color(2)
						} else if (bg === 'linear-gradient(42deg, rgba(255,191,50,1) 0%, rgba(255,179,49,1) 75%, rgba(255,156,45,1) 100%)') {
							set_bg('#1B7340')
							set_color(3)
						} else if (bg === '#1B7340') {
							set_bg('#E9897E')
							set_color(4)
						} else if (bg === '#E9897E') {
							set_bg('#0072B5')
							set_color(5)
						} else if (bg === '#0072B5') {
							set_bg('#FDAC53')
							set_color(6)
						} else if (bg === '#FDAC53') {
							set_bg('#B55A30')
							set_color(7)
						} else {
							set_bg('rgb(255,71,62)')
							set_color(1)
						}
					}}
				>
					<ul className={'circles circlesMoreVisible pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
					<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
						<div className={'lg:text-center'}>
							<p className={'leading-8 font-extrabold tracking-tight text-white opacity-60 text-4xl'}>
								{'Greetings'}
							</p>
							<p className={'text-7xl font-extrabold tracking-tight text-white my-4 md:my-8'}>
								{'PLAYER ONE'}
							</p>
							<p className={'font-extrabold tracking-tight text-white opacity-60 text-4xl'}>
								{'Are you ready to claim your name ?'}
							</p>
							<p className={'font-extrabold tracking-tight text-white opacity-80 text-lg mt-6'}>
								{`Color #${color}`}
							</p>
						</div>
					</header>
					<div className="custom-shape-divider-bottom-1617443724">
						<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
							<path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
						</svg>
					</div>
				</div>
			</div>
			<div ref={contentRef} className={'contentAnim'}>
				<div className={'w-full px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto pb-24'}>
					<div className={'pb-6'}>


						<div className={'flex flex-col mt-6'}>
							<div className={'-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'}>
								<div className={'py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'}>
									<SectionStats numberOfChallengers={addressesCount} numberOfAchievements={achievementsCount} />
								</div>
							</div>
						</div>


						<div className={'relative h-0 -ml-10'} style={{zIndex: -1}}>
							<svg width='404' height='500' fill={'none'} viewBox='0 0 404 500' className='hidden lg:block absolute left-full transform -translate-x-1/2 opacity-50 z-0'><defs><pattern id='b1e6e422-73f8-40a6-b5d9-c8586e37e0e7' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'><rect x='0' y='0' width='4' height='4' fill={'currentColor'} className='text-gray-200'></rect></pattern></defs><rect width='404' height='500' fill='url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)'></rect></svg>
						</div>

						<Table challengers={challengers} numberOfAchievements={achievementsCount} />
					</div>
				</div>
			</div>
		</>
	);
}

export async function getStaticProps() {
	const	{challengers, addressesCount, achievementsCount} = await fetcher(`${process.env.API_URI}/leaderboard`)
	return {props: {challengers, addressesCount, achievementsCount}}
}

export default Page;
