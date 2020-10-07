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

		for (let boss = 0; boss < totalRaids.length; boss++) {
			if (incompleteRaids.length < 25) {
				if (boss == 0) formattedFields.push({ name: 'Spirit Vale (W1)', value: '\u200B' });
				if (boss == 4) formattedFields.push({ name: 'Salvation Pass (W2)', value: '\u200B' });
				if (boss == 7) formattedFields.push({ name: 'Stronghold of the Faithful (W3)', value: '\u200B' });
				if (boss == 11) formattedFields.push({ name: 'Bastion of the Penitent (W4)', value: '\u200B' });
				if (boss == 15) formattedFields.push({ name: 'Hall of Chains (W5)', value: '\u200B' });
				if (boss == 19) formattedFields.push({ name: 'Mythwright Gambit (W6)', value: '\u200B' });
				if (boss == 22) formattedFields.push({ name: 'The Key of Ahdashim (W7)', value: '\u200B' });
			}
			const isCompleted = completedRaids.includes(totalRaids[boss]);
			if (!isCompleted) {
				formattedFields.push({
					name: totalRaids[boss]
						.split('_')
						.map((word: string) => word[0].toUpperCase() + word.substring(1).toLowerCase())
						.join(' '),
					value: '⛔',
					inline: true,
				});
			}
		}

		let embed: MessageEmbed = new MessageEmbed()
			.setTitle('Raids to be completed')
			.addFields(formattedFields)
			.setTimestamp()
			.setThumbnail('https://wiki.guildwars2.com/images/5/5e/Legendary_Insight.png');
		return client.users.cache.get(discordUserId).send(embed);
	},
};
