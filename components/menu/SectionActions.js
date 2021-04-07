/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday April 6th 2021
**	@Filename:				SectionActions.js
******************************************************************************/

import	{useState, useRef}		from	'react';
import	useWeb3					from	'contexts/useWeb3';
import	useAchievements			from	'contexts/useAchievements';
import	useOnClickOutside		from	'hook/useOnClickOutside';
import	ContextMenuLogin		from	'components/menu/ContextMenuLogin'
import	ContextMenuProgress		from	'components/menu/ContextMenuProgress'

function	SectionActions() {
	const	refOutside = useRef();
	const	{address, deactivate, onDesactivate, active} = useWeb3();
	const	{elements} = useAchievements()
	const	[open, set_open] = useState(false);
	const	[slideOverOpen, set_slideOverOpen] = useState(false);

	useOnClickOutside(refOutside, () => {
		set_open(false);
		set_slideOverOpen(false);
	});

	function	renderContent() {
		if (address) {
			return (
				<span className={'whitespace-nowrap'}>
					<span className={'font-semibold bg-playerone text-white mr-2 -ml-4 px-2 py-4'}>{`150 RWD`}</span>
					{`${address.slice(0, 4)}...${address.slice(-4)}`}
				</span>
			);
			return (`${address.slice(0, 4)}...${address.slice(-4)}`);
		}
		return ('Connect a wallet');
	}

	return (
		<div
			className={'relative flex flex-row items-center text-left z-50 pointer-events-auto'}
			ref={refOutside}>
			<div className={'flex items-center relative'}>
				<button
					suppressHydrationWarning
					onClick={() => {
						if (active) {
							set_slideOverOpen(!slideOverOpen)
							// deactivate();
							// onDesactivate();
						} else {
							set_open(!open);
						}
					}}
					type={'button'}
					className={'inline-flex border border-solid border-gray-200 px-4 py-2 items-center shadow-sm leading-4 font-normal rounded-md text-xs text-gray-700 bg-white hover:bg-gray-100 overflow-hidden'}
					id={'options-menu'}
					aria-expanded={'true'}
					aria-haspopup={'true'}>
					{renderContent()}
					<svg className={`-mr-1 ml-2 h-5 w-5 text-gray-400 ${active ? 'hidden' : 'block'}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden={'true'}><path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' /></svg>

					<svg className={`-mr-1 ml-2 h-5 w-5 text-gray-400 ${!active ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
				</button>
				{elements.claimables?.length > 0 ? <span className={`transition-opacity flex absolute h-3 w-3 top-0 right-0 -mt-0.5 -mr-1 ${active && !slideOverOpen ? 'opacity-100' : 'opacity-0'}`}>
					<span className={'animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75'} />
					<span className={'relative inline-flex rounded-full h-3 w-3 bg-teal-500'} />
				</span> : null}
			</div>

			<ContextMenuLogin open={open} set_open={set_open} />
			<ContextMenuProgress open={slideOverOpen} set_open={set_slideOverOpen} />
		</div>
	)
}

export default SectionActions;