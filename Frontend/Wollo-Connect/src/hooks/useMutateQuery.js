import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance  from "../lib/api";

const useMutateQuery = ({ method, url, queryKey, invalidate = true }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance({
        method,
        url,
        data,
      });

      return response.data;
    },

    onSuccess: () => {
      if (queryKey && invalidate) {
        queryClient.invalidateQueries({
          queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        });
      }
    },
  });

  return {
    mutate,
    isPending,
    error,
  };
};

export default useMutateQuery;