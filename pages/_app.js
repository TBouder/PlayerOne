/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday August 26th 2020
**	@Filename:				_app.js
******************************************************************************/

import	React						from	'react';
import	NProgress					from	'nprogress';
import	Router						from	'next/router';
import	Head						from	'next/head';
import	{Web3ContextApp}			from	'contexts/useWeb3';
import	TopMenu						from	'components/TopMenu';
import	{AnimatePresence}			from	'framer-motion';

import	'style/Default.css'
import	'tailwindcss/tailwind.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing }
  }
};

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
					<AnimatePresence exitBeforeEnter>
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
					</AnimatePresence>
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
