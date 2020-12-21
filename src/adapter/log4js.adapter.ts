import { configure, getLogger } from 'log4js';

const pattern = '%[* [%d{yyyy-MM-dd hh:mm:ss.SSS TZO}] (%p):%] %m';
configure({
	appenders: {
		main: {
			type: 'file',
			filename: './logs/main.log',
			layout: {
				type: 'pattern',
				pattern: pattern,
			},
		},
		arcdps: {
			type: 'file',
			filename: './logs/arcdps.log',
		},
		console: {
			type: 'stdout',
			layout: {
				type: 'pattern',
				pattern: pattern,
			},
		},
	},
	categories: {
		main: {
			appenders: ['main', 'console'],
			level: 'info',
			enableCallStack: false,
		},
		arcdps: {
			appenders: ['arcdps', 'console'],
			level: 'info',
		},
		default: {
			appenders: ['console'],
			level: 'info',
		},
	},
});

export const logger = getLogger('main');
export const arcdpsLogger = getLogger('arcdps');
