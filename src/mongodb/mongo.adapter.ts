import { debug } from 'console';
import mongoose from 'mongoose';
import * as config from '../../config/config.json';
import { fetchGw2AccName } from '../gw2api/find.account.name';
const UserModel = require('./user.model');

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err: any) => {
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

	let user = new UserModel({ discord: config.DISCORD_USER_ID, gw2ApiKey: [{ accName: config.GW2_ACC_NAME, apiKey: config.GW2_API_KEY }] });
	UserModel.findOne({ discord: config.DISCORD_USER_ID }, async (err: any, docs: any) => {
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
		const resp = await UserModel.findOne({ discord: discordUserId }).exec();
		if (resp) {
			return resp.gw2;
		} else return [];
	} catch (err) {
		console.log(err);
		return { error: 'An error occoured when checking the database.' };
	}
}

export async function getAccInfo(apiKey: string, discordUserId: string): Promise<string> {
	try {
		const resp = await UserModel.findOne({ discord: discordUserId }, 'gw2').exec();
		if (resp) {
			console.log(resp);
		}
	} catch (err) {
		console.log('Error occoured with Database');
	}
	return '';
}

export async function insertApiKey(apiKey: string, discordUserId: string): Promise<number> {
	try {
		const resp = await UserModel.findOne({ discord: discordUserId }, 'gw2').exec();
		if (resp) {
			console.debug('* Discord user already exists');
			let accAlreadyExists: boolean = false;

			/* Check to see if the API key is present in the database */
			for (let element of resp.gw2) {
				if (element.apiKey === apiKey) {
					accAlreadyExists = true;
					break;
				}
			}
			if (!accAlreadyExists) {
				console.debug('* Account does not exist');
				const accName: string = await fetchGw2AccName(apiKey);
				if (accName === '') {
					return 5;
				} else {
					const dbResp = await UserModel.updateOne(
						{ _id: resp._id },
						{
							$push: {
								gw2: { accName: accName, apiKey: apiKey },
							},
						}
					);
					if (dbResp.ok === 1) {
						console.debug('* New API Key has been added');
						return 0;
					} else return 5;
				}
			} else {
				console.log('* API key already exists');
				return 2;
			}
		} else {
			console.log(`* Discord user does not exist`);
			const accName: string = await fetchGw2AccName(apiKey);
			console.log(accName);
			const newUser = new UserModel({
				discord: discordUserId,
				gw2: {
					accName: accName,
					apiKey: apiKey,
				},
			});
			const dbSaveResp = await newUser.save();
			return 0;
		}
	} catch (err) {
		return 5;
	}
}

export async function removeApiKey(_id: string, discordUserId: string) {
	const user = await UserModel.findOne({ discord: discordUserId });
	UserModel.findOneAndUpdate({ _id: user._id }, { $pull: { gw2: { _id: _id } } }, { new: true }, (err: any) => {
		if (err) {
			console.log(err);
			return false;
		} else {
			console.log('removed');
			return true;
		}
	});
}

/* Return Codes */

// 0: New discord user created
// 1: New API key added
// 2: API key already exists
// 3: Issue with fetching name
// 4: Issue with database
// 5: Unknown error