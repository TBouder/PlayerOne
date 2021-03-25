/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 25th 2021
**	@Filename:				SectionCollections.js
******************************************************************************/

import	{useState}								from	'react';
import	{FontAwesomeIcon}						from	'@fortawesome/react-fontawesome'
import	{
	faCoins, faParachuteBox, faGasPump, faShapes,
	faUniversity, faAward}						from	'@fortawesome/free-solid-svg-icons'


function	ItemCollection({selected, faIcon, title, onClick}) {
	if (selected) {
		return (
			<div className={'rounded-lg bg-teal-700 overflow-hidden w-full h-full transition-colors'}>
				<div className={'flex flex-col justify-center items-center p-4'}>
					<FontAwesomeIcon style={{width: 24, height: 24}} className={'mt-8 text-white'} icon={faIcon} />
					<p className={'mt-6 text-white font-medium'}>{title}</p>
				</div>
			</div>
		);
	}
	return (
		<div className={'rounded-lg bg-gray-200 overflow-hidden w-full h-full cursor-pointer group transition-colors'} onClick={onClick}>
			<div className={'flex flex-col justify-center items-center p-4'}>
				<FontAwesomeIcon
					style={{width: 24, height: 24}}
					className={'mt-8 text-gray-400 group-hover:animate-shake group-hover:text-teal-700 transition-colors'} icon={faIcon} />
				<p className={'mt-6 text-gray-400 font-medium'}>{title}</p>
			</div>
		</div>
	);
}
function	SectionCollections() {
	const	[selec, set_selec] = useState(0);

	return (
		<section id={'collections'} aria-label={'collections'} className={'w-full pt-8'}>
			<div className={'pb-8 w-full flex justify-between'}>
				<h3 className={'text-base leading-6 font-medium text-gray-400'}>
					{`Browse the collections`}
				</h3>
				<h3 className={'text-sm leading-6 font-normal text-teal-700 text-opacity-60 cursor-pointer hover:text-opacity-100 hover:underline'}>
					{`See all`}
				</h3>
			</div>
			<div className={'grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'}>
				<ItemCollection selected={selec === 0} onClick={() => set_selec(0)} faIcon={faAward} title={'All'} />
				<ItemCollection selected={selec === 1} onClick={() => set_selec(1)} faIcon={faShapes} title={'Ecosystem'} />
				<ItemCollection selected={selec === 2} onClick={() => set_selec(2)} faIcon={faCoins} title={'ERC-20'} />
				<ItemCollection selected={selec === 3} onClick={() => set_selec(3)} faIcon={faParachuteBox} title={'Airdrops'} />
				<ItemCollection selected={selec === 4} onClick={() => set_selec(4)} faIcon={faGasPump} title={'Fees'} />
				<ItemCollection selected={selec === 5} onClick={() => set_selec(5)} faIcon={faUniversity} title={'DeFI'} />
			</div>
		</section>
	);
}

export default SectionCollections;