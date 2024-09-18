import axios, { AxiosRequestConfig } from "axios";

interface FetchApiOptions extends AxiosRequestConfig {}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function fetchAPI(options: FetchApiOptions) {
  try {
    const result = await instance(options);
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      data: error,
    };
  }
}
