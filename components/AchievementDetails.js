/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 9th 2021
**	@Filename:				AchievementDetails.js
******************************************************************************/

import	{useRef}							from	'react';
import	{Transition}						from	'@headlessui/react';
import	useOnClickOutside					from	'hook/useOnClickOutside';
import	useLockBodyScroll					from	'hook/useLockBodyScroll';

function	AchievementDetails({details, set_details}) {
	const	refOutside = useRef();
	
	useOnClickOutside(refOutside, () => set_details({open: false}));
	useLockBodyScroll(details.open);

	if (!details.open) {
		return null;
	}
	return (
		<div className={'fixed inset-0 -bottom-20 bg-gray-400 bg-opacity-60 z-50'}>
			<Transition
				show={details.open}
				enter={'transition ease-out duration-200'}
				enterFrom={'opacity-0 translate-y-1'}
				enterTo={'opacity-100 translate-y-0'}
				leave={'transition ease-in duration-150'}
				leaveFrom={'opacity-100 translate-y-0'}
				leaveTo={'opacity-0 translate-y-1'}>
				<div
					ref={refOutside}
					className={'flex w-full lg:w-3/4 px-6 lg:px-0 h-full justify-center mx-auto z-50 mt-10 lg:mt-20'}>
					<div className={'rounded-lg shadow-lg w-full overflow-scroll lg:overflow-hidden lg:h-5/6'} style={{maxHeight: '80vh'}}>
						<div className={'px-4 py-5 flex justify-center items-center sm:px-6'} style={{background: details.background}}>
							<div className={'flex justify-center items-center w-16 h-16 rounded-full shadow-lg text-3xl'} style={{background: 'rgba(255, 255, 255, 0.9)'}}>
								{details.icon}
							</div>
						</div>
						<dl className={'relative grid gap-6 grid-cols-1 lg:grid-cols-2 bg-white px-4 py-6 lg:h-50vh'}>
							<div className={'w-full h-full max-h-56 lg:max-h-full'}>
								<div className={'w-full h-full relative'}>
									<img
										className={'w-full h-full rounded'}
										style={{objectFit: 'cover'}}
										src={`https://source.unsplash.com/random?key=${details.informations.hash}`} />
									<div className={'absolute bottom-4 right-4 bg-white px-2 py-1 rounded'}>
										<p className={'text-gradient text-xs inline'}>
											<b>{'42'}</b>
											{'/183'}
										</p>
									</div>
									<div className={'absolute inset-2 rounded border border-solid border-white'} />
									<div style={{borderWidth: 9}} className={'absolute inset-0 rounded border-solid border-white border-opacity-60'} />
								</div>
							</div>
							<div>
								<div className={'mb-4'}>
									<dt className={'text-xs text-gray-400 font-all-small-caps'}>
										{'Achievement title'}
									</dt>
									<dd className={'mt-0.5 text-sm font-bold text-gray-800'}>
										{details.title}
									</dd>
								</div>
								<div className={'mb-4'}>
									<dt className={'text-xs font-medium text-gray-400 font-all-small-caps'}>
										{'Description'}
									</dt>
									<dd className={'mt-0.5 text-sm text-gray-800'}>
										{details.description}
									</dd>
								</div>
								<div className={'mb-4'}>
									<dt className={'text-xs font-medium text-gray-400 font-all-small-caps'}>
										{'Unlock date'}
									</dt>
									<dd className={'mt-0.5 text-sm text-gray-800 hover:underline'}>
										<a target={'_blank'} href={`https://etherscan.io/block/${details.informations.blockNumber}`}>
											{`Achievement unlocked on ${new Date(details.informations.timestamp).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})} at block ${details.informations.blockNumber}`}
										</a>
									</dd>
								</div>
								<div className={'mb-4'}>
									<dt className={'text-xs font-medium text-gray-400 font-all-small-caps'}>
										{'Details'}
									</dt>
									<dd className={'mt-0.5 text-sm text-gray-800'}>
										<p className={'mb-1'}>
											{'Vehicula ipsum a arcu cursus. Volutpat ac tincidunt vitae semper quis lectus nulla.'}
										</p>
										<p>
											{'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
										</p>
									</dd>
								</div>
							</div>
						</dl>
					</div>
				</div>
			</Transition>
			<div className={'fixed top-3 right-6'}>
				<svg className={'text-white w-8 h-8 cursor-pointer'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
			</div>
		</div>
	)
}

export default AchievementDetails;