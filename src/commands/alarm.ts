import { logger } from "../logger/log4js.adapter";

module.exports = {
  name: "alarm",
  description: "It sets an alarm!",
  cooldown: 5,
  args: true,
  guildOnly: true,
  usage: ["<time> <message>"],
  tooltip: ["You can set an reminder for upto 12h with an optional message."],
  execute(client: any, message: any, args: any) {
    if (args[0]) {
      let alarmTimeout = 1000;
      let hours: any = args[0].match(/\d+h/gi);
      let minutes: any = args[0].match(/\d+m/gi);
      let seconds: any = args[0].match(/\d+s/gi);
      let timeErrorFlag: number = 0;
      if (hours) {
        hours = Number(hours[0]?.substr(0, hours[0].length - 1));
      } else {
        hours = 0;
        timeErrorFlag += 1;
      }
      if (minutes) {
        minutes = Number(minutes[0]?.substr(0, minutes[0].length - 1));
      } else {
        minutes = 0;
        timeErrorFlag += 1;
      }
      if (seconds) {
        seconds = Number(seconds[0]?.substr(0, seconds[0].length - 1));
      } else {
        seconds = 0;
        timeErrorFlag += 1;
      }
      if (timeErrorFlag == 3) {
        return message.channel.send(
          `<@!${message.author.id}> please enter command in the format: \`!alarm 5h30m20s\`.`
        );
      }
      if (seconds >= 60) {
        minutes += Math.floor(seconds / 60);
        seconds %= 60;
      }
      if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes %= 60;
      }
      alarmTimeout *= hours * 3600 + minutes * 60 + seconds;
      if (alarmTimeout > 43200000) {
        return message.channel.send(`<@!${message.author.id}> max alarm time is 12h`);
      }
      logger.info(`Alarm set by (${message.author.id}) for (${hours}h ${minutes}m ${seconds}s)`);
      message.channel.send(
        `<@!${message.author.id}>, I will send you a direct message in ${hours}h ${minutes}m ${seconds}s.`
      );
      let replyMessage: string = "";
      if (args.length > 1) {
        for (let i = 1; i < args.length; i++) {
          replyMessage += `${args[i]} `;
        }
      }
      setTimeout(() => {
        logger.info(`Alarm successfully executed for (${message.author.id})`);
        for (let i = 0; i < 5; i++) {
          client.users.cache.get(message.author.id).send(`<@!${message.author.id}> ${replyMessage}`);
        }
      }, alarmTimeout);
    } else {
      return message.channel.send(`<@!${message.author.id}> please enter command in the format: \`!alarm 5h30m20s\`.`);
    }
  },
};
