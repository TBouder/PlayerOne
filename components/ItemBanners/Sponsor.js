/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 23rd 2021
**	@Filename:				Uniswap.js
******************************************************************************/

import	{forwardRef}					from	'react';
import	{faMedal}						from	'@fortawesome/free-solid-svg-icons'
import	{FontAwesomeIcon}				from	'@fortawesome/react-fontawesome'

const	ItemBannerSponsor = forwardRef((props, ref) => {
	return (
		<div id={'bannerRef-Sponsor'} ref={ref} className={`${props.defaultClassName} bannerInitialStateOff`}>
			<ul className={'circles pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<div className={'col-span-2 pt-8 pb-8 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0'}>
				<h2 className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'}>
					<span className={'block'}>{'Sponsor'}</span>
				</h2>
				<p className={'mt-4 text-lg text-white text-opacity-80'}>
					{'Send us token, and become one of our sponsor.'}
				</p>
				<button
					onClick={({clientX, clientY}) => {
						props.confetti.set({active: true, x: clientX, y: clientY});
						setTimeout(() => props.confetti.set({active: false, x: clientX, y: clientY}), 100);
					}}
					className={'mt-12 border border-solid border-opacity-0 rounded-lg shadow px-5 py-3 inline-flex items-center text-base bg-white text-teal-700 font-medium hover:bg-teal-50 hover:text-teal-700 cursor-pointer'}>
						{'Claim this achievement !'}
				</button>
			</div>
			<div className={'flex justify-center items-center col-span-1'}>
				<FontAwesomeIcon
					style={{width: 160, height: 160}}
					className={'text-white'}
					icon={faMedal} />
			</div>
		</div>
	);
});

export default ItemBannerSponsor;