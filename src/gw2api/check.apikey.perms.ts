import axios from 'axios';

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
			console.log(err);
		}
		return false;
	}
}
