/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				StatusButton.js
******************************************************************************/

import	useUI								from	'contexts/useUI';
import	ClaimableButton						from	'components/details/ClaimableButton';

function	StatusButton(props) {
	const	{confetti} = useUI();

	if (props.isClaimed) {
		return (
			<div
				onClick={(e) => {
					e.preventDefault();
					confetti.set({active: true, x: e.pageX, y: e.pageY});
				}}
				className={'relative mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md bg-white sm:w-auto text-base font-medium'}>
				<svg xmlns="http://www.w3.org/2000/svg" className={'w-4 h-4 text-accent-900'} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
				<span className={'text-gray-900 dark:text-white ml-2'}>{'Unlocked !'}</span>
			</div>
		);
	}
	if (props.unlocked) {
		return (
			<ClaimableButton onClaim={() => null} confetti={confetti} />
		)
	}
	return (
		<button
			className={'mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md bg-white sm:w-auto text-base font-medium text-gray-700 cursor-not-allowed'}>
			<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
			<span className={'ml-2'}>{'Locked'}</span>
		</button>
	)
}

export default StatusButton;