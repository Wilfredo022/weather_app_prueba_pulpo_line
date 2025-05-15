import apiClient from "../apiClient";

interface Params {
  userId: number;
  city: string;
  lat: number;
  lon: number;
}

export const createFavorite = async (data: Params) => {
  try {
    const response = await apiClient.post("/favorites", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
