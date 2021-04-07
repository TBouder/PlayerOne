/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday April 6th 2021
**	@Filename:				DialogBatchClaim.js
******************************************************************************/

import	{useState, useEffect, useRef}		from	'react';
import	{useToasts}							from	'react-toast-notifications';
import	{Transition}						from	'@headlessui/react';
import	useUI								from	'contexts/useUI';

function	SectionHeader({count}) {
	function	DialogIcon() {
		return (
			<svg className={'h-6 w-6 text-teal-600'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
		);
	}

	return (
		<section
			aria-label={'batch-header'}
			className={'flex flex-row items-center justify-center bg-gray-50 sm:-mt-6 sm:-mx-6 p-4'}>
			<DialogIcon />
			<p className={'text-lg leading-6 font-medium text-gray-900 ml-3'} id={'modal-title'}>
				{`You can claim ${count} achievements !`}
			</p>
		</section>
	)
}

function	SectionBatchAchievements({expectedReward, achievementsToClaim}) {
	if (!achievementsToClaim) {
		return null;
	}
	return (
		<div className={'mt-4 px-4'}>
			<p className={'text-sm text-gray-500 text-left'}>
				{`You can batch claim the ${achievementsToClaim?.length || 0} following achievements to get a total of ${expectedReward || 0} RWD. Congratulation !`}
			</p>
			<ul className={'bg-gray-100 rounded-lg px-2 py-2 space-y-2 text-left my-4'}>
				{
					achievementsToClaim.map((achievement) => (
						<li key={achievement.key}>
							<p className={'text-sm text-gray-800 font-medium inline'}>{achievement.title}</p>
							<p className={'text-sm text-gray-500 inline'}>{' - '}</p>
							<p className={'text-xs text-gray-500 italic inline'}>{achievement.description}</p>
						</li>
					))
				}
			</ul>
		</div>
	);
}

function	SectionButtons({set_modalOpen, achievementsToClaim, actions}) {
	const	STATUS = {UNDEFINED: 0, PENDING: 1, UNLOCKED: 2};
	const	{confetti} = useUI();
	const	{addToast} = useToasts();
	const	[buttonStatus, set_buttonStatus] = useState(STATUS.UNDEFINED);

	function	onBatchClaim(e) {
		e.preventDefault();
		if (buttonStatus === STATUS.PENDING) {
			return;
		}
		if (buttonStatus === STATUS.UNLOCKED) {
			confetti.set({active: true, x: e.pageX, y: e.pageY});
			return;
		}

		set_buttonStatus(STATUS.PENDING);
		try {
			actions.claimMultiple(achievementsToClaim.map(e => e.key), ({status}) => {
				if (status === 'SUCCESS') {
					actions.setAsClaimed(achievementsToClaim)
					set_buttonStatus(STATUS.UNLOCKED);
					confetti.set({active: true, x: e.pageX, y: e.pageY});
					setTimeout(() => {
						set_modalOpen(false);
						set_buttonStatus(STATUS.UNDEFINED);
					}, 1000);
				} else if (status === 'ERROR') {
					set_buttonStatus(STATUS.UNDEFINED);
				}
			})
		} catch (error) {
			addToast(error?.response?.data?.error || error.message, {appearance: 'error'});
			set_buttonStatus(STATUS.UNDEFINED);
			return console.error(error.message);
		}
	}

	return (
		<div className={'mt-5 flex flex-col items-center'}>
			<button
				autoFocus
				onClick={onBatchClaim}
				type={'button'}
				disabled={buttonStatus === STATUS.PENDING}
				className={`relative w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 sm:w-auto sm:text-sm ${buttonStatus === STATUS.PENDING ? 'cursor-wait' : 'cursor-pointer'}`}>
				{buttonStatus === STATUS.UNLOCKED ?
					'Congratulation ! 🎉' :
				buttonStatus === STATUS.UNDEFINED ?
					'Claim theses achievements !' :
				buttonStatus === STATUS.PENDING ?
					<>
						<p className={'opacity-0'}>{'Claim theses achievements'}</p>
						<div className={'flex flex-row justify-center items-center absolute inset-0'}>
							<div className={`w-2 h-2 rounded-full bg-white bg-opacity-80 animate-pulse`} />
							<div className={`w-2 h-2 rounded-full bg-white bg-opacity-80 animate-pulse mx-2`} style={{animationDelay: '1s'}} />
							<div className={`w-2 h-2 rounded-full bg-white bg-opacity-80 animate-pulse`} />
						</div>
					</>
				: null}
			</button>
			<button
				onClick={() => set_modalOpen(false)}
				type={'button'}
				className={'mt-2 w-full text-sm justify-center font-medium text-gray-400 hover:text-gray-900'}>
				{'Cancel'}
			</button>
		</div>
	);
}

function	DialogBatchClaim({claimables, achievements, actions, modalOpen, set_modalOpen}) {
	const	[achievementsToClaim, set_achievementsToClaim] = useState(undefined);
	const	[expectedReward, set_expectedReward] = useState(0);
	const	buttonRef = useRef();

	useEffect(() => {
		if (claimables && achievements) {
			const intersections = achievements.filter((achievement) => (
				claimables.findIndex(claimable => claimable.achievement === achievement.key) >= 0
			))
			set_achievementsToClaim(intersections);
			set_expectedReward((intersections.reduce((a, b) => a + b.reward, 0)) / 100)
		}
	}, [claimables, achievements])

	return (
		<>
			<div
				onClick={() => set_modalOpen(false)}
				className={`fixed z-20 inset-0 bg-gray-500 transition-opacity ${modalOpen ? 'opacity-75 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />
			<Transition
				className={'z-30'}
				show={modalOpen}
				unmount={false}
				enter={'transition ease-out duration-300'}
				enterFrom={'opacity-0'}
				enterTo={'opacity-100'}
				leave={'transition ease-in duration-200'}
				leaveFrom={'opacity-100'}
				leaveTo={'opacity-0'}>
				<div
					onClose={set_modalOpen}
					className={'fixed z-50 inset-0 pointer-events-none flex justify-center'}>
					<div className={'fixed top-32 pointer-events-auto'}>
						<div
							ref={buttonRef}
							className={'inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-xl sm:w-full sm:p-6'}>
							<SectionHeader
								count={achievementsToClaim?.length || 0} />
							<SectionBatchAchievements
								expectedReward={expectedReward}
								achievementsToClaim={achievementsToClaim} />
							<SectionButtons
								set_modalOpen={(_modalOpen) => set_modalOpen(_modalOpen)}
								achievementsToClaim={achievementsToClaim}
								actions={actions} />
						</div>
					</div>
				</div>
			</Transition>
		</>
	);
}

export default DialogBatchClaim;