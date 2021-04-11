/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday April 3rd 2021
**	@Filename:				SectionStats.js
******************************************************************************/

import	{useState, useEffect}		from	'react';
import	Link						from	'next/link';
import	useWeb3						from	'contexts/useWeb3';
import	useAchievements				from	'contexts/useAchievements';
import	{formatNumber}				from	'utils'

function	ItemStatChallengers({count}) {
	return (
		<div className={'relative bg-white dark:bg-dark-background-600 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'}>
			<dt>
				<div className={'absolute bg-accent-900 rounded-md p-3'}>
					<svg className={'h-6 w-6 text-white'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'} aria-hidden={'true'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={'2'} d={'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'} /></svg>
				</div>
				<p className={'ml-16 text-sm font-medium text-gray-500 dark:text-dark-white truncate'}>{'Total Challengers'}</p>
			</dt>

			<dd className={'ml-16 pb-6 flex items-baseline sm:pb-7'}>
				<p className={'text-2xl font-semibold text-gray-900 dark:text-white'}>
					{count}
				</p>

				<div className={'absolute bottom-0 inset-x-0 bg-gray-50 dark:bg-dark-background-400 px-4 py-4 sm:px-6'}>
					<div className={'text-sm'}>
						<Link href={'#challengers'} passHref>
							<a className={'font-medium text-accent-900 hover:text-accent-700 hover:underline'}>
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
		<div className={'relative bg-white dark:bg-dark-background-600 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'}>
			<dt>
				<div className={'absolute bg-accent-900 rounded-md p-3'}>
					<svg className={'h-6 w-6 text-white'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' /></svg>
				</div>
				<p className={'ml-16 text-sm font-medium text-gray-500 dark:text-dark-white truncate'}>{'Total achievements'}</p>
			</dt>
			<dd className={'ml-16 pb-6 flex items-baseline sm:pb-7'}>
				<p className={'text-2xl font-semibold text-gray-900 dark:text-white'}>
					{count}
				</p>

				<div className={'absolute bottom-0 inset-x-0 bg-gray-50 dark:bg-dark-background-400 px-4 py-4 sm:px-6'}>
					<div className={'text-sm'}>
						<Link href={'/'} passHref>
							<a className={'font-medium text-accent-900 hover:text-accent-700 hover:underline'}>
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
		<div className={'relative bg-white dark:bg-dark-background-600 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'}>
			<dt>
				<div className={'absolute bg-accent-900 rounded-md p-3'}>
					<svg className={'h-6 w-6 text-white'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' /><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' /></svg>
				</div>
				<p className={'ml-16 text-sm font-medium text-gray-500 dark:text-dark-white truncate'}>{'Current supply'}</p>
			</dt>

			<dd className={'ml-16 pb-6 flex items-baseline sm:pb-7'}>
				<p className={'text-2xl font-semibold text-gray-900 dark:text-white'}>
					{`${formatNumber(totalSupply)}`}
				</p>

				<div className={'absolute bottom-0 inset-x-0 bg-gray-50 dark:bg-dark-background-400 px-4 py-4 sm:px-6'}>
					<div className={'text-sm'}>
						<a
							href={'https://ropsten.etherscan.io/token/0x35017DC776c43Bcf8192Bb6Ba528348D32A57CB5'}
							target={'_blank'}
							className={'font-medium text-accent-900 hover:text-accent-700 hover:underline'}>
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
		<section aria-label={`stats`}>
			<dl className={'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
				<ItemStatChallengers count={numberOfChallengers}/>

				<ItemStatAchievements count={numberOfAchievements} />

				<ItemStatTotalSupply />
			</dl>
		</section>
	);
}
export default SectionStats;