/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 8th 2021
**	@Filename:				usePrevious.js
******************************************************************************/

import	{useEffect, useRef}	from 'react';
function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}

export default usePrevious;