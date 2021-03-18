/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 8th 2021
**	@Filename:				erc20Amount copy.js
******************************************************************************/

import	{bigNumber, toAddress} 	from	'achievements/helpers'

/******************************************************************************
** _DETAILS_: Check if a specific address has paid more than X since block Y
******************************************************************************/
async function	checkGasPrice(provider, userAddress, walletData, args) {
	const	{startBlock, value, moreOrLess} = args;
	const	bigValue = bigNumber.from(value);
	const	transactions = [...(walletData?.erc20 || []), ...(walletData?.transactions || [])];
	let		informations = undefined;

	if (transactions === undefined || transactions.length === 0) {
		return {unlocked: false, informations: informations};
	}

	const	_transactions = transactions.filter(each => each.blockNumber >= startBlock && toAddress(each.from) === toAddress(userAddress));

	const	result = _transactions.some((each) => {
		if (moreOrLess === -1 && bigNumber.from(each.gasPrice).lte(bigValue)) {
			informations = {
				blockNumber: each.blockNumber,
				hash: each.hash,
				details: each.gasPrice,
				timestamp: each.timeStamp * 1000,
			};
			return true;
		} else if (moreOrLess === 1 && bigNumber.from(each.gasPrice).gte(bigValue)) {
			informations = {
				blockNumber: each.blockNumber,
				hash: each.hash,
				details: each.gasPrice,
				timestamp: each.timeStamp * 1000,
			};
			return true;
		}
		return false;
	});
	return {unlocked: result, informations: informations};
}

export default checkGasPrice;
