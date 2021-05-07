/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 19th 2021
**	@Filename:				DetailsLeaderboard.js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	ReactMarkdown						from	'react-markdown';
import	jazzicon							from	'@metamask/jazzicon';
import	useSWR								from	'swr';
import	useWeb3								from	'contexts/useWeb3';
import	{fetcher}							from	'utils';
import { useRouter } from 'next/router';

function jsNumberForAddress(address) {
	const addr = address.slice(2, 10);
	const seed = parseInt(addr, 16);
	return seed;
}

function	Leader({claim}) {
	const	{ethMainnetProvider} = useWeb3();
	const	[requestor, set_requestor] = useState(claim.address)
	const	jazziconRef = useRef();
	const	numericRepresentation = jsNumberForAddress(claim.address);

	/**************************************************************************
	**	OnMount useEffect, used to generate the jazzincon (similar to metamask)
	**	and check if the signature is valid.
	**************************************************************************/
	useEffect(async () => {
		if (typeof(window) !== 'undefined') {
			if (jazziconRef.current.childNodes[0])
				jazziconRef.current.removeChild(jazziconRef.current.childNodes[0]); 
			jazziconRef.current.appendChild(jazzicon(48, numericRepresentation))
		}
		// if (ethMainnetProvider) {
		// 	const	ENS = await ethMainnetProvider.lookupAddress(claim.address);
		// 	set_requestor(ENS || claim.address);
		// }
	}, [ethMainnetProvider])

	/**************************************************************************
	**	List element to render
	**************************************************************************/
	return (
		<li className={'py-4'}>
			<div className={'flex space-x-8'}>
				<div className={'flex-shrink-0'}>
					<div className={'w-12 h-12 rounded-full'} ref={jazziconRef} />
				</div>
				<div className={'min-w-0 flex-1 px-4 lg:grid lg:gap-4 relative'}>
					<div>
						<span className={`text-sm font-medium text-gray-900 dark:text-white truncate`}>
							<p className={`${requestor === undefined ? 'cp-line' : 'cp-line-after truncate'}`}>
								<a
									href={`${process.env.EXPLORER_BASE_URL}/address/${requestor}`}
									target={'_blank'}
									className={'hover:text-accent-900 hover:underline cursor-pointer truncate'}>
									{requestor}
								</a>
							</p>
							<div className={'lg:flex mt-2'}>
								<p className={'mb-2 flex lg:hidden items-center text-sm text-accent-900 dark:text-dark-white lg:mt-0 lg:ml-6'}>
									<svg className={'flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
									<a
										href={`${process.env.EXPLORER_BASE_URL}/address/${claim.validator}`}
										target={'_blank'}
										className={'hover:text-accent-900 hover:underline cursor-pointer truncate'}>
										{claim.validator}
									</a>
								</p>
								<p className={'flex items-center text-sm text-gray-400 dark:text-dark-white'}>
									<svg className={'flex-shrink-0 mr-1.5 h-4 w-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
									{`${new Date(claim.date).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})}`}
								</p>
								<p className={'mt-2 flex items-center text-sm text-gray-400 dark:text-dark-white lg:mt-0 lg:ml-6'}>
									<svg className={'flex-shrink-0 mr-1.5 h-4 w-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
									{`${claim.nonce}`}
								</p>
							</div>
						</span>
						<div className={'absolute top-0 right-0'}>
							<p className={'items-center text-xs text-gray-400 font-normal hidden lg:flex'}>
								<svg className={'flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
								<a
									href={`${process.env.EXPLORER_BASE_URL}/address/${claim.validator}`}
									target={'_blank'}
									className={'hover:text-accent-900 hover:underline cursor-pointer'}>
									{claim.validator ? `${claim.validator.slice(0, 4)}...${claim.validator.slice(-4)}` : 'unknow'}
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</li>
	);
}

function	SectionLeaderboard(props) {
	const	router = useRouter();
	const	[initialRedirectionDone, set_initialRedirectionDone] = useState(false);
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
		props.achievementKey ? `${process.env.API_URI}/claims/achievement/${props.achievementKey}` : null,
		fetcher, {focusThrottleInterval: 1000 * 10}
	);

	/**************************************************************************
	**	When receiving new data from the swr fetcher, we can update the claims
	**************************************************************************/
	useEffect(() => {
		set_claims(data || []);
	}, [data]);

	/**************************************************************************
	**	Change the tab when the route change with an anchor
	**************************************************************************/
	useEffect(() => {
		if (!initialRedirectionDone) {
			if (router.asPath.endsWith('#claims')) {
				set_currentSubSection(0)
			} else if (router.asPath.endsWith('#technical')) {
				set_currentSubSection(1)
			} else if (router.asPath.endsWith('#social')) {
				set_currentSubSection(2)
			}
			set_initialRedirectionDone(true);
		}
	}, [router])

	useEffect(() => {
		if (typeof(window) !== 'undefined' && initialRedirectionDone) {
			if (currentSubSection === 0) {
				if (window.history.replaceState) {
					window.history.replaceState(null, null, `${window.location.pathname}#claims`);
				}
			} else if (currentSubSection === 1) {
				if (window.history.replaceState) {
					window.history.replaceState(null, null, `${window.location.pathname}#technical`);
				}
			} else if (currentSubSection === 2) {
				if (window.history.replaceState) {
					window.history.replaceState(null, null, `${window.location.pathname}#social`);
				}
			}
		}
	}, [typeof(window), currentSubSection, initialRedirectionDone]);

	/**************************************************************************
	**	Sections to render
	**************************************************************************/
	function	Navbar() {
		return (
			<div className={'pb-5 border-b border-gray-200 dark:border-dark-background-400 lg:pb-0'}>
				<div className={'mt-3 lg:mt-4'}>
					<div className={'lg:hidden'}>
						<label htmlFor={'current-tab'} className={'sr-only'}>Select a tab</label>
						<select
							value={currentSubSection === 0 ? 'Claims' : currentSubSection === 1 ? 'Technical informations' :  'Social'}
							onChange={(e) => {
								if (e.target.value === 'Claims')
									set_currentSubSection(0);
								else if (e.target.value === 'Technical informations')
									set_currentSubSection(1);
								else 
									set_currentSubSection(2);
							}}
							id={'current-tab'}
							name={'current-tab'}
							className={'block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-dark-background-600 focus:outline-none focus:ring-accent-900 focus:border-accent-900 lg:text-sm rounded-md'}>
							<option>{'Claims'}</option>
							<option>{'Technical informations'}</option>
							<option>{'Social'}</option>
						</select>
					</div>
					<div className={'hidden lg:block'}>
						<nav className={'-mb-px flex space-x-8'}>
							<button
								id={'claims'}
								onClick={() => set_currentSubSection(0)}
								className={`${currentSubSection === 0 ? 'border-accent-900 text-accent-900' : 'dark:border-dark-background-400 border-transparent text-accent-900 dark:text-dark-white hover:text-gray-700'} whitespace-nowrap pb-4 px-1 border-b font-medium text-base cursor-pointer`}>
								{'Claims'}
							</button>

							<button
								id={'technical'}
								onClick={() => set_currentSubSection(1)}
								className={`${currentSubSection === 1 ? 'border-accent-900 text-accent-900' : 'dark:border-dark-background-400 border-transparent text-accent-900 dark:text-dark-white hover:text-gray-700'} whitespace-nowrap pb-4 px-1 border-b font-medium text-base cursor-pointer`}>
								{'Technical informations'}
							</button>

							<button
								id={'social'}
								onClick={() => set_currentSubSection(2)}
								className={`${currentSubSection === 2 ? 'border-accent-900 text-accent-900' : 'dark:border-dark-background-400 border-transparent text-accent-900 dark:text-dark-white hover:text-gray-700'} whitespace-nowrap pb-4 px-1 border-b font-medium text-base cursor-pointer`}>
								{'Social'}
							</button>
						</nav>
					</div>
				</div>
			</div>
		)
	}

	function	LeaderBoard() {
		function	renderClaims() {
			if (claims.length === 0) {
				return (
					<div className={'flex items-center justify-center flex-col p-12'}>
						<svg className={'w-20 h-20 text-gray-400'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
						<p className={'text-gray-400 font-medium mt-4'}>{'This achievement has never been claimed!'}</p>
						<p className={'text-gray-400 font-medium'}>{'Be the first and earn an extra reward!'}</p>
					</div>
				);
			}
			return (
				<div>
					<div className={'mt-0'}>
						<ul className={'divide-y divide-gray-200 dark:divide-dark-background-400'}>
							{claims.map((claim) => (
								<Leader
									key={`leader_${claim.address}`}
									claim={claim} />
							))}
						</ul>
					</div>
				</div>

			);
		}
		return (
			<div className={'flow-root mt-6'}>
				{renderClaims()}
			</div>
		);
	}

	function	Technical() {
		function	renderArguments(args) {
			return Object.entries(args).map(([key, value]) => {
				if (key === 'value') {
					return (
						<div key={key}>
							<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`Value: `}</p>
							<p className={'inline'}>{value}</p>
						</div>
					);
				} else if (key === 'address') {
					return (
						<div key={key}>
							<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`Address: `}</p>
							<a
								href={`https://etherscan.io/address/${value}`}
								target={'_blank'}
								className={'inline hover:underline hover:text-accent-900 break-all'}>
								{value}
							</a>
						</div>
					);
				} else if (key === 'addressFrom') {
					return (
						<div key={key}>
							<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`AddressFrom: `}</p>
							<a
								href={`https://etherscan.io/address/${value}`}
								target={'_blank'}
								className={'inline hover:underline hover:text-accent-900 break-all'}>
								{value}
							</a>
						</div>
					);
				} else if (key === 'addressTo') {
					return (
						<div key={key}>
							<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`AddressTo: `}</p>
							<a
								href={`https://etherscan.io/address/${value}`}
								target={'_blank'}
								className={'inline hover:underline hover:text-accent-900 break-all'}>
								{value}
							</a>
						</div>
					);
				} else if (key === 'startBlock') {
					return (
						<div key={key}>
							<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`StartBlock: `}</p>
							<a
								href={`https://etherscan.io/block/${value}`}
								target={'_blank'}
								className={'inline hover:underline hover:text-accent-900 break-all'}>
								{value}
							</a>
						</div>
					);
				} else if (key === 'endBlock') {
					return (
						<div key={key}>
							<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`EndBlock: `}</p>
							<a
								href={`https://etherscan.io/block/${value}`}
								target={'_blank'}
								className={'inline hover:underline hover:text-accent-900 break-all'}>
								{value}
							</a>
						</div>
					);
				} else if (key === 'methodsID') {
					return (
						<div key={key}>
							<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`Methods: `}</p>
							{value.map((e, i) => (
								<p key={e} className={'inline lining-nums break-all'}>{`${i !== 0 ? ', ' : ''}${e}`}</p>
							))}
						</div>
					);
				}
				return (
					<div key={key}>
						<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`${key}: `}</p>
						<p className={'inline break-all'}>{value}</p>
					</div>
				)
			})
		}

		const renderers = {
			strong: ({children}) => <span className={'font-semibold'}>{children}</span>
		};
		return (
			<div className={'flow-root mt-6'}>
			 	<dl className={'grid grid-cols-2 gap-x-16 gap-y-8'}>
              		<div className={'col-span-2 lg:col-span-1'}>
						<div>
							<dt className={'text-base font-medium text-gray-900 dark:text-white mb-2'}>
								{'How to get this achievement'}
							</dt>
							<dd className={'text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-dark-background-900 rounded-lg p-4 flex flex-row items-start'}>
								<svg className={'w-9 h-9 min-w-9 text-gray-300'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
								<div className={'ml-4 my-auto overflow-y-scroll'}>
									<ReactMarkdown renderers={renderers}>
										{props.technicalContext}
									</ReactMarkdown>
								</div>
							</dd>
						</div>

						<div className={'mt-8'}>
							<dt className={'text-base font-medium text-gray-900 dark:text-white mb-2'}>
								{'Strategy arguments'}
							</dt>
							<dd className={'text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-dark-background-900 rounded-lg p-4 flex flex-row items-start'}>
								<svg className={'w-9 h-9 min-w-9 text-gray-300'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" /></svg>
								<div className={'ml-4 space-y-2 my-auto'}>
									<div>
										<p className={'inline font-medium text-gray-600 dark:text-gray-300 dark:text-opacity-60'}>{`Stategy: `}</p>
										<p className={'inline'}>{props?.strategy?.name}</p>
									</div>
									{renderArguments(props?.strategy?.args)}
								</div>
							</dd>
						</div>
              		</div>

              		<div className={'col-span-2 lg:col-span-1'}>
                		<dt className={'text-xs font-light text-gray-400 dark:text-dark-white flex flex-row items-center'}>
							{'Verification pseudo-code'}
							<svg className={'w-3 h-3 text-green-600 dark:text-green-400 opacity-60 dark:opacity-100 ml-2'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                		</dt>
                		<dd className={'mt-1 text-sm text-gray-900 dark:text-white'}>
							<pre className={'bg-gray-800 dark:bg-dark-background-900 text-white rounded-lg px-6 py-3 text-xs'}>
								<code className={'whitespace-break-spaces'}>{props.verificationCode}</code>
							</pre>
                		</dd>
              		</div>
				</dl>
			</div>
		);
	}

	function	Social() {
		return (
			<div className={'flow-root mt-6'}>
				<div className={'flex items-center justify-center flex-col p-12'}>
					<svg className={'w-20 h-20 text-gray-400'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>

					<p className={'text-gray-400 font-medium mt-4'}>{'Share the achievement to your followers!'}</p>

				</div>
			</div>
		);
	}

	return (
		<div className={'grid grid-cols-1 gap-4 lg:col-span-3 pb-32'}>
			<section aria-labelledby={'leaderboard'}>
				<div className={'rounded-lg bg-white dark:bg-dark-background-600 overflow-hidden shadow'}>
					<div className={'px-6 pb-6'}>
						<Navbar />
						{currentSubSection === 0 ? <LeaderBoard /> : null}
						{currentSubSection === 1 ? <Technical /> : null}
						{currentSubSection === 2 ? <Social /> : null}
					</div>
				</div>
				{currentSubSection === 0 ? <div className={'flex w-full items-center justify-center mt-6'}>
					<p className={'text-sm text-gray-400 hover:text-accent-900 cursor-pointer text-center hover:underline'}>
						{'Contact us to see more'}
					</p>
				</div> : null}
			</section>
		</div>
	);
}

export default SectionLeaderboard;