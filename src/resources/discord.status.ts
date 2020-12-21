import { client } from '../adapter/discord.adapter';
export async function setDiscordStatus() {
	return client.user.setActivity('!command --help');
}
