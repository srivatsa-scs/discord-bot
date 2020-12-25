import { Client, Message } from 'discord.js';

export default {
	name: 'smile',
	description: 'reacts with a smiley',
	cooldown: 5,
	guildOnly: true,
	usage: [''],
	tooltip: ['Reacts with a smiley'],
	execute(client: Client, message: Message, args: Array<string>) {
		message.react('😄');
	},
};
