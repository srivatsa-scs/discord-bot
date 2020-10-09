import { MessageEmbed } from 'discord.js';
import { validateGw2ApiToken } from '../gw2api/check.apikey.perms';
import { maingw2 } from '../gw2api/gw2api.main';
import { findAllApiKeys, insertApiKey, removeApiKey } from '../mongodb/mongo.adapter';
import insertResponseDecoder from '../mongodb/insert.response.decoder';
import { awaitUserReaction } from '../projects/await.choice';

module.exports = {
	name: 'gw2tp',
	description: 'checks the gw2 trading post',
	guildOnly: true,
	tooltip: [`Allows you to check trading post of accounts you've linked to this bot`, `Allows you to add one or more API Keys`, `Allows you to remove an API key`],
	usage: ['', 'add <enter-your-api-key-here>', 'remove'],
	async execute(client: any, message: any, args: any) {
		let formattedFields = [];
		const discordUserId = message.author.id;
		/* Look up keys that are stored in the database for that user */

		const dbResp: any = await findAllApiKeys(discordUserId);
		if (dbResp.length > 0) {
			const choice: any = await awaitUserReaction(client, discordUserId, dbResp);
			/* No Args provided */
			const resp = await maingw2(dbResp[choice].apiKey);

			if (resp!.totalCoins === undefined && resp!.totalItems.length === 0) {
				formattedFields.push({ name: 'You have nothing', value: 'Jon Snow' });
			}
			if (resp?.totalCoins) {
				formattedFields.push({ name: 'Coins', value: `${resp?.totalCoins.gold}g ${resp?.totalCoins.silver}s ${resp?.totalCoins.copper}c` });
			}
			if (resp!.totalItems.length > 0) {
				for (let items of resp!.totalItems) {
					formattedFields.push({ name: items.name, value: items.count });
				}
			}
		} else {
			formattedFields.push({ name: '❌ API Key not found ❌', value: `You don't have any API keys stored with me` });
		}

		const embed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(`GW2 Trading Post`)
			.setThumbnail(`https://wiki.guildwars2.com/images/b/be/Black_Lion_Trading_Company_trading_post_icon.png`)
			.addFields(formattedFields)
			.setTimestamp();

		client.users.cache.get(discordUserId).send(embed);
	},
};
