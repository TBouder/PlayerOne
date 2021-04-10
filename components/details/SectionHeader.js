/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				PageHeader.js
******************************************************************************/

import	FullConfetti						from	'react-confetti';
import	StatusButton						from	'components/details/StatusButton';

function	PageHeader({achievement, isClaimed}) {
	return (
		<section
			aria-label={'header'}
			className={'py-32 md:py-48 bg-playerone -mt-28 relative'}
			style={{background: achievement.background}}>
			<ul className={'circles circlesMoreVisible pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
				<div className={'lg:text-center'}>
					<p className={'text-7xl font-extrabold tracking-tight text-white my-4 md:my-8'}>
						{achievement.title}
					</p>
					<p className={'font-extrabold tracking-tight text-white opacity-60 text-4xl'}>
						{achievement.description}
					</p>
					<p className={'leading-8 font-extrabold tracking-tight text-white opacity-60 text-4xl'}>
						&nbsp;
					</p>
				</div>
			</header>
			{isClaimed ? <FullConfetti
				width={typeof(window) !== 'undefined' && window.innerWidth || 1920}
				height={592} /> : null}
		</section>
	);


	return (
		<header className={'pt-14'} style={{background: achievement.background}}>
			<div className={'max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'}>
				<div className={'pt-12 pb-36'}>
					<div className={'mx-auto px-4 sm:px-6 lg:px-8'}>
						<div className={'max-auto px-12 w-auto text-center'}>
							<h1 className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'}>
								{achievement.title}
							</h1>
							<p className={'mt-4 max-w-2xl text-xl text-white text-opacity-80 lg:mx-auto'}>
								{achievement.description}
							</p>
							<StatusButton {...achievement} isClaimed={isClaimed} />
						</div>
					</div>
		  		</div>
			</div>
			{isClaimed ? <FullConfetti
				width={typeof(window) !== 'undefined' && window.innerWidth || 1920}
				height={358} /> : null}
	  </header>
	);
}

export default PageHeader;