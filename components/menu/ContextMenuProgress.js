/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday April 6th 2021
**	@Filename:				ContextMenuProgress.js
******************************************************************************/

import	{useState}			from	'react';
import	{Transition}		from	'@headlessui/react';
import	useAchievements		from	'contexts/useAchievements';
import	DialogBatchClaim	from	'components/menu/DialogBatchClaim';

function	ContextItemClaimed({count}) {
	return (
		<li className={'px-2 py-2 text-gray-400 flex items-center hover:bg-gray-200 hover:text-gray-800 cursor-pointer'}>
			<svg xmlns="http://www.w3.org/2000/svg" className={'h-4 w-4 inline'} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
			<p className={'ml-2 text-sm inline'}>
				{`${count} claimed`}
			</p>
		</li>
	);
}

function	ContextItemClaimable({set_modalOpen, count}) {
	return (
		<li
			onClick={() => set_modalOpen(true)}
			className={'px-2 py-2 text-gray-400 flex items-center hover:bg-gray-200 hover:text-gray-800 cursor-pointer relative'}>
			<svg xmlns="http://www.w3.org/2000/svg" className={'h-4 w-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
			<p className={'ml-2 text-sm inline'}>
				{`${count} claimable`}
			</p>
			{count > 0 ? <span className={'flex absolute h-3 w-3 right-0 mr-2'}>
				<span className={'animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75'} />
				<span className={'relative inline-flex rounded-full h-3 w-3 bg-teal-500'} />
			</span> : null}
		</li>
	);
}

function	ContextItemLocked({count}) {
	return (
		<li className={'px-2 py-2 text-gray-400 flex items-center hover:bg-gray-200 hover:text-gray-800 cursor-pointer'}>
			<svg xmlns="http://www.w3.org/2000/svg" className={'h-4 w-4 inline'} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
			<p className={'ml-2 text-sm inline'}>
				{`${count} locked`}
			</p>
		</li>
	);
}

function	ContextMenuProgress({claims, claimables, achievements, set_modalOpen}) {
	return (
		<div className={'absolute z-10 left-1/2 transform -translate-x-1/2 mt-6 px-2 w-full max-w-xs sm:px-0'}>
			<div className={'rounded-md shadow-lg border-gray-200 border-solid border overflow-hidden'}>
				<div className={'relative grid gap-2 bg-white'}>
					<div>
						<div className={'bg-teal-600 px-2 py-2 flex flex-row justify-between items-center'}>
							<p className={'font-medium text-sm text-white'}>{'Achievements'}</p>
							<svg xmlns="http://www.w3.org/2000/svg" className={'h-4 w-4 text-white animate-wobble-hor-bottom cursor-pointer'} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" /><path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" /></svg>
						</div>
						<div>
							<ul>
								<ContextItemClaimed
									count={claims?.length || 0} />
								<ContextItemClaimable
									count={claimables?.length || 0}
									set_modalOpen={set_modalOpen} />
								<ContextItemLocked
									count={(achievements?.length || 0) - (claims?.length || 0) - (claimables?.length || 0)} />
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function	ContextMenuProgressController({open, set_open}) {
	const	{claims, claimables, achievements, actions} = useAchievements()
	const	[modalOpen, set_modalOpen] = useState(false)
	
	return (
		<>
			<Transition
				show={open}
				enter={'transition ease-out duration-200'}
				enterFrom={'opacity-0 translate-y-1'}
				enterTo={'opacity-100 translate-y-0'}
				leave={'transition ease-in duration-150'}
				leaveFrom={'opacity-100 translate-y-0'}
				leaveTo={'opacity-0 translate-y-1'}>
				<ContextMenuProgress
					claims={claims}
					claimables={claimables}
					achievements={achievements}
					set_modalOpen={set_modalOpen} />
			</Transition>
			<DialogBatchClaim
				actions={actions}
				claimables={claimables}
				achievements={achievements}
				modalOpen={modalOpen}
				set_modalOpen={set_modalOpen} />
		</>
	);
}

export default ContextMenuProgressController;