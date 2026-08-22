import useApiQuery from "./useApiQuery";


const useAuthUser = () => {
  const {
    data,
    isLoading,
    error,
  } = useApiQuery("/user/me", "authUser");

  return {
    authenticatedUser: data?.user,
    isLoading,
    error,
  };
};

export default useAuthUser;