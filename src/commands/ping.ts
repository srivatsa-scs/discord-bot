module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(client: any, message: any, args: any) {
		message.channel.send('Pong.');
	},
};
