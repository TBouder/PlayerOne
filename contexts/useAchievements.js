/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useAchievements.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	useSWR												from	'swr';
import	axios												from	'axios';
import	{ethers}											from	'ethers';
import	{useToasts}											from	'react-toast-notifications';
import	useWeb3												from	'contexts/useWeb3';
import	{getStrategy}										from	'achievements/helpers';
import	UUID												from	'utils/uuid';
import	{bigNumber, fetcher, removeFromArray}				from	'utils';

const	AchievementsContext = createContext();
export const AchievementsContextApp = (props) => {
	const	{addToast} = useToasts();
	const	{address, provider, rProvider, walletData, chainID, actions} = useWeb3();

	/**************************************************************************
	**	achievements: matches the local state to handle the achievements on the
	**	front-end
	**************************************************************************/
	const	[achievements, set_achievements] = useState();

	/**************************************************************************
	**	achievementsCheckProgress: used to indicate to the user which
	**	achievement is being checked. Used with the progress bar
	**************************************************************************/
	const	[achievementsCheckProgress, set_achievementsCheckProgress] = useState({checking: false, progress: 0, total: 0});

	/**************************************************************************
	**	achievementsProgressNonce: used to continue or stop an achievement
	**	check process. If current != previous, then another process started
	**	and we need to abort the current one.
	**************************************************************************/
	const	[achievementsProgressNonce, set_achievementsProgressNonce] = useState({previous: undefined, current: undefined});

	/**************************************************************************
	**	claims: lists the claims for this user
	**	claimables: lists the claimable for this user
	**************************************************************************/
	const	[elements, set_elements] = useState({
		claims: undefined,
		claimsAsMapping: {},
		claimables: undefined,
		claimablesAsMapping: {},
		locked: undefined,
		lockedAsMapping: {},
		count: 0,
		nonce: 0
	});

	/**************************************************************************
	**	pool: size of the pool of adresse which have interacted with this
	**	playground
	**************************************************************************/
	const	{data: poolSize} = useSWR(
		`${process.env.API_URI}/addresses/count`,
		fetcher,
		{focusThrottleInterval: 1000 * 10}
	);

	/**************************************************************************
	**	This is a hack. Is it a good one ? I am not sure, but it seams to work.
	**	Only here for performance reason : the list of achievements is built at
	**	build time and, if we land on the index, we will have them as this
	**	component props (achievementsList). It will save us one API call & some
	**	time.
	**	We will then init the achievements based on this list.
	**************************************************************************/
	const	{data: achievementsList} = useSWR(`${process.env.API_URI}/achievements`, fetcher);

	useEffect(() => {
		if (!achievements && achievementsList) {
			set_achievements(achievementsList.map(e => ({...e})));
		}
	}, [achievementsList])

	/**************************************************************************
	**	This effect will be launched once we got an address (aka we know which
	**	address is connected) + some achievements (we need to check them, so we
	**	need them). It will only be launched if claims is undefined, so not
	**	initialized, and will :
	**	- init the claims + claimMapping
	** 	- init the claimables + claimablesMapping
	**	- sort the achievements by `unlocked` (should we add a distinction
	**		between claim & claimable ?)
	**	- prepare the field for the achievement check
	**************************************************************************/
	async function	recomputeClaims() {
		const	{claims: addressClaims, claimables: addressClaimables} = await fetcher(`${process.env.API_URI}/address/${address || 'none'}`);

		const	_claimsAsMapping = {};
		const	_claimablesAsMapping = {};
		const	_lockedAsMapping = {};
		const	_locked = [];
		const	_claimables = [];
		const	_claims = [];
		const	_achievements = achievements.map((achievement) => {
			const	_achievement = {...achievement};
			const	achievementClaim = addressClaims.find(e => e.achievement === achievement.key);
			if (achievementClaim) {
				_claims.push({
					...achievement,
					status: `CLAIMED`,
					address: achievementClaim.address,
					validator: achievementClaim.validator,
					nonce: achievementClaim.nonce,
					date: achievementClaim.date,
				});
				_claimsAsMapping[_achievement.key] = true;
			} else {
				const	achievementClaimable = addressClaimables.find(e => e.achievement === achievement.key);
				if (achievementClaimable) {
					_claimables.push({
						...achievement,
						status: `CLAIMABLE`,
						verified: achievementClaimable.verified,
						address: achievementClaimable.address,
						date: achievementClaimable.date,
					});
					_claimablesAsMapping[_achievement.key] = true;
				} else {
					_lockedAsMapping[_achievement.key] = true;
					_locked.push(achievement);
				}
			}
			return _achievement;
		})

		set_elements(x => ({
			claims: _claims,
			claimsAsMapping: _claimsAsMapping,
			claimables: _claimables,
			claimablesAsMapping: _claimablesAsMapping,
			locked: _locked,
			lockedAsMapping: _lockedAsMapping,
			count: _achievements.length,
			nonce: x.nonce + 1,
		}));

		set_achievementsCheckProgress({checking: false, progress: addressClaims.length + addressClaimables.length, total: _achievements.length});
	}
	useEffect(() => {
		if (achievements !== undefined) {
			recomputeClaims();
		}
	}, [address, achievements])


	/**************************************************************************
	**	This effect function is called when we need to reset the state of the
	**	achievement context (on logout, on change account, on change chainID).
	**************************************************************************/
	useEffect(() => {
		if (props.shouldReset) {
			const	_lockedAsMapping = {};
			achievementsList.forEach((a) => {_lockedAsMapping[a.key] = true});
			set_elements({
				claims: undefined,
				claimsAsMapping: {},
				claimables: undefined,
				claimablesAsMapping: {},
				locked: achievementsList,
				lockedAsMapping: _lockedAsMapping,
				count: achievementsList.length,
			});
			set_achievementsCheckProgress({checking: false, progress: 0, total: 0});
			set_achievementsProgressNonce({previous: undefined, current: undefined});
			props.set_shouldReset(false);
		}
	}, [props.shouldReset])

	/**************************************************************************
	**	Updating the achievements when we have the wallet history
	**************************************************************************/
	useEffect(() => {
		if (walletData.ready && provider) {
			if (elements.locked !== undefined && !achievementsCheckProgress.checking) {
				checkAchievements();
			}
		}
	}, [walletData.ready, elements.nonce]);

	function	checkAchievements() {
		if (elements.nonce === 0) {
			return
		}
		const	progressUUID = UUID();
		set_achievementsProgressNonce(v => ({previous: v.previous === undefined ? progressUUID : undefined, current: progressUUID}));
		set_achievementsCheckProgress({checking: true, progress: 0, total: elements.count});
		recursiveCheckAchivements([...elements.locked], elements.locked[0], 0);
	}
	async function	recursiveCheckAchivements(achievementsList, achievement, index) {
		if (achievement === undefined) {
			set_achievementsProgressNonce({previous: undefined, current: undefined});
			set_achievementsCheckProgress({checking: false, progress: 0, total: 0});
			return;
		}

		if (achievementsProgressNonce.current !== achievementsProgressNonce.previous) {
			return
		} else if (elements.claimsAsMapping[achievement.key] || elements.claimablesAsMapping[achievement.key]) {
			recursiveCheckAchivements(achievementsList, achievementsList[index + 1], index + 1);
			return
		}

		if (achievement?.strategy?.name) {
			const	strategy = getStrategy(achievement.strategy.name);
			if (strategy !== undefined) {
				const	{unlocked} = await strategy(provider, address, walletData, achievement?.strategy?.args);
				if (unlocked) {
					try {
						const	newClaimable = await axios.post(`${process.env.API_URI}/claimable`, {
							achievementKey: achievement.key,
							address: address,
						}).then(e => e.data);

						set_elements((x) => ({
							...x,
							claimables: [...x.claimables, {
								...achievement,
								status: `CLAIMABLE`,
								verified: newClaimable.verified,
								address: newClaimable.address,
								date: newClaimable.date,
							}],
							claimablesAsMapping: {...x.claimablesAsMapping, [achievement.key]: true},
							locked: removeFromArray(x.locked, 'key', achievement.key),
							lockedAsMapping: {...x.lockedAsMapping, [achievement.key]: false},
							nonce: x.nonce + 1
						}));
					} catch (error) {
						console.log(error)
					}
				}
			}
		}

		if (achievementsProgressNonce.current === achievementsProgressNonce.previous) {
			set_achievementsCheckProgress(v => ({checking: true, progress: v.progress + 1, total: v.total}));
			recursiveCheckAchivements(achievementsList, achievementsList[index + 1], index + 1);
		}
	}

	async function	checkAchievement(achievement) {
		if (!achievement) {
			return null;
		}
		if (achievement.unlocked) {
			return achievement;
		}

		achievement.unlocked = false;
		achievement.informations = {};
		if (!achievement?.strategy?.name) {
			return null;
		}

		const	strategy = getStrategy(achievement.strategy.name);
		if (strategy === undefined) {
			return null;
		}
		const	{unlocked, informations} = await strategy(provider, address, walletData, achievement?.strategy?.args);
		achievement.unlocked = unlocked;
		achievement.informations = informations || {};
		return achievement;
	}
	async function	claimAchievement(achievementKey, callback = () => null) {
		const	achievement = achievements.find(e => e.key === achievementKey);
		const	isUnlocked = (await checkAchievement(achievement)).unlocked;
		if (!isUnlocked) {
			return callback({status: 'ERROR'});
		}

		/**********************************************************************
		**	Only for ropsten / testnets
		**	We need to get the gasPrice to provide an actual price estimation
		**********************************************************************/
		let	gasPrice = undefined;
		let	averageGasPrice = undefined;

		if (chainID !== 1 || chainID !== '0x1') {
			gasPrice = await fetcher(`https://ethgasstation.info/api/ethgasAPI.json?api-key=14139d139150b5687787a4bcd40aae485d6a380a9253ada65e6076a957df`)
			averageGasPrice = (gasPrice.average / 10);
			addToast(`Average gasPrice on mainnet: ${averageGasPrice}`, {appearance: 'info'});
		}

		/**********************************************************************
		**	We need the backend to generate a claim.
		**	Note: the backend will ask, to the smartcontract, is the user can
		**	claim the achievement (not already claimed), then check if the
		**	user matches the requirements (verification with the specific
		**	strategy)
		**********************************************************************/
		let	signatureResponse = undefined;
		try {
			signatureResponse = await axios.post(`${process.env.API_URI}/claim/signature`, {
				achievementKey: achievement.key,
				address: address,
			});
			callback({status: 'GET_SIGNATURE'})
			addToast(`Signature from validator (${signatureResponse.data.validator}) : ${signatureResponse.data.signature}`, {appearance: 'info'});
		} catch (error) {
			if (error?.response?.data?.error === 'achievement already claimed') {
				return callback({status: 'SUCCESS'});
			}
			addToast(error?.response?.data?.error || error.message, {appearance: 'error'});
			return callback({status: 'ERROR'});
		}

		/**********************************************************************
		**	Creating the claim transaction
		**********************************************************************/
		const	signature = signatureResponse.data.signature;
		const	tokenAddress = signatureResponse.data.contractAddress;
		const	validator = signatureResponse.data.validator;
		const	achievementHash = signatureResponse.data.achievement;
		const	amount = signatureResponse.data.amount;
		const	deadline = signatureResponse.data.deadline;
		const	r = signature.slice(0, 66);
		const	s = '0x' + signature.slice(66, 130);
		const	v = parseInt(signature.slice(130, 132), 16) + 27;

		/**********************************************************************
		**	Accessing the contract
		**********************************************************************/
		actions.claim(
			tokenAddress,
			[validator, address, achievementHash, amount, deadline, v, r, s],
			averageGasPrice ? {gasPrice: averageGasPrice * 1000000000} : undefined,
			(({status}) => {
				if (status === 'SUCCESS') {
					recomputeClaims();
				}
				callback({status})
			})
		);
	}
	async function	claimMultipleAchievement(achievementsKey, callback = () => null) {
		// const	achievement = achievements.find(e => e.key === achievementKey);
		// const	isUnlocked = (await checkAchievement(achievement)).unlocked;
		// if (!isUnlocked) {
		// 	return callback({status: 'ERROR'});
		// }

		/**********************************************************************
		**	Only for ropsten / testnets
		**	We need to get the gasPrice to provide an actual price estimation
		**********************************************************************/
		let	gasPrice = undefined;
		let	averageGasPrice = undefined;

		if (chainID !== 1 || chainID !== '0x1') {
			gasPrice = await fetcher(`https://ethgasstation.info/api/ethgasAPI.json?api-key=14139d139150b5687787a4bcd40aae485d6a380a9253ada65e6076a957df`)
			averageGasPrice = (gasPrice.average / 10);
			addToast(`Average gasPrice on mainnet: ${averageGasPrice}`, {appearance: 'info'});
		}

		/**********************************************************************
		**	We need the backend to generate a claim.
		**	Note: the backend will ask, to the smartcontract, is the user can
		**	claim the achievement (not already claimed), then check if the
		**	user matches the requirements (verification with the specific
		**	strategy)
		**********************************************************************/
		let	signatureResponse = undefined;
		try {
			signatureResponse = await axios.post(`${process.env.API_URI}/claim/multiple/signature`, {
				achievementsKey: achievementsKey,
				address: address,
			});
			callback({status: 'GET_SIGNATURE'})
			addToast(`Signature from validator (${signatureResponse.data.validator}) : ${signatureResponse.data.signature}`, {appearance: 'info'});
		} catch (error) {
			if (error?.response?.data?.error === 'achievement already claimed') {
				return callback({status: 'SUCCESS'});
			}
			addToast(error?.response?.data?.error || error.message, {appearance: 'error'});
			return callback({status: 'ERROR'});
		}

		/**********************************************************************
		**	Creating the claim transaction
		**********************************************************************/
		const	signature = signatureResponse.data.signature;
		const	tokenAddress = signatureResponse.data.contractAddress;
		const	validator = signatureResponse.data.validator;
		const	achievements = signatureResponse.data.achievements;
		const	amount = signatureResponse.data.amount;
		const	deadline = signatureResponse.data.deadline;
		const	r = signature.slice(0, 66);
		const	s = '0x' + signature.slice(66, 130);
		const	v = parseInt(signature.slice(130, 132), 16) + 27;

		/**********************************************************************
		**	Accessing the contract
		**********************************************************************/
		actions.claimMultiple(
			tokenAddress,
			[validator, address, achievements, amount, deadline, v, r, s],
			averageGasPrice ? {gasPrice: averageGasPrice * 1000000000} : undefined,
			(({status}) => {
				if (status === 'SUCCESS') {
					setTimeout(() => recomputeClaims(), 500);
				}
				callback({status})
			})
		);
	}
	async function	getTotalSupply(_provider) {
		const	TOTAL_SUPPLY_ABI = ["function totalSupply() external view returns (uint256)"];
		const	contract = new ethers.Contract('0x35017DC776c43Bcf8192Bb6Ba528348D32A57CB5', TOTAL_SUPPLY_ABI, _provider);
		const	totalSupply = await contract.functions.totalSupply();
		return (bigNumber.from(totalSupply[0]).div(bigNumber.from(10).pow(18)));
	}
	function	setAsClaimed(list) {
		let		_claims = [...elements.claims];
		let		_claimables = [...elements.claimables];
		const	_claimsAsMapping = {...elements.claimsAsMapping};
		const	_claimablesAsMapping = {...elements.claimablesAsMapping};

		list.forEach((achievement) => {
			_claimablesAsMapping[achievement.key] = false;
			_claimsAsMapping[achievement.key] = true;
			_claimables = removeFromArray(_claimables, 'key', achievement.key)
			_claims.push({
				...achievement,
				status: `CLAIMED`,
				address: address,
				validator: 'validator',
				nonce: -1,
				date: new Date()
			});
		});

		set_elements((x) => ({
			...x,
			claimablesAsMapping: _claimablesAsMapping,
			claimsAsMapping: _claimsAsMapping,
			claimables: _claimables,
			claims: _claims,
			nonce: x.nonce + 1
		}))
		setTimeout(() => recomputeClaims(), 2000);
	}

	return (
		<AchievementsContext.Provider
			children={props.children}
			value={{
				poolSize: poolSize || 0,
				achievementsCheckProgress,
				elements,
				actions: {
					check: checkAchievement,
					claim: claimAchievement,
					claimMultiple: claimMultipleAchievement,
					getTotalSupply: getTotalSupply,
					setAsClaimed: setAsClaimed
				}
			}} />
	)
}

export const useAchievements = () => useContext(AchievementsContext)
export default useAchievements;
