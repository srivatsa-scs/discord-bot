module.exports = {
	name: 'avatar',
	description: 'Avatar',
	guildOnly: true,
	usage: [' '],
	tooltip: ['Allows you to view your avatar / profile picture'],
	cooldown: 5,
	execute(client: any, message: any, args: any) {
		message.channel.send(`Your avatar is <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
	},
};
