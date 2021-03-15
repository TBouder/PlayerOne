/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday March 15th 2021
**	@Filename:				database.js
******************************************************************************/

import	{MongoClient}	from	'mongodb';
import	nextConnect		from	'next-connect';

const	{MONGODB_URI, MONGODB_DB} = process.env;

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
if (!MONGODB_DB) {
	throw new Error('Please define the MONGODB_DB environment variable inside .env.local')
}

let cached = global.mongo;
if (!cached) {
	cached = global.mongo = {dbClient: null, db: null, promise: null};
}

const client = new MongoClient(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function database(req, res, next) {
	if (cached.conn) {
		req.dbClient = cached.dbClient;
		req.db = cached.db;
		cached.db.collection('achievements').createIndex({UUID: 1}, {unique: true});
		return next();
  	}
	if (!cached.promise) {
		const opts = {useNewUrlParser: true, useUnifiedTopology: true};

		cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
			req.dbClient = client;
			req.db = client.db(process.env.MONGODB_DB);
			cached.dbClient = req.dbClient;
			cached.db = req.db;
			cached.db.collection('achievements').createIndex({UUID: 1}, {unique: true});
			return next();
		});
	}

	if (!client.isConnected()) {
		await cached.promise;
	}
	req.dbClient = cached.client;
	req.db = cached.db;
	cached.db.collection('achievements').createIndex({UUID: 1}, {unique: true});
	return next();
}

// const middleware = nextConnect();
// middleware.use(database);

export default database;