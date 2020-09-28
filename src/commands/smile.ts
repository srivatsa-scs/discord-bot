module.exports = {
	name: 'smile',
	description: 'reacts with a smiley',
	cooldown: 5,
	guildOnly: true,
	usage: [''],
	tooltip: ['Reacts with a smiley'],
	execute(client: any, message: any, args: any) {
		message.react('😄');
	},
};
