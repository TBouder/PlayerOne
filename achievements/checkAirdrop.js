/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 8th 2021
**	@Filename:				checkAirdrop.js
******************************************************************************/

import	axios		from	'axios';
import	{ethers}	from	'ethers';

/******************************************************************************
** _DETAILS_: Check if a specific address got an airdrop from a specific
**		address
******************************************************************************/
async function	checkAirdrop(_, userAddress, startBlock, from, data) {
	const	address = ethers.utils.getAddress;
	let		informations = undefined;
	let		transactions = [];

	if (data === undefined || (data && data.erc20 === undefined)) {
		const	responseERC20 = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${userAddress}&startblock=${startBlock}&endblock=999999999&sort=asc&apikey=${process.env.ETHERSCAN_KEY}`).then(e => e.data).catch(e => console.dir(e))
		if (responseERC20.status !== '1') {
			console.dir(responseERC20);
			return false;
		}
		transactions = responseERC20.result;
	} else {
		transactions = data.erc20;
	}
	const	result = transactions.some((each) => {
		if (address(each.from) === address(from) && address(each.to) === address(userAddress)) {
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
