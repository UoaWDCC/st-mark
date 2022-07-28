import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface UseGetOutput<T> {
  data: T | undefined;
  status: number | undefined;
  isLoading: boolean;
  reFetch: () => void;
}

/**
 * A custom hook which fetches data from the given URL. Includes functionality to determine
 * whether the data is still being loaded or not.
 */
const useGet = <T>(url: string): UseGetOutput<T> => {
  const [data, setData] = useState<T>();
  const [status, setStatus] = useState<number | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const reFetch = () => {
    setVersion(version + 1);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await axios.get<T>(url);
        setData(response.data);
        setStatus(response.status);
      } catch (error) {
        if ((error as AxiosError).response) {
          setStatus((error as AxiosError).response?.status);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [url, version]);

  return { data, status, isLoading, reFetch };
};

export default useGet;
