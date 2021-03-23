/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useUI.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';

const	UI = createContext();
export const UIApp = ({children}) => {
	const	[confetti, set_confetti] = useState({x: 0, y: 0});
	const	confettiConfig = {
		angle: 90,
		spread: 360,
		startVelocity: 20,
		elementCount: 70,
		dragFriction: 0.12,
		duration: 3000,
		stagger: 3,
		width: '10px',
		height: '10px',
		colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
	}


	return (
		<UI.Provider
			children={children}
			value={{
				confetti: {
					config: confettiConfig,
					set: set_confetti,
					get: confetti
				}
			}} />
	)
}

export const useUI = () => useContext(UI)
export default useUI;
