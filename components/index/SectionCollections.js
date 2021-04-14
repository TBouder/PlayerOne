/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionCollections.js
******************************************************************************/

import	{useState}								from	'react';
import	{FontAwesomeIcon}						from	'@fortawesome/react-fontawesome'
import	{
	faCoins, faParachuteBox, faGasPump, faShapes,
	faUniversity, faAward}						from	'@fortawesome/pro-solid-svg-icons'
import Link from 'next/link';


function	ItemCollection({selected, faIcon, title, slug, onClick}) {
	if (selected) {
		return (
			<div className={'rounded-lg bg-accent-900 overflow-hidden w-full h-full transition-colors z-10'}>
				<div className={'flex flex-col justify-center items-center p-4'}>
					<FontAwesomeIcon style={{width: 24, height: 24}} className={'mt-8 text-white'} icon={faIcon} />
					<p className={'mt-6 text-white font-medium'}>{title}</p>
				</div>
			</div>
		);
	}
	return (
		<Link href={`/collections/${slug}`} passHref>
			<div
				className={'rounded-lg bg-gray-200 dark:bg-dark-background-400 overflow-hidden w-full h-full cursor-pointer group z-10'}
				onClick={onClick}>
				<div className={'flex flex-col justify-center items-center p-4'}>
					<FontAwesomeIcon
						style={{width: 24, height: 24}}
						className={'mt-8 text-gray-400 dark:text-dark-white group-hover:animate-shake group-hover:text-accent-900 dark:group-hover:text-white'} icon={faIcon} />
					<p className={'mt-6 text-gray-400 dark:text-dark-white dark:group-hover:text-white font-medium'}>{title}</p>
				</div>
			</div>
		</Link>
	);
}
function	SectionCollections() {
	return (
		<section id={'collections'} aria-label={'collections'} className={'w-full pt-8 z-10'}>
			<div className={'pb-8 w-full flex justify-between'}>
				<h3 className={'text-base leading-6 font-medium text-gray-400'}>
					{`Browse the collections`}
				</h3>
				<Link href={'/collections'} passHref>
					<h3 className={'text-sm leading-6 font-normal text-accent-900 dark:text-dark-white text-opacity-60 cursor-pointer hover:text-opacity-100 hover:underline'}>
						{`See all`}
					</h3>
				</Link>
			</div>
			<div className={'grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'}>
				<ItemCollection selected faIcon={faAward} slug={'all'} title={'All'} />
				<ItemCollection faIcon={faShapes} slug={'protocols'} title={'Protocols'} />
				<ItemCollection faIcon={faCoins} slug={'erc20'} title={'ERC-20'} />
				<ItemCollection faIcon={faParachuteBox} slug={'airdrop'} title={'Airdrops'} />
				<ItemCollection faIcon={faGasPump} slug={'fees'} title={'Fees'} />
				<ItemCollection faIcon={faUniversity} slug={'defi'} title={'DeFI'} />
			</div>
		</section>
	);
}

export default SectionCollections;