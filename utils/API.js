/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday January 2nd 2021
**	@Filename:				API.js
******************************************************************************/

import	axios			from	'axios';

export const	performGet = (url) => {
	return (
		axios.get(url)
		.then(function (response) {
			return response.data
		})
		.catch(function (error) {
			console.warn(error)
			return null
		})
	);
};

export const	performPost = (url, data, options) => {
	return (
		axios.post(url, data, options)
		.then(function (response) {
			return response.data
		})
		.catch(function (error) {
			console.warn(error)
			return null
		})
	);
};

export async function	fetchCryptoPrice(from, to) {
	const	result = await performGet(
		`https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`
	);

	if (result) {
		return result;
	}
	return null;
}