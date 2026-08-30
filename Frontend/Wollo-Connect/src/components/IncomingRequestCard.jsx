import { Check } from "lucide-react";
import useMutateQuery from "../hooks/useMutateQuery";

function IncomingRequestCard({ request }) {
  const {
    mutate: acceptRequest,
    isPending,
  } = useMutateQuery({
    method: "POST",
    url: `/user/friend-request/accept/${request.id}`,
    queryKey: "friendRequests",
  });

  return (
    <div className="card bg-base-100 border border-base-200">
      <div className="card-body p-4">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <img
              src={request.image || "/default-avatar.png"}
              alt={request.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <h5 className="font-semibold">
                {request.fullName}
              </h5>

              <p className="text-sm text-base-content/60">
                Wants to connect with you
              </p>
            </div>
          </div>

          <button
            onClick={() => acceptRequest()}
            disabled={isPending}
            className="btn btn-sm btn-success btn-soft"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <>
                <Check className="size-4" />
                Accept
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}

export default IncomingRequestCard;