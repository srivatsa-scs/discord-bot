import { Client, Collection, Message, MessageReaction, Snowflake, User } from 'discord.js';

export default {
	name: 'vote',
	description: 'thumbs up thumbs down',
	guildOnly: true,
	usage: [''],
	tooltip: ['Reacts with 👍👎'],
	async execute(client: Client, message: Message, args: any) {
		await message.react('👍');
		await message.react('👎');

		const filter = (reaction: MessageReaction, user: User) => {
			return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		try {
			const collected: Collection<Snowflake, MessageReaction> = await message.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] });
			const reaction = collected.first();
			if (reaction!.emoji.name === '👍') {
				message.reply('you reacted with a thumbs up.');
			} else if (reaction!.emoji.name === '👎') {
				message.reply('you reacted with a thumbs down.');
			}
		} catch (err: any) {
			message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
		}

		const userReactions = message.reactions.cache.filter((reaction) => reaction.users.cache.has(message.author.id));
		for (const reaction of userReactions.values()) {
			await reaction.users.remove(message.author.id);
		}
	},
};
