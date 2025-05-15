import apiClient from "../apiClient";

export const deleteFavorite = async (id: string) => {
  await apiClient.delete(`/favorites/${id}`);
};
