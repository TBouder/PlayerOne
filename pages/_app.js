/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday August 26th 2020
**	@Filename:				_app.js
******************************************************************************/

import	React, {useState}			from	'react';
import	NProgress					from	'nprogress';
import	Router						from	'next/router';
import	Head						from	'next/head';
import	{ToastProvider}				from	'react-toast-notifications';
import	Confetti					from	'react-dom-confetti'
import	{ethers}					from	'ethers';

import	useWeb3, {Web3ContextApp}	from	'contexts/useWeb3';
import	{AchievementsContextApp}	from	'contexts/useAchievements';
import	useUi, {UIApp}				from	'contexts/useUI';
import	useScrollRestoration		from	'hook/useScrollRestoration';
import	TopMenu						from	'components/TopMenu';
import	{Web3ReactProvider}			from	'@web3-react-fork/core';

import	'style/Default.css'
import	'tailwindcss/tailwind.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function	AppWrapper(props) {
	const	{Component, pageProps, router} = props;
	const	{confetti} = useUi();
	const	{chainID} = useWeb3();
	useScrollRestoration(router, '/');

	return (
		<>
			<Head>
				<title>{'DEFI Achievements'}</title>
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta name={'description'} content={'DEFI Achievements - Get achievement & NFT from your DEFI Degen score'} />
				<meta name={'msapplication-TileColor'} content={'#9fcc2e'} />
				<meta name={'theme-color'} content={'#ffffff'} />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link href="https://fonts.googleapis.com/css2?family=Courgette&display=swap" rel="stylesheet" />
				<meta charSet={'utf-8'} />
			</Head>
			<div>
				<div id={'app'} className={'flex'}>
					<div className={'w-full overflow-x-hidden'} key={router.pathname}>
						<TopMenu />
						<div id={'chainIDWarning'} suppressHydrationWarning>
							{chainID === 1 ?
								<div className={'fixed z-40 bg-amber-100 w-full'} style={{top: 51}}>
									<div className={'max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8'}>
										<div className={'pr-16 sm:text-center sm:px-16'}>
											<div className={'flex justify-center items-center'}>
												<svg className={'h-5 w-5 text-amber-400 mr-4'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
												<span className={'text-amber-800 font-medium'}>
													{'YOU ARE USING THIS IN-DEV PRODUCT ON THE MAINNET. YOU WILL LOSE MONEY IF YOU CONFIRM A TX.'}
												</span>
												<svg className={'h-5 w-5 text-amber-400 ml-4'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
											</div>
										</div>
									</div>
								</div>
							: null}
						</div>
						<div className={'mt-14'}>
							<Component
								key={router.route}
								element={props.element}
								router={props.router}
								{...pageProps} />
						</div>
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
	const	achievementsList = pageProps && pageProps.achievementsList ? [...pageProps.achievementsList] : [];

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
							set_shouldReset={value => set_shouldReset(value)}
							achievementsList={achievementsList}>
						<AppWrapper
							Component={Component}
							pageProps={{...pageProps, achievementsList}}
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
