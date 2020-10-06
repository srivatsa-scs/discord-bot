import { Client, Collection, Message, MessageEmbed, MessageReaction, Snowflake, User } from 'discord.js';
import { getCompletedRaids } from '../gw2api/check.completed.raids';
import { findAllApiKeys } from '../mongodb/mongo.adapter';
import { awaitUserReaction } from '../projects/await.choice';
import totalRaids from '../resources/raid.map';
module.exports = {
	name: 'raids',
	description: 'allows to check which raid wings are not still completed',
	async execute(client: any, message: Message, args: Array<string>) {
		const discordUserId: string = message.author.id;
		const dbResp: any = await findAllApiKeys(discordUserId);
		const choice: any = await awaitUserReaction(client, discordUserId, dbResp);
		const completedRaids = await getCompletedRaids(dbResp[choice].apiKey);

		let incompleteRaids = totalRaids.filter((val: string) => !completedRaids.includes(val));
		let formattedFields: any = [];
		for (let boss of incompleteRaids) {
			formattedFields.push({
				name: boss
					.split('_')
					.map((word: string) => word[0].toUpperCase() + word.substring(1).toLowerCase())
					.join(' '),
				value: '⛔',
			});
		}

		let embed: MessageEmbed = new MessageEmbed().setTitle('Raids to be completed').addFields(formattedFields).setTimestamp();
		return client.users.cache.get(discordUserId).send(embed);
	},
};
