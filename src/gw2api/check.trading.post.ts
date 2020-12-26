import axios from 'axios';

const tradingPostUrl: string = 'https://api.guildwars2.com/v2/commerce/delivery';
const itemUrl: string = 'https://api.guildwars2.com/v2/items/';

async function _getMetaData(id: number) {
	const resp: any = await axios.get(`${itemUrl}${id}`);
	return {
		name: resp.data.name,
		icon: resp.data.icon,
	};
}

export function _coinHandler(coins: number) {
	if (coins < 1) {
		return;
	} else {
		const copper = coins % 100;
		const silver = ((coins % 10000) - copper) / 100;
		const gold = (coins - silver * 100 - copper) / 10000;
		return {
			gold,
			silver,
			copper,
		};
	}
}
async function _itemHandler(items: Array<{ id: number; count: number }>) {
	if (items.length === 0) return [];
	else {
		let returnItems: Array<any> = [];
		for (let item of items) {
			const metaDataResponse: any = await _getMetaData(item.id);
			const itemData: any = { count: item.count, name: metaDataResponse.name, icon: metaDataResponse.icon };
			returnItems.push(itemData);
		}
		return returnItems;
	}
}

export async function checkTradingPost(token: string) {
	const reqUrl: string = `${tradingPostUrl}?access_token=${token}`;
	const resp: any = await axios.get(reqUrl);

	const totalCoins = _coinHandler(resp.data.coins);
	const totalItems = await _itemHandler(resp.data.items);
	return { totalCoins, totalItems };
}
