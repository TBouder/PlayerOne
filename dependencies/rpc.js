/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday March 20th 2021
**	@Filename:				rpc.js
******************************************************************************/

const randomId = () => Math.floor(Math.random() * 10000000000);

export const send = (provider, method, params) => new Promise((resolve, reject) => {
  const payload = {
    id: randomId(),
    method,
    params,
  };
  const callback = (err, result) => {
    if (err) {
      reject(err);
    } else if (result.error) {
      console.error(result.error);
      reject(result.error);
    } else {
      resolve(result.result);
    }
  };

  let _provider = provider.provider || provider

  if (_provider.sendAsync) {
    _provider.sendAsync(payload, callback);
  } else {
    _provider.send(payload, callback);
  }
});

export const signData = async (provider, fromAddress, typeData) => {
  const typeDataString = typeof typeData === 'string' ? typeData : JSON.stringify(typeData);
  const result = await send(provider, 'eth_signTypedData_v4', [fromAddress, typeDataString])
    .catch((error) => {
      if (error.message === 'Method eth_signTypedData_v4 not supported.') {
        return send(provider, 'eth_signTypedData', [fromAddress, typeData]);
      } else {
        throw error;
      }
    });

  return {
    r: result.slice(0, 66),
    s: '0x' + result.slice(66, 130),
    v: parseInt(result.slice(130, 132), 16),
  };
};

let chainIdOverride;
export const setChainIdOverride = (id) => { chainIdOverride = id };
export const getChainId = async (provider) => chainIdOverride || send(provider, 'eth_chainId');

export const call = (provider, to, data) => send(provider, 'eth_call', [{
  to,
  data,
}, 'latest']);
