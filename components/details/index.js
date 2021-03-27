/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				index.js
******************************************************************************/

import	{useRef, useState, useEffect}		from	'react';
import	useSWR								from	'swr';
import	useWeb3								from	'contexts/useWeb3';
import	PageHeader							from	'components/details/PageHeader';
import	MainSection							from	'components/details/MainSection';
import	{fetcher}							from	'utils';

function	Page(props) {
	const	{address} = useWeb3();

	/**************************************************************************
	**	Based on the props received from the static props, we can initialize
	**	`achievement` (the informations about this achievement) and
	**	`claims` (the list of all the claims).
	**************************************************************************/
	const	[achievement, set_achievement] = useState(props.achievement);
	const	[numberOfClaims, set_numberOfClaims] = useState(props.numberOfClaims);

	/**************************************************************************
	**	Then, we need to hydrate the default page's informations, aka data,
	**	which are `achievement` (the informations about this achievement) and
	**	`claims` (the list of all the claims).
	**************************************************************************/
	const	{data} = useSWR(
		`${process.env.API_URI}/achievement/withclaims/${props?.achievement?.key}`,
		fetcher,
		{
			initialData: {achievement},
			revalidateOnMount: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		}
	);

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
	**	Effect to update the `achievement` and `claims` state when receiving
	**	data from swr.
	**************************************************************************/
	useEffect(() => {
		set_achievement(data.achievement);
		set_numberOfClaims(data.achievement.numberOfClaims);
	}, [data])

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
		<div className={'bg-gray-50'}>
			<div style={{marginTop: -50}}>
				<div ref={headerRef} className={'headerAnim'}>
					<PageHeader
						achievement={achievement}
						isClaimed={currentAddressClaim !== undefined} />
				</div>
				<div ref={contentRef} className={'contentAnim'}>
					<MainSection
						achievement={achievement}
						currentAddressClaim={currentAddressClaim}
						description={props.description}
						verificationCode={props.verificationCode}
						/>
				</div>
			</div>
		</div>
	)
}

export default Page;