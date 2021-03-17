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
import	checkWalletLogin		from	'achievements/checkWalletLogin';

const	Achievements = [
	{
		UUID: 'af327787-cb54-4351-8cbb-093c859f97ee',
		title: 'Pioneer',
		description: 'Connect your wallet',
		icon: '💸',
		background: 'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)',
		badges: ['meta'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider) => checkWalletLogin(provider),
		check: 'checkWalletLogin',
		checkArguments: {}
	},
	{
		UUID: '029e3d84-adab-4a25-9e99-2549667ae325',
		title: 'Booty ASSY',
		description: 'Own at least 1 ASSY DEFI index token.',
		icon: '🍑',
		background: 'conic-gradient(from 90deg at bottom right, cyan, rebeccapurple)',
		badges: ['erc20', 'defi'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkERC20Amount(provider, address, '0xfa2562da1bba7b954f26c74725df51fb62646313', '1000000000000000000', data),
		check: 'checkERC20Amount',
		checkArguments: {
			address: '0xfa2562da1bba7b954f26c74725df51fb62646313',
			value: '1000000000000000000'
		}
	},
	{
		UUID: 'd63b6d4b-811e-4f13-8a51-506628294683',
		title: 'Like a Unicorn',
		description: 'Receive an airdrop from Uniswap.',
		icon: '🦄',
		background: 'conic-gradient(from -270deg at 75% 110%, fuchsia, floralwhite)',
		badges: ['uniswap', 'airdrop', 'erc20', 'defi'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkAirdrop(provider, address, '10875192', '0x090D4613473dEE047c3f2706764f49E0821D256e', data),
		check: 'checkAirdrop',
		checkArguments: {
			address: '0x090D4613473dEE047c3f2706764f49E0821D256e',
			block: '10875192'
		}
	},
	{
		UUID: '97020eab-f4d5-4aa5-9549-ec2f75111b93',
		title: 'Like a Dark Unicorn',
		description: 'Receive an airdrop from 1Inch.',
		icon: '🦄',
		badges: ['1inch', 'airdrop', 'erc20', 'defi'],
		background: 'linear-gradient(113.3deg, rgba(217,9,27,1) 6.9%, rgba(22,68,150,1) 75%)',
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkAirdrop(provider, address, '11517558', '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe', data),
		check: 'checkAirdrop',
		checkArguments: {
			address: '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe',
			block: '11517558'
		}
	},
	{
		UUID: 'cacfc0bd-4216-48e4-a3f1-10c8bdbd0b66',
		title: 'Pwnd',
		description: 'Be a victim of the yDai smartContract hack.',
		icon: '😵',
		background: 'conic-gradient(at 125% 50%, #b78cf7, #ff7c94, #ffcf0d, #ff7c94, #b78cf7)',
		badges: ['yearn', 'exploit', 'defi'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address) => checkYearnDaiExploit(provider, address),
		check: 'checkYearnDaiExploit',
		checkArguments: {}
	},
	{
		UUID: 'cc22bb74-7e1c-42cb-82ff-b85684439856',
		title: 'Pwnd Protection',
		description: 'Get covered for the yDai smartContract hack.',
		icon: '🛡',
		background: 'conic-gradient(from -135deg at -10% center, #ffa500, #ff7715, #ff522a, #ff3f47, #ff5482, #ff69b4)',
		badges: ['yearn', 'exploit', 'defi'],
		unlocked: false,
		claimed: false,
		checkArguments: {}
	},
	{
		UUID: '268480ee-d580-4029-9432-2203678ec377',
		title: 'Stable Vault-Tec 114',
		description: 'Store at least 114$ in the yDai Vault V1',
		icon: '🔒',
		background: 'conic-gradient(from .5turn at center left, lime, cyan)',
		badges: ['yearn', 'erc20', 'defi'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkERC20Amount(provider, address, '0xacd43e627e64355f1861cec6d3a6688b31a6f952', '114000000000000000000', data),
		check: 'checkERC20Amount',
		checkArguments: {
			address: '0xacd43e627e64355f1861cec6d3a6688b31a6f952',
			value: '114000000000000000000'
		}
	},
	{
		UUID: '2cde12c0-7817-4034-ade7-306c123d834f',
		title: 'Airdrop seeker',
		description: 'Get involved in 6 different airdrops.',
		icon: '🪂',
		background: 'conic-gradient(from -90deg at bottom center, papayawhip, peachpuff)',
		badges: ['airdrop', 'erc20', 'defi'],
		unlocked: false,
		claimed: false,
		checkArguments: {}
	},
	{
		UUID: '9fe57dcb-68a3-4d4f-89ff-714b783f6610',
		title: 'Cheap AF',
		description: 'Pay less than 60 gwei for a transaction in 2021',
		icon: '🤑',
		background: 'linear-gradient(to bottom right, #8DD2C0, #1D722C)',
		badges: ['fees'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkGasPrice(provider, address, '11565019', '60000000000', -1, data),
		check: 'checkGasPrice',
		checkArguments: {
			startBlock: '11565019',
			value: '60000000000',
			moreOrLess: -1
		}
	},
	{
		UUID: '8697b471-b78e-445e-8da9-2cea79abfd0a',
		title: 'Ethereum is SOOO Cheap',
		description: 'Pay more than 150 gwei for a transaction in 2021',
		icon: '😑',
		background: 'linear-gradient(109.6deg, rgba(255,174,0,1) 11.2%, rgba(255,0,0,1) 100.2%)',
		badges: ['fees'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkGasPrice(provider, address, '11565019', '150000000000', 1, data),
		check: 'checkGasPrice',
		checkArguments: {
			startBlock: '11565019',
			value: '150000000000',
			moreOrLess: 1
		}
	},
	{
		UUID: 'd54d6aa8-29ea-4575-be00-0df2c3738e77',
		title: 'Instant trader',
		description: 'Pay a transaction with a gas price above 1000 Gwei in 2021',
		icon: '🔥',
		background: 'linear-gradient(to bottom right, #DB1926, #90388E)',
		badges: ['fees'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkGasPrice(provider, address, '11565019', '1000000000000', 1, data),
		check: 'checkGasPrice',
		checkArguments: {
			startBlock: '11565019',
			value: '1000000000000',
			moreOrLess: 1
		}
	},
	{
		UUID: '967fa724-69f8-493d-b841-c72b245c2295',
		title: 'Sushi & Bento',
		description: 'Make 4 swaps on SushiSwap',
		icon: '🍣',
		background: 'linear-gradient(to bottom right, #EB9A2A, #DC5F5D)',
		badges: ['sushiswap', 'defi'],
		unlocked: false,
		claimed: false,
		checkArguments: {}
	},
	{
		UUID: '95adcf07-d866-4f21-aa01-33f2a84415fa',
		title: 'One coin to rule them all',
		description: 'Get at least 0.001 wBTC in your wallet.',
		icon: '₿',
		background: 'linear-gradient(to bottom right, #f7931a, #DF5820)',
		badges: ['erc20'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkERC20Amount(provider, address, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', '100000', data),
		check: 'checkERC20Amount',
		checkArguments: {
			address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
			value: '100000'
		}
	},
	{
		UUID: '9820837d-a179-4d4b-9bc2-f8e25e5ddd72',
		title: 'Wrapper',
		description: 'Get at least 0.001 wETH in your wallet.',
		icon: 'Ξ',
		background: 'linear-gradient(to bottom right, #c6c5d4, #37367b)',
		badges: ['erc20'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkERC20Amount(provider, address, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1000000000000000', data),
		check: 'checkERC20Amount',
		checkArguments: {
			address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			value: '1000000000000000'
		}
	},
	{
		UUID: 'f41eb8fa-761e-46c0-a82f-6358f6425a3a',
		title: 'Early adopter',
		description: 'Fill a random Google Form, drunk at 2am, to get a 40k$ airdrop from Inverse Finance',
		icon: '😤',
		background: 'linear-gradient( 183.5deg, rgba(244,173,6,1) 18.6%, rgba(229,251,31,1) 119.9%)',
		badges: ['airdrop', 'inverseFinance', 'erc20'],
		unlocked: false,
		claimed: false,
		checkAchievement: (provider, address, data) => checkAirdrop(provider, address, '11526195', '0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68', data),
		check: 'checkAirdrop',
		checkArguments: {
			address: '0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68',
			block: '11526195'
		}
	},
	{
		UUID: '48cbd64e-a50c-4ce2-96cf-ab548d476b8c',
		title: 'Sponsor',
		description: 'Send us token, and become one of our sponsor.',
		icon: '🎖',
		background: 'conic-gradient(from -.5turn at bottom right, deeppink, cyan, rebeccapurple)',
		badges: ['meta'],
		unlocked: false,
		claimed: false,
		checkArguments: {}
	},
]

const	getAchievements = () => {
	const	clone = Achievements.map(e => ({...e}));
	return clone
};

export default getAchievements;