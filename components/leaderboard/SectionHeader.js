/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday April 3rd 2021
**	@Filename:				SectionHeader.js
******************************************************************************/

function	SectionHeader() {
	return (
		<section
			aria-label={'header'}
			className={'py-32 md:py-48 bg-playerone-gradient -mt-28 relative'}>
			<ul className={'circles circlesMoreVisible pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<header className={'pt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
				<div className={'lg:text-center'}>
					<p className={'leading-8 font-extrabold tracking-tight text-white dark:text-dark-white opacity-60 text-4xl'}>
						{'Greetings'}
					</p>
					<span className={'flex flex-row items-center justify-center'}>
						<p className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-5xl my-4 md:my-8 mr-6'} style={{fontFamily: '"Press Start 2P"'}}>
							{'PLAYER'}
						</p>
						<p className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-5xl my-4 md:my-8'} style={{fontFamily: '"Press Start 2P"'}}>
							{'ONE'}
						</p>
					</span>
					<p className={'font-extrabold tracking-tight text-white dark:text-dark-white opacity-60 text-4xl'}>
						{'Are you ready to claim your name ?'}
					</p>
				</div>
			</header>
		</section>
	);
}
export default SectionHeader;