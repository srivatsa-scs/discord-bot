import { configure, getLogger } from "log4js";

function configureLogger(format: string, isEnableCallStack: boolean) {
  const logConfig = {
    appenders: {
      main: {
        type: "file",
        filename: "../logs/main.log",
        layout: {
          type: "pattern",
          pattern: format,
        },
      },
      arcDpsUploader: {
        type: "file",
        filename: "../logs/dpsReportLogs.log",
      },
      console: {
        type: "stdout",
        layout: {
          type: "pattern",
          pattern: format,
        },
      },
    },
    categories: {
      main: {
        appenders: ["main", "console"],
        level: "info",
        enableCallStack: isEnableCallStack,
      },
      arcDpsUploader: {
        appenders: ["arcDpsUploader", "console"],
        level: "info",
      },
      default: { appenders: ["console"], level: "info" },
    },
  };
  return configure(logConfig);
}

switch (process.env.LOG_LEVEL?.toLowerCase()) {
  case "trace":
    configureLogger("%[[ %d{yyyy-mm-dd} %r | %c | PID:%z on %h | %p ]%] - %m%n%s", true);
    break;
  case "debug":
    configureLogger("%[[ %d{yyyy-mm-dd} %r | %c | PID:%z on %h | %f:%l:%o | %p ]%] - %m", true);
    break;
  default:
    configureLogger("%[[ %d{yyyy-mm-dd} %r | %c | %p ]%] - %m", false);
}

export const logger = getLogger("main");
export const arcDpsLogLogger = getLogger("uploader");
//export const shutdownLogger = shutdown();
//Set log level to respect .env setting
logger.level = `${process.env.LOG_LEVEL}`;
arcDpsLogLogger.level = `${process.env.LOG_LEVEL}`;
