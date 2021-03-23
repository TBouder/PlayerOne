/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				useHover.js
******************************************************************************/

import	{useState, useCallback, useRef}	from 'react';

export default function useHover() {
	const [value, setValue] = useState(false);
	const handleMouseOver = useCallback(() => setValue(true), []);
	const handleMouseOut = useCallback(() => setValue(false), []);
	const ref = useRef();
	
	const callbackRef = useCallback((node) => {
		if (ref.current) {
			ref.current.removeEventListener("mouseenter", handleMouseOver);
			ref.current.removeEventListener("mouseleave", handleMouseOut);
		}
  
		ref.current = node;
  
		if (ref.current) {
			ref.current.addEventListener("mouseenter", handleMouseOver);
			ref.current.addEventListener("mouseleave", handleMouseOut);
		}
	}, [handleMouseOver, handleMouseOut]);
  
	return [callbackRef, value];
}
