import {getChainId, call, signData} from './rpc';
import {hexToUtf8} from './lib';

const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const EIP712Domain = [
	{name: "name", type: "string"},
	{name: "version", type: "string"},
	{name: "chainId", type: "uint256"},
	{name: "verifyingContract", type: "address"},
];

const createTypedERC2612Data = (message, domain) => {
	const typedData = {
		types: {
			EIP712Domain,
			Claim: [
				{name: "validator", type: "address"},
				{name: "requestor", type: "address"},
				{name: "value", type: "uint256"},
				{name: "nonce", type: "uint256"},
				{name: "deadline", type: "uint256"},
			],
		},
		primaryType: "Claim",
		domain,
		message,
	};

	return typedData;
};

const NONCES_FN = '0x7ecebe00';
const NAME_FN = '0x06fdde03';

const zeros = (numZeros) => ''.padEnd(numZeros, '0');

const getTokenName = async (provider, address) =>
	hexToUtf8((await call(provider, address, NAME_FN)).substr(130));


const getDomain = async (provider, token) => {
	if (typeof token !== 'string') {
		return token;
	}

	const tokenAddress = token;

	const [name, chainId] = await Promise.all([
		getTokenName(provider, tokenAddress),
		getChainId(provider),
	]);

	const domain = {name, version: '1', chainId, verifyingContract: tokenAddress};
	return domain;
};

export const signERC2612Permit = async (provider, token, validator, requestor, value, deadline, nonce) => {
	const tokenAddress = (token).verifyingContract || token;
	const message = {
		validator,
		requestor,
		value,
		nonce: nonce || await call(provider, tokenAddress, `${NONCES_FN}${zeros(24)}${validator.substr(2)}`),
		deadline: deadline || MAX_INT,
	};
	const domain = await getDomain(provider, token);
	const typedData = createTypedERC2612Data(message, domain);
	const sig = await signData(provider, validator, typedData);

	return {...sig, ...message};
};
