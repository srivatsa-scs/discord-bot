import axios from 'axios';
import { _coinHandler } from './check.trading.post';
export async function getGoldToGems() {
	const gems: number = 400;
	const resp = await axios.get('https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=1460000');
	if (resp) {
		return _coinHandler(resp.data.coins_per_gem * gems);
	} else return 'Error fetching data';
}
