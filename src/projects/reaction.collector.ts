import { Message } from 'discord.js';

const firstMessage = require('./first.message');
module.exports = (client: any) => {
	const channelId = '758317408787234877';
	const reactions = ['✅']; // Add additional options here

	let emojiText = 'Add reaction to sign up for this weeks raid\n';
	emojiText += `✅ = Sign Up\n`; // Text

	firstMessage(client, channelId, emojiText, reactions);

	const handleReaction = (reaction: any, user: any, add: boolean) => {
		if (user.id === '757890240437551224') return;
		const emoji = reaction._emoji.name;
		const { guild } = reaction.message;
		const roleId = '758323143214891008';
		const member = guild.members.cache.find((member: any) => member.id === user.id);
		if (add) {
			member.roles.add(roleId);
			console.log(member.roles.cache.keys());
		} else member.roles.remove(roleId);
	};

	client.on('messageReactionAdd', (reaction: any, user: any) => {
		if (reaction.message.channel.id === channelId) {
			handleReaction(reaction, user, true);
		}
	});

	client.on('messageReactionRemove', (reaction: any, user: any) => {
		if (reaction.message.channel.id === channelId) {
			handleReaction(reaction, user, false);
		}
	});
};
