/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 8th 2021
**	@Filename:				useLockBodyScroll.js
******************************************************************************/

import { useLayoutEffect } from 'react';

function useLockBodyScroll(locked) {
	useLayoutEffect(() => {
		if (locked) {
			const originalStyle = window.getComputedStyle(document.body).overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
	}, [locked]);
}

export default useLockBodyScroll;