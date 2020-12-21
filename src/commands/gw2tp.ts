import { MessageEmbed } from 'discord.js';
import { maingw2 } from '../gw2api/gw2api.main';
import { findAllApiKeys } from '../mongodb/mongo.adapter';
import { awaitUserReaction } from '../projects/await.choice';

module.exports = {
  name: 'gw2tp',
  description: 'checks the gw2 trading post',
  guildOnly: false,
  tooltip: [`Allows you to check trading post of accounts you've linked to this bot`],
  usage: ['\u200B'],
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
      formattedFields.push({
        name: '❌ API Key not found ❌',
        value: `Beep-Boop, You don't have any API keys stored with me. Use !gw2 add <Enter-your-api-key> to add an API key.`,
      });
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
