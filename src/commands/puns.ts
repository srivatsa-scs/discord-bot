import puns from '../resources/punmap';

module.exports = {
	name: 'puns',
	description: 'replies with a random pun',
	cooldown: 5,
	guildOnly: true,
	usage: [''],
	tooltip: ['Replies with a random pun'],
	execute(client: any, message: any, args: any) {
		message.channel.send(puns.get(Math.floor(Math.random() * puns.size)));
	},
};
