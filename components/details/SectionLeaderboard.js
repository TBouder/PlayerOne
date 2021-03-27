/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 19th 2021
**	@Filename:				DetailsLeaderboard.js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	{ethers}							from	'ethers';
import	jazzicon							from	'@metamask/jazzicon';
import	useSWR								from	'swr';
import	useWeb3								from	'contexts/useWeb3';
import	{fetcher, toAddress}				from	'utils';

function jsNumberForAddress(address) {
	const addr = address.slice(2, 10);
	const seed = parseInt(addr, 16);
	return seed;
}

function	Leader({claim}) {
	const	{address} = useWeb3();
	const	jazziconRef = useRef();
	const	numericRepresentation = jsNumberForAddress(claim.address);

	/**************************************************************************
	**	OnMount useEffect, used to generate the jazzincon (similar to metamask)
	**	and check if the signature is valid.
	**************************************************************************/
	useEffect(() => {
		if (typeof(window) !== 'undefined') {
			if (jazziconRef.current.childNodes[0])
				jazziconRef.current.removeChild(jazziconRef.current.childNodes[0]); 
			jazziconRef.current.appendChild(jazzicon(64, numericRepresentation))
		}
	}, [])

	/**************************************************************************
	**	List element to render
	**************************************************************************/
	return (
		<li className={'py-4'}>
			<div className={'flex space-x-8'}>
				<div className={'flex-shrink-0'}>
					<div className={'w-16 h-16 rounded-full'} ref={jazziconRef} />
				</div>
				<div className={'flex-1 min-w-0'}>
					<span className={'text-sm font-medium text-gray-900 truncate'}>
						{claim.address}
						{claim.address && address && toAddress(claim.address) === toAddress(address) ? <p className={'text-xs font-normal text-gray-600 inline italic'}>
							{` - this is you`}
						</p> : null}
					</span>
					<p className={'text-xs text-gray-500 truncate mt-1'}>
						{`${new Date(claim.date).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})} - # ${claim.nonce}`}
					</p>
				</div>
			</div>
		</li>
	);
}

function	SectionLeaderboard(props) {
	const	[currentSubSection, set_currentSubSection] = useState(0);
	/**************************************************************************
	**	Based on the props received we can initialize `claims`, aka the list
	**	of all the claims).
	**************************************************************************/
	const	[claims, set_claims] = useState([]);

	/**************************************************************************
	**	Adding a swr method to re-fetch the claims on focus/reconnect
	**************************************************************************/
	const	{data} = useSWR(
		props.key ? `${process.env.API_URI}/claims/achievement/by-key/${props.key}` : null,
		fetcher, {focusThrottleInterval: 1000 * 10}
	);

	/**************************************************************************
	**	When receiving new data from the swr fetcher, we can update the claims
	**************************************************************************/
	useEffect(() => {
		set_claims(data || []);
	}, [data]);

	/**************************************************************************
	**	Sections to render
	**************************************************************************/
	function	Navbar() {
		return (
			<div className={'pb-5 border-b border-gray-200 sm:pb-0'}>
				<div className={'mt-3 sm:mt-4'}>
					<div className={'sm:hidden'}>
						<label htmlFor={'current-tab'} className={'sr-only'}>Select a tab</label>
						<select
							value={currentSubSection === 0 ? 'Leaderboard' : currentSubSection === 0 ? 'Technical informations' :  'Bla'}
							onChange={(e) => set_currentSubSection(e)}
							id={'current-tab'}
							name={'current-tab'}
							className={'block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md'}>
							<option>{'Leaderboard'}</option>
							<option>{'Technical informations'}</option>
							<option>{'Bla'}</option>
						</select>
					</div>
					<div className={'hidden sm:block'}>
						<nav className={'-mb-px flex space-x-8'}>
							<button
								onClick={() => set_currentSubSection(0)}
								className={`${currentSubSection === 0 ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b font-medium text-base cursor-pointer`}>
								{'Leaderboard'}
							</button>

							<button
								onClick={() => set_currentSubSection(1)}
								className={`${currentSubSection === 1 ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b font-medium text-base cursor-pointer`}>
								{'Technical informations'}
							</button>

							<button
								onClick={() => set_currentSubSection(2)}
								className={`${currentSubSection === 2 ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b font-medium text-base cursor-pointer`}>
								{'Bla'}
							</button>
						</nav>
					</div>
				</div>
			</div>
		)
	}

	function	LeaderBoard() {
		return (
			<div className={'flow-root mt-6'}>
				<ul className={'-my-5 divide-y divide-gray-200'}>
					{claims.map((claim) => (
						<Leader
							key={`leader_${claim.address}`}
							claim={claim} />
					))}
				</ul>
			</div>
		);
	}

	function	Technical() {
		return (
			<div className={'flow-root mt-6'}>
				<pre className={'bg-gray-800 text-white rounded-lg p-6'}>
					<code>{props.verificationCode}</code>
				</pre>
			</div>
		);
	}

	return (
		<section aria-labelledby={'leaderboard'}>
			<div className={'rounded-lg bg-white overflow-hidden shadow'}>
				<div className={'px-6 pb-6'}>
					<Navbar />
					{currentSubSection === 0 ? <LeaderBoard /> : null}
					{currentSubSection === 1 ? <Technical /> : null}
				</div>
			</div>
		</section>
	);
}

export default SectionLeaderboard;