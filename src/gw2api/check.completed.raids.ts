import Axios from 'axios';
import axios from 'axios';
import { logger } from '../logger/log4js.adapter';
export async function getCompletedRaids(validApiKey: string): Promise<Array<string>> {
  const baseUrl: string = 'https://api.guildwars2.com/v2/account/raids?access_token=';
  try {
    const resp = await axios.get(`${baseUrl}${validApiKey}`);
    return resp.data;
  } catch (err) {
    logger.error('Error retrieving GW2 Data');
    return [];
  }
}
