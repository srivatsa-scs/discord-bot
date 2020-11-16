import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
	discord: {
		type: String,
		required: true,
	},
	gw2: [
		{
			accName: String,
			apiKey: String,
		},
	],
});

export default mongoose.model('user', userSchema, 'gw2-api-keys');
