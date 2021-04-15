/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday April 3rd 2021
**	@Filename:				SectionStats.js
******************************************************************************/

import	{useState, useEffect}		from	'react';
import	Link						from	'next/link';
import	{FontAwesomeIcon}			from	'@fortawesome/react-fontawesome';
import	{faUsersCrown, faTrophy, faCoin}				from	'@fortawesome/pro-solid-svg-icons'
import	useWeb3						from	'contexts/useWeb3';
import	useAchievements				from	'contexts/useAchievements';
import	{formatNumber}				from	'utils'

function	ItemStatChallengers({count}) {
	return (
		<div className={'relative bg-white dark:bg-dark-background-600 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'}>
			<dt>
				<div className={'absolute bg-accent-900 rounded-md p-2 group'}>
					<FontAwesomeIcon
						style={{width: 32, height: 32}}
						className={'text-white group-hover:animate-shake'}
						icon={faUsersCrown} />
				</div>
				<p className={'ml-16 text-sm font-medium text-gray-500 dark:text-dark-white truncate'}>{'Challengers'}</p>
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
				<div className={'absolute bg-accent-900 rounded-md p-3 group'}>
					<FontAwesomeIcon
						style={{width: 24, height: 24}}
						className={'text-white group-hover:animate-shake'}
						icon={faTrophy} />
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
	const	{provider} = useWeb3();
	const	{actions} = useAchievements();
	const	[totalSupply, set_totalSupply] = useState(0);

	useEffect(() => {
		if (provider) {
			actions.getTotalSupply(provider).then((supply) => {
				set_totalSupply(supply);
			})
		}
	}, [provider])

	return (
		<div className={'relative bg-white dark:bg-dark-background-600 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'}>
			<dt>
				<div className={'absolute bg-accent-900 rounded-md p-3'}>
					<FontAwesomeIcon
						style={{width: 24, height: 24}}
						className={'text-white group-hover:animate-shake'}
						icon={faCoin} />
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