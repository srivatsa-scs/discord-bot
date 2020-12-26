import log4js from 'log4js';
import { client } from './adapter/discord.adapter';
import loggers from './adapter/log4js.adapter';
const { logger } = loggers;
import { disconnectDB } from './mongodb/mongo.adapter';
import { closeFileWatcher } from './projects/arcdps.log.uploader';

export async function gracefulExit(sig: string, code: number = 0): Promise<void> {
	logger.info(`Recieved ${sig}`);
	logger.info('Attempting to gracefully exit...');
	try {
		await closeFileWatcher();
		logger.info('My watch has ended.');
		client.destroy();
		logger.info(`Discord Client Connection Closed.`);
		await disconnectDB();
	} catch (err: any) {
		logger.error(err);
	} finally {
		logger.info(`Exiting with code: ${code}`);
		log4js.shutdown((error: Error) => {
			if (error) {
				console.error('Error when shutting down logger', error);
			}
			setImmediate(() => {
				process.exit(code);
			});
		});
	}
}
