/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface RegisterResponse {
  token: string;
  resource_owner: {
    id: number;
    email: string;
  };
}

interface LoginResponse {
  token: string;
  resource_owner: {
    id: number;
    email: string;
  };
}

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${baseUrl}/users/tokens/sign_up`, {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${baseUrl}/users/tokens/sign_in`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

interface UserPreferences {
  preferences: {
    id: number;
    user_id: number;
    volume: number;
    selected_track: string;
    image_transition_interval: number;
    created_at: string;
    updated_at: string;
  };
}

export const getUserPreferences = async (token: string): Promise<UserPreferences> => {
  try {
    const response = await axios.get<UserPreferences>(`${baseUrl}/api/user_preferences`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user preferences');
  }
};

export const saveUserPreferences = async (
  token: string,
  preferences: UserPreferences
): Promise<void> => {
  try {
    await axios.post(
      `${baseUrl}/api/user_preferences`,
      preferences,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save user preferences');
  }
};
