import chokidar from 'chokidar';
import { MessageEmbed } from 'discord.js';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
import config from '../../config/config.json';
import boss from '../resources/bossmap';
import { arcdpsLogger, logger } from '../adapter/log4js.adapter';

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

const logPath: string = `${config.DPS_REPORT_FILES}**/*.${config.ARC_DPS_LOG_FILE_EXTENSION}`;
const watcher = chokidar.watch(logPath, { persistent: true, ignoreInitial: true });
logger.info('Initializing File Watcher');

export async function closeFileWatcher() {
	return watcher.close();
}

export function uploaderFunction(client: any) {
	const logChannelId: string = config.LOG_CHANNEL_ID;

	const uploadUrl: string = `https://dps.report/uploadContent?json=1&generator=ei&userToken=${config.DPS_REPORT_USER_TOKEN}`;
	const metaDataUrl: string = `https://dps.report/getJson?permalink=`;

	watcher.on('add', async (path: any) => {
		let form = new FormData();
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
			arcdpsLogger.info(`Log was successfully uploaded for Boss: ${fightname} by user ${metaData.data.recordedBy || 'Unknown'}`);
			client.channels.cache.get(logChannelId).send(embed);
		} catch (err: any) {
			if (err.response.status === 403 && err.response.data.error === 'Encounter is too short for a useful report to be made') {
				arcdpsLogger.error(`Log was not uploaded because ${err.response.data.error}`);
				return;
			} else if (err.response.status === 523) {
				arcdpsLogger.error(`Upload failed due to Cloudflare error ${path}`);
			} else {
				arcdpsLogger.error(err);
			}
		}
	});
}
