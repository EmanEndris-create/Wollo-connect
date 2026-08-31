import useApiQuery from "./useApiQuery";

const useStreamToken = () => {
  const {
    data,
    isLoading,
    error,
  } = useApiQuery("/chat/token", "streamToken");

  return {
    token: data?.token,
    isLoading,
    error,
  };
};

export default useStreamToken;