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
import { truncateAddress } from 'utils';

function	ItemCollection({faIcon, title, content, reward, progress}) {
	return (
		<div className={`relative rounded-lg bg-white shadow dark:bg-dark-background-600 w-full h-full cursor-pointer group z-10 overflow-hidden transition-colors flex flex-col md:flex-row col-span-full border border-solid border-gray-100 dark:border-none`}>
			<div className={'flex flex-col justify-center items-center p-8 md:p-4 z-10 w-full md:w-1/4 lg:w-1/6 bg-gray-50 dark:bg-dark-background-400'}>
				<div className={`progress-circle p${progress.toFixed(0)} ${progress >= 50 ? 'over50' : ''} dark:bg-dark-background-300`}>
					<span className={'absolute inset-0 circle-span flex items-center justify-center'}>
						<FontAwesomeIcon
							style={{width: 36, height: 36}}
							className={'text-gray-400 dark:text-dark-white group-hover:animate-shake group-hover:text-accent-900 dark:group-hover:text-white'}
							icon={faIcon} />
					</span>
					<div className={'left-half-clipper'}>
						<div className={'first50-bar'}></div>
						<div className={'value-bar'}></div>
					</div>
				</div>
			</div>

			<div className={'flex flex-col px-8 py-4 z-10 w-full md:w-3/4 lg:w-5/6'}>
				<div className={'mb-6'}>
					<h2
						className={'text-gray-400 dark:text-dark-background-200 font-medium text-lg mb-2'}
						>
						{title}
					</h2>
					<p className={'text-gray-700 dark:text-dark-white text-base'}>
						{content}
					</p>
				</div>
				<div className={'flex flex-row justify-between'}>
					<div className={'flex flex-col rounded-md dark:bg-dark-background-600 text-xs truncate overflow-ellipsis mr-6'}>
						<span>
							<p className={'text-gray-400 dark:text-dark-background-200 text-base font-medium inline'} style={{fontVariant: 'all-small-caps'}}>
								{'ENS reward : '}
							</p>
							<p className={'text-gray-700 dark:text-dark-white inline dark:hover:text-accent-900 hover:text-accent-900 hover:underline '}>
								{reward}
							</p>
						</span>
						<span>
							<p className={'text-gray-400 dark:text-dark-background-200 text-base font-medium inline'} style={{fontVariant: 'all-small-caps'}}>
								{'Current Leader : '}
							</p>
							<p className={'text-gray-700 dark:text-dark-white inline dark:hover:text-accent-900 hover:text-accent-900 hover:underline truncate'}>
								{truncateAddress('0x9E63B020ae098E73cF201EE1357EDc72DFEaA518')}
							</p>
						</span>
					</div>
					<div className={'flex rounded-md dark:bg-dark-background-600'}>
						<button
							onClick={() => null}
							type={'button'}
							className={'flex flex-row items-center justify-center px-4 py-4 font-medium text-gray-400 hover:text-gray-900 dark:text-dark-background-100 dark:hover:text-white transition-colors whitespace-nowrap'}>
							{'Browse the collection'}
							<svg xmlns="http://www.w3.org/2000/svg" className={'h-3.5 w-3.5 ml-1'} style={{marginTop: 1}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
function	SectionCollections() {
	return (
		<section id={'collections'} aria-label={'collections'}>
			<div className={'grid gap-8 grid-cols-1'}>
				<ItemCollection
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faAward}
					title={'All'}
					reward={'player-one.eth'}
					progress={(7/11)*100}
					/>
				<ItemCollection
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faShapes}
					title={'Ecosystem'}
					reward={'touche-tout.eth'}
					progress={(4/11)*100}
					/>
				<ItemCollection
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faCoins}
					reward={'master-of-coin.eth'}
					progress={(2/11)*100}
					title={'ERC-20'} />
				<ItemCollection
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faParachuteBox}
					reward={'gimesomeairdrops.eth'}
					progress={(9/11)*100}
					title={'Airdrops'} />
				<ItemCollection
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faGasPump}
					reward={'gas-pump.eth'}
					progress={(3/11)*100}
					title={'Fees'} />
				<ItemCollection
					content={'Sed nec diam a ante porttitor blandit non ut ex. Maecenas commodo aliquam ultricies. Maecenas at finibus lacus. Quisque ultrices commodo metus in molestie. Proin lacinia nisl non massa pellentesque rhoncus.'}
					faIcon={faUniversity}
					reward={'defi-degen.eth'}
					progress={(0/11)*100}
					title={'DeFI'} />
			</div>
		</section>
	);
}

export default SectionCollections;