const addReactions = (message: any, reactions: any) => {
	message.react(reactions[0]);
	reactions.shift();
	if (reactions.length > 0) {
		setTimeout(() => addReactions(message, reactions), 750);
	}
};

module.exports = async (client: any, id: any, text: any, reactions = []) => {
	const channel = await client.channels.fetch(id);

	const messages = await channel.messages.fetch();
	if (messages.size === 0) {
		const resp = await channel.send(text);
		addReactions(resp, reactions);
	} else {
		for (const message of messages) {
			message[1].edit(text);
			addReactions(message[1], reactions);
		}
	}
};
