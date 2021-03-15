import	axios					from	'axios';
import	{ethers}				from	'ethers';
import	{bigNumber, address} 	from	'achievements/helpers'

/******************************************************************************
** _DETAILS_: Check if a specific address had a specific amount of some ERC20
**		in the wallet lifetime
******************************************************************************/
const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)"];

async function	checkERC20Amount(provider, userAddress, erc20Address, amount, data) {
	const	erc20Json = new ethers.Contract(erc20Address, ERC20_ABI, provider);
	const	bigAmount = bigNumber.from(amount);
	let		informations = undefined;
	let		transactions = [];
	let		balanceRightNow = undefined;

	//1 - checking if balance is above amount -> true if yes
	try {
		balanceRightNow = await erc20Json.balanceOf(userAddress);
	} catch (error) {
		console.dir(error)
		return {unlocked: false, informations: undefined};
	}

	if (bigNumber.from(balanceRightNow).gt(bigAmount)) {
		const	blockNumber = await provider.getBlockNumber();
		return {unlocked: true, informations: {
			blockNumber,
			hash: (await provider.getBlock(blockNumber)).hash,
			details: bigNumber.from(balanceRightNow).toString(),
			timestamp: Date.now(),
		}};
	}

	//2 - too bad, let's check the user's transactions to find the max amount
	/**************************************************************************
	** If data !== undefined, we already have the erc20 transactions available.
	** We don't need to re-fetch the data.
	**************************************************************************/
	if (data === undefined || (data && data.erc20 === undefined)) {
		const	response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${userAddress}&startblock=0&endblock=999999999&sort=asc&apikey=${process.env.ETHERSCAN_KEY}`).then(e => e.data).catch(e => console.dir(e))

		if (response.status !== '1') {
			console.dir(response);
			return {unlocked: false, informations: undefined};
		}
		transactions = response.result.filter(e => e.contractAddress === erc20Address);
	} else {
		transactions = data.erc20.filter(e => e.contractAddress === erc20Address);
	}

	let		balance = bigNumber.from(0);
	const	failed = transactions.every(({from, to, value, blockNumber, hash, timeStamp}) => {
		if (address(from) === address(userAddress) && address(to) === address(userAddress)) {
			//nothing to do
		} else if (address(from) === address(userAddress)) {
			balance = balance.sub(bigNumber.from(value));
		} else if (address(to) === address(userAddress)) {
			balance = balance.add(bigNumber.from(value));
		}
		if (balance.gte(bigAmount)) {
			informations = {blockNumber, hash, timestamp: timeStamp * 1000, details: balance.toString()}
			return false;
		}
		return true;
	});
	return {unlocked: !failed, informations};
}

export default checkERC20Amount;
