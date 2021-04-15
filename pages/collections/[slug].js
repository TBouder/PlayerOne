/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday April 12th 2021
**	@Filename:				[slug].js
******************************************************************************/

import	{useRef, useEffect, useState}	from	'react';
import	{useRouter}						from	'next/router';
import	{FontAwesomeIcon}				from	'@fortawesome/react-fontawesome';
import	{faUsersCrown, faTrophy}		from	'@fortawesome/pro-solid-svg-icons'
import	SectionAchievements				from	'components/collections/SectionAchievements';
import	SectionHeader					from	'components/collections/SectionAchievementsHeader';
import	useAchievements					from	'contexts/useAchievements';


function	Head() {
	return (
		<div className={'bg-gray-100 dark:bg-dark-background-400 -mt-6 -mx-6 mb-6'}>
			<p className={'p-6 text-base font-medium text-gray-600 dark:text-dark-white'}>
				{'More informations'}
			</p>
		</div>
	);
}

function	Item({faIcon, count, content}) {
	return (
		<div>
			<dt>
				<div className={'absolute bg-accent-900 rounded-md p-2 group'}>
					<FontAwesomeIcon
						style={{width: 32, height: 32}}
						className={'text-white group-hover:animate-shake'}
						icon={faIcon} />
				</div>
				<p className={'ml-16 text-sm font-medium text-gray-500 dark:text-dark-white truncate'}>{content}</p>
			</dt>

			<dd className={'ml-16 flex items-baseline'}>
				<p className={'text-2xl font-semibold text-gray-900 dark:text-white'}>
					{count}
				</p>
			</dd>
		</div>
	);
}

function	Page() {
	const	router = useRouter()
	const	slug = router?.query?.slug;
	const	{elements} = useAchievements();
	const	[achievements, set_achievements] = useState([]);

	useEffect(() => {
		set_achievements((
			[
				...elements.claims || [],
				...elements.claimables || [],
				...elements.locked || []
			]).filter(e => slug === 'all' || e.collections.includes(slug))
		);
	}, [elements])

	console.log(achievements)

	/**************************************************************************
	**	Used for the animations
	**************************************************************************/
	const	headerRef = useRef();
	const	contentRef = useRef();
	useEffect(() => {
		setTimeout(() => headerRef.current.className = `${headerRef.current.className} headerAnimOnMount`, 0);
		setTimeout(() => contentRef.current.className = `${contentRef.current.className} contentAnimOnMount`, 0);
	}, [])

	const	unlocked = achievements?.filter(e => ['CLAIMED', 'CLAIMABLE'].includes(e.status))?.length || 0;
	const	unlockedPercent = ((unlocked / (achievements?.length || 1)) * 100).toFixed(0)
	return (
		<main className={'dark:bg-dark-background-900'}>
			<div ref={headerRef} className={'headerAnim'}>
				<SectionHeader slug={slug} />
			</div>
			<div ref={contentRef} className={'contentAnim'}>
				<main className={'-mt-24 pb-8'}>
					<div className={'w-full px-6 md:px-12 lg:px-12 xl:px-12 max-w-screen-2xl mx-auto relative grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8'}>
						<div className={'absolute h-96 -left-28 w-full transform translate-y-1/3 '}>
							<div
								className={'h-96 block dark:hidden'}
								style={{zIndex: 0, backgroundImage: 'url("/bg-noise.svg")'}} />
							<div
								className={'h-96 hidden dark:block'}
								style={{zIndex: 0, backgroundImage: 'url("/bg-noise-dark.svg")'}} />
						</div>
						<div className={'grid grid-cols-1 gap-4 lg:col-span-2'}>
							<SectionAchievements achievements={achievements} />
						</div>
						<div className={'grid grid-cols-1 gap-4 z-10'}>
							<div className={'bg-white dark:bg-dark-background-600 h-full w-full p-6 rounded-lg overflow-hidden shadow'}>
								<Head />
								<div className={'flex flex-row pb-6 mb-6 border-b dark:border-dark-background-300'}>
									<div>
										<div className={`progress-circle p${unlockedPercent} ${unlockedPercent >= 50 ? 'over50' : ''} dark:bg-dark-background-300`}>
											<span className={'absolute inset-0 circle-span flex items-center justify-center'}>
												<FontAwesomeIcon
													style={{width: 36, height: 36}}
													className={'text-gray-400 dark:text-dark-white group-hover:animate-shake group-hover:text-accent-900 dark:group-hover:text-white'}
													icon={faTrophy} />
											</span>
											<div className={'left-half-clipper'}>
												<div className={'first50-bar'}></div>
												<div className={'value-bar'}></div>
											</div>
										</div>
									</div>
									<div className={'pl-6'}>
										<p className={'text-gray-400 dark:text-dark-background-100 text-base pb-2'}>
											{`Congratulation !`}
										</p>
										<p className={'text-gray-700 dark:text-dark-white text-base font-medium'}>
											{`${unlocked} / ${achievements?.length || 0} unlocked !`}
										</p>
									</div>
								</div>
								<div className={'space-y-6'}>
									<Item count={achievements?.length || 0} faIcon={faTrophy} content={'Total achievements'} />
									<Item count={'--'} faIcon={faUsersCrown} content={'Challengers'} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</main>
	)
}

export default Page;
