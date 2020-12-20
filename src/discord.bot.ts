import * as dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/../.env` });
import { logger } from "./logger/log4js.adapter";
import { shutdown } from "log4js";
logger.info(
  `ENV: ${process.env.NODE_ENV} | OS: ${process.platform} | PID: ${process.pid} | ARCH: ${process.arch} | LOG_LEVEL:${process.env.LOG_LEVEL}`
);
import * as Discord from "discord.js";
import config from "../config/config.json";
import * as fs from "fs";

import { connectDB, disconnectDB } from "./mongodb/mongo.adapter";
const reactionCollector = require("./projects/reaction.collector");
import { uploaderFunction, closeFileWatcher } from "./projects/arcdps.log.uploader";
import { prefix } from "../config/config.json";

let client: any = new Discord.Client();
client.commands = new Discord.Collection();

async function gracefulExit(sig: string, code: number = 0) {
  logger.info(`Recieved ${sig}`);
  logger.info("Attemping to gracefully exit...");
  try {
    await closeFileWatcher();
    logger.info("My watch has ended.");
    client.destroy();
    logger.info(`Discord Client Connection Closed.`);
    await disconnectDB();
  } catch (err: any) {
    code = 1;
    logger.error(err);
  } finally {
    logger.info(`Exiting with code: ${code}`);
    shutdown((error: any) => {
      if (error) {
        code = 2;
        console.error(`errors were encountered while closing the logger\n${error}`);
      }
      setImmediate(() => {
        process.exit(code);
      });
    });
  }
}

const sigs = ["SIGINT", "SIGTERM"];
sigs.forEach((sig) => {
  process.on(sig, async () => {
    await gracefulExit(sig);
  });
});

client.on("error", (err: Error) => {
  logger.error(err);
});

client.on("warn", (info: string) => {
  logger.warn(info);
});

process.on("uncaughtException", (error) => {
  logger.error(`uncaughtException:\nTHIS${error}`);
  gracefulExit("SIGTERM", 1);
});

process.on("exit", (code) => {
  if (code !== 0) {
    console.error(`There was errors while trying to graceflly exit, process.exit was called with code : ${code}`);
  } else {
    console.info(`----- { Exiting the end process with code : ${code} } -----`);
  }
});

const commandFiles = fs
  .readdirSync(process.env.NODE_ENV == "production" ? "../dist/commands" : "./commands")
  .filter((file) => file.endsWith(process.env.NODE_ENV == "production" ? ".js" : ".ts"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

client.once("ready", async () => {
  connectDB();
  logger.info(`Connected to Discord`);
  reactionCollector(client);
  uploaderFunction(client);
  client.user.setActivity("!command --help");
});

try {
  client.login(config.token);
} catch (err: any) {
  logger.error("Failed to connect to discord");
  logger.error(err);
}

client.on("message", (message: any) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  /* No Command */
  if (!client.commands.has(commandName)) return;
  /* Cooldowns */
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps: any = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 5) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }
  /* Channel only or Not*/
  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("I can't execute that command inside DMs!");
  }
  if (args[0] === "--help" || args[0] === "-h") {
    let helpFields: Array<any> = [];
    for (let i = 0; i < command.usage.length; i++) {
      helpFields[i] = {
        name: `${prefix}${command.name} ${command.usage[i]}`,
        value: `${command.tooltip[i]}`,
      };
    }
    const responseEmbed = new Discord.MessageEmbed()
      .setColor("77ffff")
      .setTitle(`${prefix}${command.name} Help`)
      .addFields(helpFields)
      .setTimestamp();
    return message.reply(responseEmbed);
  }
  /* Does it require arguments */
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\n Usage: \`${prefix}${command.name} ${command.usage}`;
    }
    return message.channel.send(reply);
  }
  /* Actual Command */
  try {
    command.execute(client, message, args);
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  } catch (err: any) {
    logger.error(err);
    message.reply("An error occoured, this is a unhelpful error message.");
  }
});
