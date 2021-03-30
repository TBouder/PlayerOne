/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday March 24th 2021
**	@Filename:				HelperButton.js
******************************************************************************/

import	{useState, useEffect, useRef}			from	'react';
import	useAchievements							from	'contexts/useAchievements';
import	useWeb3									from	'contexts/useWeb3';
import	{useWeb3React}							from	'dependencies/@web3-react/core';

function HelperButton(props) {
	const	STATUS = {CONNECT: -2, LOCKED: -1, UNDEFINED: 0, PENDING: 1, UNLOCKED: 2};
	const	{achievements, achievementsNonce} = useAchievements();
	const	{address} = useWeb3();
	const	[buttonStatus, set_buttonStatus] = useState(props.defaultClaimed ? 2 : -2);
	const	buttonRef = useRef();
	const	web3React = useWeb3React()

	// useEffect(() => {
	// 	if (props.defaultClaimed) {
	// 		set_buttonStatus(STATUS.UNLOCKED);
	// 		const	elementPosition = buttonRef.current.getBoundingClientRect();
	// 		props.confetti.set({active: true, x: elementPosition.left + (elementPosition.width / 2), y: elementPosition.top});
	// 		setTimeout(() => props.confetti.set({active: false, x: elementPosition.left + (elementPosition.width / 2), y: elementPosition.top}), 100);
	// 	}
	// }, [props.defaultClaimed])

	// useEffect(() => {
	// 	if (achievements) {
	// 		const	currentAchievement = achievements.find(e => e.key === props.achievementKey);
	// 		if (currentAchievement) {
	// 			const	isUnlocked = currentAchievement.unlocked;
	// 			if (!isUnlocked)
	// 				set_buttonStatus(STATUS.LOCKED);
	// 			else 
	// 				set_buttonStatus(props.defaultClaimed ? STATUS.UNLOCKED : STATUS.UNDEFINED);
	// 		}
	// 	}
	// }, [achievementsNonce, achievements, props.defaultClaimed]);

	useEffect(() => {
			set_buttonStatus(STATUS.CONNECT);
		if (!address) {
			set_buttonStatus(STATUS.CONNECT);
		}
	}, [address])

	return (
		<button
			ref={buttonRef}
			onClick={({clientX, clientY}) => {
				if (buttonStatus === STATUS.CONNECT) {
					// web3React.activate()
				}


				if (buttonStatus === STATUS.PENDING || buttonStatus === STATUS.LOCKED || buttonStatus === STATUS.CONNECT) {
					return;
				}
				if (buttonStatus === STATUS.UNLOCKED) {
					props.confetti.set({active: true, x: clientX, y: clientY});
					setTimeout(() => props.confetti.set({active: false, x: clientX, y: clientY}), 100);
					return;
				}

				set_buttonStatus(STATUS.PENDING);
				props.onClaim(({status}) => {
					if (status === 'SUCCESS') {
						set_buttonStatus(STATUS.UNLOCKED);
						props.confetti.set({active: true, x: clientX, y: clientY});
						setTimeout(() => props.confetti.set({active: false, x: clientX, y: clientY}), 100);
					} else if (status === 'ERROR') {
						set_buttonStatus(STATUS.UNDEFINED);
					}
				})
			}}
			disabled={buttonStatus === STATUS.PENDING || buttonStatus === STATUS.LOCKED}
			className={`mt-12 border border-solid border-opacity-0 rounded-lg shadow px-5 py-3 inline-flex items-center text-base bg-white ${props.textColor} font-medium relative  ${buttonStatus === STATUS.PENDING ? 'cursor-wait' : buttonStatus === STATUS.LOCKED ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
			<p style={buttonStatus === STATUS.PENDING ? {opacity: 0} : {opacity: 1} }>
				{buttonStatus === STATUS.CONNECT ?
					'Please connect your wallet' :
				buttonStatus === STATUS.LOCKED ?
					'Achievement locked' :
				buttonStatus === STATUS.UNLOCKED ?
					'Congratulations! You\'ve unlocked this achievement! 🎉' :
					'Claim this achievement !'
				}
			</p>
			{buttonStatus === STATUS.PENDING ?
				<div className={'flex flex-row justify-center items-center absolute inset-0'}>
					<div className={`w-2 h-2 rounded-full ${props.bgColor} animate-pulse`} />
					<div className={`w-2 h-2 rounded-full ${props.bgColor} animate-pulse mx-2`} style={{animationDelay: '1s'}} />
					<div className={`w-2 h-2 rounded-full ${props.bgColor} animate-pulse`} />
				</div>
			: null}
		</button>
	);
};

export default HelperButton;