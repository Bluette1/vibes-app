import axios from 'axios';

export const getImages = async (): Promise<string[]> => {
    const response = await axios.get('/api/images');
    return response.data;
};
