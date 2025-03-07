import axios from 'axios';

interface ImageResponse {
  src: string;
  alt: string;
}

interface AudioResponse {
  id: string;
  title: string;
  url: string;
}

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getImages = async (): Promise<ImageResponse[]> => {
  const response = await axios.get(`${baseUrl}/api/images`);
  return response.data;
};

export const getAudios = async (): Promise<AudioResponse[]> => {
  const response = await axios.get(`${baseUrl}/api/audios`);
  return response.data;
};
