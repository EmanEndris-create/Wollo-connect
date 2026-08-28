import useMutateQuery from "./useMutateQuery";

function useLogout() {
  const{
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutateQuery({
    method: "POST",
    url: "/auth/logout",
    queryKey: "authUser",
    invalidate: false
  });
  return {
    logoutMutation,
    isPending,
    error
  };
}

export default useLogout
