/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				useUI.js
******************************************************************************/

import	{useState, useEffect, useContext, createContext}	from	'react';
import	useLocalStorage										from	'hook/useLocalStorage';
import	useClientEffect										from	'hook/useClientEffect';

const	UI = createContext();
export const UIApp = ({children}) => {
	const	[theme, set_theme] = useLocalStorage('theme', 'dark-initial');
	const	[confetti, set_confetti] = useState({x: 0, y: 0});
	const	[walletModal, set_walletModal] = useState(false);
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

	useClientEffect(() => {
		if (theme !== 'dark-initial') {
			const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			if (darkModeMediaQuery.matches)
				set_theme('dark')
		}
	}, [])

	useEffect(() => {
		if (theme === 'light') {
			document.documentElement.classList.add('light')
			document.documentElement.classList.remove('dark')
			document.documentElement.classList.remove('dark-initial')
		} else if (theme === 'dark' || theme === 'dark-initial') {
			document.documentElement.classList.add('dark')
			document.documentElement.classList.remove('light')
		}
	}, [theme])

	return (
		<UI.Provider
			children={children}
			value={{
				walletModal,
				set_walletModal,
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
