import UserCard from "../components/UserCard";
import useApiQuery from "../hooks/useApiQuery";

function OutgoingRequestsPage() {
  const {
    data,
    isLoading,
    error,
  } = useApiQuery(
    "/user/friend-requests/outgoing",
    "outgoingRequests"
  );

  const outgoingRequests = data || [];

  return (
    <div>
      <section className="pb-6">
        <div>
          <h3>Outgoing Requests</h3>

          <p className="para">
            Connection requests you have sent
          </p>
        </div>

        {isLoading ? (
          <div className="flexCenter py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>

        ) : error ? (

          <div className="alert alert-error">
            <span>
              {error.response?.data?.message ||
                "Failed to load outgoing requests."}
            </span>
          </div>

        ) : outgoingRequests.length === 0 ? (

          <div className="card bg-base-100 border border-base-200 p-8 text-center">
            <h3 className="font-semibold">
              No outgoing requests
            </h3>

            <p className="para mt-2">
              You haven't sent any connection requests yet.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {outgoingRequests.map((user) => (
              <UserCard
                key={user.requestId}
                user={user}
                type="outgoing"
              />
            ))}
          </div>

        )}
      </section>
    </div>
  );
}

export default OutgoingRequestsPage;