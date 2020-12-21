import Discord from 'discord.js';
import { logger } from './log4js.adapter';
import { setDiscordStatus } from '../resources/discord.status';
import { exec } from 'child_process';
const client: any = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const discordErrorEvents: Array<string> = ['rateLimit', 'shardError', 'invalidated', 'error'];

client.on('ready', () => {
	setDiscordStatus();
});
client.on('debug', (info: any) => {
	logger.debug(info);
});
client.on('warn', (warn: any) => {
	logger.warn(warn);
});
discordErrorEvents.forEach((event: string) => {
	client.on(event, (err: Error) => {
		logger.error(event, err);
	});
});

export { client, cooldowns };
