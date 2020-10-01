module.exports = {
	name: 'roster',
	description: 'Add role to roster',
	guildOnly: true,
	async execute(client: any, message: any) {
		const responseMessage = await message.channel.send(
			`React with the following:\n<:emoji:760034711673503806>: Reaper\n<:emoji:760034712084676658>: Scourge\n<:emoji:760034711836950531>: Chronomancer\n<:emoji:760034712038539304>: Heal Tempest\n<:emoji:760034712046927872>: Heal Scrapper\n<:emoji:760035752179531776>: Core Guardian\n<:emoji:760034712051515442>: Heal Firebrand\n<:emoji:760034712096997416>: Spellbreaker\n<:emoji:760034712223350814>: Condi Herald\n`
		);
		await responseMessage.react('760034711673503806');
		await responseMessage.react('760034712084676658');
		await responseMessage.react('760034711836950531');
		await responseMessage.react('760034712038539304');
		await responseMessage.react('760034712046927872');
		await responseMessage.react('760035752179531776');
		await responseMessage.react('760034712051515442');
		await responseMessage.react('760034712096997416');
		await responseMessage.react('760034712223350814');
	},
};

/* 

[KnF] Discord
<:Reaper:760034711673503806>
<:Scourge:760034712084676658> 
<:Chronomancer:760034711836950531>
<:Tempest:760034712038539304>
<:Scrapper:760034712046927872>
<:Guardian:760035752179531776>
<:Firebrand:760034712051515442>
<:Spellbreaker:760034712096997416>
<:Herald:760034712223350814>

			 */
