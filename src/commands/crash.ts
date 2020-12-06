import { Client, Message } from 'discord.js';

module.exports = {
	name: 'crash',
	description: 'Throws an error',
	cooldown: 5,
	guildOnly: true,
	usage: [''],
	tooltip: ['Replies with Pong'],
	execute(client: Client, message: Message, args: Array<string>) {
		throw new Error('User Defined Error');
	},
};
