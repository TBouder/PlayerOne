/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 23rd 2021
**	@Filename:				Uniswap.js
******************************************************************************/

import	{forwardRef}					from	'react';
import	{faMedal}						from	'@fortawesome/free-solid-svg-icons'
import	{FontAwesomeIcon}				from	'@fortawesome/react-fontawesome'
import	HelperButton					from	'components/index/ItemBanners/HelperButton';

const	ItemBannerSponsor = forwardRef((props, ref) => {
	return (
		<div id={'bannerRef-Sponsor'} ref={ref} className={`${props.defaultClassName} bannerInitialStateOff`}>
			<ul className={'circles pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<div className={'col-span-3 md:col-span-2 pt-8 pb-8 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0'}>
				<h2 className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'}>
					<span className={'block'}>{'Sponsor'}</span>
				</h2>
				<p className={'mt-4 text-lg text-white text-opacity-80'}>
					{'Send us token, and become one of our sponsor.'}
				</p>
				<div className={'flex md:block justify-center items-center'}>
					<HelperButton
						bgColor={'bg-teal-700'}
						textColor={'text-teal-700'}
						defaultClaimed={props.defaultClaimed}
						onClaim={props.onClaim}
						confetti={props.confetti} />
				</div>
			</div>
			<div className={'justify-center items-center col-span-1 hidden md:flex'}>
				<FontAwesomeIcon
					style={{width: 160, height: 160}}
					className={'text-white'}
					icon={faMedal} />
			</div>
		</div>
	);
});

export default ItemBannerSponsor;