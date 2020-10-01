module.exports = {
	name: 'ping',
	description: 'replies with Pong',
	cooldown: 5,
	guildOnly: true,
	usage: [''],
	tooltip: ['Replies with Pong'],
	execute(client: any, message: any, args: any) {
		message.channel.send('Pong.');
	},
};
