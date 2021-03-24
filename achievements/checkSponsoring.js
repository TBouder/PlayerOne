/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 8th 2021
**	@Filename:				checkSponsoring.js
******************************************************************************/

import	{bigNumber, toAddress} 	from	'utils'

/******************************************************************************
** _DETAILS_: Check if a specific address send us an airdrop
******************************************************************************/
async function	checkSponsoring(provider, userAddress, walletData, args) {
	const	{addressTo} = args;
	const	transactions = [...(walletData?.erc20 || []), ...(walletData?.transactions || [])];
	let		informations = undefined;

	if (transactions === undefined || transactions.length === 0) {
		return {unlocked: false, informations: informations};
	}
	const	_transactions = transactions.filter(each => toAddress(each.to) === toAddress(addressTo));

	if (_transactions.length === 0) {
		return {unlocked: false, informations: informations};
	}

	let	totalValue = bigNumber.from(0);
	let	initialTimestamp = undefined;
	let	initialBlockNumber = undefined;
	let	initialHash = undefined;
	let	txDetails = [];
	_transactions.forEach((tx) => {
		const {value, timeStamp, hash, blockNumber} = tx;
		if (!initialTimestamp)
			initialTimestamp = timeStamp;
		if (!initialHash)
			initialHash = hash;
		if (!initialBlockNumber)
			initialBlockNumber = blockNumber;
		txDetails.push(tx)
		totalValue = totalValue.add(bigNumber.from(value));
	});

	informations = {
		blockNumber: initialBlockNumber,
		hash: initialHash,
		details: txDetails,
		timestamp: initialTimestamp * 1000,
	};

	return {unlocked: true, informations: informations};
}

export default checkSponsoring;
