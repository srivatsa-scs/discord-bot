import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, prettyPrint, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }: any): string => {
	return `[${timestamp}] | ${label} | (${level}): ${message}`;
});

export const infoLogger = createLogger({
	level: 'info',
	exitOnError: false,
	format: combine(label({ label: 'UsageLog' }), timestamp(), myFormat),
	transports: [
		new transports.File({
			filename: './logs/info.log',
			level: 'info',
		}),
		new transports.File({
			filename: './logs/error.log',
			level: 'error',
			handleExceptions: true,
		}),
	],
});

const myFormatTwo = printf(({ level, message, label, timestamp }: any): string => {
	return `[${timestamp}] | ${label} | (${level}): ${message} `;
});

export const arcDpsLogLogger = createLogger({
	level: 'info',
	exitOnError: false,
	format: combine(label({ label: 'dps.report Log' }), timestamp(), myFormatTwo),
	transports: [
		new transports.File({
			filename: './logs/dpsReportLogs.log',
			level: 'info',
		}),
		new transports.Console(),
	],
});
