import Discord from 'discord.js';
import loggers from './log4js.adapter';
const { logger, console } = loggers;
import { gracefulExit } from '../end.process';
import { setDiscordStatus } from '../resources/discord.status';

const client: any = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const discordErrorEvents: Array<string> = ['rateLimit', 'shardError', 'error'];
const discordInfoEvents: Array<string> = ['allReady', 'ready', 'resumed', 'shardReady', 'shardDisconnect'];
const discordDebugEvents: Array<string> = ['shardReconnecting', 'shardResume'];

client
	.on('shardReady', (info?: any) => {
		setDiscordStatus();
	})
	.on('warn', (warn?: any) => {
		logger.warn(warn);
	})
	.on('invalidated', (err?: any) => {
		logger.fatal(err ? err : '');
		gracefulExit('SIGTERM', 130);
	})
	.on('debug', (info?: any) => {
		logger.debug(info);
	});

discordErrorEvents.forEach((event: string) => {
	client.on(event, (err?: Error) => {
		logger.error(event, err ? err : '');
	});
});

discordInfoEvents.forEach((event: string) => {
	client.on(event, (info?: any) => {
		logger.info(event, info ? info : '');
	});
});

discordDebugEvents.forEach((event: string) => {
	client.on(event, (info?: any) => {
		logger.debug(event, info ? info : '');
	});
});

export { client, cooldowns };
