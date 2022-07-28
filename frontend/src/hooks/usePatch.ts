import { useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface UsePatchOutput<T> {
  data?: T;
  status?: number;
  error?: AxiosError;
}

type UsePatch<T> = (
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) => Promise<UsePatchOutput<T>>;

const usePatch = <T>(): UsePatch<T> => {
  const { getAccessTokenSilently } = useAuth0();

  return useCallback<UsePatch<T>>(
    async (
      url: string,
      body = {},
      config: AxiosRequestConfig = {}
    ): Promise<UsePatchOutput<T>> => {
      const accessToken = await getAccessTokenSilently();
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      try {
        const { data, status } = await axios.patch<T>(url, body, config);
        return { data, status };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },
    [getAccessTokenSilently]
  );
};

export default usePatch;
