/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				SectionStatus.js
******************************************************************************/

import ReactMarkdown from 'react-markdown'
import	useAchievements						from	'contexts/useAchievements';
import	Badge								from	'components/Badges';
import	SwapOnSushiswap						from	'components/details/SwapOnSushiswap';
import	{formatPercent}						from	'utils';

function	SectionQuickStats({numberOfClaims}) {
	const	{poolSize} = useAchievements();
	return (
		<section
			className={'border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x'}>
			<div className='px-6 py-5 text-sm font-medium text-center'>
				<span className={'text-gray-900'}>{'1 '}</span>
				<span className={'text-gray-600'}>{'Reward Token'}</span>
			</div>

			<div className='px-6 py-5 text-sm font-medium text-center'>
				<span className={'text-gray-900'}>{numberOfClaims}</span>
				<span className={'text-gray-600'}>{' Unlocks'}</span>
			</div>

			<div className='px-6 py-5 text-sm font-medium text-center'>
				<span className={'text-gray-900'}>{`${poolSize > 0 ? formatPercent(numberOfClaims / poolSize) : '100%'} `}</span>
				<span className={'text-gray-600'}>{'Ratio'}</span>
			</div>
		</section>
	);
}

function	SectionCollections({collections}) {
	return (
		<section aria-label={'collections'} className={'flex flex-row'}>
			<div className={'flow-root ml-24'}>
				{collections.map((e, i) => <Badge key={`${e}_${i}`} defaultSelected disable type={e} />)}
			</div>
		</section>
	);
}

function	SectionStatus({achievement, currentAddressClaim, description}) {
	return (
		<section aria-labelledby={'profile-overview-title'}>
			<div className={'rounded-lg bg-white overflow-hidden shadow'}>
				<div className={'bg-white p-6'}>
					<div className={'sm:flex sm:items-center sm:justify-between'}>
						<div className={'w-full flex flex-col'}>

							<SectionCollections collections={achievement.badges} />

							<div aria-label={'descriptions'} className={'flex flex-row'}>
								<div className={'flex flex-row w-1/3 pr-2'}>
									<div className={'flex-shrink-0 -mt-4'}>
										<div
											style={{background: achievement.background}}
											className={'mx-auto h-20 w-20 text-5xl flex justify-center items-center rounded-full text-white'}>
											{achievement.icon}
										</div>
									</div>
									<div className={'ml-4 mt-1'}>
										<span className={'text-xl font-bold text-gray-900 sm:text-2xl'}>
											{achievement.title}
											<p className={'text-sm font-normal text-gray-400 inline ml-2'}>
												{currentAddressClaim?.nonce ? `#${currentAddressClaim.nonce}` : ''}
											</p>
										</span>
										<p className={'text-sm font-medium text-gray-600'}>
											{currentAddressClaim?.date ? <time dateTime={currentAddressClaim?.date}>{new Date(currentAddressClaim?.date).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})}</time> : null}
										</p>
									</div>
								</div>
								<div className={'flex flex-col w-2/3 pl-2 '}>
									<div className={'flex'}>
										<p className={'text-base font-normal text-gray-800 prose-xl prose-teal'}>
											<ReactMarkdown>
												{description}
											</ReactMarkdown>
										</p>
									</div>
									<div>
										{/* <SwapOnSushiswap /> */}
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