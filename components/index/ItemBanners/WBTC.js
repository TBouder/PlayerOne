/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 23rd 2021
**	@Filename:				WBTC.js
******************************************************************************/

import	{forwardRef}					from	'react';
import	{FontAwesomeIcon}				from	'@fortawesome/react-fontawesome'
import	{faBitcoin}						from	'@fortawesome/free-brands-svg-icons';
import	HelperButton					from	'components/index/ItemBanners/HelperButton';

const	ItemBannerWBTC = forwardRef((props, ref) => {
	return (
		<div id={'bannerRef-Wbtc'} ref={ref} className={`${props.defaultClassName} bannerInitialStateOff`}>
			<ul className={'circles pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<div className={'col-span-3 md:col-span-2 pt-8 pb-8 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0'}>
				<h2 className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'}>
					<span className={'block'}>{'One coin to rule them all'}</span>
				</h2>
				<p className={'mt-4 text-lg text-white text-opacity-80'}>
					{'Get at least 0.001 wBTC in your wallet.'}
				</p>
				<div className={'flex md:block justify-center items-center'}>
					<HelperButton
						bgColor={'bg-bitcoin-initial'}
						textColor={'text-bitcoin-initial'}
						achievementKey={props.achievementKey}
						defaultClaimed={props.defaultClaimed}
						onClaim={props.onClaim}
						confetti={props.confetti} />
				</div>
			</div>
			<div className={'hidden md:flex justify-center items-center col-span-1'}>
				<FontAwesomeIcon
					style={{width: 160, height: 160}}
					className={'text-white'}
					icon={faBitcoin} />
			</div>
		</div>
	);
});

export default ItemBannerWBTC;