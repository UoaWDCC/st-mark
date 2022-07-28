import { useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface UsePostOutput<T> {
  data?: T;
  status?: number;
  error?: AxiosError;
}

type UsePost<T> = (
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) => Promise<UsePostOutput<T>>;

const usePost = <T>(): UsePost<T> => {
  const { getAccessTokenSilently } = useAuth0();

  return useCallback<UsePost<T>>(
    async (
      url: string,
      body = {},
      config: AxiosRequestConfig = {}
    ): Promise<UsePostOutput<T>> => {
      const accessToken = await getAccessTokenSilently();
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      try {
        const response = await axios.post<T>(url, body, config);
        return { data: response.data, status: response.status };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },
    [getAccessTokenSilently]
  );
};

export default usePost;
