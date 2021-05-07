/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday March 6th 2021
**	@Filename:				checkYearnDaiExploit.js
******************************************************************************/

import	{toAddress} 			from	'utils'

/******************************************************************************
** _DETAILS_: Check if a specific address has performed a tx with a specific
**		      method
**	
**	UNISWAP V2 -> LP
**	"0xe8e33700": "addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)",
**	"0xf305d719": "addLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
**	"0xbaa2abde": "removeLiquidity(address,address,uint256,uint256,uint256,address,uint256)",
**	"0x02751cec": "removeLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
**	"0xded9382a": "removeLiquidityETHWithPermit(address,uint256,uint256,uint256,address,uint256,bool,uint8,bytes32,bytes32)",
**	"0x2195995c": "removeLiquidityWithPermit(address,address,uint256,uint256,uint256,address,uint256,bool,uint8,bytes32,bytes32)",
**	
**	UNISWAP V2 -> SWAP
**	"0xfb3bdb41": "swapETHForExactTokens(uint256,address[],address,uint256)",
**	"0x7ff36ab5": "swapExactETHForTokens(uint256,address[],address,uint256)",
**	"0x18cbafe5": "swapExactTokensForETH(uint256,uint256,address[],address,uint256)",
**	"0x38ed1739": "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
**	"0x4a25d94a": "swapTokensForExactETH(uint256,uint256,address[],address,uint256)",
**	"0x8803dbee": "swapTokensForExactTokens(uint256,uint256,address[],address,uint256)",
**
**	UNISWAP V3 -> SWAP
**	"0xc04b8d59": "exactInput((bytes,address,uint256,uint256,uint256))",
**	"0x414bf389": "exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))",
**	"0xf28c0498": "exactOutput((bytes,address,uint256,uint256,uint256))",
**	"0xdb3e2198": "exactOutputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))",
**	"0xac9650d8": "multicall(bytes[])",
**
**	SUSHISWAP -> LP
**	"e8e33700": "addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)",
**	"f305d719": "addLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
**	"baa2abde": "removeLiquidity(address,address,uint256,uint256,uint256,address,uint256)",
**	"02751cec": "removeLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
**	"af2979eb": "removeLiquidityETHSupportingFeeOnTransferTokens(address,uint256,uint256,uint256,address,uint256)",
**	"ded9382a": "removeLiquidityETHWithPermit(address,uint256,uint256,uint256,address,uint256,bool,uint8,bytes32,bytes32)",
**	"5b0d5984": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address,uint256,uint256,uint256,address,uint256,bool,uint8,bytes32,bytes32)",
**	"2195995c": "removeLiquidityWithPermit(address,address,uint256,uint256,uint256,address,uint256,bool,uint8,bytes32,bytes32)",
**		
**	SUSHISWAP -> SWAP
**	"fb3bdb41": "swapETHForExactTokens(uint256,address[],address,uint256)",
**	"7ff36ab5": "swapExactETHForTokens(uint256,address[],address,uint256)",
**	"b6f9de95": "swapExactETHForTokensSupportingFeeOnTransferTokens(uint256,address[],address,uint256)",
**	"18cbafe5": "swapExactTokensForETH(uint256,uint256,address[],address,uint256)",
**	"791ac947": "swapExactTokensForETHSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)",
**	"38ed1739": "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
**	"5c11d795": "swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)",
**	"4a25d94a": "swapTokensForExactETH(uint256,uint256,address[],address,uint256)",
**	"8803dbee": "swapTokensForExactTokens(uint256,uint256,address[],address,uint256)",
**
**	UNISWAPV3 -> LP
**	"13ead562": "createAndInitializePoolIfNecessary(address,address,uint24,uint160)",
**	"0c49ccbe": "decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))",
**	"219f5d17": "increaseLiquidity((uint256,uint256,uint256,uint256,uint256,uint256))",
**	"88316456": "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
**
******************************************************************************/
async function	checkMethodID(provider, userAddress, walletData, args) {
	const	{address, methodsID} = args;
	const	transactions = walletData?.transactions;
	let		informations = undefined;

	if (transactions === undefined) {
		return {unlocked: false, informations: informations};
	}

	const	result = transactions.filter(each => toAddress(each.to) === toAddress(address) && toAddress(each.from) === toAddress(userAddress)).some((each) => {
		if (each.input && methodsID.includes(each.input.substr(0, 10), 0)) {
			informations = {
				blockNumber: each.blockNumber,
				hash: each.hash,
				details: each.input,
				timestamp: each.timeStamp * 1000,
			};
			return (true);
		}
		return (false);
	});

	return {unlocked: result, informations: informations};
}

export default checkMethodID;
