/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				Badges.js
******************************************************************************/

const	badgeClassNames = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2';

export function Meta() {
	return (
		<span
		className={`${badgeClassNames} text-white`}
		style={{
			background: 'linear-gradient(90deg, rgba(20,184,166,0.2) 0%, rgba(139,92,246,0.2) 50%, rgba(236,72,153,0.2) 100%)',
			color: 'rgba(139,92,246,1)'
		}}>
			{'Meta'}
		</span>
	);
}
export function DEFI() {
	return (<span className={`${badgeClassNames} bg-gray-600 bg-opacity-20 text-gray-800`}>{'DEFI'}</span>);
}
export function Airdrop() {
	return (<span className={`${badgeClassNames} bg-teal-600 bg-opacity-20 text-teal-800`}>{'Airdrop'}</span>);
}
export function Exploit() {
	return (<span className={`${badgeClassNames} bg-red-600 bg-opacity-20 text-red-800`}>{'Exploit'}</span>);
}
export function Fees() {
	return (<span className={`${badgeClassNames} bg-green-600 bg-opacity-20 text-green-800`}>{'Fees'}</span>);
}
export function ERC20() {
	return (<span className={`${badgeClassNames} bg-amber-600 bg-opacity-20 text-amber-800`}>{'ERC-20'}</span>);
}
export function Protocole1Inch() {
	return (
		<span className={`${badgeClassNames}`} style={{background: 'rgba(223, 235, 255, 1)', color: 'rgba(85, 153, 255, 1)'}}>
			{'1Inch'}
		</span>
	);
}
export function ProtocoleUniswap() {
	return (
		<span
			className={`${badgeClassNames}`}
			style={{
				background: 'linear-gradient(128.17deg, rgba(189, 0, 255, 0.2) -14.78%, rgba(255, 31, 138, 0.2) 110.05%)',
				color: '#BD00FF'
			}}>
			{'Uniswap'}
		</span>
	);
}
export function ProtocoleSushiswap() {
	return (
		<span
			className={`${badgeClassNames}`}
			style={{background: 'radial-gradient(circle at left top, rgba(37, 167, 219, 0.3), rgba(250, 82, 160, 0.3)', color: 'rgb(250, 81, 157)'}}>
			{'Sushiswap'}
		</span>
	);
}

export function ProtocoleAAVE() {
	return (<span className={`${badgeClassNames}`}>{'AAVE'}</span>);
}
export function ProtocoleYearn() {
	return (<span className={`${badgeClassNames}`} style={{background: 'rgba(0, 106, 227, 0.2)', color: 'rgb(0, 106, 227)'}}>{'Yearn'}</span>);
}

export function Badge({type}) {
	if (type === 'meta') return (<Meta />);
	if (type === 'defi') return (<DEFI />);
	if (type === 'airdrop') return (<Airdrop />);
	if (type === 'exploit') return (<Exploit />);
	if (type === 'fees') return (<Fees />);
	if (type === 'erc20') return (<ERC20 />);
	if (type === '1inch') return (<Protocole1Inch />);
	if (type === 'uniswap') return (<ProtocoleUniswap />);
	if (type === 'sushiswap') return (<ProtocoleSushiswap />);
	if (type === 'aave') return (<ProtocoleAAVE />);
	if (type === 'yearn') return (<ProtocoleYearn />);
	return (<span className={`${badgeClassNames} bg-gray-600 bg-opacity-20 text-gray-800`}>{type}</span>);
}