/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 8th 2021
**	@Filename:				checkAirdrop.js
******************************************************************************/

import	{toAddress} 	from	'achievements/helpers'

/******************************************************************************
** _DETAILS_: Check if a specific address got an airdrop from a specific
**		address
******************************************************************************/
async function	checkAirdrop(provider, userAddress, walletData, args) {
	const	{block, address} = args;
	const	transactions = walletData?.erc20;
	let		informations = undefined;

	if (transactions === undefined) {
		return {unlocked: false, informations: informations};
	}

	const	result = transactions.filter(each => each.blockNumber >= block).some((each) => {
		if (toAddress(each.from) === toAddress(address) && toAddress(each.to) === toAddress(userAddress)) {
			informations = {
				blockNumber: each.blockNumber,
				hash: each.hash,
				details: each.value,
				timestamp: each.timeStamp * 1000,
			};
			return (true);
		}
		return (false);
	});

	return {unlocked: result, informations: informations};
}

export default checkAirdrop;
