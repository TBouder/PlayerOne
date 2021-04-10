/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				Header.js
******************************************************************************/

function	PageHeader() {
	return (
		<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} style={{width: 'fit-content'}}>
			<div className={'lg:text-center'}>
				<p className={'text-3xl leading-8 font-extrabold tracking-tight text-gradient sm:text-5xl my-4 md:my-8'} style={{fontFamily: '"Press Start 2P"'}}>
					{'PLAYER ONE'}
				</p>
				<p className={'mt-4 max-w-2xl text-xl text-gray-500 dark:text-dark-white lg:mx-auto'}>
					{'Are you ready to claim your name ? Come and unlock unique achievements throughout your Degen life in the DEFI ecosystem, and become the first to get the golden Reward'}
				</p>
			</div>
		</header>
	);
}

export default PageHeader;