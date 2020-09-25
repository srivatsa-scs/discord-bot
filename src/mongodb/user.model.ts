import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
	discord: {
		type: String,
		required: true,
	},
	gw2ApiKey: [
		{
			accName: String,
			apiKey: String,
		},
	],
});

module.exports = mongoose.model('user', userSchema, 'gw2-api-keys');
