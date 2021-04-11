/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				ClaimableButton.js
******************************************************************************/

import	{useRef, useState}		from	'react';

function	ClaimableButton(props) {
	const	STATUS = {UNDEFINED: 0, PENDING: 1, UNLOCKED: 2};
	const	[buttonStatus, set_buttonStatus] = useState(0);
	const	buttonRef = useRef();

	function	onClick(e) {
		e.preventDefault();
		if (buttonStatus === STATUS.PENDING) {
			return;
		}
		if (buttonStatus === STATUS.UNLOCKED) {
			props.confetti.set({active: true, x: e.pageX, y: e.pageY});
			return;
		}

		set_buttonStatus(STATUS.PENDING);
		props.onClaim(({status}) => {
			if (status === 'SUCCESS') {
				set_buttonStatus(STATUS.UNLOCKED);
				props.confetti.set({active: true, x: e.pageX, y: e.pageY});
			} else if (status === 'ERROR') {
				set_buttonStatus(STATUS.UNDEFINED);
			}
		})
	}

	return (
		<button
			ref={buttonRef}
			onClick={onClick}
			disabled={buttonStatus === STATUS.PENDING}
			className={`relative mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md bg-white sm:w-auto text-base font-medium ${buttonStatus === STATUS.PENDING ? 'cursor-wait' : 'cursor-pointer'}`}>
			<p className={'flex items-center'} style={buttonStatus === STATUS.PENDING ? {opacity: 1} : {opacity: 1} }>
				{buttonStatus === STATUS.UNLOCKED ?
					<>
						<svg xmlns="http://www.w3.org/2000/svg" className={'w-4 h-4 text-accent-900'} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
						<span className={'ml-2 text-gray-900 dark:text-white font-medium'}>{'Unlocked !'}</span>
					</>
				: null}
				{buttonStatus === STATUS.UNDEFINED ?
					<>
						<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
						<span className={'ml-2 text-gray-700'}>{'Claim'}</span>
					</>
				: null}
			</p>
			{buttonStatus === STATUS.PENDING ?
				<>
					<svg className={'w-4 h-4 opacity-0'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
					<span className={'ml-2 opacity-0'}>{'Claim'}</span>
					<div className={'flex flex-row justify-center items-center absolute inset-0'}>
						<div className={`w-2 h-2 rounded-full bg-gray-700 animate-pulse`} />
						<div className={`w-2 h-2 rounded-full bg-gray-700 animate-pulse mx-2`} style={{animationDelay: '1s'}} />
						<div className={`w-2 h-2 rounded-full bg-gray-700 animate-pulse`} />
					</div>
				</>
			: null}
		</button>
	);
};

export default ClaimableButton;