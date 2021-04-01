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
		<thead className={'bg-gray-50'}>
			<tr>
				<th scope={'col'} className={'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center'}>
					<FontAwesomeIcon
						style={{width: 24, height: 24}}
						className={'mr-4 mb-1 text-gray-200'}
						icon={faCrown} />
					{'Challengers'}
				</th>
				<th scope={'col'} className={'px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-pre'}>
					{`Claim\ncount`}
				</th>
				<th scope={'col'} className={'px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-pre'}>
					<p>{`RWD\nfrom claims`}</p>
				</th>
				<th scope={'col'} className={'px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-pre'}>
					<p>{`RWD\nbalance`}</p>
				</th>
			</tr>
		</thead>
	)
}
function	Row({challenger, numberOfAchievements}) {
	const	{rProviderMainnet} = useWeb3();
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
		if (rProviderMainnet) {
			const	ENS = await rProviderMainnet.lookupAddress(challenger.address);
			set_isENS(ENS ? true : false);
			set_requestor(ENS || challenger.address);
		}
	}, [rProviderMainnet])

	return (
		<tr>
			<td className={'px-6 py-4 whitespace-nowrap'}>
				<div className={'flex items-center'}>
					<div className={'flex-shrink-0 h-10 w-10'}>
						<div className={'w-10 h-10 rounded-full'} ref={jazziconRef} />
					</div>
					<div className={'ml-4 flex flex-col justify-center'}>
						<p className={`text-sm font-medium text-gray-900 ${requestor === undefined ? 'cpLine' : 'cpLine-after truncate'}`}>
							<a
								href={`https://etherscan.io/address/${requestor}`}
								target={'_blank'}
								className={'hover:text-teal-600 hover:underline cursor-pointer truncate'}>
								{requestor}
							</a>
						</p>
						<div className={`text-xs text-gray-400 ${isENS ? 'opacity-100' : 'opacity-0'}`}>
							{challenger.address}
						</div>
					</div>
				</div>
			</td>
			<td className={'px-6 py-4 whitespace-nowrap text-center'}>
				<div className={'text-sm font-semibold text-gray-900 lining-nums'}>
					{`${(challenger.achievements / numberOfAchievements * 100).toFixed(2)} %`}
				</div>
			</td>
			<td className={'px-6 py-4 whitespace-nowrap text-center'}>
				<div className={'text-sm font-semibold text-gray-900 lining-nums'}>
					{`${(challenger.rewards / 10000).toFixed(4)} 💎`}
				</div>
			</td>
			<td className={'px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500'}>
				<div className={'text-sm font-semibold text-gray-900 lining-nums'}>
					{`${((challenger.rewards + randomInteger(challenger.rewards < 1000 ? -challenger.rewards : -10000, 10000)) / 10000).toFixed(4)} 💎`}
				</div>
			</td>
		</tr>
	)
}
function	Table({challengers, numberOfAchievements}) {
	return (
		<div className={'flex flex-col mt-16'} id={'challengers'}>
			<div className={'-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'}>
				<div className={'py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'}>
				<div className={'shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'}>
					<table className='min-w-full divide-y divide-gray-200'>
					<Head />
					<tbody className='bg-white divide-y divide-gray-200'>
						{challengers.map((challenger) => (
							<Row key={challenger.address} challenger={challenger} numberOfAchievements={numberOfAchievements} />	
						))}
					</tbody>
					</table>
				</div>
				</div>
			</div>
		</div>
	);
}


function	ItemStatChallengers() {
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
					{'71,897'}
				</p>

				<p className={'ml-2 flex items-baseline text-sm font-semibold text-green-600'}>
					<svg className={'self-center flex-shrink-0 h-5 w-5 text-green-500'} fill={'currentColor'} viewBox='0 0 20 20' aria-hidden={'true'}><path fill-rule={'evenodd'} d={'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'} clip-rule={'evenodd'} /></svg>
					<span className={'sr-only'}>{'Increased by'}</span>
					{'122'}
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

				<p className={'ml-2 flex items-baseline text-sm font-semibold text-green-600'}>
					<svg className={'self-center flex-shrink-0 h-5 w-5 text-green-500'} fill={'currentColor'} viewBox='0 0 20 20' aria-hidden={'true'}><path fill-rule={'evenodd'} d={'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'} clip-rule={'evenodd'} /></svg>
					<span className={'sr-only'}>
						{'Increased by'}
					</span>
					{'5.4%'}
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
				<p className={'text-xs font-light text-gray-400 ml-1'}>
					{'𝗑10¹⁸'}
				</p>

				<p className={'ml-2 flex items-baseline text-sm font-semibold text-green-500'}>
					<svg className={'self-center flex-shrink-0 h-5 w-5 text-green-500'} fill={'currentColor'} viewBox='0 0 20 20' aria-hidden={'true'}><path fill-rule={'evenodd'} d={'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'} clip-rule={'evenodd'} /></svg>
					<span className={'sr-only'}>Decreased by</span>
					{'3.2%'}
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
function	SectionStats({numberOfAchievements}) {
	return (
		<div>
		<h3 className='text-lg leading-6 font-medium text-gray-900'>
			Last 30 days
		</h3>

		<dl className={'mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
			<ItemStatChallengers />

			<ItemStatAchievements count={numberOfAchievements} />

			<ItemStatTotalSupply />
		</dl>
		</div>
	)
}

function	Page(props) {
	const	{data: challengers} = useSWR(`${process.env.API_URI}/claims`, fetcher, {initialData: props.challengers});
	const	{data: numberOfAchievements} = useSWR(`${process.env.API_URI}/achievements/count`, fetcher, {initialData: props.numberOfAchievements});

	return (
		<div className={'w-full pt-2 px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto pb-24'}>
			<div className={'pb-6'}>
				
				{/* <div className={'relative -ml-8'} style={{zIndex: -1}}>
					<svg width={'404'} height={'300'} fill={'none'} viewBox={'0 0 404 300'} className={`absolute left-0 transform opacity-50`}><defs><pattern id={'64e643ad-2176-4f86-b3d7-f2c5da3b6a6d'} x={'0'} y={'0'} width={'20'} height={'20'} patternUnits={'userSpaceOnUse'}><rect x={'0'} y={'0'} width={'4'} height={'4'} fill={'currentColor'} className={'text-gray-200'}></rect></pattern></defs><rect width={'404'} height={'300'} fill={'url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)'}></rect></svg>
				</div> */}
				
				<Header />
				{/* <SectionBanner /> */}


				<div className={'flex flex-col mt-16'}>
					<div className={'-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'}>
						<div className={'py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'}>
							<SectionStats numberOfAchievements={numberOfAchievements} />
						</div>
					</div>
				</div>


				<div className={'relative h-0 -ml-10'} style={{zIndex: -1}}>
					<svg width='404' height='500' fill={'none'} viewBox='0 0 404 500' className='hidden lg:block absolute left-full transform -translate-x-1/2 opacity-50 z-0'><defs><pattern id='b1e6e422-73f8-40a6-b5d9-c8586e37e0e7' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'><rect x='0' y='0' width='4' height='4' fill={'currentColor'} className='text-gray-200'></rect></pattern></defs><rect width='404' height='500' fill='url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)'></rect></svg>
				</div>

				<Table challengers={challengers} numberOfAchievements={numberOfAchievements} />
			</div>
		</div>
	);
}

export async function getStaticProps() {
	const	challengers = await fetcher(`${process.env.API_URI}/claims`)
	const	numberOfAchievements = await fetcher(`${process.env.API_URI}/achievements/count`)
	return {props: {challengers, numberOfAchievements}}
}

export default Page;
