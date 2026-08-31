import { MapPinIcon, UserPlusIcon, MessageSquareIcon, XIcon } from 'lucide-react';
import { getCountryFlag } from './getCountryFlag';
import useMutateQuery from '../hooks/useMutateQuery';
import { Link } from 'react-router-dom'

export const UserCard = ({ user, type }) => {
  // const [requestSent, setRequestSent] = useState(user.requestStatus === 'outgoing');
  const requestSent = user.requestStatus === "outgoing";

  const {
    mutate: sendRequest,
    isPending: isSending,
  } = useMutateQuery({
    method: "POST",
    url: `/user/friend-request/${user.id}`,
    queryKey: "recommended",
  });

  const {
    mutate: cancelRequest,
    isPending: isCancelling,
  } = useMutateQuery({
    method: "DELETE",
    url: `/user/friend-request/${user.id}`,
    queryKey: "outgoingRequests",
  });

  const handleConnectionRequest = () => {
    if (requestSent) {
      // cancelRequest(undefined, {
      //   onSuccess: ()=>{
      //     setRequestSent(false);
      //   },
      // });
      cancelRequest();
    } else {
      // sendRequest(undefined, {
      //   onSuccess:()=>{
      //     setRequestSent(true);
      //   },
      // });
      sendRequest();
    }
  };

  const isLoading = isSending || isCancelling;

  return (
    <div className="card bg-base-100 card-sm shadow-sm border border-base-200">
      <div className="card-body p-4 flex flex-col justify-between">


        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={user?.image || '/default-avatar.png'}
                alt={user?.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h5 className="font-semibold text-base">{user?.fullName}</h5>
                {user?.location && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    {user.location}
                  </p>
                )}
              </div>
            </div>

            {type === 'friend' && (
              <Link
                to={`/chat/${user.id}`}
                className="btn btn-xs btn-outline btn-primary"
              >
                <MessageSquareIcon className="size-4 mr-1" />
                Message
              </Link>
            )}

            {type === 'recommendation' && (
              <button
                onClick={handleConnectionRequest}
                disabled={isLoading}
                className={`btn btn-xs ${requestSent ? "btn-error btn-soft" : "btn-info btn-soft"}`}>
                {isLoading ? (
                  <span className='loading loading-spinner loading-xs'></span>
                ) : requestSent ? (
                  <>
                    <XIcon className="size-4 mr-1" />
                    Cancel Request
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="size-4 mr-1" />
                    Connection Request
                  </>
                )}
              </button>
            )}

            {type === "outgoing" && (
              <button
                onClick={() => cancelRequest()}
                disabled={isCancelling}
                className="btn btn-xs btn-error btn-soft"
              >
                {isCancelling ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <XIcon className="size-4 mr-1" />
                    Cancel Request
                  </>
                )}
              </button>
            )}
          </div>


          {user?.bio && (
            <p className="text-xs text-gray-600 line-clamp-2 my-2">
              {user.bio}
            </p>
          )}
        </div>


        <div className="mt-3 pt-2 border-t border-base-200 flex flex-wrap gap-2 items-center">
          {user?.language && (
            <span className="badge badge-soft badge-secondary text-xs">
              {getCountryFlag(user.language)}
              {user.language}
            </span>
          )}
          {user?.skill && (
            <span className="badge badge-soft badge-success text-xs">
              <span className="hidden sm:inline mr-1">Skill:</span>
              {user.skill}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;