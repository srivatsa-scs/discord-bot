import log4js from 'log4js';
import { client } from './adapter/discord.adapter';
import { logger } from './adapter/log4js.adapter';
import { disconnectDB } from './mongodb/mongo.adapter';
import { closeFileWatcher } from './projects/arcdps.log.uploader';

export async function gracefulExit(sig: string, code: number = 0): Promise<void> {
	logger.info(`Recieved ${sig}`);
	logger.info(`Attempting to gracefully exit...`);
	try {
		await closeFileWatcher();
		logger.info(`My watch has ended.`);
		client.destroy();
		logger.info(`Discord Connection Closed.`);
		await disconnectDB();
		logger.info(`MongoDB Connection Closed.`);
	} catch (err: any) {
		logger.error(err);
	} finally {
		logger.info(`Exiting with code: ${code}`);
		log4js.shutdown((err: any) => {
			if (err) {
				console.error('Error when shutting down logger');
				console.error(err);
			}
			setImmediate(() => {
				process.exit(code);
			});
		});
		return;
	}
}
