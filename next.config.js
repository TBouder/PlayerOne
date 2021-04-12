/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday August 24th 2020
**	@Filename:				next.config.js
******************************************************************************/

const Dotenv = require('dotenv-webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
	plugins: [
		new Dotenv()
	],
	env: {
		WSS_ETH_NODE: process.env.WSS_ETH_NODE,
		ETHERSCAN_KEY: process.env.ETHERSCAN_KEY,
		API_URI: process.env.API_URI,
		TOKEN_ADDRESS: process.env.TOKEN_ADDRESS,
	},
	images: {
		domains: ['images.unsplash.com', 'source.unsplash.com'],
	},
	future: {
		webpack5: false,
	},
  	optimization: {
		minimize: true,
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: 25,
			minSize: 20000
		}
	},
	async headers() {
		return [{
			source: '/', headers: securityHeaders,
			source: '/:path*', headers: securityHeaders,
		}]
	},
	webpack: (config, {webpack}) => {
		// Note: we provide webpack above so you should not `require` it
		// Perform customizations to webpack config
		// Important: return the modified config
		config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
		return config
	},
	webpackDevMiddleware: (config) => {
		// Perform customizations to webpack dev middleware config
		// Important: return the modified config
		return config
	},
})

const	ContentSecurityPolicy = `
	default-src 'self';
	script-src 'self' 'unsafe-eval' 'unsafe-inline';
	style-src 'self' 'unsafe-inline';
	img-src 'none';
	media-src 'none';
	connect-src *;
	font-src 'self' fonts.googleapis.com;
`;
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, '')
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];
