import axios from 'axios';
import loggers from '../adapter/log4js.adapter';
const { logger } = loggers;

const validTokenUrl: string = 'https://api.guildwars2.com/v2/tokeninfo';

export async function validateGw2ApiToken(token: string): Promise<boolean> {
	try {
		const resp: any = await axios.get(`${validTokenUrl}?access_token=${token}`);

		if (resp.status === '401') {
			return false;
		} else {
			return resp.data.permissions.includes('account') && resp.data.permissions.includes('tradingpost');
		}
	} catch (err: any) {
		if (err.response.status !== 401) {
			logger.error(`Trading Post Error, Status ${err.response.status}, ${err.response.statusText}`);
		}
		return false;
	}
}
