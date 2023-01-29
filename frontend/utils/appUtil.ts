import axios from 'axios';

export const BASE = 'http://localhost:9100/api';

export const noAuthFetcher = async (url: string) =>
  await axios.get(url).then(res => res.data);

export const noAuthPoster = async (url: string, { arg }: any) => {
  return await axios.post(url, { ...arg.data }).then(res => res.data);
};

export const noAuthPutter = async (url: string, { arg }: any) => {
  return await axios.put(url, { ...arg.data }).then(res => res.data);
};

export const noAuthDeleter = async (url: string) =>
  await axios.delete(url).then(res => res.data);
