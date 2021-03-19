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

function jsNumberForAddress(address) {
	const addr = address.slice(2, 10);
	const seed = parseInt(addr, 16);
	return seed;
}

function	Leader({claim}) {
	const	{address} = useWeb3();
	const	jazziconRef = useRef();
	const	[validSignature, set_validSignature] = useState(true);
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
		try {
			const	signer = ethers.utils.verifyTypedData(claimDomain, claimTypes, JSON.parse(claim.message), claim.signature);
			set_validSignature(toAddress(signer) === toAddress(claim.address));
		} catch(e) {
			set_validSignature(false);
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
					<div className={'w-full mt-2 bg-gray-100 py-1 px-2 rounded '}>
						<code className={'text-xs font-medium text-gray-900 break-all whitespace-pre-wrap inline'}>
							{claim.signature}
							{validSignature ? <svg className={'w-4 h-4 text-green-600 inline ml-1'} style={{marginBottom: 2}} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' /></svg> : null}
						</code>
					</div>
				</div>
			</div>
		</li>
	);
}

function	LeaderBoard(props) {
	/**************************************************************************
	**	Based on the props received we can initialize `claims`, aka the list
	**	of all the claims).
	**************************************************************************/
	const	[claims, set_claims] = useState(props.claims);

	/**************************************************************************
	**	Adding a swr method to re-fetch the claims on focus/reconnect
	**************************************************************************/
	const	{data} = useSWR(
		props.achievementUUID ? `${process.env.API_URI}/claims/achievement/${props.achievementUUID}` : null,
		fetcher,
		{
			initialData: claims,
			focusThrottleInterval: 1000 * 10
		}
	);

	/**************************************************************************
	**	When receiving new data from the swr fetcher, we can update the claims
	**************************************************************************/
	useEffect(() => {
		set_claims(data);
		
		//@INFO: Trigger an update on the parent prop to set the number of 
		//		 claims to `data.length`
		props.set_numberOfClaims(data.length);
	}, [data]);

	/**************************************************************************
	**	Section to render
	**************************************************************************/
	return (
		<section aria-labelledby={'leaderboard'}>
			<div className={'rounded-lg bg-white overflow-hidden shadow'}>
				<div className={'p-6'}>
					<h2 className={'text-base font-medium text-gray-900'} id={'leaderboard'}>
						{'Leaderboard'}
					</h2>
					<div className={'flow-root mt-6'}>
						<ul className={'-my-5 divide-y divide-gray-200'}>
							{claims.map((claim) => (
								<Leader
									key={`leader_${claim.address}`}
									claim={claim} />
							))}
						</ul>
					</div>
					<div className={'mt-6'}>
						<a href={'#'} className={'w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'}>
							{'View all'}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}

export default LeaderBoard;