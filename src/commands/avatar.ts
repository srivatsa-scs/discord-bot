module.exports = {
	name: 'avatar',
	description: 'Avatar',
	cooldown: 5,
	execute(client: any, message: any, args: any) {
		message.channel.send(`Your avatar is <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
	},
};
