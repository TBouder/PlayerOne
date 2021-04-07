/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 9th 2021
**	@Filename:				AchievementCard.js
******************************************************************************/

import	{useState, useEffect, useRef, forwardRef}	from	'react';
import	Link										from	'next/link';
import	{useToasts}									from	'react-toast-notifications';
import	{getStrategy}								from	'achievements/helpers';
import	useUI										from	'contexts/useUI';
import	useWeb3										from	'contexts/useWeb3';
import	useAchievements								from	'contexts/useAchievements';

function	ClaimableButtom(props) {
	const	STATUS = {UNDEFINED: 0, PENDING: 1, UNLOCKED: 2};
	const	[buttonStatus, set_buttonStatus] = useState(0);
	const	buttonRef = useRef();

	return (
		<button
			ref={buttonRef}
			onClick={(e) => {
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
			}}
			disabled={buttonStatus === STATUS.PENDING}
			className={`relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm border-t border-transparent ${buttonStatus === STATUS.UNLOCKED ? 'font-medium text-gradient' : 'text-gray-700 font-normal'} ${buttonStatus === STATUS.PENDING ? 'cursor-wait' : 'cursor-pointer'}`}>
			<p className={'flex items-center'} style={buttonStatus === STATUS.PENDING ? {opacity: 1} : {opacity: 1} }>
				{buttonStatus === STATUS.UNLOCKED ?
					<>
						<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="url(#gradient)"><linearGradient id="gradient"><stop offset="0%" stopColor={'rgba(20,184,166,1)'} /><stop offset="50%" stopColor={'rgba(139,92,246,1)'} /><stop offset="100%" stopColor={'rgba(236,72,153,1)'} /></linearGradient><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
						</svg>
						<span className={'ml-2'}>{'Unlocked'}</span>
					</>
				: null}
				{buttonStatus === STATUS.UNDEFINED ?
					<>
						<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
						<span className={'ml-2'}>{'Claim'}</span>
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


const	AchievementCard = forwardRef((props, ref) => {
	const	{addToast} = useToasts();
	const	{confetti} = useUI();
	const	{provider, address, walletData} = useWeb3();
	const	{actions} = useAchievements();

	const	[achievement, set_achievement] = useState(props.achievement);
	useEffect(() => set_achievement(props.achievement), [props.informations, props.unlocked]);

	async function	onClaimMultiple(callback = () => null) {
		try {
			actions.claimMultiple(['17014046665459167871385144214384153657052529861444070975123034192784533496286', '9467569119697655395695061540870730797287567233033790043736635320929402325446'], callback)
		} catch (error) {
			addToast(error?.response?.data?.error || error.message, {appearance: 'error'});
			return console.error(error.message);
		}
	}

	async function	onClaim(callback = () => null) {
		const	strategy = achievement.strategy;
		if (!strategy?.name) {
			addToast(`No strategy`, {appearance: 'error'});
			callback({status: 'ERROR'});
			return console.error(`No strategy`);
		}

		const	strategyFunc = getStrategy(strategy.name);
		if (!strategyFunc) {
			addToast(`No strategy function`, {appearance: 'error'});
			callback({status: 'ERROR'});
			return console.error(`No strategy function`);
		}

		const	{unlocked} = await strategyFunc(provider, address, walletData, strategy?.args);
		if (!unlocked) {
			addToast(`Achievement is not unlocked`, {appearance: 'error'});
			callback({status: 'ERROR'});
			return console.error(`Achievement is not unlocked`);
		}

		try {
			actions.claim(achievement.key, callback)
		} catch (error) {
			addToast(error?.response?.data?.error || error.message, {appearance: 'error'});
			return console.error(error.message);
		}
	}


	return (
		<Link href={`/details/${achievement.slug}`}>
			<div
				ref={ref}
				className={'flex w-full lg:w-auto'}
				style={props.claimed || props.unlocked ? {} : {filter: 'grayscale(1)'}}>
				<div className={'flex flex-row lg:flex-col overflow-hidden w-full h-full cursor-pointer transition-transform transform-gpu hover:scale-102 shine shadow-lg rounded-lg bg-white'}>
					<div className={'flex-shrink-0 flex justify-center items-center h-auto lg:h-28 w-32 lg:w-full'}
						style={{background: achievement.background}}>
						<div
							className={'flex justify-center items-center w-16 h-16 rounded-full shadow-lg text-3xl'}
							style={{background: 'rgba(255, 255, 255, 0.9)'}}>
							{achievement.icon}
						</div>
					</div>
					<div className={`flex flex-col h-full w-full`}>
						<div className={'flex flex-col items-center text-center px-3 mb-12'}>
							<h3 className={'mt-3 text-gray-900 text-base font-medium'}>{achievement.title}</h3>
							<dl className={'mt-2 flex-grow flex flex-col justify-between'}>
								<dd className={'text-gray-500 text-sm'}>{achievement.description}</dd>
							</dl>
						</div>
						<div className={'flex mt-auto'}>
							{props.claimed ?
								<div
								className={'w-0 flex-1 flex'}
								onClick={(e) => {
									e.preventDefault();
									confetti.set({active: true, x: e.pageX, y: e.pageY});
								}}>
									<div className={'relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gradient border-t border-transparent font-medium '}>
										<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="url(#gradient)"><linearGradient id="gradient"><stop offset="0%" stopColor={'rgba(20,184,166,1)'} /><stop offset="50%" stopColor={'rgba(139,92,246,1)'} /><stop offset="100%" stopColor={'rgba(236,72,153,1)'} /></linearGradient><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
										</svg>
										<span className={'ml-2'}>{'Unlocked'}</span>
									</div>
								</div>
							:
							props.unlocked ?
								<ClaimableButtom onClaim={onClaim} confetti={confetti} />
							:
								<div className={'w-full flex-1 flex'}>
									<a
										className={'relative -mr-px w-full flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 border-t border-transparent cursor-not-allowed bg-gray-200'}>
										<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
										<span className={'ml-2'}>{'Locked'}</span>
									</a>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		</Link>
	)	
});

export default AchievementCard;
