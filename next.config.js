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
	},
	images: {
		domains: ['images.unsplash.com', 'source.unsplash.com'],
	},
	future: {
		webpack5: true,
	},
  	optimization: {
		minimize: true,
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: 25,
			minSize: 20000
		}
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
