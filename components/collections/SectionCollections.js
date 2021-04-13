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

function	ItemCollection({faIcon, title, content, size}) {
	return (
		<div className={`relative rounded-lg bg-gray-200 dark:bg-dark-background-600 w-full h-full cursor-pointer group z-10 overflow-hidden transition-colors hover:shadow-2xl flex flex-row ${size}`}>
			<div className={'flex flex-col justify-center items-center p-4 z-10 w-1/6 dark:bg-dark-background-400 py-16'}>
				<FontAwesomeIcon
					style={{width: 48, height: 48}}
					className={'text-gray-400 dark:text-dark-white group-hover:animate-shake group-hover:text-accent-900 dark:group-hover:text-white'}
					icon={faIcon} />
			</div>

			<div className={'flex flex-col px-8 py-4 z-10 w-5/6'}>
				<div className={'mb-4'}>
					<h2
						className={'text-gray-400 dark:text-dark-background-200 font-medium text-lg mb-2'}
						style={{fontFamily: '"Press Start 2P"'}}>
						{title}
					</h2>
					<p className={'text-gray-400 dark:text-dark-white text-base'}>
						{content}
					</p>
				</div>
				<div className={'flex flex-row justify-between'}>
					<div
						className={'flex rounded-md border border-solid border-dark-background-400 dark:bg-dark-background-600 w-1/4 h-28'}>

					</div>
					<div
						className={'flex rounded-md border border-solid border-dark-background-400 dark:bg-dark-background-600 w-1/4 h-28'}>

					</div>
					<div
						className={'flex rounded-md border border-solid border-dark-background-400 dark:bg-dark-background-600 w-1/4 h-28'}>

					</div>
					
				</div>
			</div>
		</div>
	);
}
function	SectionCollections() {
	return (
		<section id={'collections'} aria-label={'collections'}>
			<div className={'grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6'}>
				<ItemCollection
					size={'col-span-full'}
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faAward}
					title={'All'}
					reward={'player-one.eth'}
					/>
				<ItemCollection
					size={'col-span-full'}
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faShapes}
					title={'Ecosystem'}
					reward={'touche-tout.eth'}
					/>
				<ItemCollection
					size={'col-span-full'}
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faCoins}
					reward={'master-of-coin.eth'}
					title={'ERC-20'} />
				<ItemCollection
					size={'col-span-full'}
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faParachuteBox}
					reward={'gimesomeairdrops.eth'}
					title={'Airdrops'} />
				<ItemCollection
					size={'col-span-full'}
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faGasPump}
					reward={'gas-pump.eth'}
					title={'Fees'} />
				<ItemCollection
					size={'col-span-full'}
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faUniversity}
					reward={'defi-degen.eth'}
					title={'DeFI'} />
			</div>
		</section>
	);
}

export default SectionCollections;