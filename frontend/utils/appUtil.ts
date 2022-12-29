import axios from 'axios';

export const BASE = 'http://localhost:9100/api';

export const noAuthFetcher = async (url: string) =>
  await axios.get(url).then(res => res.data);
