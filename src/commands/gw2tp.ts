import { MessageEmbed } from 'discord.js';
import { maingw2 } from '../gw2api/gw2api.main';
import { findAllApiKeys } from '../mongodb/mongo.adapter';

module.exports = {
	name: 'gw2tp',
	description: 'checks the gw2 trading post',
	async execute(client: any, message: any, args: any) {
		// args > 1

		// args => 0 do normal

		const dbResp: any = await findAllApiKeys(message.author.id);
		let formattedFields = [];

		if (dbResp.length > 0) {
			// Which Api key do you want to use
			// await user response or timeout module
			const resp = await maingw2(dbResp[0].apiKey);
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

		const embed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(`GW2 Trading Post`)
			.setThumbnail(`https://wiki.guildwars2.com/images/b/be/Black_Lion_Trading_Company_trading_post_icon.png`)
			.addFields(formattedFields)
			.setFooter(`${new Date(new Date().toUTCString())}`);
		client.users.cache.get(message.author.id).send(embed);
	},
};
