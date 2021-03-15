/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				Badges.js
******************************************************************************/

import	{useState, useEffect}	from	'react';

const	badgeClassNames = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 mb-2 lg:mb-0';

export function Meta({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-teal-600 bg-opacity-20 border-teal-600 border-opacity-20 text-teal-800'
				}
				cursor-pointer border border-solid 
				hover:bg-teal-600 hover:bg-opacity-20 hover:border-teal-600 hover:border-opacity-20 hover:text-teal-800
			`}>
		{'Meta'}
		</span>
	);
}
export function DEFI({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-gray-600 bg-opacity-20 border-gray-600 border-opacity-20 text-gray-800'
				}
				cursor-pointer border border-solid 
				hover:bg-gray-600 hover:bg-opacity-20 hover:border-gray-600 hover:border-opacity-20 hover:text-gray-800
			`}>
			{'DEFI'}
		</span>
	);
}
export function Airdrop({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-orange-600 bg-opacity-20 border-orange-600 border-opacity-20 text-orange-800'
				}
				cursor-pointer border border-solid 
				hover:bg-orange-600 hover:bg-opacity-20 hover:border-orange-600 hover:border-opacity-20 hover:text-orange-800
			`}>
			{'Airdrop'}
		</span>
	);
}
export function Exploit({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-red-600 bg-opacity-20 border-red-600 border-opacity-20 text-red-800'
				}
				cursor-pointer border border-solid 
				hover:bg-red-600 hover:bg-opacity-20 hover:border-red-600 hover:border-opacity-20 hover:text-red-800
			`}>
			{'Exploit'}
		</span>
	);
}
export function Fees({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-green-600 bg-opacity-20 border-green-600 border-opacity-20 text-green-800'
				}
				cursor-pointer border border-solid 
				hover:bg-green-600 hover:bg-opacity-20 hover:border-green-600 hover:border-opacity-20 hover:text-green-800
			`}>
			{'Fees'}
		</span>
	);
}
export function ERC20({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-amber-600 bg-opacity-20 border-amber-600 border-opacity-20 text-amber-800'
				}
				cursor-pointer border border-solid 
				hover:bg-amber-600 hover:bg-opacity-20 hover:border-amber-600 hover:border-opacity-20 hover:text-amber-800
			`}>
			{'ERC-20'}
		</span>
	);
}
export function Protocole1Inch({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-1inch-600 bg-opacity-20 border-1inch-600 border-opacity-20 text-1inch-800'
				}
				cursor-pointer border border-solid 
				hover:bg-1inch-600 hover:bg-opacity-20 hover:border-1inch-600 hover:border-opacity-20 hover:text-1inch-800
			`}>
			{'1Inch'}
		</span>
	);
}
export function ProtocoleUniswap({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-uniswap-600 bg-opacity-20 border-uniswap-600 border-opacity-20 text-uniswap-800'
				}
				cursor-pointer border border-solid 
				hover:bg-uniswap-600 hover:bg-opacity-20 hover:border-uniswap-600 hover:border-opacity-20 hover:text-uniswap-800
			`}>
			{'Uniswap'}
		</span>
	);
}
export function ProtocoleSushiswap({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-sushiswap-600 bg-opacity-20 border-sushiswap-600 border-opacity-20 text-sushiswap-800'
				}
				cursor-pointer border border-solid 
				hover:bg-sushiswap-600 hover:bg-opacity-20 hover:border-sushiswap-600 hover:border-opacity-20 hover:text-sushiswap-800
			`}>
			{'Sushiswap'}
		</span>
	);
}
export function ProtocoleYearn({selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-yearn-600 bg-opacity-20 border-yearn-600 border-opacity-20 text-yearn-800'
				}
				cursor-pointer border border-solid 
				hover:bg-yearn-600 hover:bg-opacity-20 hover:border-yearn-600 hover:border-opacity-20 hover:text-yearn-800
			`}>
			{'Yearn'}
		</span>
	);
}
export function Default({type, selected, onClick}) {
	return (
		<span
			onClick={onClick}
			className={`
				${badgeClassNames}
				${!selected ?
					'bg-gray-100 border-gray-200 text-gray-400'
					:
					'bg-gray-600 bg-opacity-20 border-gray-600 border-opacity-20 text-gray-800'
				}
				cursor-pointer border border-solid 
				hover:bg-gray-600 hover:bg-opacity-20 hover:border-gray-600 hover:border-opacity-20 hover:text-gray-800
			`}>
			{type}
		</span>
	);
}

export	function getBadgeList() {
	return ([
		'meta',
		'defi',
		'airdrop',
		'exploit',
		'fees',
		'erc20',
		'1inch',
		'uniswap',
		'sushiswap',
		'yearn',
	].map(e => e));
}

function	Badge({type, defaultSelected, onClick, disable}) {
	const	[selected, set_selected] = useState(defaultSelected);

	if (type === 'meta') {
		return (
			<Meta
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === 'defi') {
		return (
			<DEFI
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === 'airdrop') {
		return (
			<Airdrop
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === 'exploit') {
		return (
			<Exploit
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === 'fees') {
		return (
			<Fees
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === 'erc20') {
		return (
			<ERC20
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === '1inch') {
		return (
			<Protocole1Inch
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === 'uniswap') {
		return (
			<ProtocoleUniswap
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === 'sushiswap') {
		return (
			<ProtocoleSushiswap
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	if (type === 'yearn') {
		return (
			<ProtocoleYearn
				selected={selected}
				onClick={() => {
					if (disable)
						return null;
					set_selected(s => !s);
					onClick();
				}} />
		);
	}
	return (
		<Default
			type={type}
			selected={selected}
			onClick={() => {
				if (disable)
					return null;
				set_selected(s => !s);
				onClick();
			}} />
	);
}

export default Badge;