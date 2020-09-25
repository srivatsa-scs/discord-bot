import axios from 'axios';

const validTokenUrl: string = 'https://api.guildwars2.com/v2/tokeninfo';

export async function validateGw2ApiToken(token: string): Promise<boolean> {
	const resp: any = await axios.get(`${validTokenUrl}?access_token=${token}`);

	if (resp) {
		if (resp.status === '401') {
			return false;
		} else {
			return resp.data.permissions.includes('account') && resp.data.permissions.includes('tradingpost');
		}
	} else return false;
}
