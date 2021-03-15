/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				[address].js
******************************************************************************/

import	nextConnect	from	'next-connect';
import	middleware	from	'utils/dbMiddleware';

const	collectionName = 'addresses';
const	collection = {
	address:	'string',
	signature:	'string',
	signDate:	'date',
};
if (false) console.log(collection);


const handler = nextConnect()
	.use(middleware)

	/**************************************************************************
	**	GET will be used to retrieve a specific address from the database.
	**	uri: /api/address/0x9E[...]A518 
	**	method: GET
	**************************************************************************/
	.get(async (req, res) => {
		const	{address} = req.query;
		if (address === undefined) {
			return res.status(404).end(`missing address`);
		}
        const	document = await req.db.collection(collectionName).findOne({address});
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