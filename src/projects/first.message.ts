const addReactions = (message: any, reactions: Array<string>) => {
	message.react(reactions[0]);
	reactions.shift();
	if (reactions.length > 0) {
		setTimeout(() => addReactions(message, reactions), 750);
	}
};

module.exports = async (client: any, id: any, text: any, reactions: Array<string>) => {
	const channel = await client.channels.fetch(id);

	const messages = await channel.messages.fetch();

	if (messages.size === 0) {
		const resp = await channel.send(text);
		addReactions(resp, reactions);
	} else {
		messages.last().edit(text);
		addReactions(messages.last(), reactions);
	}
};
