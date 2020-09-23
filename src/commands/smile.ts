module.exports = {
	name: 'smile',
	description: 'reacts with a smiley',
	cooldown: 5,
	execute(client: any, message: any, args: any) {
		message.react('😄');
	},
};
