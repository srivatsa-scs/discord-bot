import { MessageEmbed } from 'discord.js';
import { validateGw2ApiToken } from '../gw2api/check.apikey.perms';
import { maingw2 } from '../gw2api/gw2api.main';
import { findAllApiKeys, insertApiKey } from '../mongodb/mongo.adapter';
import insertResponseDecoder from '../mongodb/insert.response.decoder';
import { awaitUserReaction } from '../projects/await.choice';

module.exports = {
	name: 'gw2tp',
	description: 'checks the gw2 trading post',
	async execute(client: any, message: any, args: any) {
		let formattedFields = [];
		const discordUserId = message.author.id;
		message.delete({ timeout: 1000 });
		/* One or more Args provided */

		if (args.length > 0) {
			// let keyValidityArray: Array<any> = [];
			for (let key of args) {
				let valid: boolean = await validateGw2ApiToken(key);
				let insertResponseCode: number;
				if (valid) {
					insertResponseCode = await insertApiKey(key, discordUserId);
				} else insertResponseCode = -1;

				formattedFields.push({
					name: insertResponseDecoder.get(insertResponseCode),
					value: key,
				});
			}
			// console.log(keyValidityArray);
		} else {
			/* No Args provided */
			const dbResp: any = await findAllApiKeys(discordUserId);
			if (dbResp.length > 0) {
				let choice: any = await awaitUserReaction(client, discordUserId, dbResp);
				// console.log(dbResp[choice]);

				const resp = await maingw2(dbResp[choice].apiKey);
				// console.log(resp);
				if (resp!.totalCoins === undefined && resp!.totalItems.length === 0) {
					formattedFields.push({ name: 'You have nothing', value: 'Jon Snow' });
				}
				if (resp?.totalCoins) {
					formattedFields.push({ name: 'Coins', value: `${resp?.totalCoins.gold} ${resp?.totalCoins.silver}s ${resp?.totalCoins.copper}c` });
				}
				if (resp!.totalItems.length > 0) {
					for (let items of resp!.totalItems) {
						formattedFields.push({ name: items.name, value: items.count });
					}
				}
			} else {
				formattedFields.push({ name: '❌ API Key not found ❌', value: `You don't have any API keys stored with me` });
			}
		}

		const embed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(`GW2 Trading Post`)
			.setThumbnail(`https://wiki.guildwars2.com/images/b/be/Black_Lion_Trading_Company_trading_post_icon.png`)
			.addFields(formattedFields)
			.setFooter(`${new Date(new Date().toUTCString())}`);
		client.users.cache.get(discordUserId).send(embed);
	},
};
