/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday April 3rd 2021
**	@Filename:				SectionHeader.js
******************************************************************************/

function	SectionHeader({slug}) {
	return (
		<section
			aria-label={'header'}
			className={'py-32 md:py-48 bg-white dark:bg-dark-background-900 bg-playerone-gradient -mt-24 md:-mt-28 relative'}>
			<ul className={'circles circlesMoreVisible pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<header className={'pt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center'}>
				<div className={'text-center'}>
					<p className={'leading-8 font-extrabold tracking-tight text-white dark:text-dark-white opacity-60 text-xl md:text-4xl'}>
						{'Select your'}
					</p>
					<p className={'text-3xl sm:text-5xl leading-8 font-extrabold tracking-tight text-white my-4 md:my-8 mr-6'} style={{fontFamily: '"Press Start 2P"'}}>
						{slug}
					</p>
					<p className={'font-extrabold tracking-tight text-white dark:text-dark-white opacity-60 text-xl md:text-4xl'}>
						{'And go get it !'}
					</p>
				</div>
			</header>
		</section>
	);
}

function	SectionHeaderNew({slug}) {
	return (
		<section
			aria-label={'header'}
			className={'py-32 md:py-48 bg-white dark:bg-dark-background-900 bg-playerone-gradient -mt-24 md:-mt-28 relative'}>
			<ul className={'circles circlesMoreVisible pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<header className={'pt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3'}>
				<div className={'text-left col-span-1'}>
					<p className={'leading-8 font-extrabold tracking-tight text-white dark:text-dark-white opacity-60 text-xl md:text-4xl'}>
						{'Select your'}
					</p>
					<p className={'text-3xl sm:text-5xl leading-8 font-extrabold tracking-tight text-white my-4 md:my-8 mr-6'} style={{fontFamily: '"Press Start 2P"'}}>
						{slug}
					</p>
					<p className={'font-extrabold tracking-tight text-white dark:text-dark-white opacity-60 text-xl md:text-4xl'}>
						{'And go get it !'}
					</p>
				</div>
				<div className={'col-span-1'} />
				<div className={'h-full dark:bg-dark-background-600 w-full rounded-md col-span-1 z-10'}>
				</div>
			</header>
		</section>
	);
}
export default SectionHeader;