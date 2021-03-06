/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				SectionStatus.js
******************************************************************************/

import	ReactMarkdown						from	'react-markdown';
import	useAchievements						from	'contexts/useAchievements';
import	Badge								from	'components/Badges';
import	SwapOnSushiswap						from	'components/details/SwapRouter';
import	{formatPercent}						from	'utils';
import Image from 'next/image';

function	SectionQuickStats({numberOfClaims}) {
	const	{poolSize} = useAchievements();
	return (
		<section
			className={'border-t border-gray-200 dark:border-dark-background-600 bg-gray-50 dark:bg-dark-background-400 grid grid-cols-1 divide-y divide-gray-200 dark:divide-dark-background-600 sm:grid-cols-3 sm:divide-y-0 sm:divide-x'}>
			<div className={'px-6 py-5 text-sm font-medium text-center'}>
				<span className={'text-gray-900 dark:text-white'}>{'1 '}</span>
				<span className={'text-gray-600 dark:text-dark-white'}>{'Reward Token'}</span>
			</div>

			<div className={'px-6 py-5 text-sm font-medium text-center'}>
				<span className={'text-gray-900 dark:text-white'}>{numberOfClaims}</span>
				<span className={'text-gray-600 dark:text-dark-white'}>{' Unlocks'}</span>
			</div>

			<div className={'px-6 py-5 text-sm font-medium text-center'}>
				<span className={'text-gray-900 dark:text-white'}>{`${poolSize > 0 ? formatPercent(numberOfClaims / poolSize) : '100%'} `}</span>
				<span className={'text-gray-600 dark:text-dark-white'}>{'Ratio'}</span>
			</div>
		</section>
	);
}

function	SectionCollections({collections, className}) {
	return (
		<section aria-label={'collections'} className={`${className} flex-row`}>
			<div className={'flow-root ml-0 lg:ml-24'}>
				{collections.map((e, i) => <Badge key={`${e}_${i}`} defaultSelected disable type={e} />)}
			</div>
		</section>
	);
}

function	SectionStatus({achievement, currentAddressClaim, description}) {
	return (
		<section aria-labelledby={'profile-overview-title'}>
			<div className={'rounded-lg bg-white dark:bg-dark-background-600 overflow-hidden shadow'}>
				<div className={'p-6'}>
					<div className={'sm:flex sm:items-center sm:justify-between'}>
						<div className={'w-full flex flex-col'}>

							<SectionCollections collections={achievement.collections} className={'hidden lg:flex'} />

							<div aria-label={'descriptions'} className={'flex flex-col lg:flex-row py-4 lg:py-0'}>
								<div className={'flex flex-row w-full lg:w-1/3 pr-0 lg:pr-2'}>
									<div className={'flex-shrink-0 -mt-4'}>
										{achievement.icon ? 
											<div
												style={{background: achievement.background}}
												className={'mx-auto h-20 w-20 text-5xl flex justify-center items-center rounded-full text-white'}>
												{achievement.icon}
											</div>
											:
											<Image
												src={achievement.image}
												width={80}
												quality={100}
												height={80}
												objectFit={'cover'}
												alt={achievement.title} />
										}
									</div>
									<div className={'ml-4 -mt-2 lg:mt-1 '}>
										<SectionCollections collections={achievement.collections} className={'flex lg:hidden'} />
										<span className={'text-xl font-bold text-gray-900 dark:text-white sm:text-2xl'}>
											{achievement.title}
											<p className={'text-sm font-normal text-gray-400 dark:text-dark-white inline ml-2'}>
												{currentAddressClaim?.nonce ? `#${currentAddressClaim.nonce}` : ''}
											</p>
										</span>
										<p className={'text-sm font-medium text-gray-600 dark:text-dark-white'}>
											{currentAddressClaim?.date ? <time dateTime={currentAddressClaim?.date}>{new Date(currentAddressClaim?.date).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})}</time> : null}
										</p>
									</div>
								</div>
								<div className={'flex flex-col w-full lg:w-2/3 pl-2 pt-6 lg:pt-0'}>
									<div className={'flex'}>
										<span className={'text-base font-normal text-gray-800 dark:text-dark-white prose-xl prose-teal'}>
											<ReactMarkdown>
												{description}
											</ReactMarkdown>
										</span>
									</div>
									<div>
										{achievement.slug === 'booty-assy' ?
											<SwapOnSushiswap
												routerAddress={'0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'}
												pairID={'0x46acb1187a6d83e26c0bb46a57ffeaf23ad7851e'}
												token={{
													icon: '????',
													name: 'ASSY'
												}}
											/>
										: null}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<SectionQuickStats numberOfClaims={achievement.numberOfClaims} />
			</div>
		</section>
	);
}

export default SectionStatus;