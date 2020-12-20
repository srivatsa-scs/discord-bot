import { Client, Message, MessageEmbed } from "discord.js";
import classMap from "../resources/class.icon.map";
module.exports = {
  name: "build",
  description: "formats builds in an embed format",
  cooldown: 5,
  guildOnly: true,
  usage: ["add <build-name-with-no-space> <class-name-for-the-icon> <link-to-build>"],
  tooltip: ["Creates an embed with the build link"],
  execute(client: Client, message: Message, args: Array<string>) {
    if (args[0] === "add") {
      args[2] = args[2].toLowerCase();
      let thumbnail: string = "";
      switch (args[2]) {
        case "war":
        case "warrior":
        case "zerker":
          thumbnail = "00";
          break;
        case "berzerker":
        case "berserker":
          thumbnail = "01";
          break;
        case "spb":
        case "spellbreaker":
          thumbnail = "02";
          break;
        case "guard":
        case "guardian":
          thumbnail = "10";
          break;
        case "dh":
        case "dragonhunter":
          thumbnail = "11";
          break;
        case "fb":
        case "firebrand":
          thumbnail = "12";
          break;
        case "rev":
        case "revenant":
        case "revenent":
          thumbnail = "20";
          break;
        case "her":
        case "herald":
          thumbnail = "21";
          break;
        case "ren":
        case "renegade":
          thumbnail = "22";
          break;
        case "thief":
        case "teef":
          thumbnail = "30";
          break;
        case "dd":
        case "daredevil":
          thumbnail = "31";
          break;
        case "de":
        case "deadeye":
          thumbnail = "32";
          break;
        case "ranger":
          thumbnail = "40";
          break;
        case "druid":
        case "dudu":
          thumbnail = "41";
          break;
        case "sb":
        case "soulbeast":
          thumbnail = "42";
          break;
        case "engi":
        case "engineer":
          thumbnail = "50";
          break;
        case "scrapper":
          thumbnail = "51";
          break;
        case "holo":
        case "holosmith":
          thumbnail = "52";
          break;
        case "ele":
        case "elementalist":
          thumbnail = "60";
          break;
        case "temp":
        case "tempest":
          thumbnail = "61";
          break;
        case "weaver":
        case "weeber":
        case "weeb":
          thumbnail = "62";
          break;
        case "mes":
        case "mesmer":
          thumbnail = "70";
          break;
        case "chrono":
        case "chronomancer":
          thumbnail = "71";
          break;
        case "mirage":
          thumbnail = "72";
          break;
        case "necro":
        case "necromancer":
          thumbnail = "80";
          break;
        case "reaper":
          thumbnail = "81";
          break;
        case "scourge":
        case "cancer":
          thumbnail = "82";
          break;
        default:
          thumbnail = "90";
          break;
      }

      const embed = new MessageEmbed()
        .setTitle(args[1])
        .setURL(args[3])
        .setThumbnail(classMap.get(thumbnail).url)
        .setTimestamp()
        .setColor(classMap.get(thumbnail).color);
      message.delete({ timeout: 5000 });
      message.channel.send(embed);
    }
  },
};
