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
import	{randomInteger, randomItem}					from	'utils';

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

const	AchievementCard = forwardRef((achievement, ref) => {
	const	cardRef = useRef();
	const	{informations} = achievement;
	const	{addToast} = useToasts();
	const	{provider, address, actions, walletData} = useWeb3();

	const	[numberOfClaims, set_numberOfClaims] = useState(achievement.numberOfClaims);
	const	[isUnlocked, set_isUnlocked] = useState(achievement.unlocked);
	const	[isClaimed, set_isClaimed] = useState(achievement.claimed);
	const	[claimData, set_claimData] = useState(achievement.claim);
	const	[informationsData, set_informationsData] = useState(informations);

	useEffect(() => set_numberOfClaims(achievement.numberOfClaims), [achievement.numberOfClaims]);
	useEffect(() => set_isUnlocked(achievement.unlocked), [achievement.unlocked]);
	useEffect(() => set_isClaimed(achievement.claimed), [achievement.claimed]);
	useEffect(() => set_claimData(achievement.claim), [achievement.claim]);
	useEffect(() => set_informationsData(informations || {}), [informations]);

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

		const	randomCount = randomInteger(1, 999999);
		const	randomID = randomInteger(1, randomCount);
		const	randomLevel = randomItem([null, null, null, null, null, 'cooper', 'cooper', 'cooper', 'cooper', 'silver', 'silver', 'gold'])
		const	claimMessage = {
			action: 'Claiming',
			title: achievement.title,
			unlock: {
				blockNumber: String(informationsData.blockNumber),
				hash: String(informationsData.hash),
				timestamp: String(informationsData.timestamp),
				details: String(informationsData.details),
			}
		};

		try {
			actions.sign(claimDomain, claimTypes, claimMessage, (signature) => {
				axios.post(`${process.env.API_URI}/claim`, {
					achievementUUID: achievement.UUID,
					address: address,
					signature: signature,
					message: JSON.stringify(claimMessage)
				});
				set_claimData({
					id: randomID,
					count: randomCount,
					level: randomLevel
				})
				set_isClaimed(true);
			})
		} catch (error) {
			addToast(error?.response?.data?.error || error.message, {appearance: 'error'});
			return console.error(error.message);
		}
	}
	function	renderClaimButton() {
		if (isUnlocked && !claimData?.data) {
			return (
				<p className={'text-sm font-medium text-teal-600'}>
					<button href={'#'} className={'hover:underline'} onClick={onClaim}>
						{'Claim'}
					</button>
				</p>
			);
		}
		if (isUnlocked && claimData?.data) {
			return (
				<span className={'flex flex-row items-center'}>
					<p className={'text-sm font-medium text-teal-600'}>
						{'Claimed !'}
					</p>
					<p className={'ml-2 text-xs font-light text-gray-400'}>
						{`(${claimData?.data.nonce} / ${numberOfClaims})`}
					</p>
				</span>
			);
		}
		return null;
	}

	return (
		<Link href={`/details/${achievement.UUID}`}>
			<div ref={cardRef} className={achievement.hidden ? 'not-visible' : 'cardAnim visible'}>
				<div
					ref={ref}
					className={'flex w-full lg:w-auto h-auto lg:h-96'}
					style={isUnlocked ? {} : {filter: 'grayscale(1)'}}>
					<div className={`
						flex flex-row lg:flex-col rounded-lg shadow-lg overflow-hidden w-full h-full cursor-pointer
						${isUnlocked ? 'transition-transform transform-gpu hover:scale-102 shine' : ''}
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
						<div className={`flex-1 p-4 lg:p-6 flex flex-col justify-between bg-white ${isUnlocked && isClaimed ? claimData?.level : ''}`}>
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
									{renderClaimButton()}
									<div className={'flex space-x-1 text-sm text-gray-500'}>
										{!isUnlocked ? <button className={'hover:underline'}>{'Unlock'}</button> : null}
										{isUnlocked ? <span>{'Unlocked'}</span> : null}
										{isUnlocked ? <span aria-hidden={'true'}>&middot;</span> : null}
										{isUnlocked && claimData?.data.date ? <time dateTime={claimData.data.date}>{new Date(claimData.data.date).toLocaleDateString('en-EN', {year: 'numeric', month: 'short', day: 'numeric'})}</time> : null}
									</div>
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
