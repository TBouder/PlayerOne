/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				index.js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	useSWR								from	'swr';
import	useWeb3								from	'contexts/useWeb3';
import	SectionHeader						from	'components/details/SectionHeader';
import	Leaderboard							from	'components/details/SectionLeaderboard';
import	SectionStatus						from	'components/details/SectionStatus';
import	{fetcher}							from	'utils';

function	Page(props) {
	const	{address} = useWeb3();

	/**************************************************************************
	**	Based on the props received from the static props, we can initialize
	**	`achievement` (the informations about this achievement) and
	**	`claims` (the list of all the claims).
	**************************************************************************/
	const	[achievement, set_achievement] = useState(props.achievement);

	/**************************************************************************
	**	We should check if the current address has a claim, and use if to
	**	display some useful informations
	**************************************************************************/
	const	{data: currentAddressClaim} = useSWR(
		address ? `${process.env.API_URI}/claim/${props?.achievement?.key}/${address}` : null,
		fetcher,
		{
			shouldRetryOnError: false,
			revalidateOnMount: true,
			revalidateOnReconnect: true
		}
	);

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
			<div>
				<div ref={headerRef} className={'headerAnim'}>
					<SectionHeader
						achievement={achievement}
						isClaimed={currentAddressClaim !== undefined} />
				</div>
				<div ref={contentRef} className={'contentAnim'}>
					<main className={'-mt-24 pb-8 '}>
						<div className={'max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'}>
							<div className={'grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8'}>
								<div className={'grid grid-cols-1 gap-4 lg:col-span-3'}>
									<SectionStatus
										achievement={achievement}
										description={props.description}
										currentAddressClaim={currentAddressClaim} />
								</div>
								<div className={'grid grid-cols-1 gap-4 lg:col-span-3'}>
									<Leaderboard
										strategy={achievement?.strategy}
										achievementKey={achievement.key}
										verificationCode={achievement?.informations?.verificationPseudoCode}
										technicalContext={achievement?.informations?.technicalContext} />
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	)
}

export default Page;
