import { Message } from 'discord.js';

module.exports = {
  name: 'uptime',
  description: 'Uptime',
  guildOnly: true,
  usage: [' '],
  tooltip: ['Allows you to check how long the bot has been active'],
  cooldown: 5,
  execute(client: any, message: Message, args: Array<any>) {
    message.channel.send(millisecondConvertor(client.uptime));
    function millisecondConvertor(time: number): string {
      const t = time / 1000;
      let seconds = Math.floor(t % 60);
      let minutes = Math.floor((t / 60) % 60);
      let hours = Math.floor((t / 3600) % 24);
      let days = Math.floor(t / 86400);
      return `My uptime is: ${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${
        minutes > 0 ? minutes + 'm ' : ''
      }${seconds}s`;
    }
  },
};
