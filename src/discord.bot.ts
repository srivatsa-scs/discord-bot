import * as Discord from 'discord.js';
import config from '../config/config.json';
import fs from 'fs';

const client: any = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.ts'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('* Discord Bot Ready');
});
client.login(config.token);

client.on('message', (message: any) => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	/* No Command */
	if (!client.commands.has(commandName)) return;
	/* Cooldowns */
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps: any = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 5) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	try {
		command.execute(client, message, args);
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	} catch (err: any) {
		console.error(err);
		message.reply('Error!');
	}
});
