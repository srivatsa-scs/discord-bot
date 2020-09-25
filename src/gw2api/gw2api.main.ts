import { validateGw2ApiToken } from './check.apikey.perms';
import { checkTradingPost } from './check.trading.post';
import * as config from '../../config/config.json';

export async function maingw2(apiKey: string) {
	if (await validateGw2ApiToken(apiKey)) {
		return await checkTradingPost(apiKey);
	}
}
