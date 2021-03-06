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

export const getIntersection = (a, ...arr) => [...new Set(a)].filter(v => arr.every(b => b.includes(v)));

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

export function	formatPercent(amount) {
    return (new Intl.NumberFormat('fr-FR', {style: 'percent', maximumFractionDigits: 1}).format(amount))
}
export function	formatNumber(amount) {
	return (new Intl.NumberFormat().format(amount))
}
  
export function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-'); 
    return str;
}

export function jsNumberForAddress(address) {
	const addr = address.slice(2, 10);
	const seed = parseInt(addr, 16);
	return seed;
}

export function truncateAddress(address) {
	if (address !== undefined) {
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	}
	return `0x000...0000`;
}