import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE;

const client = axios.create({ baseURL: API_BASE_URL });

export function setAuthToken(token?: string) {
  if (token)
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete client.defaults.headers.common["Authorization"];
}

export default client;
