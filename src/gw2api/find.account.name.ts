import axios from 'axios';
import { logger } from '../logger/log4js.adapter';

const endPointUrl: string = 'https://api.guildwars2.com/v2/account?access_token=';

export async function fetchGw2AccName(apiKey: string): Promise<string> {
  try {
    const resp = await axios.get(`${endPointUrl}${apiKey}`);
    return resp.data.name;
  } catch (err) {
    logger.error(`* Error occoured when retrieving data from GW2 API.`);
    return '';
  }
}
