import { getGoldToGems } from '../gw2api/goldtogems';
export default {
	name: 'gw2gems',
	description: 'Gives gold to gems conversion rate for 400💎',
	guildOnly: true,
	usage: [' '],
	tooltip: ['Gives gold to gems conversion rate for 400💎'],
	cooldown: 5,
	async execute(client: any, message: any, args: any) {
		const resp: any = await getGoldToGems();

		message.channel.send(`400 Gems = ${resp!.gold}g ${resp!.silver}s ${resp!.copper}c`);
	},
};
