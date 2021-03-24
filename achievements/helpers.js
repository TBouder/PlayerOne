/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 11th 2021
**	@Filename:				helpers.js
******************************************************************************/

import	checkYearnDaiExploit	from	'achievements/checkYearnDaiExploit';
import	checkERC20Amount		from	'achievements/checkERC20Amount';
import	checkGasPrice			from	'achievements/checkGasPrice';
import	checkAirdrop			from	'achievements/checkAirdrop';
import	checkWalletLogin		from	'achievements/checkWalletLogin';
import	checkSponsoring			from	'achievements/checkSponsoring';

export function getStrategy(strategy) {
	if (strategy === 'checkYearnDaiExploit') {
		return checkYearnDaiExploit;
	} else if (strategy === 'checkERC20Amount') {
		return checkERC20Amount;
	} else if (strategy === 'checkAirdrop') {
		return checkAirdrop;
	} else if (strategy === 'checkWalletLogin') {
		return checkWalletLogin;
	} else if (strategy === 'checkGasPrice') {
		return checkGasPrice;
	} else if (strategy === 'checkSponsoring') {
		return checkSponsoring;
	}
	return undefined;
}
