/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				prices.js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	jazzicon							from	'@metamask/jazzicon';
import	useSWR								from	'swr';
import	{FontAwesomeIcon}					from	'@fortawesome/react-fontawesome'
import	{faCrown}							from	'@fortawesome/free-solid-svg-icons'
import	useWeb3								from	'contexts/useWeb3';
import	Header											from	'components/index/Header';
import	SectionBanner						from	'components/index/SectionBanner';
import	{randomInteger, fetcher, jsNumberForAddress}		from	'utils'

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
		if (rProvider) {
			const	ENS = await rProvider.lookupAddress(challenger.address);
			set_isENS(ENS ? true : false);
			set_requestor(ENS || challenger.address);
		}
	}, [rProvider])

	return (
		<tr>
			<td className={'px-6 py-4 whitespace-nowrap'}>
				<div className={'flex items-center'}>
					<div className={'flex-shrink-0 h-10 w-10'}>
						<div className={'w-10 h-10 rounded-full'} ref={jazziconRef} />
					</div>
					<div className={'ml-4 flex flex-col justify-center'}>
						<p className={`text-sm font-medium text-gray-900 ${requestor === undefined ? 'cp-line' : 'cp-line-after truncate'}`}>
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
					{`${((challenger.rewards + randomInteger(-10000, 10000)) / 10000).toFixed(4)} 💎`}
				</div>
			</td>
		</tr>
	)
}
function	Table({challengers, numberOfAchievements}) {
	return (
		<div className={'flex flex-col mt-16'}>
			<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
				<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
				<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
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

				<div className={'relative h-0 -ml-10'} style={{zIndex: -1}}>
					<svg width="404" height="500" fill="none" viewBox="0 0 404 500" className="hidden lg:block absolute left-full transform -translate-x-1/2 opacity-50 z-0"><defs><pattern id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="currentColor" className="text-gray-200"></rect></pattern></defs><rect width="404" height="500" fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"></rect></svg>
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
