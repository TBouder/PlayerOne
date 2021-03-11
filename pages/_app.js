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
import	{Web3ContextApp}			from	'contexts/useWeb3';
import	TopMenu						from	'components/TopMenu';

import	'style/Default.css'
import	'tailwindcss/tailwind.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function	AppWrapper(props) {
	const	{Component, pageProps, router} = props;
	const	[version, set_version] = useState('a');

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
					<div className={'w-full pt-16 px-6 md:px-12 lg:px-16 xl:px-24'}>
						<TopMenu
							version={version}
							set_version={set_version}
						/>
						<Component
							key={router.route}
							version={version}
							element={props.element}
							router={props.router}
							{...pageProps} />
					</div>
				</div>
			</div>
			<div id={'portal-root'} />
		</>
	);
}

function	MyApp(props) {
	const	{Component, pageProps} = props;
	
	return (
		<Web3ContextApp>
			<AppWrapper
				Component={Component}
				pageProps={pageProps}
				element={props.element}
				router={props.router} />
		</Web3ContextApp>
	);
}


export default MyApp;
