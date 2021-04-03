/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday April 3rd 2021
**	@Filename:				SectionHeader.js
******************************************************************************/

import	{useState}		from	'react';

function	SectionHeader() {
	const	[bg, set_bg] = useState('rgb(255,71,62)')
	const	[color, set_color] = useState(1)

	return (
		<section
			aria-label={'header'}
			className={'py-32 md:py-48 progressBarColor -mt-28 relative'}
			style={{background: bg}}
			onClick={() => {
				if (bg === 'rgb(255,71,62)') {
					set_bg('linear-gradient(42deg, rgba(255,191,50,1) 0%, rgba(255,179,49,1) 75%, rgba(255,156,45,1) 100%)')
					set_color(2)
				} else if (bg === 'linear-gradient(42deg, rgba(255,191,50,1) 0%, rgba(255,179,49,1) 75%, rgba(255,156,45,1) 100%)') {
					set_bg('#1B7340')
					set_color(3)
				} else if (bg === '#1B7340') {
					set_bg('#E9897E')
					set_color(4)
				} else if (bg === '#E9897E') {
					set_bg('#0072B5')
					set_color(5)
				} else if (bg === '#0072B5') {
					set_bg('#FDAC53')
					set_color(6)
				} else if (bg === '#FDAC53') {
					set_bg('#B55A30')
					set_color(7)
				} else {
					set_bg('rgb(255,71,62)')
					set_color(1)
				}
			}}
		>
			<ul className={'circles circlesMoreVisible pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<header className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
				<div className={'lg:text-center'}>
					<p className={'leading-8 font-extrabold tracking-tight text-white opacity-60 text-4xl'}>
						{'Greetings'}
					</p>
					<p className={'text-7xl font-extrabold tracking-tight text-white my-4 md:my-8'}>
						{'PLAYER ONE'}
					</p>
					<p className={'font-extrabold tracking-tight text-white opacity-60 text-4xl'}>
						{'Are you ready to claim your name ?'}
					</p>
					<p className={'font-extrabold tracking-tight text-white opacity-80 text-lg mt-6'}>
						{`Color #${color}`}
					</p>
				</div>
			</header>
			<div className="custom-shape-divider-bottom-1617443724">
				<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
				</svg>
			</div>
		</section>
	);
}
export default SectionHeader;