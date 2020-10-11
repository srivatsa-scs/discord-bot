import { Client, Message } from 'discord.js';
import fs from 'fs';

module.exports = {
	name: 'commands',
	description: 'lists all commands',
	cooldown: 5,
	guildOnly: true,
	usage: [' '],
	tooltip: ['Displays a list of commands.'],
	execute(client: Client, message: Message, args: Array<string>) {
		const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.ts'));
		let commands: string = '';
		commandFiles.forEach((file: any) => {
			commands += `!${file.substr(0, file.length - 3)} `;
		});
		/* Currently only works if file names are the same as commands */
		message.channel.send(`<@!${message.author.id}> here are the list of commands: ${commands}`);
	},
};
