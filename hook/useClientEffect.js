/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useLocalStorage copy.js
******************************************************************************/

import	{useEffect}		from 'react';

function useClientEffect(callback = () => null, effectDependencies = []) {
	useEffect(() => {
		if (typeof(window) !== 'undefined')
			return callback()
	}, [typeof(window), ...effectDependencies]);
}
  
export default useClientEffect;