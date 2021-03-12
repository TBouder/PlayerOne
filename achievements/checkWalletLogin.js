/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 11th 2021
**	@Filename:				checkWalletLogin.js
******************************************************************************/

async function	checkWalletLogin(provider) {
	console.log(provider)
	const	blockNumber = await provider.getBlockNumber();

	return {unlocked: true, informations: {
		blockNumber,
		hash: (await provider.getBlock(blockNumber)).hash,
		details: 0,
		timestamp: Date.now(),
	}};
}

export default checkWalletLogin;