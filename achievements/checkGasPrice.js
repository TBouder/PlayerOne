/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 8th 2021
**	@Filename:				erc20Amount copy.js
******************************************************************************/

import	axios					from	'axios';
import	{bigNumber, toAddress} 	from	'achievements/helpers'

/******************************************************************************
** _DETAILS_: Check if a specific address has paid more than X since block Y
******************************************************************************/
async function	checkGasPrice(provider, userAddress, walletData, args) {
	const	{startBlock, value, moreOrLess} = args;
	const	bigValue = bigNumber.from(value);
	let		informations = undefined;
	let		transactions = [];

	if (walletData === undefined || (walletData && walletData.erc20 === undefined)) {
		const	responseERC20 = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${userAddress}&startblock=${startBlock}&endblock=999999999&sort=asc&apikey=${process.env.ETHERSCAN_KEY}`).then(e => e.data).catch(e => console.dir(e))
		if (responseERC20.status !== '1') {
			console.dir(responseERC20);
			return {unlocked: false, informations: undefined};
		}
		const	responseNormal = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${userAddress}&startblock=${startBlock}&endblock=999999999&sort=asc&apikey=${process.env.ETHERSCAN_KEY}`).then(e => e.data).catch(e => console.dir(e))
		if (responseNormal.status !== '1') {
			console.dir(responseNormal);
			return {unlocked: false, informations: undefined};
		}
		transactions = [...responseERC20.result, ...responseNormal.result];
	} else {
		const	erc20Transactions = walletData.erc20.filter(each => each.blockNumber >= startBlock && toAddress(each.from) === toAddress(userAddress));
		const	normalTransactions = walletData.transactions.filter(each => each.blockNumber >= startBlock && toAddress(each.from) === toAddress(userAddress));
		transactions = [...erc20Transactions, ...normalTransactions];
	}

	const	result = transactions.some((each) => {
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
