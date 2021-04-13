/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday April 12th 2021
**	@Filename:				index.js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	SectionHeader						from	'components/collections/SectionHeader';
import	SectionCollections					from	'components/collections/SectionCollections';
import	useSWR								from	'swr';
import	{fetcher}							from	'utils'

function	Page(props) {
	/**************************************************************************
	**	Used for the animations
	**************************************************************************/
	const	headerRef = useRef();
	const	contentRef = useRef();
	useEffect(() => {
		setTimeout(() => headerRef.current.className = `${headerRef.current.className} headerAnimOnMount`, 0);
		setTimeout(() => contentRef.current.className = `${contentRef.current.className} contentAnimOnMount`, 0);
	}, [])

	return (
		<>
			<div ref={headerRef} className={'headerAnim'}>
				<SectionHeader />
			</div>
			<div ref={contentRef} className={'contentAnim'}>
				<main className={'-mt-24 pb-8'}>
					<div className={'max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'}>
						<div className={'flex flex-col'}>
							<SectionCollections />
							<div className={'relative h-96 transform -translate-y-2/3 -translate-x-1/2'} style={{zIndex: 0, backgroundImage: 'url("/bg-noise.svg")'}} />
						</div>
					</div>
				</main>
			</div>
		</>
	);
}

export default Page;
