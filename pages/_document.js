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
					<link rel={'stylesheet'} href={'https://rsms.me/inter/inter.css'} />
					<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
					<link rel="manifest" href="/favicon/site.webmanifest" />
					<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#f9b12a" />
					<link rel="shortcut icon" href="/favicon/favicon.ico" />
					<meta name="msapplication-TileColor" content="#09162e" />
					<meta name="msapplication-config" content="/favicon/browserconfig.xml" />
					<meta name="theme-color" content="#09162e" />
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
