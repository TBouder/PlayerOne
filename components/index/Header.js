/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				Header.js
******************************************************************************/

function	PageHeader() {
	return (
		<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
			<div className={'lg:text-center'}>
				<p className={'text-3xl leading-8 font-extrabold tracking-tight text-gray-900 text-gradient sm:text-4xl'}>
					{'No more unknow. So much wow.'}
				</p>
				<p className={'mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'}>
					{'Unlock unique achievements throughout your Degen life in the DEFI ecosystem, and become the first to get the golden Reward'}
				</p>
			</div>
		</header>
	);
}

export default PageHeader;