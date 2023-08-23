import axios from "axios";

export const baseURL = "https://deckofcardsapi.com/api/deck";
const axiosBase = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosBase;