import { CheckCircle } from "lucide-react";

function AcceptedRequestCard({ request }) {
  return (
    <div className="card bg-base-100 border border-base-200">
      <div className="card-body p-4">

        <div className="flex items-center gap-3">

          <div className="avatar">
            <div className="w-12 rounded-full">
              <img
                src={request.image || "/default-avatar.png"}
                alt={request.fullName}
              />
            </div>
          </div>

          <div className="flex-1">
            <h5 className="font-semibold">
              {request.fullName}
            </h5>

            <p className="text-sm text-base-content/60">
              Accepted your connection request
            </p>
          </div>

          <CheckCircle className="size-5 text-success" />

        </div>

      </div>
    </div>
  );
}

export default AcceptedRequestCard;