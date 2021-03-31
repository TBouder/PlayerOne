/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				SwapRouter.js
******************************************************************************/

import	{useState, useEffect}				from	'react';
import	useSWR								from	'swr';
import	{ethers}							from	'ethers';
import	{request}							from	'graphql-request';
import	useWeb3								from	'contexts/useWeb3';
import	{Percent}							from	'@uniswap/sdk'
import	{bigNumber}							from	'utils';
import	{DEFAULT_TIMESTAMP}					from 	'utils/const';

const	SWAP_GRAPHS = {
	SUSHISWAP: 'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork',
	UNISWAP: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
}
const	ROUTER_ADDRESS = {
	SUSHISWAP: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
	UNISWAP: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
}

const	AMOUNTS_IN_OUT_ABI = [
	'function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)',
	'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'
];

function	GetSwapGraph(routerAddress) {
	if (routerAddress === ROUTER_ADDRESS.UNISWAP) {
		return SWAP_GRAPHS.UNISWAP
	} else if (routerAddress === ROUTER_ADDRESS.SUSHISWAP) {
		return SWAP_GRAPHS.SUSHISWAP
	}
}

function	SwapRouter({routerAddress, pairID, token}) {
	const	{address, actions, provider} = useWeb3();
	const	[swapPath, set_swapPath] = useState([]);
	const	[swapOrder, set_swapOrder] = useState(0);
	const	[swapToken0, set_swapToken0] = useState(0);
	const	[swapToken1, set_swapToken1] = useState(50);
	const	[swapToken0Decimals, set_swapToken0Decimals] = useState(0);
	const	[swapToken1Decimals, set_swapToken1Decimals] = useState(0);
	const	[ratio, set_ratio] = useState(bigNumber.from(0));
	const	slippageTolerance = new Percent('50', '10000');

	/**************************************************************************
	**	We may need some informations to be able to perform the action, thanks
	**	to graphQL.
	**	This part may change a lot (should we use a graph ? Which pair ? Which
	**	uri ?).
	**************************************************************************/
	const {data: swapData} = useSWR(
		`{
			pair(id: "${pairID}") {
				id,
				token0{id,symbol,decimals},
				token1{id,symbol,decimals},
				reserveETH,
				token0Price,
				token1Price	
			}
		}`,
		(query) => request(GetSwapGraph(routerAddress), query)
	);

	useEffect(() => {
		if (swapData?.pair) {
			if (swapData?.pair?.token0?.symbol === 'WETH') {
				set_swapPath([swapData?.pair?.token0?.id, swapData?.pair?.token1?.id]);
				set_swapToken0((swapData.pair?.token0Price || 0) * 50)
				set_swapToken0Decimals(swapData?.pair?.token0?.decimals)
				set_swapToken1Decimals(swapData?.pair?.token1?.decimals)
				set_swapOrder(1);
			} else if (swapData?.pair?.token1?.symbol === 'WETH') {
				set_swapPath([swapData?.pair?.token1?.id, swapData?.pair?.token0?.id]);
				set_swapToken0((swapData.pair?.token1Price || 0) * 50)
				set_swapToken0Decimals(swapData?.pair?.token1?.decimals)
				set_swapToken1Decimals(swapData?.pair?.token0?.decimals)
				set_swapOrder(-1);
			}
			set_swapToken1(50);
		}
	}, [swapData])

	async function	calculateAmountIn(amountOut, decimalsOut, path) {
		try {
			console.log(amountOut)
			const	toEth = ethers.utils.parseUnits(amountOut, decimalsOut);
			console.log(toEth.toString())
			const	contract = new ethers.Contract(routerAddress, AMOUNTS_IN_OUT_ABI, provider);
			const	amountIn = await contract.getAmountsIn(toEth, path);
			const	slippage = slippageTolerance.multiply(amountIn[0]).quotient.toString();
			const	ethToPay = amountIn[0].add(slippage);
			return	ethToPay;
		} catch(e) {
			return e
		}
	}
	async function	calculateAmountOut(amountIn, decimalsIn, path) {
		try {
			const	toEth = ethers.utils.parseUnits(amountIn, decimalsIn);
			const	contract = new ethers.Contract(routerAddress, AMOUNTS_IN_OUT_ABI, provider);
			const	amountOut = await contract.getAmountsOut(toEth, path);
			const	slippage = slippageTolerance.multiply(amountOut[0]).quotient.toString();
			const	ethToPay = amountOut[0].add(slippage);
			return	ethToPay;
		} catch(e) {
			return e
		}
	}

	return (
		<section aria-label={'swap'} className={'flex flex-row justify-between items-center mt-8'}>
			<div className={'w-full'}>
				<div className={'relative rounded-md shadow'}>
					<div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'}>
					<span className={'text-gray-500'}>{'Ξ'}</span>
					</div>
					<input
						type={'number'}
						name={'price'}
						id={'price'}
						readOnly
						value={swapToken0}
						onChange={(e) => {
							if (swapOrder === 1) {
								set_swapToken0(e.target.value);
								set_swapToken1(e.target.value * (swapData.pair?.token1Price));
							} else if (swapOrder === -1) {
								set_swapToken0(e.target.value);
								set_swapToken1(e.target.value * (swapData.pair?.token0Price));
							}
						}}
						className={'focus:ring-teal-500 focus:border-teal-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md'}
						placeholder={'0.00'}
						aria-describedby={'price-currency'} />
					<div className={'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'}>
						<span className={'text-gray-500 sm:text-sm'} id={'price-currency'}>{'ETH'}</span>
					</div>
				</div>
			</div>
			<div className={'mx-8'}>
				<div>
					<svg className={'w-4 h-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
				</div>
			</div>
			<div className={'w-full'}>
				<div className={'relative rounded-md shadow'}>
					<div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'}>
						<span className={'text-gray-500'}>{token.icon}</span>
					</div>
					<input
						type={'number'}
						name={'price-token1'}
						id={'price-token1'}
						className={'focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md'}
						value={swapToken1}
						onChange={(e) => {
							if (swapOrder === 1) {
								set_swapToken1(e.target.value);
								
								if (ratio.isZero()) {
									calculateAmountIn(
										String(e.target.value),
										swapPath
									).then((price) => {
										const	_ratio = bigNumber.from(price).div(e.target.value);
										set_ratio(_ratio);
										set_swapToken0(ethers.utils.formatUnits(price, 'wei'));
									})
									.catch((err) => {
										set_swapToken0(e.target.value * (swapData.pair?.token0Price));
									})
								} else {
									const	bigValue = ethers.utils.parseUnits(e.target.value, 'wei');
									const	token0WithRatio = bigValue.mul(ratio);
									set_swapToken0(ethers.utils.formatUnits(token0WithRatio, 'ether'));
								}
							} else if (swapOrder === -1) {
								set_swapToken1(e.target.value);
								set_swapToken0((e.target.value * (swapData.pair?.token1Price)) * 101/100);
							}

						}}
						placeholder={'0.00'}
						aria-describedby={'price-token1-currency'} />
					<div className={'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'}>
						<span className={'text-gray-500 sm:text-sm'} id={'price-token1-currency'}>{token.name}</span>
					</div>
				</div>
			</div>
			<div className={'mx-8'}>
				<div>
					<button
						onClick={async () => {
							let	amountOutWei;
							let	ethToPay;
							if (swapOrder === 1) {
								amountOutWei = ethers.utils.parseUnits(String(swapToken1), swapToken1Decimals);
								ethToPay = await calculateAmountIn(String(swapToken1), swapToken1Decimals, swapPath)
							} else if (swapOrder === -1) {
								console.log(String(swapToken1), swapToken1Decimals)
								console.log(String(swapToken0), swapToken0Decimals)
								amountOutWei = ethers.utils.parseUnits(String(swapToken1), swapToken1Decimals)
								ethToPay = await calculateAmountOut(String(swapToken0), swapToken0Decimals, swapPath)
							}

							actions.SwapRouter(
								routerAddress,
								[
									amountOutWei.toString(),
									swapPath,
									address,
									DEFAULT_TIMESTAMP
								],
								ethToPay.toString(),
								(e) => console.log(e)
							)
						}}
						type={'button'} className={'inline-flex items-center px-3 py-2.5 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}>
						<svg className={'mr-2 -ml-0.5 h-4 w-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
						{'Swap'}
					</button>
				</div>
			</div>
		</section>
	)
}

export default SwapRouter;