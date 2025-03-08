// utils/api.ts
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
  const url = `${baseUrl}/api/images`;

  if (!navigator.onLine) {
    // Try to get cached data if offline
    const cachedResponse = await caches.match(url); // Match the full URL
    if (cachedResponse) {
      return cachedResponse.json();
    }
    throw new Error('Offline and no cache available');
  }

  const response = await axios.get(url);
  const data = response.data;

  const cache = await caches.open('image-cache');
  cache.put(url, new Response(JSON.stringify(data)));

  return data;
};

export const getAudios = async (): Promise<AudioResponse[]> => {
  const url = `${baseUrl}/api/audios`;

  if (!navigator.onLine) {
    // Try to get cached data if offline
    const cachedResponse = await caches.match(url);
    if (cachedResponse) {
      return cachedResponse.json();
    }
    throw new Error('Offline and no cache available');
  }

  const response = await axios.get(url);
  const data = response.data;

  const cache = await caches.open('audio-cache');
  cache.put(url, new Response(JSON.stringify(data)));

  return data;
};
