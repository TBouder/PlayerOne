/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useUI.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	useLocalStorage										from	'hook/useLocalStorage';

const	UI = createContext();
export const UIApp = ({children}) => {
	const	[theme, set_theme] = useLocalStorage('theme', 'light');
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

	useEffect(() => {
		if (confetti.active) {
			setTimeout(() => (
				set_confetti({active: false, x: 0, y: 0})
			), 3000);
		}
	}, [confetti.active])

	useEffect(() => {
		if (theme === 'light') {
			document.documentElement.classList.add('light')
			document.documentElement.classList.remove('dark')
		} else if (theme === 'dark') {
			document.documentElement.classList.add('dark')
			document.documentElement.classList.remove('light')
		}
	}, [theme])

	return (
		<UI.Provider
			children={children}
			value={{
				theme: {
					get: theme,
					set: set_theme,
					switch: () => set_theme(t => t === 'light' ? 'dark' : 'light')
				},
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
