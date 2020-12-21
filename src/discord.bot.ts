import * as Discord from 'discord.js';
import * as config from '../config/config.json';
import * as fs from 'fs';
import { logger } from './adapter/log4js.adapter';
import { connectDB } from './mongodb/mongo.adapter';
import { client, cooldowns } from './adapter/discord.adapter';
import reactionCollector from './projects/reaction.collector';
import { uploaderFunction, closeFileWatcher } from './projects/arcdps.log.uploader';
import { gracefulExit } from './the.end.process';
require('dotenv').config();

logger.info(`ENV: ${process.env.NODE_ENV} | PID: ${process.pid} | ARCH: ${process.arch}`);

// Works with all
const sigs: Array<string> = ['SIGINT', 'SIGTERM'];

sigs.forEach((signal: any) => {
	process.on(signal, async () => {
		await gracefulExit(signal);
	});
});

const commandFiles = fs
	.readdirSync(process.env.NODE_ENV == 'production' ? './dist/src/commands' : './src/commands')
	.filter((file) => file.endsWith(process.env.NODE_ENV == 'production' ? '.js' : '.ts'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', async () => {
	connectDB();
	logger.info(`Connected to Discord`);
	reactionCollector(client);
	uploaderFunction(client);
});

try {
	client.login(config.token);
} catch (err: any) {
	logger.error('Failed to connect to discord');
	logger.error(err);
}

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
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	/* Channel only or Not*/
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply("I can't execute that command inside DMs!");
	}
	if (args[0] === '--help' || args[0] === '-h') {
		let helpFields: Array<any> = [];
		for (let i = 0; i < command.usage.length; i++) {
			helpFields[i] = { name: `${config.prefix}${command.name} ${command.usage[i]}`, value: `${command.tooltip[i]}` };
		}
		const responseEmbed = new Discord.MessageEmbed().setColor('77ffff').setTitle(`${config.prefix}${command.name} Help`).addFields(helpFields).setTimestamp();
		return message.reply(responseEmbed);
	}
	/* Does it require arguments */
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\n Usage: \`${config.prefix}${command.name} ${command.usage}`;
		}
		return message.channel.send(reply);
	}
	/* Actual Command */
	try {
		command.execute(client, message, args);
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	} catch (err: any) {
		logger.error(err);
		message.reply('An error occoured, this is a unhelpful error message.');
	}
});

client.on('error', (err: Error) => {
	logger.error(err);
});

client.on('warn', (info: string) => {
	logger.info(info);
});
