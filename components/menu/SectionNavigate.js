/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Tuesday April 6th 2021
**	@Filename:				SectionNavigate.js
******************************************************************************/

import	Link					from	'next/link';
import	{useRouter}				from	'next/router';
import	{FontAwesomeIcon}		from	'@fortawesome/react-fontawesome'
import	{faCrown}				from	'@fortawesome/free-solid-svg-icons'

function	SectionNavigate() {
	const	router = useRouter();

	return (
		<div className={'relative flex flex-row items-center text-left z-50 pointer-events-auto'}>
			{router.pathname === '/details/[slug]' ? <Link href={'/'} scroll={false} passHref>
				<svg className={'w-6 h-6 text-gray-400 hover:text-gray-900 cursor-pointer'} xmlns='http://www.w3.org/2000/svg' fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
			</Link> : null}
			{router.pathname !== '/details/[slug]' ?
				<div className={'flex flex-row w-full items-center'}>
					<div>
						<Link href={'/'} passHref>
							<div className={'cursor-pointer'}>
								<FontAwesomeIcon
									style={{width: 24, height: 24}}
									className={'text-gray-600'}
									icon={faCrown} />
							</div>
						</Link>
					</div>
					<div>
						<p className={'text-gray-600 hover:text-gray-900 leading-7 text-sm cursor-pointer mx-8'}>{'About'}</p>
					</div>
					<div>
						<Link href={'/leaderboard'} passHref>
							<p className={'text-gray-600 hover:text-gray-900 leading-7 text-sm cursor-pointer mr-8'}>
								{'Leaderboard'}
							</p>
						</Link>
					</div>
					<div>
						<p className={'text-gray-600 hover:text-gray-900 leading-7 text-sm cursor-pointer mr-8'}>{'Governance'}</p>
					</div>
				</div>
			: null}
		</div>
	);
}

export default SectionNavigate;