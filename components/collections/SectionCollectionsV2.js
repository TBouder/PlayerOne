/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionCollections.js
******************************************************************************/

import	{FontAwesomeIcon}						from	'@fortawesome/react-fontawesome'
import	{
	faCoins, faParachuteBox, faGasPump, faShapes,
	faUniversity, faAward}						from	'@fortawesome/pro-solid-svg-icons'


function	ItemCollectionUniswap({title, size}) {
	return (
		<div className={`relative rounded-lg bg-gray-200 dark:bg-dark-background-600 w-full h-full cursor-pointer group z-10 overflow-hidden hover:bg-accent-900 dark:hover:bg-accent-900 transition-colors hover:shadow-2xl ${size}`}>
			<div className={'flex flex-col justify-center items-center p-4 z-10 h-full py-16'}>
				<div className={'flex flex-row'}>
					<p className={'text-gray-400 dark:text-dark-white dark:group-hover:text-white font-medium text-2xl'}>{title}</p>
				</div>
			</div>
			<div className={'absolute z-10 w-full h-full flex justify-end items-end top-0 bottom-0 -right-16 mt-8'}>
				<div className={'w-48 h-48 bg-cover opacity-50'} style={{backgroundImage: 'url("/uniswap.svg")'}} />
			</div>
		</div>
	);
}
function	ItemCollectionSushiswap({title, size}) {
	return (
		<div className={`relative rounded-lg bg-gray-200 dark:bg-dark-background-600 w-full h-full cursor-pointer group z-10 overflow-hidden hover:bg-accent-900 dark:hover:bg-accent-900 transition-colors hover:shadow-2xl ${size}`}>
			<div className={'flex flex-col justify-center items-center p-4 z-10 h-full py-16'}>
				<div className={'flex flex-row'}>
					<p className={'text-gray-400 dark:text-dark-white dark:group-hover:text-white font-medium text-2xl'}>{title}</p>
				</div>
			</div>
			<div className={'absolute z-10 w-full h-full flex justify-start items-end top-0 bottom-0 -left-12 mt-6'}>
				<div className={'w-48 h-48 bg-cover opacity-20'} style={{backgroundImage: 'url("/sushiswap.svg")'}} />
			</div>
		</div>
	);
}
function	ItemCollectionPooltogether({title, size}) {
	return (
		<div className={`relative rounded-lg bg-gray-200 dark:bg-dark-background-600 w-full h-full cursor-pointer group z-10 overflow-hidden hover:bg-accent-900 dark:hover:bg-accent-900 transition-colors hover:shadow-2xl ${size}`}>
			<div className={'flex flex-col justify-center items-center p-4 z-10 h-full py-16'}>
				<div className={'flex flex-row'}>
					<p className={'text-gray-400 dark:text-dark-white dark:group-hover:text-white font-medium text-2xl'}>{title}</p>
				</div>
			</div>
			<div className={'absolute z-10 w-full h-full flex justify-start items-end top-0 bottom-4 left-2'}>
				<div className={'w-24 h-24 mb-2 bg-contain bg-no-repeat opacity-50'} style={{backgroundImage: 'url("/pooltogether.svg")'}} />
			</div>
		</div>
	);
}
function	ItemCollectionAave({title, size}) {
	return (
		<div className={`relative rounded-lg bg-gray-200 dark:bg-dark-background-600 w-full h-full cursor-pointer group z-10 overflow-hidden hover:bg-accent-900 dark:hover:bg-accent-900 transition-colors hover:shadow-2xl ${size}`}>
			<div className={'flex flex-col justify-center items-center p-4 z-10 h-full py-16'}>
				<div className={'flex flex-row'}>
					<p className={'text-gray-400 dark:text-dark-white dark:group-hover:text-white font-medium text-2xl'}>{title}</p>
				</div>
			</div>
			<div className={'absolute z-10 w-full h-full justify-center items-end top-0 bottom-0 left-0 right-0 mt-10 flex'}>
				<div className={'w-24 h-24 bg-contain bg-center bg-no-repeat opacity-50'} style={{backgroundImage: 'url("/aave.svg")'}} />
			</div>
		</div>
	);
}
function	ItemCollectionYearn({title, size}) {
	return (
		<div className={`relative rounded-lg bg-gray-200 dark:bg-dark-background-600 w-full h-full cursor-pointer group z-10 overflow-hidden hover:bg-accent-900 dark:hover:bg-accent-900 transition-colors hover:shadow-2xl ${size}`}>
			<div className={'flex flex-col justify-center items-center p-4 z-10 h-full py-16'}>
				<div className={'flex flex-row'}>
					<p className={'text-gray-400 dark:text-dark-white dark:group-hover:text-white font-medium text-2xl'}>{title}</p>
				</div>
			</div>
			<div className={'absolute z-10 w-full h-full flex justify-end items-end -bottom-8 -right-8'}>
				<div className={'w-24 h-24 bg-contain bg-left-bottom bg-no-repeat opacity-20'} style={{backgroundImage: 'url("/yearn.png")'}} />
			</div>
		</div>
	);
}
function	ItemCollection({faIcon, title, size}) {
	return (
		<div className={`relative rounded-lg bg-gray-200 dark:bg-dark-background-600 w-full h-full cursor-pointer group z-10 overflow-hidden hover:bg-accent-900 dark:hover:bg-accent-900 transition-colors hover:shadow-2xl ${size}`}>
			<div className={'flex flex-col justify-center items-center p-4 z-10'}>
				<FontAwesomeIcon
					style={{width: 24, height: 24}}
					className={'mt-8 text-gray-400 dark:text-dark-white group-hover:animate-shake group-hover:text-accent-900 dark:group-hover:text-white'} icon={faIcon} />
				<div className={'mt-6 flex flex-row'}>
					<p className={'text-gray-400 dark:text-dark-white dark:group-hover:text-white font-medium'}>{title}</p>
					{/* <div className={'bg-red-400 ml-2 rounded inline opacity-100'}>
						<p className={'text-white text-xs px-1.5 py-0.5 pt-1 font-semibold'}>{randomInteger(0, 11)}</p>
					</div> */}
				</div>
			</div>
			{/* <div className={'absolute origin-center -right-8 -top-4 w-16 h-10 transform rotate-45 dark:bg-teal-600'} /> */}
		</div>
	);
}
function	SectionCollections() {
	return (
		<section id={'collections'} aria-label={'collections'}>
			<div className={'grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6'}>
				<ItemCollection size={'col-span-1'} faIcon={faAward} title={'All'} />
				<ItemCollection size={'col-span-2'} faIcon={faShapes} title={'Ecosystem'} />
				<ItemCollection size={'col-span-3'} faIcon={faCoins} title={'ERC-20'} />
				<ItemCollection size={'col-span-1'} faIcon={faParachuteBox} title={'Airdrops'} />
				<ItemCollection size={'col-span-1'} faIcon={faGasPump} title={'Fees'} />
				<ItemCollection size={'col-span-1'} faIcon={faUniversity} title={'DeFI'} />

				<ItemCollectionAave size={'col-span-1'} title={'AAVE'} />
				{/* <ItemCollection size={'col-span-1'} faIcon={faGhost} title={'AAVE'} /> */}
				<ItemCollectionUniswap size={'col-span-2'} title={'Uniswap'} />
				{/* <ItemCollection size={'col-span-2'} faIcon={faUnicorn} title={'Uniswap'} /> */}
				<ItemCollectionSushiswap size={'col-span-3'} title={'Sushiswap'} />
				{/* <ItemCollection size={'col-span-3'} faIcon={faFish} title={'Sushiswap'} /> */}
				<ItemCollectionYearn size={'col-span-1'} title={'Yearn'} />
				{/* <ItemCollection size={'col-span-1'} faIcon={faPiggyBank} title={'Yearn'} /> */}
				{/* <ItemCollection size={'col-span-2'} faIcon={faSwimmingPool} title={'PoolTogether'} /> */}
				<ItemCollectionPooltogether size={'col-span-2'} title={'PoolTogether'} />
			</div>
		</section>
	);
}

export default SectionCollections;