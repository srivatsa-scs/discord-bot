import { Client, Message } from 'discord.js';

module.exports = {
	name: 'ping',
	description: 'replies with Pong',
	cooldown: 5,
	guildOnly: true,
	usage: [''],
	tooltip: ['Replies with Pong'],
	execute(client: Client, message: Message, args: Array<string>) {
		message.channel.send('Pong.');
	},
};
