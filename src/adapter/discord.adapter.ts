import Discord from 'discord.js';
import { logger } from './log4js.adapter';
import { setDiscordStatus } from '../resources/discord.status';

const client: any = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const discordErrorEvents: Array<string> = ['rateLimit', 'shardError', 'invalidated', 'error', 'shardReconnecting', 'shardDisconnect'];
const discordInfoEvents: Array<string> = ['shardResume', 'shardReady'];

discordInfoEvents.forEach((infoEvent: any) => {
	client.on(infoEvent, () => {
		logger.info(infoEvent);
		setDiscordStatus();
	});
});
client.on('debug', (info: any) => {
	logger.debug('debug', info);
});
client.on('warn', (warn: any) => {
	logger.warn('warn', warn);
});
discordErrorEvents.forEach((event: string) => {
	client.on(event, (err: Error) => {
		logger.error(event, err);
	});
});

export { client, cooldowns };
