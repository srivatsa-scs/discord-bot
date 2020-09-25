import mongoose from 'mongoose';
import * as config from '../../config/config.json';
const User = require('./user.model');

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err: any) => {
	if (err) {
		console.log('Failed to connect to Database');
	} else {
		let nowDate: Date = new Date();
		console.log(` * [${nowDate}] Connected to Database`);
	}
});

export function mongoDbHandler() {
	// mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err: any) => {
	// 	if (err) {
	// 		console.log('Failed to connect to Database');
	// 	} else {
	// 		let nowDate: Date = new Date();
	// 		console.log(` * [${nowDate}] Connected to Database`);
	// 	}
	// });

	let user = new User({ discord: config.DISCORD_USER_ID, gw2ApiKey: [{ accName: config.GW2_ACC_NAME, apiKey: config.GW2_API_KEY }] });
	User.findOne({ discord: config.DISCORD_USER_ID }, async (err: any, docs: any) => {
		if (err) console.log('Error');
		else {
			if (docs) {
				console.log('User already exists');
			} else {
				// Validate if the key has all the required perms
				user.save((err: any, reg: any) => {
					if (err) {
						console.log('Error when saving');
					} else {
						console.log(`User saved with id ${reg.id}`);
					}
				});
			}
		}
	});
}

export async function findAllApiKeys(discordUserId: string): Promise<any> {
	try {
		const resp = await User.findOne({ discord: discordUserId }).exec();
		if (resp) {
			return resp.gw2ApiKey;
		} else return [];
	} catch (err) {
		console.log(err);
		return { error: 'An error occoured when checking the database.' };
	}

	// User.findOne({ discord: discordUserId }, (err: any, docs: any) => {
	// 	if (err) {
	// 		console.error(err);
	// 		return { error: 'An error occoured when checking the database.' };
	// 	} else {
	// 		if (docs) {
	// 			/* Non-empty array = keys exist (maybe invalid) */
	// 			return { keys: docs.gw2ApiKey };
	// 		} else {
	// 			/* Empty array = no keys */
	// 			return { keys: [] };
	// 		}
	// 	}
	// });
	/* This should never happen */
	return { error: `An error occoured when checking the database. This shouldn't ever happen` };
}
