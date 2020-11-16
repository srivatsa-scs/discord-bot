import * as Discord from 'discord.js';
import config from '../config/config.json';
import fs from 'fs';

const reactionCollector = require('./projects/reaction.collector');
const uploaderFunction = require('./projects/arcdps.log.uploader');
const { prefix } = require('../config/config.json');

let client: any = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.ts'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();
client.once('ready', async () => {
	let nowDate: Date = new Date();
	console.log(` * [${nowDate}] Connected to Discord`);
	reactionCollector(client);
	uploaderFunction(client);
	client.user.setActivity('!command --help');
});
client.login(config.token);

client.on('message', (message: any) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	/* No Command */
	if (!client.commands.has(commandName)) return;
	/* Cooldowns */
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps: any = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 5) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	/* Channel only or Not*/
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply("I can't execute that command inside DMs!");
	}
	if (args[0] === '--help' || args[0] === '-h') {
		// console.log('Enter the --help block');
		let helpFields: Array<any> = [];
		for (let i = 0; i < command.usage.length; i++) {
			helpFields[i] = { name: `${prefix}${command.name} ${command.usage[i]}`, value: `${command.tooltip[i]}` };
		}
		const responseEmbed = new Discord.MessageEmbed().setColor('77ffff').setTitle(`${prefix}${command.name} Help`).addFields(helpFields).setTimestamp();
		return message.reply(responseEmbed);
	}
	/* Does it require arguments */
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\n Usage: \`${prefix}${command.name} ${command.usage}`;
		}
		return message.channel.send(reply);
	}
	/* Actual Command */
	try {
		command.execute(client, message, args);
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	} catch (err: any) {
		console.error(err);
		message.reply('Error!');
	}
});
