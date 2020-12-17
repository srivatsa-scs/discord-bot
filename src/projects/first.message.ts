import {
  Channel,
  Client,
  Message,
  MessageManager,
  TextChannel,
} from "discord.js";
import * as config from "../../config/config.json";
import { logger } from "../adapter/winston.adapter";

const addReactions = (message: Message, reactions: Array<string>) => {
  message.react(reactions[0]);
  reactions.shift();
  if (reactions.length > 0) {
    setTimeout(() => addReactions(message, reactions), 750);
  }
};

module.exports = async (
  client: Client,
  id: string,
  text: string,
  reactions: Array<string>
) => {
  const channel: any = await client.channels.fetch(id);
  const messages: any = await channel.messages.fetch();

  // Sort to find the oldest message
  let messageArray: Array<number> = [];
  messages.forEach((msg: any) => {
    messageArray.push(msg.id);
  });
  messageArray.sort();

  const firstMessage = messages.get(messageArray[0]);

  if (messages.size === 0) {
    // If the channel is empty, send a new message
    const resp = await channel.send(text);
    addReactions(resp, reactions);
  } else if (firstMessage.author.id != config.DISCORD_BOT_CLIENT_ID) {
    // If the channel is not empty and the first message is not by the bot, do nothing basically
    logger.info("First message not created by bot");
  } else if (firstMessage.author.id == config.DISCORD_BOT_CLIENT_ID) {
    // If the channel is not empty and the first message is by the bot, edit to say whatever you want.
    messages.get(messageArray[0]).edit(text);
    addReactions(messages.last(), reactions);
  }
};
