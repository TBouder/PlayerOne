/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				Header.js
******************************************************************************/

function	PageHeader() {
	return (
		<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} style={{width: 'fit-content'}}>
			<div className={'text-center'}>
				<span className={'flex flex-row my-4 md:my-6 items-center justify-center leading-8 font-extrabold tracking-tight relative'} style={{fontFamily: '"Press Start 2P"', lineHeight: 'unset'}}>
					<p className={'text-playerone-gradient mr-0 tracking-wider md:tracking-extrem text-4xl sm:text-7xl'}>{'PLAYER'}</p>
					<p className={'text-accent-900 withNeon absolute -right-3 -bottom-7 md:-right-1 md:-bottom-16 text-6xl sm:text-9xl'} style={{fontFamily: 'Absolute Neon Script'}}>{'ONE'}</p>
				</span>
				<p className={'pt-8 my-4 max-w-2xl text-sm md:text-base text-gray-500 dark:text-dark-white dark:opacity-75 lg:mx-auto'}>
					{'Are you ready to claim your name ? Come and unlock unique achievements throughout your Degen life in the DEFI ecosystem, and become the first to get the golden Reward'}
				</p>
			</div>
		</header>
	);
}

export default PageHeader;