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
				<span className={'flex flex-row my-4 md:my-6 items-center justify-center text-playerone-gradient text-3xl sm:text-5xl leading-8 font-extrabold tracking-tight'} style={{fontFamily: '"Press Start 2P"'}}>
					<p className={'mr-6'}>{'PLAYER'}</p>
					<p className={''}>{'ONE'}</p>
				</span>
				<p className={'my-4 max-w-2xl text-sm md:text-base text-gray-500 dark:text-dark-white dark:opacity-75 lg:mx-auto'}>
					{'Are you ready to claim your name ? Come and unlock unique achievements throughout your Degen life in the DEFI ecosystem, and become the first to get the golden Reward'}
				</p>
			</div>
		</header>
	);
}

export default PageHeader;