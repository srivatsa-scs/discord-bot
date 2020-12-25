import { Client, Message } from 'discord.js';
import loggers from '../adapter/log4js.adapter';
const { logger } = loggers;

export default {
	name: 'crash',
	description: 'Throws an error',
	cooldown: 5,
	guildOnly: true,
	usage: [''],
	tooltip: ['Replies with Pong'],
	execute(client: Client, message: Message, args: Array<string>) {
		try {
			throw new Error('User Defined Error');
		} catch (err: any) {
			logger.error('User defined error', err);
		}
	},
};
