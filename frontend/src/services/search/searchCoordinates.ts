import apiClient from "../apiClient";

interface ParamsSearch {
  city: string;
  lat: number;
  lon: number;
  lang: string;
}

export const searchCoordinates = async (params: ParamsSearch) => {
  const response = await apiClient.get(`/weather`, {
    params: {
      city: params.city,
      lat: String(params.lat),
      lon: String(params.lon),
      lang: params.lang,
    },
  });

  return response;
};
