import { useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface UseNoAuthPostOutput<T> {
  data?: T;
  status?: number;
  error?: AxiosError;
}

type UseNoAuthPost<T> = (
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) => Promise<UseNoAuthPostOutput<T>>;

const useNoAuthPost = <T>(): UseNoAuthPost<T> => {
  return useCallback<UseNoAuthPost<T>>(
    async (
      url: string,
      body = {},
      config: AxiosRequestConfig = {}
    ): Promise<UseNoAuthPostOutput<T>> => {
      try {
        const response = await axios.post<T>(url, body, config);
        return { data: response.data, status: response.status };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },
    []
  );
};

export default useNoAuthPost;
