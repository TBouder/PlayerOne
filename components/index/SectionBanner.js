/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 23rd 2021
**	@Filename:				SectionBanner.js
******************************************************************************/

import	{useState, useRef}					from	'react';
import	ItemBannerSponsor					from	'components/index/ItemBanners/Sponsor';
import	ItemBannerUniswap					from	'components/index/ItemBanners/Uniswap';
import	ItemBannerWBTC						from	'components/index/ItemBanners/WBTC';
import	useUI								from	'contexts/useUI';
import	useAchievements						from	'contexts/useAchievements';
import	useInterval							from	'hook/useInterval';
import	useHover							from	'hook/useHover';

function	SectionBanner() {
	const	{confetti} = useUI();
	const	{actions} = useAchievements();
	const	firstBannerRef = useRef();
	const	secondBannerRef = useRef();
	const	thirdBannerRef = useRef();
	const	[hoverRef, isHover] = useHover();
	const	[intervalStep, set_intervalStep] = useState(0);
	const	[currentStep, set_currentStep] = useState(0);
	const	[isClaiming, set_isClaiming] = useState(false);
	const	firstClassName = 'absolute inset-0 rounded-lg shadow-xl overflow-hidden w-full uniswapGradient';
	const	secondClassName = 'absolute inset-0 rounded-lg shadow-xl overflow-hidden w-full bg-accent-900';
	const	thirdClassName = 'absolute inset-0 rounded-lg shadow-xl overflow-hidden w-full wbtcGradient';

	// useInterval(() => {
	// 	if (!isHover && !isClaiming)
	// 		triggerStep(currentStep, intervalStep);
	// }, 400, true, [isHover, isClaiming]);

	function	triggerStep(_currentStep, _intervalStep) {
		if (_intervalStep === 20) {
			firstBannerRef.current.className = `${firstClassName} animate-slide-out-left bannerStateOffLeft`;
			set_intervalStep(i => i + 1);
		} else if (_intervalStep === 21) {
			secondBannerRef.current.className = `${secondClassName} animate-slide-in-right pointer-event-auto z-10`;
			set_currentStep(1);
			set_intervalStep(i => i + 1);
		} else if (_intervalStep === 41) {
			setTimeout(() => secondBannerRef.current.className = `${secondClassName} animate-slide-out-left bannerStateOffLeft`, 0);
			set_intervalStep(i => i + 1);
		} else if (_intervalStep === 42) {
			setTimeout(() => thirdBannerRef.current.className = `${thirdClassName} animate-slide-in-right pointer-event-auto z-10`, 0);
			set_currentStep(2);
			set_intervalStep(i => i + 1);
		} else if (_intervalStep === 61) {
			setTimeout(() => thirdBannerRef.current.className = `${thirdClassName} animate-slide-out-left bannerStateOffLeft`, 0);
			set_intervalStep(i => i + 1);
		} else if (_intervalStep === 62) {
			firstBannerRef.current.className = `${firstClassName} animate-slide-in-right pointer-event-auto z-10`;
			set_currentStep(0);
			set_intervalStep(0);
		} else {
			set_intervalStep(i => i + 1);
		}
	}

	function	onClaim(achievementKey, callback) {
		set_isClaiming(true);
		actions.claim(achievementKey, (props) => {
			if (props.status === 'ERROR' || props.status === 'SUCCESS') {
				set_isClaiming(false);
			}
			callback(props);
		})
	}

	return (
		<section id={'preview'} aria-label={'preview'} className={'w-full z-10'}>
			<div ref={hoverRef} className={'relative h-80'}>
				<ItemBannerUniswap
					id={'Like a unicorn'}
					ref={firstBannerRef}
					achievementKey={'73676514052504261986825330636986845718420318140825453794724876113850676774808'}
					defaultClassName={firstClassName}
					onClaim={(callback) => onClaim('73676514052504261986825330636986845718420318140825453794724876113850676774808', callback)}
					confetti={confetti} />
				<ItemBannerSponsor
					id={'Sponsor'}
					ref={secondBannerRef}
					achievementKey={'10129071317085928672231597343656140796863069368282823987076694473609354742003'}
					defaultClassName={secondClassName}
					onClaim={(callback) => onClaim('10129071317085928672231597343656140796863069368282823987076694473609354742003', callback)}
					confetti={confetti} />
				<ItemBannerWBTC
					id={'One coin to rule them all'}
					ref={thirdBannerRef}
					achievementKey={'85104516872644109789153651723214403976812994108384631455702337152374087380959'}
					defaultClassName={thirdClassName}
					onClaim={(callback) => onClaim('85104516872644109789153651723214403976812994108384631455702337152374087380959', callback)}
					confetti={confetti} />
			</div>
			<div className={'w-full flex flex-row justify-center items-center h-12'}>
				<div
					className={'flex justify-center items-center p-2 cursor-pointer'}
					onClick={() => {
						set_isClaiming(false);
						if (currentStep === 1) {
							secondBannerRef.current.className = `${secondClassName} animate-slide-out-left bannerStateOffLeft`;
							setTimeout(() => set_intervalStep(62), 400);
						} else if (currentStep === 2) {
							set_intervalStep(61)
						}
					}}>
					<div className={`w-8 rounded transition-opacity h-1 ${currentStep === 0 ? 'bg-gray-400' : 'bg-gray-200'}`} />
				</div>
				<div
					className={'flex justify-center items-center p-2 mx-2 cursor-pointer'}
					onClick={() => {
						set_isClaiming(false);
						if (currentStep === 0) {
							set_intervalStep(20);
						} else if (currentStep === 2) {
							thirdBannerRef.current.className = `${thirdClassName} animate-slide-out-left bannerStateOffLeft`;
							setTimeout(() => set_intervalStep(21), 400);
						}
					}}>
					<div className={`w-8 rounded cursor-pointer transition-opacity h-1 ${currentStep === 1 ? 'bg-gray-400' : 'bg-gray-200'}`} />
				</div>
				<div
					className={'flex justify-center items-center p-2 cursor-pointer'}
					onClick={() => {
						set_isClaiming(false);
						if (currentStep === 0) {
							firstBannerRef.current.className = `${firstClassName} animate-slide-out-left bannerStateOffLeft`;
							setTimeout(() => set_intervalStep(42), 400);
						} else if (currentStep === 1) {
							set_intervalStep(41)
						}
					}}>
					<div className={`w-8 rounded cursor-pointer transition-opacity h-1 ${currentStep === 2 ? 'bg-gray-400' : 'bg-gray-200'}`} />
				</div>
			</div>

		</section>
	);
}

export default SectionBanner;