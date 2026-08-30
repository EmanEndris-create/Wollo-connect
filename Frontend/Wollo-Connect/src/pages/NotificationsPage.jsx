import { Check, UserPlus } from "lucide-react";
import useApiQuery from "../hooks/useApiQuery"
import IncomingRequestCard from "../components/IncomingRequestCard";
import AcceptedRequestCard from "../components/AcceptedRequestCard";


function NotificationsPage() {
   const {
    data,
    isLoading,
    error,
  } = useApiQuery(
    "/user/friend-requests",
    "friendRequests"
  );

  const incomingRequests = data?.incomingRequests || [];
  const acceptedRequests = data?.acceptedRequests || [];

  return (
    <div>
      <div className="mb-6">
        <h3>Notifications</h3>

        <p className="para">
          Manage your connection requests and notifications
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
              "Failed to load notifications."}
          </span>
        </div>
      ) : (
        <div className="space-y-6">

          <section>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="size-5" />

              <h4 className="font-semibold">
                Connection Requests
              </h4>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="card bg-base-100 border border-base-200">
                <div className="card-body">
                  <p className="text-sm text-base-content/60">
                    No new connection requests.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((request) => (
                  <IncomingRequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Check className="size-5" />

              <h4 className="font-semibold">
                Accepted Requests
              </h4>
            </div>

            {acceptedRequests.length === 0 ? (
              <div className="card bg-base-100 border border-base-200">
                <div className="card-body">
                  <p className="text-sm text-base-content/60">
                    No accepted requests yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedRequests.map((request) => (
                  <AcceptedRequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
}

export default NotificationsPage
