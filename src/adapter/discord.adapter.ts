import Discord from 'discord.js';
import { logger } from './log4js.adapter';
import { setDiscordStatus } from '../resources/discord.status';
const client: any = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const discordErrorEvents: Array<string> = ['rateLimit', 'shardError', 'invalidated', 'error'];
// const array2 = [
// 	{
// 		level: 'error',
// 		names: discordErrorEvents,
// 	},
// 	{
// 		names: ['debug'],
// 		level: 'debug',
// 	},
// 	{
// 		names: ['warn'],
// 		level: 'warn',
// 	},
// ];

// const array = [
// 	{
// 		name: 'rateLimit',
// 		level: 'error',
// 	},
// 	{
// 		name: 'shardError',
// 		level: 'error',
// 	},
// 	{
// 		name: 'invalidated',
// 		level: 'error',
// 	},
// 	{
// 		name: 'error',
// 		level: 'error',
// 	},
// 	{
// 		name: 'debug',
// 		level: 'debug',
// 	},
// 	{
// 		name: 'warn',
// 		level: 'warn',
// 	},
// 	{
// 		name: 'ready',
// 		level: 'info',
// 	},
// ];

client.on('ready', () => {
	setDiscordStatus();
});

// discordErrorEvents.forEach((event: any) => {
// 	switch (event.level) {
// 		case 'debug':
// 			client.on(event.name, (msg: any) => {
// 				logger.debug(event.name, msg);
// 			});
// 		case 'warn':
// 			client.on(event.name, (msg: any) => {
// 				logger.warn(event.name, msg);
// 			});
// 		case 'error':
// 			client.on(event.name, (msg: Error) => {
// 				logger.error(event.name, msg);
// 			});
// 	}
// });

discordErrorEvents.forEach((event: string) => {
	client.on(event, (err: Error) => {
		logger.error(event, err);
	});
	if (event == 'debug') {
		client.on(event, (info: any) => {
			logger.debug(event);
		});
	} else if (event == 'warn') {
		client.on(event, (warn: any) => {
			logger.warn(event);
		});
	}
});

export { client, cooldowns };
