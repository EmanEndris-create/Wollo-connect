import { useQuery } from "@tanstack/react-query";
import  axiosInstance  from "../lib/api";

const useApiQuery = (url, queryKey) => {
  const { isLoading, error, data } = useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],

    queryFn: async () => {
      const response = await axiosInstance.get(url);
      return response.data;
    },

    retry: false,
  });

  return {
    isLoading,
    error,
    data,
  };
};

export default useApiQuery;