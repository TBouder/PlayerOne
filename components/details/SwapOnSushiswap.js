/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				SwapOnSushiswap.js
******************************************************************************/

import	{useState, useEffect}		from	'react';
import	useSWR								from	'swr';
import	{request}							from	'graphql-request';
import	useWeb3								from	'contexts/useWeb3';

const	SWAP_GRAPHS = {
	SUSHISWAP: 'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork'
}

function	SwapOnSushiswap() {
	const	{address, actions} = useWeb3();
	const	[swapToken0, set_swapToken0] = useState(0);
	const	[swapToken1, set_swapToken1] = useState(50);

	/**************************************************************************
	**	We may need some informations to be able to perform the action, thanks
	**	to graphQL.
	**	This part may change a lot (should we use a graph ? Which pair ? Which
	**	uri ?).
	**************************************************************************/
	const {data: sushiswapData} = useSWR(
		SWAP_GRAPHS.SUSHISWAP,
		`{
			pair(id: "0x46acb1187a6d83e26c0bb46a57ffeaf23ad7851e") {
				id,
				token0{id},
				token1{id},
				reserveETH,
				token0Price,
				token1Price	
			}
		}`,
		(uri, query) => request(uri, query)
	);

	useEffect(() => {
		if (sushiswapData?.pair) {
			set_swapToken0((sushiswapData.pair?.token0Price || 0) * 50)
			set_swapToken1(50);
		}
	}, [sushiswapData])

	return (
		<section aria-label={'swap'} className={'flex flex-row justify-between items-center mt-8'}>
			<div className={'w-full'}>
				<div className={'relative rounded-md shadow'}>
					<div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'}>
					<span className={'text-gray-500'}>{'Ξ'}</span>
					</div>
					<input
						type={'text'}
						name={'price'}
						id={'price'}
						value={swapToken0}
						onChange={(e) => {
							set_swapToken0(e.target.value);
							set_swapToken1(e.target.value * (sushiswapData.pair?.token1Price));
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
						<span className={'text-gray-500'}>{'🍑'}</span>
					</div>
					<input
						type={'number'}
						name={'price-assy'}
						id={'price-assy'}
						className={'focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md'}
						value={swapToken1}
						onChange={(e) => {
							set_swapToken1(e.target.value);
							set_swapToken0(e.target.value * (sushiswapData.pair?.token0Price));
						}}
						placeholder={'0.00'}
						aria-describedby={'price-assy-currency'} />
					<div className={'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'}>
						<span className={'text-gray-500 sm:text-sm'} id={'price-assy-currency'}>{'ASSY'}</span>
					</div>
				</div>
			</div>
			<div className={'mx-8'}>
				<div>
					<button
						onClick={() => {
							const	wei = swapToken0*10e17
							actions.swapOnSushiswap(
								undefined,
								[
									String(wei),
									[
										sushiswapData?.pair?.token0?.id,
										sushiswapData?.pair?.token1?.id,
									],
									address,
									'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
								],
								(e) => console.log(e)
							)
						}}
						type={'button'} className={'shadow inline-flex items-center px-3 py-2.5 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}>
						<svg className={'mr-2 -ml-0.5 h-4 w-4'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
						{'Swap'}
					</button>
				</div>
			</div>
		</section>
	)
}

export default SwapOnSushiswap;