/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 23rd 2021
**	@Filename:				Uniswap.js
******************************************************************************/

import	{forwardRef}					from	'react';
import	Image							from	'next/image';

const	ItemBannerUniswap = forwardRef((props, ref) => {
	return (
		<div id={'bannerRef-Uniswap'} ref={ref} className={`${props.defaultClassName} bannerInitialState`}>
			<ul className={'circles pointer-events-none'}><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
			<div className={'col-span-3 md:col-span-2 pt-8 pb-8 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0'}>
				<h2 className={'text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'}>
					<span className={'block'}>{'Like a Unicorn'}</span>
				</h2>
				<p className={'mt-4 text-lg text-white text-opacity-80'}>
					{'Receive an airdrop from Uniswap'}
				</p>
				<div className={'flex md:block justify-center items-center'}>
					<button
						onClick={({clientX, clientY}) => {
							props.confetti.set({active: true, x: clientX, y: clientY});
							setTimeout(() => props.confetti.set({active: false, x: clientX, y: clientY}), 100);
						}}
						className={'mt-12 border border-solid border-opacity-0 rounded-lg shadow px-5 py-3 inline-flex items-center text-base bg-white text-uniswap-pink font-medium cursor-pointer'}>
						{'Claim this achievement !'}
					</button>
				</div>
			</div>
			<div className={'hidden md:flex justify-center items-center col-span-1'}>
				<Image
					src={'/uniswap.svg'}
					alt={'uniswap'}
					width={220}
					height={220} />
			</div>
		</div>
	);
});

export default ItemBannerUniswap;