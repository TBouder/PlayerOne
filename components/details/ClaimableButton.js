/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				ClaimableButton.js
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

const graphFetcher = query => request('https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork', query)

function	ClaimableButton(props) {
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
