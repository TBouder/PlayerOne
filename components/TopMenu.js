/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Sunday March 7th 2021
**	@Filename:				TopMenu.js
******************************************************************************/

import	SectionNavigate			from	'components/menu/SectionNavigate';
import	SectionActions			from	'components/menu/SectionActions';

function	TopMenu() {
	return (
		<div className={'fixed top-0 w-full py-2 px-4 bg-white bg-opacity-95 pointer-events-none z-50'}>
			<div className={'max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-12 lg:px-12 xl:px-12'}>
				<SectionNavigate />
				<SectionActions />
			</div>
		</div>
	);
}

export default TopMenu;
