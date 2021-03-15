/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday March 9th 2021
**	@Filename:				AchievementCard.js
******************************************************************************/

import	{useState, useEffect, forwardRef}	from	'react';
import	Link								from	'next/link';
import	{motion}							from	'framer-motion';
import	useWeb3								from	'contexts/useWeb3';

const cardVariants = {
	initial: { scale: 0.96, y: 30, opacity: 0 },
	enter: { scale: 1, y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.48, 0.15, 0.25, 0.96] } },
	exit: {
	  scale: 0.6,
	  y: 100,
	  opacity: 0,
	  transition: { duration: 0.2, ease: [0.48, 0.15, 0.25, 0.96] }
	}
};
const	randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const	randomItem = arr => arr[(Math.random() * arr.length) | 0];

const	AchievementCard = forwardRef(({UUID, hidden, title, description, icon, background, unlocked, claimed, claim, informations, set_details, checkAchievement = () => null}, ref) => {
	const	{provider, address, actions} = useWeb3();
	const	[isUnlocked, set_isUnlocked] = useState(unlocked);
	const	[isClaimed, set_isClaimed] = useState(claimed);
	const	[claimData, set_claimData] = useState(claim);
	const	[informationsData, set_informationsData] = useState(informations);

	useEffect(() => set_isUnlocked(unlocked), [unlocked])
	useEffect(() => set_isClaimed(claimed), [claimed])
	useEffect(() => set_claimData(claim), [claim])
	useEffect(() => set_informationsData(informations || {}), [informations])

	async function	onClaim(e) {
		e.stopPropagation();
		e.preventDefault();
		const	result = await checkAchievement(provider, address);
		if (!result) {
			return null;
		}
		const	randomCount = randomInteger(1, 999999);
		const	randomID = randomInteger(1, randomCount);
		const	randomLevel = randomItem([null, null, null, null, null, 'cooper', 'cooper', 'cooper', 'cooper', 'silver', 'silver', 'gold'])
		const	msgParams = {
			domain: {
				name: 'Degen Achievement',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				action: 'Claiming',
				title: title,
				unlock: {
					blockNumber: String(informationsData.blockNumber),
					hash: String(informationsData.hash),
					timestamp: String(informationsData.timestamp),
					details: String(informationsData.details),
				}
			},
			types: {
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
			},
		};
		actions.sign(
			JSON.stringify(msgParams),
			msgParams.domain,
			msgParams.types,
			msgParams.message,
			() => {
			set_claimData({
				id: randomID,
				count: randomCount,
				level: randomLevel
			})
			set_isClaimed(result);
		});
	}
	function	onClaimed() {
		
	}
	function	renderClaimButton() {
		if (isUnlocked && !isClaimed) {
			return (
				<p className={'text-sm font-medium text-teal-600'}>
					<button href={'#'} className={'hover:underline'} onClick={onClaim}>
						{'Claim'}
					</button>
				</p>
			);
		}
		if (isUnlocked && isClaimed) {
			return (
				<span className={'flex flex-row items-center'}>
					<p className={'text-sm font-medium text-teal-600'}>
						<button href={'#'} className={'hover:underline'} onClick={onClaimed}>
							{'Claimed !'}
						</button>
					</p>
					<p className={'ml-2 text-xs font-light text-gray-400'}>
						{`(${claimData?.id} / ${claimData?.count})`}
					</p>
				</span>
			);
		}
		return null;
	}

	return (
		<Link href={`/details/${UUID}`}>
		  <motion.div variants={cardVariants} className={hidden ? 'not-visible' : 'visible'}>
			<div
				ref={ref}
				className={'flex w-full lg:w-auto h-auto lg:h-96'}
				style={isUnlocked ? {} : {filter: 'grayscale(1)'}}>
				<div className={`
					flex flex-row lg:flex-col rounded-lg shadow-lg overflow-hidden w-full h-full
					${isUnlocked ? 'transition-transform transform-gpu hover:scale-102 cursor-pointer shine' : ''}
				`}>
					<div
						onClick={() => set_details({open: true, background, icon, title, description, informations})}
						className={'flex-shrink-0 flex justify-center items-center h-auto lg:h-36 w-32 lg:w-full'}
						style={{background}}>
						<div
							className={'flex justify-center items-center w-16 h-16 rounded-full shadow-lg text-3xl'}
							style={{background: 'rgba(255, 255, 255, 0.9)'}}>
							{icon}
						</div>
					</div>
					<div className={`flex-1 p-4 lg:p-6 flex flex-col justify-between bg-white ${isUnlocked && isClaimed ? claimData?.level : ''}`}>
						<div className={'flex-1'} onClick={() => set_details({open: true, background, icon, title, description, informations})}>
							<div className={'block'}>
								<p className={'text-xl font-semibold text-gray-900'}>{title}</p>
								<p className={'mt-3 text-base text-gray-500'}>{description}</p>
							</div>
						</div>
						<div className={'flex items-center mt-6'}>
							<div className={''}>
								{renderClaimButton()}
								<div className={'flex space-x-1 text-sm text-gray-500'}>
									{!isUnlocked ? <button className={'hover:underline'}>{'Unlock'}</button> : null}
									{isUnlocked ? <span>{'Unlocked'}</span> : null}
									{isUnlocked ? <span aria-hidden={'true'}>&middot;</span> : null}
									{isUnlocked && informationsData?.timestamp ? <time dateTime={informationsData.timestamp}>{new Date(informationsData.timestamp).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})}</time> : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</motion.div>
		</Link>
	)
});

export default AchievementCard;
