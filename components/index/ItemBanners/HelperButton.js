/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday March 24th 2021
**	@Filename:				HelperButton.js
******************************************************************************/

import	{useState, useEffect, useRef}			from	'react';

function HelperButton(props) {
	const	STATUS = {UNDEFINED: 0, PENDING: 1, UNLOCKED: 2};
	const	[buttonStatus, set_buttonStatus] = useState(props.defaultUnlocked ? 2 : 0);
	const	buttonRef = useRef();

	useEffect(() => {
		if (props.defaultUnlocked) {
			set_buttonStatus(2);
			const	elementPosition = buttonRef.current.getBoundingClientRect();
			props.confetti.set({active: true, x: elementPosition.left + (elementPosition.width / 2), y: elementPosition.top});
			setTimeout(() => props.confetti.set({active: false, x: elementPosition.left + (elementPosition.width / 2), y: elementPosition.top}), 100);
		}
	}, [props.defaultUnlocked])

	return (
		<button
			ref={buttonRef}
			onClick={({clientX, clientY}) => {
				if (buttonStatus === STATUS.PENDING) {
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
			disabled={buttonStatus === STATUS.PENDING}
			className={`mt-12 border border-solid border-opacity-0 rounded-lg shadow px-5 py-3 inline-flex items-center text-base bg-white ${props.textColor} font-medium relative  ${buttonStatus === STATUS.PENDING ? 'cursor-wait' : 'cursor-pointer'}`}>
			<p style={buttonStatus === STATUS.PENDING ? {opacity: 0} : {opacity: 1} }>
				{buttonStatus === STATUS.UNLOCKED ?
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