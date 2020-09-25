import chokidar from 'chokidar';
import { MessageEmbed } from 'discord.js';
const FormData = require('form-data');
import fs from 'fs';
const axios = require('axios').default;
import * as config from '../../config/config.json';
import boss from '../resources/bossmap';

function timeFormatter(time: number): string {
	let formattedTime: string = '';
	let seconds = time % 60;
	let minutes = Math.floor(time / 60);
	if (time > 3600) {
		let hours = Math.floor((time - (minutes * 60 - seconds)) / 60);
		formattedTime = `${hours}h ${minutes}m ${seconds}s`;
	} else {
		formattedTime = `${minutes}m ${seconds}s`;
	}
	return formattedTime;
}

function uploaderFunction(client: any) {
	const logChannelId: string = '758666283411177482';
	const logPath: string = `${config.DPS_REPORT_FILES}**/*.zevtc`;
	const uploadUrl: string = `https://dps.report/uploadContent?json=1&generator=ei&userToken=${config.DPS_REPORT_USER_TOKEN}`;

	const watcher = chokidar.watch(logPath, { persistent: true, ignoreInitial: true });

	watcher.on('add', async (path) => {
		// console.log(`File ${path} has been added`);

		let form = FormData();
		form.append('file', fs.createReadStream(path));

		try {
			const resp: any = await axios.post(uploadUrl, form, { headers: form.getHeaders() });
			// console.log(resp.data.encounter.bossId);
			// console.log(boss.get(resp.data.encounter.bossId));

			console.log(resp.data);

			const embed = new MessageEmbed()
				.setColor('#ff0000')
				.setTitle(`${boss.get(resp.data.encounter.bossId).name}${resp.data.encounter.isCM ? ' CM' : ''}`)
				.setURL(resp.data.permalink)
				.setThumbnail(boss.get(resp.data.encounter.bossId).thumbnail)
				.addFields(
					{ name: 'Log Uploaded By', value: `${config.PLAYER_NAME}` },
					{ name: 'Result', value: resp.data.encounter.success ? '✅' : '⛔' },
					{ name: 'Duration', value: `${timeFormatter(resp.data.encounter.duration)}` }
				)
				.setFooter(`ArcDps Version: ${resp.data.evtc.version}`);
			client.channels.cache.get(logChannelId).send(embed);
		} catch (err: any) {
			console.error(err);
		}
	});
}

module.exports = uploaderFunction;
