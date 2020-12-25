import { Client, Message } from 'discord.js';

export default {
	name: 'commands',
	description: 'lists all commands',
	cooldown: 5,
	guildOnly: true,
	usage: [' '],
	tooltip: ['Displays a list of commands.'],
	execute(client: any, message: Message, args: Array<string>) {
		let commands: string = '';
		client.commands.forEach((value: any, key: any) => {
			commands += `!${key} `;
		});
		message.channel.send(`<@!${message.author.id}> here are the list of commands: ${commands}`);
	},
};
