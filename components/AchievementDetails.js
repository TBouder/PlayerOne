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

	// if (!details.open) {
	// 	return null;
	// }
	return (
		<div
			className={`absolute inset-0 max-w-full flex ${details.open ? 'pointer-events-auto' : 'pointer-events-none'}`}
			aria-labelledby={'slide-over-heading'}>
			<Transition
				show={details.open}
				unmount={false}
				enter={'transform transition ease-in-out duration-500 sm:duration-700'}
				enterFrom={'translate-y-full'}
				enterTo={'translate-y-0'}
				leave={'transform transition ease-in-out duration-500 sm:duration-700'}
				leaveFrom={'translate-y-0'}
				leaveTo={'translate-y-full'}>
				<div ref={refOutside} className={'flex w-full h-full justify-center mx-auto z-50 mt-14'}>
					<div className={'bg-white shadow-lg'}>
						<div className={'w-full overflow-hidden'}>
							<div className={'relative px-4 py-5 flex justify-center items-center sm:px-6 bg-gray-200 border-bottom border-gray-200'}>
								<div
									className={'flex justify-center items-center w-16 h-16 rounded-full shadow-lg text-3xl'}
									style={{background: 'rgba(255, 255, 255, 0.9)'}}>
									{details?.icon}
								</div>

								<div onClick={() => set_details({open: false})} className={'absolute top-0 bottom-0 right-6 flex items-center z-20'}>
									<svg className={'text-gray-600 w-8 h-8 cursor-pointer'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
								</div>
							</div>
							<dl className={'relative grid gap-6 grid-cols-1 lg:grid-cols-2 bg-white px-4 py-6 lg:h-50vh'}>
								<div className={'w-full h-full max-h-56 lg:max-h-full'}>
								</div>
								<div>
									<div className={'mb-4'}>
										<dt className={'text-xs text-gray-400 font-all-small-caps'}>
											{'Achievement title'}
										</dt>
										<dd className={'mt-0.5 text-sm font-bold text-gray-800'}>
											{details?.title}
										</dd>
									</div>
									<div className={'mb-4'}>
										<dt className={'text-xs font-medium text-gray-400 font-all-small-caps'}>
											{'Description'}
										</dt>
										<dd className={'mt-0.5 text-sm text-gray-800'}>
											{details?.description}
										</dd>
									</div>
									<div className={'mb-4'}>
										<dt className={'text-xs font-medium text-gray-400 font-all-small-caps'}>
											{'Unlock date'}
										</dt>
										<dd className={'mt-0.5 text-sm text-gray-800 hover:underline'}>
											<a target={'_blank'} href={`https://etherscan.io/block/${details?.informations?.blockNumber}`}>
												{`Achievement unlocked on ${new Date(details?.informations?.timestamp).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})} at block ${details?.informations?.blockNumber}`}
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
				</div>
			</Transition>
		</div>
	)
}

export default AchievementDetails;