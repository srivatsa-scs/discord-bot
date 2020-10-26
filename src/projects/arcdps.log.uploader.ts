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
	const logChannelId: string = config.LOG_CHANNEL_ID;
	const logPath: string = `${config.DPS_REPORT_FILES}**/*.${config.ARC_DPS_LOG_FILE_EXTENSION}`;
	const uploadUrl: string = `https://dps.report/uploadContent?json=1&generator=ei&userToken=${config.DPS_REPORT_USER_TOKEN}`;
	const metaDataUrl: string = `https://dps.report/getJson?permalink=`;

	const watcher = chokidar.watch(logPath, { persistent: true, ignoreInitial: true });

	watcher.on('add', async (path) => {
		let form = FormData();
		form.append('file', fs.createReadStream(path));

		try {
			const resp: any = await axios.post(uploadUrl, form, { headers: form.getHeaders() });
			const metaData: any = await axios.get(`${metaDataUrl}${resp.data.permalink.substring(19)}`);
			const fightname = `${metaData.data.fightName}${resp.data.encounter.isCM ? ' CM' : ''}`;

			const embed = new MessageEmbed()
				.setColor(resp.data.encounter.success ? '#00ff00' : '#ff0000')
				.setTitle(`${fightname}`)
				.setURL(resp.data.permalink)
				.setThumbnail(metaData.data.fightIcon || boss.get(resp.data.encounter.bossId).thumbnail)
				.addFields(
					{ name: 'Log Uploaded By', value: `${metaData.data.recordedBy || 'Unknown'}` },
					{ name: 'Result', value: resp.data.encounter.success ? '✅' : '⛔' },
					{ name: 'Duration', value: `${metaData.data.duration || timeFormatter(resp.data.encounter.duration)}` }
				)
				.setFooter(`ArcDps Version: ${resp.data.evtc.version}`)
				.setTimestamp();
			client.channels.cache.get(logChannelId).send(embed);
		} catch (err: any) {
			if (err.response.status === 403 && err.response.data.error === 'Encounter is too short for a useful report to be made') {
				console.log(err.response.data.error);
				return;
			} else if (err.response.status === 523) {
				console.log(`Cloudflare Error, try later. ${path}`);
			} else {
				console.error(err);
			}
		}
	});
}

module.exports = uploaderFunction;
