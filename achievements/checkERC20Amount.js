import	axios	from	'axios';

/******************************************************************************
** _DETAILS_: Check if a specific address had a specific amount of some ERC20
**		in the wallet lifetime
******************************************************************************/
const	ERC20_JSON = [{"constant": true,"inputs": [{"name": "_owner","type": "address"}],"name": "balanceOf","outputs": [{"name": "balance","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "src","type": "address"}, {"indexed": true,"internalType": "address","name": "dst","type": "address"}, {"indexed": false,"internalType": "uint256","name": "wad","type": "uint256"}],"name": "Transfer","type": "event"}];

async function	checkERC20Amount(web3, userAddress, erc20Address, amount, data) {
	const	erc20Json = new web3.eth.Contract(ERC20_JSON, erc20Address);
	const	BN = web3.utils.BN;
	const	toChecksumAddress = web3.utils.toChecksumAddress;
	const	bigAmount = new BN(amount);
	let		informations = undefined;
	let		transactions = [];

	//1 - checking if balance is above amount -> true if yes
	const	balanceRightNow = await erc20Json.methods.balanceOf(userAddress).call().then(e => e);
	if (new BN(balanceRightNow).gt(bigAmount)) {
		return {unlocked: true, informations: {
			blockNumber: await web3.eth.getBlockNumber(),
			hash: (await web3.eth.getBlock('latest')).hash,
			details: new BN(balanceRightNow).toString(),
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

	let		balance = new BN(0);
	const	failed = transactions.every(({from, to, value, blockNumber, hash, timeStamp}) => {
		if (toChecksumAddress(from) === toChecksumAddress(userAddress) && toChecksumAddress(to) === toChecksumAddress(userAddress)) {
			//nothing to do
		} else if (toChecksumAddress(from) === toChecksumAddress(userAddress)) {
			balance = balance.sub(new BN(value));
		} else if (toChecksumAddress(to) === toChecksumAddress(userAddress)) {
			balance = balance.add(new BN(value));
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
