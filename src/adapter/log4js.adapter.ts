import log4js from 'log4js';
const { configure, getLogger, shutdown } = log4js;
import config from '../../config/config.json';
import chokidar from 'chokidar';
import fs from 'fs';

const loggers: any = new Object();
const defaultLogLevel: string = 'info';

function configureLoggers(format: string, level: string, isEnableCallStack: boolean) {
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
				layout: {
					type: 'pattern',
					pattern: format,
				},
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
				level: level,
				enableCallStack: isEnableCallStack,
			},
			arcdps: {
				appenders: ['arcdps', 'console'],
				level: level,
				enableCallStack: isEnableCallStack,
			},
			default: { appenders: ['console'], level: level },
		},
	};
	return configure(logConfig);
}

export function initLoggers(level: string = defaultLogLevel) {
	try {
		switch (level.toLowerCase()) {
			case 'trace':
				configureLoggers('%[[ %d{yyyy-MM-dd hh:mm:ss.SSS O} | %c | PID:%z on %h | %p ]%] : %m%n%s', level, true);
				break;
			case 'debug':
				configureLoggers('%[[ %d{yyyy-MM-dd hh:mm:ss.SSS O} | %c | PID:%z on %h | %f:%l:%o | %p ]%] : %m', level, true);
				break;
			default:
				level = defaultLogLevel;
				configureLoggers('%[[ %d{yyyy-MM-dd hh:mm:ss.SSS O} | %c | %p ]%] : %m', level, false);
		}
	} finally {
		if (Object.keys(loggers).length > 0) {
			Object.values(loggers).forEach((logger: any) => {
				if (level.toLowerCase() !== logger.level.levelStr.toLowerCase()) {
					logger.level = level;
				}
				logger.info(`Log level for ${logger.category} set to ${logger.level}`);
			});
		}
		return;
	}
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
				try {
					const newConfig = JSON.parse(configFile);
					initLoggers(newConfig.LOG_LEVEL);
				} catch (err: any) {
					console.log(`Error while trying to configure loggers`, err);
				}
			});
		}
	});
});

// Initialize the loggers by calling log4js configure and setting log level if loggers exist
initLoggers(config.LOG_LEVEL);

// Get loggers
loggers.logger = getLogger('main');
loggers.arcdpsLogger = getLogger('arcdps');

//export default loggers;
export default loggers;
