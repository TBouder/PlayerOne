/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday April 14th 2021
**	@Filename:				SectionFAQ.js
******************************************************************************/

import Link from "next/link";

function	ItemQuestion({question, answer}) {
	return (
		<div>
			<dt className={'text-lg leading-6 font-medium text-gray-900 dark:text-white'}>
				{question}
			</dt>
			<dd className={'mt-2 text-sm text-gray-600 dark:text-gray-400'}>
				{answer}
			</dd>
		</div>
	);
}

function	SectionFAQ() {
	return (
		<div className={'relative pt-24'}>
			<div className={'bg-gray-50 dark:bg-dark-background-600 rounded-lg py-8 px-6 shadow-md'}>
				<h2 className={'text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900 dark:text-white'}>
					{'Frequently asked questions'}
				</h2>
				<div className={'mt-6 border-t border-gray-200 dark:border-accent-900 dark:border-opacity-20 border-opacity-25 pt-10'}>
					<dl className={'space-y-10'}>
						<ItemQuestion
							question={'What are the different statuses of challenges ?'}
							answer={(
								<div className={'prose-sm prose-accent w-full max-w-full'}>
									<p style={{marginBottom: 0}}>In order to obtain a challenge, it will go through 3 different states, indicating your progress in obtaining it:</p>
									<ul style={{marginTop: 0}} className={'list-inside list-disc'}>
										<li>The first state is the <strong>Locked</strong> state: your address does not meet the necessary criteria to claim this achievement.</li>
										<li>The second state is the <strong>Unlocked</strong> state: your address is recognized as being able to claim this achievement by our system.</li>
										<li>The last state is the <strong>Claimed</strong> state: your address has claimed this achievement and you are officially the holder of this achievement (<i>saved on the SmartContract</i>).</li>
									</ul>
								</div>
							)}
						/>
						<ItemQuestion
							question={'How do you know if I made it ?'}
							answer={'Sed velit mi, dictum a justo iaculis, sollicitudin suscipit quam. Etiam feugiat massa non sapien vulputate gravida. Quisque at metus sapien. Aliquam convallis, metus at scelerisque ultrices, elit arcu sagittis elit, at laoreet justo nibh sit amet orci. Vestibulum nibh ligula, ullamcorper eget leo quis, bibendum mollis lectus. Cras at porttitor enim. In vehicula commodo metus, quis porta ex tincidunt ut. Etiam varius diam imperdiet urna facilisis vehicula. Etiam nec euismod arcu. Curabitur et volutpat tortor. Praesent porta dignissim lectus et eleifend.'}
						/>
						<ItemQuestion
							question={'Who decides what will be the next challenges ?'}
							answer={'That\'s the Frog\'s job.'}
						/>
						<ItemQuestion
							question={'What can I do with my RWD Token ?'}
							answer={'Pellentesque cursus lectus vitae ipsum rutrum accumsan. In porttitor sollicitudin odio. Nam ut felis nec justo interdum euismod. Morbi pulvinar ornare massa, eu condimentum lorem rhoncus tempor. Nulla luctus mi dui, eu ultrices libero gravida eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam rhoncus libero et enim elementum egestas. Nulla non vehicula nisl, fringilla euismod sem. Suspendisse imperdiet ante at quam vestibulum aliquam. Suspendisse quis tristique justo. Quisque non tincidunt nisi.'}
						/>
						<ItemQuestion
							question={'How could I contribute to the project ?'}
							answer={(
								<div className={'prose-sm prose-accent w-full max-w-full'}>
									<p>The <Link href={'/details/sponsor'} passHref><a className={'font-medium text-accent-900 cursor-pointer hover:underline'}>Sponsor achievement</a></Link> is a great way to start your journey !</p>
								</div>
							)}
						/>
						<ItemQuestion
							question={'What’s the leaderboard ?'}
							answer={(
								<div className={'prose-sm prose-accent w-full max-w-full'}>
									<p style={{marginBottom: 0}}>Actually, there are three types of leaderboards::</p>
									<ul style={{marginTop: 0}} className={'list-inside list-disc'}>
										<li>The <Link href={'/leaderboard'} passHref><a className={'font-medium text-accent-900 cursor-pointer hover:underline'}>general leaderboard</a></Link>: which give you the top 10 addresses with the most claimed achievements.</li>
										<li>A <strong>leaderboard per collection</strong>: which give you the top 5 addresses with the most claimed achievements in a specific collection.</li>
										<li>A <strong>leaderboard per achievement</strong>: which give you the top 10 addresses with the most claimed achievements for a specific achievement.</li>
									</ul>
								</div>
							)}
						/>
					</dl>
				</div>
			</div>
		</div>
	);
}

export default SectionFAQ;