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
					setTimeout(() => confetti.set({active: false, x: e.pageX, y: e.pageY}), 100);
				}}
				className={'relative mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md bg-white sm:w-auto text-base font-medium'}>
				<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="url(#gradient)"><linearGradient id="gradient"><stop offset="0%" stopColor={'rgba(20,184,166,1)'} /><stop offset="50%" stopColor={'rgba(139,92,246,1)'} /><stop offset="100%" stopColor={'rgba(236,72,153,1)'} /></linearGradient><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
				</svg>
				<span className={'text-gradient ml-2'}>{'Unlocked !'}</span>
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