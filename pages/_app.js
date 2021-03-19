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
import	{Web3ContextApp}			from	'contexts/useWeb3';
import	{AchievementsContextApp}	from	'contexts/useAchievements';
import	TopMenu						from	'components/TopMenu';

import	'style/Default.css'
import	'tailwindcss/tailwind.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function	AppWrapper(props) {
	const	{Component, pageProps, router} = props;

	return (
		<>
			<Head>
				<title>{'DEFI Achievements'}</title>
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta name={'description'} content={'DEFI Achievements - Get achievement & NFT from your DEFI Degen score'} />
				<meta name={'msapplication-TileColor'} content={'#9fcc2e'} />
				<meta name={'theme-color'} content={'#ffffff'} />
				<meta charSet={'utf-8'} />
			</Head>
			<div>
				<div id={'app'} className={'flex'}>
					<div className={'w-full'} key={router.pathname}>
						<TopMenu />
						<div style={{marginTop: 52}}>
							<Component
								key={router.route}
								element={props.element}
								router={props.router}
								{...pageProps} />
						</div>
					</div>
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

	return (
		<ToastProvider autoDismiss>
			<Web3ContextApp
				set_shouldReset={() => set_shouldReset(true)}>
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
		</ToastProvider>
	);
}

export default MyApp;
