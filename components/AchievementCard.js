/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 9th 2021
**	@Filename:				AchievementCard.js
******************************************************************************/

import	{useState, useEffect, useRef, forwardRef}	from	'react';
import	Link										from	'next/link';
import	axios										from	'axios';
import	{useToasts}									from	'react-toast-notifications';
import	useWeb3										from	'contexts/useWeb3';
import	{getStrategy}								from	'achievements/helpers';

const	claimDomain = {
	name: 'Degen Achievement',
	version: '1',
	chainId: 1,
	verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
};
const	claimTypes = {
	Achievement: [
		{name: 'action', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'unlock', type: 'Unlock'}
	],
	Unlock: [
		{name: 'blockNumber', type: 'string'},
		{name: 'hash', type: 'string'},
		{name: 'timestamp', type: 'string'},
		{name: 'details', type: 'string'}
	],
};

function	BottomInformation({onClaim, claim, isUnlocked}) {
	if (claim) {
		return (
			<div className={'flex space-x-1 text-sm text-gray-500'}>
				<span>{'Unlocked'}</span>
				<span aria-hidden={'true'}>&middot;</span>
				<time dateTime={claim.date}>
					{new Date(claim.date).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})}
				</time>
			</div>
		)	
	} else if (!isUnlocked) {
		return (
			<div className={'flex space-x-1 text-sm text-gray-500'}>
				<p>{'Locked'}</p>
			</div>
		)
	} else if (isUnlocked) {
		return (
			<p className={'text-sm font-medium text-teal-600'}>
				<button href={'#'} className={'hover:underline'} onClick={onClaim}>
					{'Claim'}
				</button>
			</p>
		);
	}
	return (
		<div className={'flex space-x-1 text-sm text-gray-500'}>
			<span>&nbsp;</span>
		</div>
	)
}

const	AchievementCard = forwardRef((props, ref) => {
	const	cardRef = useRef();
	const	{addToast} = useToasts();
	const	{provider, address, actions, walletData} = useWeb3();

	const	[achievement, set_achievement] = useState(props.achievement);
	useEffect(() => set_achievement(props.achievement), [props.informations, props.unlocked]);

	useEffect(() => {
		if (cardRef.current.className.indexOf('cardAnimOnMount') === -1) {
			setTimeout(() => cardRef.current.className = `${cardRef.current.className} cardAnimOnMount`, 0);
		}
	}, [achievement.hidden])

	async function	onClaim(e) {
		e.stopPropagation();
		e.preventDefault();

		const	strategy = achievement.strategy;
		if (!strategy?.name) {
			addToast(`No strategy`, {appearance: 'error'});
			return console.error(`No strategy`);
		}

		const	strategyFunc = getStrategy(strategy.name);
		if (!strategyFunc) {
			addToast(`No strategy function`, {appearance: 'error'});
			return console.error(`No strategy function`);
		}

		const	{unlocked} = await strategyFunc(provider, address, walletData, strategy?.args);
		if (!unlocked) {
			addToast(`Achievement is not unlocked`, {appearance: 'error'});
			return console.error(`Achievement is not unlocked`);
		}

		const	claimMessage = {
			action: 'Claiming',
			title: achievement.title,
			unlock: {
				blockNumber: String(achievement.informations.blockNumber),
				hash: String(achievement.informations.hash),
				timestamp: String(achievement.informations.timestamp),
				details: String(achievement.informations.details),
			}
		};

		try {
			actions.sign(claimDomain, claimTypes, claimMessage, async (signature) => {
				const response = await axios.post(`${process.env.API_URI}/claim`, {
					achievementUUID: achievement.UUID,
					address: address,
					signature: signature,
					message: JSON.stringify(claimMessage)
				});
				const	updatedAchievement = response.data.achievement;
				updatedAchievement.informations = achievement.informations;
				updatedAchievement.claim = response.data.claim;
				updatedAchievement.claimed = true;
				updatedAchievement.unlocked = true;
				set_achievement(updatedAchievement);
				props.onUpdate(updatedAchievement);
			})
		} catch (error) {
			addToast(error?.response?.data?.error || error.message, {appearance: 'error'});
			return console.error(error.message);
		}
	}

	return (
		<Link href={`/details/${achievement.UUID}`}>
			<div ref={cardRef} className={achievement.hidden ? 'not-visible' : 'cardAnim visible'}>
				<div
					ref={ref}
					className={'flex w-full lg:w-auto h-auto lg:h-96'}
					style={achievement.unlocked ? {} : {filter: 'grayscale(1)'}}>
					<div className={`
						flex flex-row lg:flex-col rounded-lg shadow-lg overflow-hidden w-full h-full cursor-pointer
						${achievement.unlocked ? 'transition-transform transform-gpu hover:scale-102 shine' : ''}
					`}>
						<div
							className={'flex-shrink-0 flex justify-center items-center h-auto lg:h-36 w-32 lg:w-full'}
							style={{background: achievement.background}}>
							<div
								className={'flex justify-center items-center w-16 h-16 rounded-full shadow-lg text-3xl'}
								style={{background: 'rgba(255, 255, 255, 0.9)'}}>
								{achievement.icon}
							</div>
						</div>
						<div className={`flex-1 p-4 lg:p-6 flex flex-col justify-between bg-white`}>
							<div className={'flex-1'}>
								<div className={'block'}>
									<p className={'text-xl font-semibold text-gray-900'}>
										{achievement.title}
									</p>
									<p className={'mt-3 text-base text-gray-500'}>
										{achievement.description}
									</p>
								</div>
							</div>
							<div className={'flex items-center mt-6'}>
								<div className={''}>
									<BottomInformation
										onClaim={onClaim}
										claim={achievement.claim}
										isUnlocked={achievement.unlocked} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
});

export default AchievementCard;
