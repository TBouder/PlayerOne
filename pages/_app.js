/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday August 26th 2020
**	@Filename:				_app.js
******************************************************************************/

import	React, {Fragment, useState, useEffect}	from	'react';
import	NProgress					from	'nprogress';
import	Router						from	'next/router';
import	Head						from	'next/head';
import	{ToastProvider}				from	'react-toast-notifications';
import	Confetti					from	'react-dom-confetti';
import	{Transition}				from	'@headlessui/react';
import	{ethers}					from	'ethers';

import	useWeb3, {Web3ContextApp}	from	'contexts/useWeb3';
import	{AchievementsContextApp}	from	'contexts/useAchievements';
import	useUi, {UIApp}				from	'contexts/useUI';
import	useScrollRestoration		from	'hook/useScrollRestoration';
import	TopMenu						from	'components/TopMenu';
import	{Web3ReactProvider}			from	'@web3-react-fork/core';

import	'style/Default.scss'
import	'tailwindcss/tailwind.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function Example() {
	const	{chainID, active, address} = useWeb3();
	const	[show, set_show] = useState(false);

	useEffect(() => {
		set_show(active && chainID !== parseInt(80001, 16));
	}, [chainID, active])

	const addToNetwork = () => {
		const params = {
		  chainId: `0x${(80001).toString(16)}`,
		  chainName: 'Matic Testnet Mumbai',
		  nativeCurrency: {
			name: 'Matic',
			symbol: 'tMATIC',
			decimals: 18,
		  },
		  rpcUrls: ["https://rpc-mumbai.matic.today","wss://ws-mumbai.matic.today"],
		  blockExplorerUrls: ['https://matic.network/']
		}

		window.ethereum.request({
			method: 'wallet_addEthereumChain',
			params: [params, address],
		})
		.then(() => set_show(false))
		.catch((error) => console.error(error));
	}

	return (
		<div
			aria-live={'assertive'}
			className={'fixed inset-0 flex items-end justify-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end sm:justify-end'}>
			<Transition
				show={show}
				as={Fragment}
				enter={'transform ease-out duration-300 transition'}
				enterFrom={'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'}
				enterTo={'translate-y-0 opacity-100 sm:translate-x-0'}
				leave={'transition ease-in duration-100'}
				leaveFrom={'opacity-100'}
				leaveTo={'opacity-0'}>
				<div className={'max-w-lg w-full bg-white dark:bg-dark-background-600 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 dark:ring-dark-background-400 relative'}>
				<span className={`flex absolute h-3 w-3 top-0 left-0 -mt-1 -ml-1`}>
					<span className={'animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-600 opacity-75'} />
					<span className={'relative inline-flex rounded-full h-3 w-3 bg-accent-900'} />
				</span>
					<div className={'p-4'}>
						<div className={'flex items-start'}>
							<div className={'flex-shrink-0 pt-0.5'}>
								<img
									className={'h-10 w-10 object-contain'}
									src={'/polygon-logo.svg'}
									alt={''} />
							</div>
							<div className={'ml-5 w-0 flex-1'}>
								<p className={'text-sm font-medium text-gray-900 dark:text-white'}>
									{'We are using the Polygon Testnet !'}
								</p>
								<p className={'mt-1 text-sm text-gray-500 dark:text-gray-300'}>
									{'In order to offer you the smoothest experience, we are building Player One on the Polygon Network.'}
								</p>
								<p className={'mt-0.5 text-sm text-gray-500 dark:text-gray-300'}>
									{'Your achievements will still be verified on the Ethereum mainnet.'}
								</p>
								<div className={'mt-6 flex'}>
									<button
										onClick={addToNetwork}
										type={'button'}
										className={'inline-flex items-center px-3 py-2 border border-accent-900 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-accent-900 hover:bg-accent-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500'}>
										{'Add to Metamask'}
									</button>
									<a
										href={'https://faucet.matic.network/'}
										target={'_blank'}
										className={'ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500'}>
										{'Get tMatic from faucet'}
									</a>
								</div>
							</div>
							<div className={'ml-4 flex-shrink-0 flex'}>
								<button
									className={'bg-white dark:bg-dark-background-900 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500'}
									onClick={() => set_show(false)}>
									<span className={'sr-only'}>Close</span>
									<svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' /></svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	);
}



function	AppWrapper(props) {
	const	{Component, pageProps, router} = props;
	const	{confetti} = useUi();
	useScrollRestoration(router, '/');

	return (
		<>
			<Head>
				<title>{'Player One'}</title>
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta name={'description'} content={'Player One - Are you ready to claim your name ?'} />
				<meta name={'msapplication-TileColor'} content={'#9fcc2e'} />
				<meta name={'theme-color'} content={'#ffffff'} />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
				<meta charSet={'utf-8'} />
			</Head>
			<div id={'app'} className={'flex min-h-screen'}>
				<div className={'w-full overflow-x-hidden min-h-screen bg-white dark:bg-dark-background-900'} key={router.pathname}>
					<TopMenu />
					<div>
						<Component
							key={router.route}
							element={props.element}
							router={props.router}
							{...pageProps} />
					</div>
				</div>
			</div>
			<div id={'portal-confetti'}>
				<div
					className={'absolute pointer-events-none'}
					style={{top: confetti.get.y, left: confetti.get.x, zIndex: 100}}>
					<Confetti active={confetti.get.active} config={confetti.config} />
				</div>
			</div>
			<Example />
			<div id={'portal-root'} />
		</>
	);
}

function	MyApp(props) {
	const	{Component, pageProps} = props;
	const	[shouldReset, set_shouldReset] = useState(false);
	
	/**************************************************************************
	**	AchievementList: matches the list of all the achievements, fetched from
	**	the database in getStaticProps on each page.
	**************************************************************************/

	const getLibrary = (provider, connector) => {
		return new ethers.providers.Web3Provider(provider, 'any')
	};

	return (
		<ToastProvider autoDismiss>
			<UIApp>
				<Web3ReactProvider getLibrary={getLibrary}>
					<Web3ContextApp set_shouldReset={() => set_shouldReset(true)}>
						<AchievementsContextApp
							shouldReset={shouldReset}
							set_shouldReset={value => set_shouldReset(value)}>
						<AppWrapper
							Component={Component}
							pageProps={pageProps}
							element={props.element}
							router={props.router} />
						</AchievementsContextApp>
					</Web3ContextApp>
				</Web3ReactProvider>
			</UIApp>
		</ToastProvider>
	);
}

export default MyApp;
