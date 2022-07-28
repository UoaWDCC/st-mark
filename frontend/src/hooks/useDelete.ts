import { useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface UseDeleteOutput<T> {
  data?: T;
  status?: number;
  error?: AxiosError;
}

type UseDelete<T> = (
  url: string,
  config?: AxiosRequestConfig
) => Promise<UseDeleteOutput<T>>;

const useDelete = <T>(): UseDelete<T> => {
  const { getAccessTokenSilently } = useAuth0();

  return useCallback<UseDelete<T>>(
    async (
      url: string,
      config: AxiosRequestConfig = {}
    ): Promise<UseDeleteOutput<T>> => {
      const accessToken = await getAccessTokenSilently();
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      try {
        const response = await axios.delete<T>(url, config);
        return { data: response.data, status: response.status };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },
    [getAccessTokenSilently]
  );
};

export default useDelete;
