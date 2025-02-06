import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "/", // Replace with your API base URL
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});


export const doGet = async (endpoint: string, params?: any) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    toast.error(`Error making GET request: ${error}`);
    throw error;
  }
};
