/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 11th 2021
**	@Filename:				helpers.js
******************************************************************************/

import	{ethers}				from	'ethers';
import	checkYearnDaiExploit	from	'achievements/checkYearnDaiExploit';
import	checkERC20Amount		from	'achievements/checkERC20Amount';
import	checkERC20AmountNew		from	'achievements/checkERC20Amount';
import	checkGasPrice			from	'achievements/checkGasPrice';
import	checkAirdrop			from	'achievements/checkAirdrop';
import	checkWalletLogin		from	'achievements/checkWalletLogin';

export const	bigNumber = ethers.BigNumber;
export const	address = ethers.utils.getAddress;
export const	toAddress = ethers.utils.getAddress;

export function getStrategy(strategy) {
	if (strategy === 'checkYearnDaiExploit') {
		return checkYearnDaiExploit;
	} else if (strategy === 'checkERC20Amount') {
		return checkERC20AmountNew;
	} else if (strategy === 'checkAirdrop') {
		return checkAirdrop;
	} else if (strategy === 'checkWalletLogin') {
		return checkWalletLogin;
	} else if (strategy === 'checkGasPrice') {
		return checkGasPrice;
	}
	return undefined;
}


// export function executeStrategy(provider, address, walletData, strategy) {
// 	if (strategy.name === 'checkYearnDaiExploit') {
// 		return checkYearnDaiExploit(provider, address, walletData, ...strategy.arguments);
// 	} else if (strategy.name === 'checkERC20Amount') {
// 		return checkERC20Amount(provider, address, walletData, ...strategy.arguments);
// 	} else if (strategy.name === 'checkAirdrop') {
// 		return checkAirdrop(provider, address, walletData, ...strategy.arguments);
// 	} else if (strategy.name === 'checkWalletLogin') {
// 		return checkWalletLogin(provider, address, walletData, ...strategy.arguments);
// 	} else if (strategy.name === 'checkGasPrice') {
// 		return checkGasPrice(provider, address, walletData, ...strategy.arguments);
// 	}
// 	return {unlocked: false, informations: undefined};
// }
