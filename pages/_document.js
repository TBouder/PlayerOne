/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday August 24th 2020
**	@Filename:				_document.js
******************************************************************************/

import	React										from	'react';
import	Document, {Html, Head, Main, NextScript}	from	'next/document'

export default class MyDocument extends Document
{
	render()
	{
		return (
			<Html lang={'fr'}>
				<Head>
					{/* <link rel={'stylesheet'} href={'https://rsms.me/inter/inter.css'} /> */}
					<link rel={'stylesheet'} href={'/font.css'} />
					<link rel="preload" href="/fonts/Agames.woff2" as="font" crossOrigin="" />
					<link rel={'shortcut icon'} type={'image/x-icon'} href={'/favicons/favicon.ico'} />
					<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
					<link rel="manifest" href="/favicons/site.webmanifest" />
					<link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
					<meta name="msapplication-TileColor" content="#00aba9" />
					<meta name="theme-color" content="#ffffff" />
				</Head>
				<body>
					<Main />
					<NextScript />
					<script> </script>
				</body>
			</Html>
		);
	}
}
