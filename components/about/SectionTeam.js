/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday April 14th 2021
**	@Filename:				team.js
******************************************************************************/

import	{FontAwesomeIcon}				from	'@fortawesome/react-fontawesome'
import	{faDiscord, faEthereum, faTelegram, faTwitter}						from	'@fortawesome/free-brands-svg-icons';

function	ItemTeamMajor({name, title, photo}) {
	return (
		<li className={'sm:py-8'}>
			<div className={'space-y-4'}> 
				<div className={'aspect-w-2 aspect-h-2'}>
					<img
						className={'object-cover object-center shadow-lg rounded-lg'}
						src={photo}
						alt={''} />
				</div>
				<div className={'sm:col-span-2'}>
					<div className={'space-y-4'}>
						<div className={'text-lg leading-6 font-medium space-y-1 text-gray-900 dark:text-dark-white'}>
							<h3>{name}</h3>
							<p className={'text-accent-900'}>{title}</p>
						</div>
						<div className={'text-lg'}>
							<p className={'text-gray-500 dark:text-dark-white'}>Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.</p>
						</div>
						<ul className={'flex space-x-5'}>
							<li>
								<a href={'#'} className={'text-gray-400 dark:text-gray-200 hover:text-gray-500'}>
								<span className='sr-only'>Twitter</span>
								<FontAwesomeIcon
									style={{width: 20, height: 20}}
									className={'text-gray-400 dark:text-gray-200 hover:text-gray-500'}
									icon={faTwitter} />
								</a>
							</li>
							<li>
								<a href={'#'} className={'text-gray-400 dark:text-gray-200 hover:text-gray-500'}>
								<span className='sr-only'>Twitter</span>
								<FontAwesomeIcon
									style={{width: 20, height: 20}}
									className={'text-gray-400 dark:text-gray-200 hover:text-gray-500'}
									icon={faTelegram} />
								</a>
							</li>
							<li>
								<a href={'#'} className={'text-gray-400 dark:text-gray-200 hover:text-gray-500'}>
								<span className='sr-only'>Twitter</span>
								<FontAwesomeIcon
									style={{width: 20, height: 20}}
									className={'text-gray-400 dark:text-gray-200 hover:text-gray-500'}
									icon={faEthereum} />
								</a>
							</li>
							<li>
								<a href={'#'} className={'text-gray-400 dark:text-gray-200 hover:text-gray-500'}>
								<span className='sr-only'>{'Discord'}</span>
								<FontAwesomeIcon
									style={{width: 20, height: 20}}
									className={'text-gray-400 dark:text-gray-200 hover:text-gray-500'}
									icon={faDiscord} />
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</li>
	)
}

function	SectionTeam() {
	return (
		<div className={'mx-auto pt-24'}>
			<div className={'space-y-5 sm:space-y-4 mb-2'}>
				<h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900 dark:text-white'>
					{'About Us'}
				</h2>
				<p className='text-lg text-gray-500 dark:text-dark-white'>
					{'We are three random people going through the darkness of Crypto : Major, Hanpepe & CAC'}
				</p>
			</div>
			<div className={'lg:col-span-3'}>
				<ul className='space-x-12 flex flex-row'>
					<ItemTeamMajor name={'Major'} title={'Someone'} photo={'/major.jpg'} />
					<ItemTeamMajor name={'CAC'} title={'Somebody else'} photo={'/cac.jpg'} />
					<ItemTeamMajor name={'Pepe'} title={'A random frog'} photo={'/pepe.jpg'} />
				</ul>
			</div>
		</div>
	);
}

export default SectionTeam;