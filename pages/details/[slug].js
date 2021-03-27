/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday March 26th 2021
**	@Filename:				[slug].js
******************************************************************************/

import	PageWrapper					from	'components/details';
import	{fetcher}					from	'utils';

export async function getStaticPaths() {
	const	achievementsList = await fetcher(`${process.env.API_URI}/achievements`)
	const	achievements = achievementsList.map((achievement) => ({params: {slug: achievement.slug}}))

	return	{paths: achievements, fallback: false}
}

export async function getStaticProps({params}) {
	console.log(params)
	const	achievement = await fetcher(`${process.env.API_URI}/achievement/by-slug/${params.slug}`)

	return {props: {achievement}}
}

function Page({achievement}) {
	return (
		<PageWrapper
			numberOfClaims={achievement.numberOfClaims}
			description={achievement.informations.context}
			verificationCode={achievement.informations.verificationPseudoCode}
			achievement={achievement}
		/>
	)
}

export default Page;
