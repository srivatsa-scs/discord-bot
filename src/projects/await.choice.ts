import loggers from '../adapter/log4js.adapter';
const { logger } = loggers;
import emoji from './get.emoji.map';
import emojiNumber from './get.emoji.number';

const filter = (reaction: any): number => {
	switch (reaction.emoji.name) {
		case ':zero:':
			return 0;
		case ':one:':
			return 1;
		case ':two:':
			return 2;
		case ':three:':
			return 3;
		case ':four:':
			return 4;
		case ':five:':
			return 5;
		case ':six:':
			return 6;
		case ':seven:':
			return 7;
		case ':eight:':
			return 8;
		case ':nine:':
			return 9;
		default:
			return -1;
	}
};

export async function awaitUserReaction(client: any, discordUserId: string, choices: Array<any>): Promise<number> {
	let question: string = 'Pick an Account:\n';
	for (let i = 0; i < choices.length; i++) {
		question += `${emoji.get(i)}: ${choices[i].accName}\n`;
	}
	logger.debug(`Discord UserID:${discordUserId}`);
	const responseMessage = await client.users.cache.get(discordUserId).send(question);
	for (let i = 0; i < choices.length; i++) {
		await responseMessage.react(emoji.get(i));
	}
	try {
		const collector = await responseMessage.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] });
		return emojiNumber.get(collector.first().emoji.name);
	} catch (err) {
		logger.error(err);
		return 0;
	}

	// collector.on('collect', (reaction: any) => {
	// 	return emojiNumber.get(reaction.emoji.name);
	// });
}
