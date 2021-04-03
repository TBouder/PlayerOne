/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday April 3rd 2021
**	@Filename:				leaderboard.js
******************************************************************************/

import	{useRef, useEffect}					from	'react';
import	useSWR								from	'swr';
import	{fetcher}							from	'utils'
import	SectionChallengers					from	'components/leaderboard/SectionChallengers';
import	SectionStats						from	'components/leaderboard/SectionStats';
import	SectionHeader						from	'components/leaderboard/SectionHeader';

function	Page(props) {
	const	initialData = {challengers: props.challengers, addressesCount: props.addressesCount, achievementsCount: props.achievementsCount};
	const	{data: {challengers, addressesCount, achievementsCount}} = useSWR(`${process.env.API_URI}/leaderboard`, fetcher, {initialData});

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
				<div className={'w-full px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto pb-24'}>
					<div className={'pb-6'}>


						<div className={'flex flex-col mt-6'}>
							<div className={'-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'}>
								<div className={'py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'}>
									<SectionStats numberOfChallengers={addressesCount} numberOfAchievements={achievementsCount} />
								</div>
							</div>
						</div>


						<div className={'relative h-0 -ml-10'} style={{zIndex: -1}}>
							<svg width='404' height='500' fill={'none'} viewBox='0 0 404 500' className='hidden lg:block absolute left-full transform -translate-x-1/2 opacity-50 z-0'><defs><pattern id='b1e6e422-73f8-40a6-b5d9-c8586e37e0e7' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'><rect x='0' y='0' width='4' height='4' fill={'currentColor'} className='text-gray-200'></rect></pattern></defs><rect width='404' height='500' fill='url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)'></rect></svg>
						</div>

						<SectionChallengers challengers={challengers} numberOfAchievements={achievementsCount} />
					</div>
				</div>
			</div>
		</>
	);
}

export async function getStaticProps() {
	const	{challengers, addressesCount, achievementsCount} = await fetcher(`${process.env.API_URI}/leaderboard`)
	return {props: {challengers, addressesCount, achievementsCount}}
}

export default Page;
