import log4js from 'log4js';
const { configure, getLogger, shutdown } = log4js;
// import { configure, getLogger, shutdown } from 'log4js';
import config from '../../config/config.json';
import chokidar from 'chokidar';
import fs from 'fs';

function configureLogger(format: string, isEnableCallStack: boolean) {
	const logConfig = {
		appenders: {
			main: {
				type: 'dateFile',
				filename: './logs/main.log',
				pattern: '.yyyy-MM-dd',
				compress: true,
				daysToKeep: 7,
				keepFileExt: true,
				maxLogSize: 10485760, // 10 MB
				layout: {
					type: 'pattern',
					pattern: format,
				},
			},
			arcdps: {
				type: 'dateFile',
				filename: './logs/arcdps.log',
				pattern: '.yyyy-MM-dd',
				compress: true,
				daysToKeep: 7,
				keepFileExt: true,
				maxLogSize: 10485760, // 10 MB
			},
			console: {
				type: 'stdout',
				layout: {
					type: 'pattern',
					pattern: format,
				},
			},
		},
		categories: {
			main: {
				appenders: ['main', 'console'],
				level: 'info',
				enableCallStack: isEnableCallStack,
			},
			arcdps: {
				appenders: ['arcdps', 'console'],
				level: 'info',
			},
			default: { appenders: ['console'], level: 'info' },
		},
	};
	return configure(logConfig);
}

function setLogLevel(level: string) {
	switch (level?.toLowerCase()) {
		case 'trace':
			configureLogger('%[[ %d{yyyy-mm-dd hh:mm:ss.SSS O} | %c | PID:%z on %h | %p ]%] : %m%n%s', true);
			break;

		case 'debug':
			configureLogger('%[[ %d{yyyy-mm-dd hh:mm:ss.SSS O} | %c | PID:%z on %h | %f:%l:%o | %p ]%] : %m', true);
			break;

		default:
			configureLogger('%[[ %d{yyyy-mm-dd hh:mm:ss.SSS O} | %c | %p ]%] : %m', false);
	}
	logger.level = level;
	arcdpsLogger.level = level;
	logger.info(`Log Level is now ${level}`);
}

const wotcher: chokidar.FSWatcher = chokidar.watch('./config/config.json', { persistent: true }); // Path needs to be from package.json

wotcher.on('change', async (path: string, stats: any) => {
	shutdown((err: Error) => {
		if (err) {
			console.error(err);
		} else {
			setImmediate(async () => {
				console.log('Shutting down log4js to reconfigure...');
				let configFile: string = fs.readFileSync('./config/config.json', 'utf8');
				const newConfig = JSON.parse(configFile);
				setLogLevel(newConfig.logLevel);
			});
		}
	});
});

export const logger = getLogger('main');
export const arcdpsLogger = getLogger('arcdps');
setLogLevel(config.logLevel);
