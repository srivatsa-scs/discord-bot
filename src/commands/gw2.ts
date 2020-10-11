import { Client, Message, MessageEmbed } from 'discord.js';
import { validateGw2ApiToken } from '../gw2api/check.apikey.perms';
import { findAllApiKeys, insertApiKey, removeApiKey } from '../mongodb/mongo.adapter';
import insertResponseDecoder from '../mongodb/insert.response.decoder';
import { awaitUserReaction } from '../projects/await.choice';
module.exports = {
	name: 'gw2',
	description: 'used to add and remove api keys',
	guildOnly: true,
	tooltip: [`Allows you to add one or more API Keys`, `Allows you to remove an API key`],
	usage: ['add <enter-your-api-key-here>', 'remove'],
	async execute(client: Client, message: Message, args: Array<string>) {
		let formattedFields: Array<any> = [];
		let responseTitle: string = 'Add / Remove API keys';
		const discordUserId = message.author.id;
		if (args[0] === 'add') {
			message.delete({ timeout: 2500 });
			responseTitle = 'Add API key(s)';
			for (let i = 1; i < args.length; i++) {
				let valid: boolean = await validateGw2ApiToken(args[i]);
				let insertResponseCode: number;
				if (valid) {
					insertResponseCode = await insertApiKey(args[i], discordUserId);
				} else insertResponseCode = -1;

				formattedFields.push({
					name: insertResponseDecoder.get(insertResponseCode),
					value: args[i],
				});
			}
		} else if (args[0] === 'remove') {
			responseTitle = 'Remove API key';
			const dbResp: any = await findAllApiKeys(discordUserId);
			if (dbResp.length > 0) {
				const choice: any = await awaitUserReaction(client, discordUserId, dbResp);
				const deleteResp = await removeApiKey(dbResp[choice]._id, discordUserId);
				console.log(dbResp[choice], deleteResp);

				if (deleteResp) {
					formattedFields.push({ name: dbResp[choice].accName, value: 'Removed Successfully' });
				} else {
					formattedFields.push({ name: dbResp[choice].accName, value: 'Error Occoured while removing' });
				}
			} else {
				formattedFields.push({ name: '❌ API Key not found ❌', value: `You don't have any API keys stored with me` });
			}
		}
		const embed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(responseTitle)
			.setThumbnail(`https://wiki.guildwars2.com/images/e/e8/Jumping_puzzle_%28map_icon%29.png`)
			.addFields(formattedFields)
			.setTimestamp();

		return client.users.cache.get(discordUserId)!.send(embed);
	},
};
