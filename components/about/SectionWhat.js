/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday April 14th 2021
**	@Filename:				SectionWhat.js
******************************************************************************/

function	SectionWhat() {
	return (
		<div className={'relative pt-12 md:pt-24'}>
			<div className={'text-lg mx-auto'}>
				<h1 className={'mt-2 block text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900 dark:text-white'}>
					{'What is it ?'}
				</h1>
				<p className="mt-8 prose-md md:text-xl text-gray-500 dark:text-dark-white leading-8">
					<strong>Player One</strong> offers every crypto user, from crypto noob to DeFi degen, a chance to highlight & value their crypto activity.
				</p>
			</div>
			<div className={'mt-6 prose-md md:prose-lg leading-8 md:leading-normal prose-accent w-full text-gray-500 dark:text-dark-white mx-auto max-w-full'}>
				<p>Throughout your crypto journey you might have engaged in a wide variety of activities: hanging around in Metaverses, collecting <a href={'https://opensea.io/assets/0x5b8c7104122ab9d33550d43d2343b20dcd455126/31'} target={'_blank'} className={'font-medium hover:underline cursor-pointer'}>crappy NFTs</a>, harvesting governance token in DeFi projects, investing your spare money in dark vaults, … but you might also have been lucky, participating in a project at an early stage and gaining an <a href={'https://uniswap.org/blog/uni/'} target={'_blank'} className={'font-medium hover:underline cursor-pointer'}>outstanding airdrop</a> … on the contrary you might also experience hacks or other misfortune ! </p>

				<p>All of these adventures show how passionate and diverse is the crypto world. But there is one thing that links all of these different projects & events: <strong>community</strong>. And as crypto relies on <strong>transparency</strong>, <strong>accessibility</strong> and <strong>openness</strong>, federating a community is key to make projects successful. This is why <strong>Player One</strong> aims at building a community of engaged crypto enthusiasts that will be able to claim their rewards but also to spot the latest protocols or opportunities available in the crypto space. Challenges provide you with guidance to identify them but also on how to achieve them. Leaderboard will enable you to know the ones having the hottest activity in this new space.</p>

				<p>As you achieve more and more you will be able to participate in <strong>exclusive programs with specific rewards</strong> such as participation in beta testing of projects, get access to referral programs, gain exclusive NFTs highlighting your engagement, be part of the governance of some protocols, and much more. All of these non exhaustive rewards will be distributed solely based on your crypto activity.</p>

				<p>As stated precedently, we are betting on your activity to build a strong and recognized community. In line with this, we are very open to suggestions, ideas or help in building this project. Do not hesitate to <a href={'#'} target={'_blank'} className={'font-medium hover:underline cursor-pointer'}>reach out</a> we would be please to talk to build the best product possible.</p>
			</div>
		</div>
	);
}

export default SectionWhat;