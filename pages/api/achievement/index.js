/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				index.js
******************************************************************************/

import	nextConnect	from	'next-connect';
import	middleware	from	'utils/dbMiddleware';

const	collectionName = 'achievements';
const	collection = {
	UUID:			'string',
	title:			'string',
	description:	'string',
	icon:			'string',
	background:		'string',
	badges:			['string'],
	strategy: {
		name:		'string',
		arguments:	['string'],
	}
};
if (false) console.log(collection);


const handler = nextConnect()
	.use(middleware)
	/**************************************************************************
	**	List will be used to retrieve all the request matching some specific
	**	queries, send as parameters
	**************************************************************************/
	.get(async (req, res) => {
        const	documents = await req.db.collection(collectionName).find({}).toArray();
	    res.json(documents);
	})
	.post(async (req, res) => {
    	const data = req.body;
		const document = await req.db.collection(collectionName).insertOne(data)
		res.json({message: 'ok', data: document});
	})
	.put(async (req, res) => {
		res.end("async/await is also supported!");
	})
	.patch(async (req, res) => {
		throw new Error("Throws me around! Error can be caught and handled.");
	});

export default handler;