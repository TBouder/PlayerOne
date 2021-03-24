/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 18th 2021
**	@Filename:				index.js
******************************************************************************/

import	axios							from	'axios';
import	{ethers}						from	'ethers';

export const fetcher = url => axios.get(url).then(res => res.data);

export const toAddress = (address) => {
	if (!address) {
		return undefined;
	}
	return ethers.utils.getAddress(address);
};
export const address = ethers.utils.getAddress;

export const bigNumber = ethers.BigNumber;

export const sortBy = (arr, k) => arr.concat().sort((b, a) => (a[k] > b[k]) ? 1 : ((a[k] < b[k]) ? -1 : 0));

export const partition = (arr, criteria) => arr.reduce((acc, i) => (acc[criteria(i) ? 0 : 1].push(i), acc), [[], []]);

export const hasIntersection = (a, ...arr) => [...new Set(a)].some(v => arr.some(b => b.includes(v)));

export const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomItem = arr => arr[(Math.random() * arr.length) | 0];

export const	removeFromArray = (arr, key,  item) => {
	const i = arr.findIndex(a => a[key] === item);
	if (i > -1) {
		arr.splice(i, 1);
	}
	return arr;
}
export const	sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}
  