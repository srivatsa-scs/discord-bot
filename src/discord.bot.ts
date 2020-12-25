import dotenv from 'dotenv';
dotenv.config();
import loggers from './adapter/log4js.adapter';
const { logger } = loggers;
import config from './config/config.json';
const { PREFIX, TOKEN } = config;
logger.info(`ENV: ${process.env.NODE_ENV} | OS: ${process.platform} | PID: ${process.pid} | ARCH: ${process.arch} | LOG_LEVEL: ${logger.level}`);
import { client, cooldowns } from './adapter/discord.adapter';
import Discord from 'discord.js';
import fs from 'fs';
import { gracefulExit } from './end.process';
import { connectDB, disconnectDB } from './mongodb/mongo.adapter';
import reactionCollector from './projects/reaction.collector';
import { uploaderFunction, closeFileWatcher } from './projects/arcdps.log.uploader';
import path from 'path';

const sigs: Array<string> = ['SIGINT', 'SIGTERM', 'SIGUSR2'];

sigs.forEach((sig: string) => {
	process.on(sig, async () => {
		await gracefulExit(sig);
	});
});

process
	.on('exit', (code) => {
		if (code !== 0) {
			console.error(`There was errors while trying to graceflly exit, process.exit was called with code : ${code}`);
		} else {
			console.info(`----- { Exiting the end process with code : ${code} } -----`);
		}
	})
	.on('uncaughtException', (error: Error) => {
		logger.fatal('App encountered an uncaughtException 🙁', error);
		gracefulExit('SIGTERM', 1);
	})
	.on('unhandledRejection', (error: Error) => {
		logger.fatal('App encountered an unhandled Promise Rejection 😭', error);
		gracefulExit('SIGTERM', 1);
	});

const commandsDir = new URL('./commands', import.meta.url);
const commandFiles = fs.readdirSync(commandsDir.pathname);
for (const file of commandFiles) {
	const command = await import(path.join(commandsDir.pathname, file));
	client.commands.set(command.default.name, command.default);
}

client.once('ready', async () => {
	await connectDB();
	logger.info(`Discord client connected as ${client.user.tag}`);
	reactionCollector(client);
	uploaderFunction(client);
});

try {
	await client.login(TOKEN);
} catch (err: any) {
	logger.fatal('Failed to connect to discord', err);
	gracefulExit('SIGTERM', 3);
}

client.on('message', (message: any) => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
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
			helpFields[i] = {
				name: `${PREFIX}${command.name} ${command.usage[i]}`,
				value: `${command.tooltip[i]}`,
			};
		}
		const responseEmbed = new Discord.MessageEmbed().setColor('77ffff').setTitle(`${PREFIX}${command.name} Help`).addFields(helpFields).setTimestamp();
		return message.reply(responseEmbed);
	}
	/* Does it require arguments */
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\n Usage: \`${PREFIX}${command.name} ${command.usage}`;
		}
		return message.channel.send(reply);
	}
	/* Actual Command */
	try {
		command.execute(client, message, args);
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	} catch (err: any) {
		logger.error('Command execute error', err);
		message.reply('An error occoured, this is a unhelpful error message.');
	}
});
