import axios from 'axios';
import loggers from '../adapter/log4js.adapter';
const { logger } = loggers;

export async function getCompletedRaids(validApiKey: string): Promise<Array<string>> {
	const baseUrl: string = 'https://api.guildwars2.com/v2/account/raids?access_token=';
	try {
		const resp = await axios.get(`${baseUrl}${validApiKey}`);
		return resp.data;
	} catch (err) {
		logger.error('Error retrieving GW2 Data:', err);
		return [];
	}
}
