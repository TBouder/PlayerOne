/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday March 24th 2021
**	@Filename:				HelperButton.js
******************************************************************************/

import	{useState, useEffect, useRef}			from	'react';
import	useAchievements							from	'contexts/useAchievements';
import	useWeb3									from	'contexts/useWeb3';

function HelperButton(props) {
	const	STATUS = {CONNECT: -2, LOCKED: -1, UNDEFINED: 0, PENDING: 1, UNLOCKED: 2};
	const	{active, connect, walletType} = useWeb3();
	const	{achievements, achievementsNonce} = useAchievements();
	const	[buttonStatus, set_buttonStatus] = useState(props.defaultClaimed ? 2 : -2);
	const	buttonRef = useRef();

	useEffect(() => {
		if (!active) {
			set_buttonStatus(STATUS.CONNECT);
		} else if (props.defaultClaimed) {
			set_buttonStatus(STATUS.UNLOCKED);
			// const	elementPosition = buttonRef.current.getBoundingClientRect();
			// props.confetti.set({active: true, x: elementPosition.left + (elementPosition.width / 2), y: elementPosition.top});
		} else if (achievements) {
			const	currentAchievement = achievements.find(e => e.key === props.achievementKey);
			if (currentAchievement) {
				const	isUnlocked = currentAchievement.unlocked;
				if (!isUnlocked)
					set_buttonStatus(STATUS.LOCKED);
				else 
					set_buttonStatus(props.defaultClaimed ? STATUS.UNLOCKED : STATUS.UNDEFINED);
			}
		}
	}, [props.defaultClaimed, active, achievementsNonce, achievements])

	return (
		<button
			ref={buttonRef}
			onClick={({clientX, clientY}) => {
				if (buttonStatus === STATUS.CONNECT) {
					return connect(walletType.METAMASK)
				}

				if (buttonStatus === STATUS.PENDING || buttonStatus === STATUS.LOCKED || buttonStatus === STATUS.CONNECT) {
					return;
				}
				if (buttonStatus === STATUS.UNLOCKED) {
					props.confetti.set({active: true, x: clientX, y: clientY});
					return;
				}

				set_buttonStatus(STATUS.PENDING);
				props.onClaim(({status}) => {
					if (status === 'SUCCESS') {
						set_buttonStatus(STATUS.UNLOCKED);
						props.confetti.set({active: true, x: clientX, y: clientY});
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