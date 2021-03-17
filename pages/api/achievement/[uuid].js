/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday March 17th 2021
**	@Filename:				[uuid].js
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
	**	GET will be used to retrieve a specific address from the database.
	**	uri: /api/achievement/af327787-cb54-4351-8cbb-093c859f97ee
	**	method: GET
	**************************************************************************/
	.get(async (req, res) => {
		const	{uuid} = req.query;
		if (uuid === undefined) {
			return res.status(404).end(`missing uuid`);
		}
        const	document = await req.db.collection(collectionName).findOne({UUID: uuid});
		if (!document) {
			return res.status(404).end(`data not found`);
		}
	    res.json(document);
	})
	.post(async (req, res) => {
    	const data = req.body;
		const document = await req.db.collection(collectionName).insertOne(data)
		res.json({message: 'ok', data: document});
	})
export default handler;