/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 8th 2021
**	@Filename:				achievements.js
******************************************************************************/

import	checkYearnDaiExploit	from	'achievements/checkYearnDaiExploit';
import	checkERC20Amount		from	'achievements/checkERC20Amount';
import	checkGasPrice			from	'achievements/checkGasPrice';
import	checkAirdrop			from	'achievements/checkAirdrop';

const	Achievements = [
	{
		title: 'Booty ASSY',
		description: 'Own at least 1 ASSY DEFI index token.',
		icon: '🍑',
		background: 'conic-gradient(from 90deg at bottom right, cyan, rebeccapurple)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkERC20Amount(web3, address, '0xfa2562da1bba7b954f26c74725df51fb62646313', '1000000000000000000', data),
	},
	{
		title: 'Like a Unicorn',
		description: 'Receive an airdrop from Uniswap.',
		icon: '🦄',
		background: 'conic-gradient(from -270deg at 75% 110%, fuchsia, floralwhite)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkAirdrop(web3, address, '10875192', '0x090D4613473dEE047c3f2706764f49E0821D256e', data),
	},
	{
		title: 'Like a Dark Unicorn',
		description: 'Receive an airdrop from 1Inch.',
		icon: '🦄',
		background: 'linear-gradient(113.3deg, rgba(217,9,27,1) 6.9%, rgba(22,68,150,1) 75%)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkAirdrop(web3, address, '11517558', '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe', data),
	},
	{
		title: 'Pwnd',
		description: 'Be a victim of a smartContract hack.',
		icon: '😵',
		background: 'conic-gradient(at 125% 50%, #b78cf7, #ff7c94, #ffcf0d, #ff7c94, #b78cf7)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address) => checkYearnDaiExploit(web3, address),
	},
	{
		title: 'Pwnd Protection',
		description: 'Be a victim of a smartContract hack. But with an insurance.',
		icon: '🛡',
		background: 'conic-gradient(from -135deg at -10% center, #ffa500, #ff7715, #ff522a, #ff3f47, #ff5482, #ff69b4)',
		unlocked: false,
		claimed: false,
	},
	{
		title: 'Stable Vault-Tec 114',
		description: 'Store at least 114$ in the yDai Vault V1',
		icon: '🔒',
		background: 'conic-gradient(from .5turn at center left, lime, cyan)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkERC20Amount(web3, address, '0xacd43e627e64355f1861cec6d3a6688b31a6f952', '114000000000000000000', data),
	},
	{
		title: 'Airdrop seeker',
		description: 'Get involved in 6 different airdrops.',
		icon: '🪂',
		background: 'conic-gradient(from -90deg at bottom center, papayawhip, peachpuff)',
		unlocked: false,
		claimed: false,
	},
	{
		title: 'Cheap AF',
		description: 'Pay less than 60 gwei for a transaction in 2021',
		icon: '🤑',
		background: 'linear-gradient(to bottom right, #8DD2C0, #1D722C)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkGasPrice(web3, address, '11565019', '60000000000', -1, data),
	},
	{
		title: 'Ethereum is SOOO Cheap',
		description: 'Pay more than 150 gwei for a transaction in 2021',
		icon: '😑',
		background: 'linear-gradient(109.6deg, rgba(255,174,0,1) 11.2%, rgba(255,0,0,1) 100.2%)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkGasPrice(web3, address, '11565019', '150000000000', 1, data),
	},
	{
		title: 'Instant trader',
		description: 'Pay a transaction with a gas price above 1000 Gwei in 2021',
		icon: '🔥',
		background: 'linear-gradient(to bottom right, #DB1926, #90388E)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkGasPrice(web3, address, '11565019', '1000000000000', 1, data),
	},
	{
		title: 'Sushi & Bento',
		description: 'Make 4 swaps on SushiSwap',
		icon: '🍣',
		background: 'linear-gradient(to bottom right, #EB9A2A, #DC5F5D)',
		unlocked: false,
		claimed: false
	},
	{
		title: 'One coin to rule them all',
		description: 'Get at least 0.001 wBTC in your wallet.',
		icon: '₿',
		background: 'linear-gradient(to bottom right, #f7931a, #DF5820)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkERC20Amount(web3, address, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', '100000', data),
	},
	{
		title: 'Wrapper',
		description: 'Get at least 0.001 wETH in your wallet.',
		icon: 'Ξ',
		background: 'linear-gradient(to bottom right, #c6c5d4, #37367b)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkERC20Amount(web3, address, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1000000000000000', data),
	},
	{
		title: 'Early adopter',
		description: 'Fill a random Google Form, drunk at 2am, to get a 40k$ airdrop from Inverse Finance',
		icon: '😤',
		background: 'linear-gradient( 183.5deg, rgba(244,173,6,1) 18.6%, rgba(229,251,31,1) 119.9%)',
		unlocked: false,
		claimed: false,
		checkAchievement: (web3, address, data) => checkAirdrop(web3, address, '11526195', '0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68', data),
	},
	{
		title: 'Sponsor',
		description: 'Send us token, and become one of our sponsor.',
		icon: '🎖',
		background: 'conic-gradient(from -.5turn at bottom right, deeppink, cyan, rebeccapurple)',
		unlocked: false,
		claimed: false,
	},
]

const	getAchievements = () => {
	const	clone = Achievements.map(e => ({...e}));
	return clone
};

export default getAchievements;