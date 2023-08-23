import axiosBase, { baseURL } from "../utils/AxiosInstance";
import { useQuery } from "react-query";

interface drawCardVariables {
  deckId: string,
  count: number
}
const getDeck = async () => {
  const response = await axiosBase.get(`${baseURL}/new/shuffle/?deck_count=1`);
  return response.data;
};

export const useGetDeck = () => {
  return useQuery("deckData", getDeck, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
const drawCardFromDeck = async ({ deckId, count }: drawCardVariables) => {
  const response = await axiosBase.get(`${baseURL}/${deckId}/draw/?count=${count}`);
  return response.data;
};
const shuffleDeck = async (deckId: string) => {
  const response = await axiosBase.patch(`${baseURL}/${deckId}/shuffle`, {
    completed: true,
  });
  return response.data;
};
export const deckService = {
  useGetDeck,
  drawCardFromDeck,
  shuffleDeck
};
