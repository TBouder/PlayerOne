/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday April 3rd 2021
**	@Filename:				Table.js
******************************************************************************/

import	{useRef, useState, useEffect}	from	'react';
import	{FontAwesomeIcon}				from	'@fortawesome/react-fontawesome'
import	{faCrown}						from	'@fortawesome/pro-solid-svg-icons'
import	jazzicon						from	'@metamask/jazzicon';
import	useWeb3							from	'contexts/useWeb3';
import	{jsNumberForAddress}			from	'utils'

function	TableHead() {
	return (
		<li>
			<div className={'items-center px-4 py-4 sm:px-6 bg-gray-100 dark:bg-dark-background-400 hidden md:flex'}>
				<div className={'text-sm text-center font-semibold text-gray-400 dark:text-dark-white lining-nums w-10 mr-8'}>
					<FontAwesomeIcon
						style={{width: 24, height: 24}}
						className={'text-gray-200'}
						icon={faCrown} />
				</div>
				<div className={'min-w-0 flex-1 flex items-center'}>
					<div className={'px-1 text-sm font-semibold text-gray-600 dark:text-dark-white lining-nums'}>
						{'Challengers'}
					</div>
				</div>

				<div className={'w-2/12 px-6 py-4 whitespace-nowrap text-center'}>
					<div className={'text-sm font-semibold text-gray-600 dark:text-dark-white lining-nums'}>
						{`Achievements`}
					</div>
				</div>
				<div className={'w-2/12 px-6 py-4 whitespace-nowrap text-center'}>
					<div className={'text-sm font-semibold text-gray-600 dark:text-dark-white lining-nums'}>
						{`Rewards from claims`}
					</div>
				</div> 
			</div>
			<div className={'items-center px-4 py-4 sm:px-6 flex md:hidden'}>
				<div className={'min-w-0 flex-1 flex items-center justify-center text-center'}>
					<div className={'px-1 text-sm font-semibold text-gray-600 dark:text-dark-white lining-nums'}>
						{'Challengers'}
					</div>
				</div>
			</div>
		</li>
	);
}

function	TableRow({index, challenger, numberOfAchievements}) {
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
				<div className={'text-sm text-center font-semibold text-gray-400 dark:text-dark-white lining-nums w-10 mr-0 md:mr-8 absolute md:static top-6 left-6'}>
					{`#${index}`}
				</div>
				<div className={'flex-1 flex items-center w-full'}>
					<div className={'flex items-center flex-col md:flex-row mt-2 md:mt-0 w-full'}>
						<div className={'flex-shrink-0 h-10 w-10 mb-2 md:mb-0'}>
							<div className={'w-10 h-10 rounded-full'} ref={jazziconRef} />
						</div>
						<div className={'ml-4 flex flex-col justify-center w-full'}>
							<p className={`text-sm font-medium text-gray-900 dark:text-dark-white ${requestor === undefined ? 'cpLine' : 'cpLine-after truncate'}`}>
								<a
									href={`https://etherscan.io/address/${requestor}`}
									target={'_blank'}
									className={'hover:text-accent-900 hover:underline cursor-pointer truncate'}>
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
						<div className={'text-sm font-semibold text-gray-900 dark:text-dark-white lining-nums'}>
							<span className={'text-gray-600 font-medium'}>{`Achievements : `}</span>
							{`${(challenger.achievements / numberOfAchievements * 100).toFixed(2)} %`}
						</div>
						<div className={'text-sm font-semibold text-gray-900 dark:text-dark-white lining-nums'}>
							<span className={'text-gray-600 font-medium'}>{`Rewards : `}</span>
							{`${(challenger.rewards / 10000).toFixed(4)} 💎`}
						</div>
					</div>
				</div> 

				<div className={'hidden md:contents'}>
					<div className={'w-2/12 px-6 py-4 whitespace-nowrap text-center'}>
						<div className={'text-sm font-semibold text-gray-900 dark:text-dark-white lining-nums'}>
							{`${(challenger.achievements / numberOfAchievements * 100).toFixed(2)} %`}
						</div>
					</div>
					<div className={'w-2/12 px-6 py-4 whitespace-nowrap text-center'}>
						<div className={'text-sm font-semibold text-gray-900 dark:text-dark-white lining-nums'}>
							{`${(challenger.rewards / 10000).toFixed(4)} 💎`}
						</div>
					</div>
				</div> 
			</div>
		</li>
	)
}

function	SectionChallengers({challengers, numberOfAchievements}) {
	return (
		<section
			aria-label={`challengers`}
			className={'flex flex-col mt-16'}
			id={'challengers'}>
			<div className={'shadow overflow-hidden border-b border-gray-200 dark:border-dark-background-400 sm:rounded-lg'}>
				<ul className={'bg-white dark:bg-dark-background-600 divide-y divide-gray-200 dark:divide-dark-background-400'}>
					<TableHead />
					{challengers.map((challenger, index) => (
						<TableRow
							key={challenger.address}
							index={index + 1}
							challenger={challenger}
							numberOfAchievements={numberOfAchievements} />	
					))}
				</ul>
			</div>
			<div className={'flex w-full items-center justify-center mt-6'}>
				<p className={'text-sm text-gray-400 hover:text-accent-900 cursor-pointer text-center hover:underline'}>
					{'Contact us to see more'}
				</p>
			</div>
		</section>
	);
}
export default SectionChallengers;