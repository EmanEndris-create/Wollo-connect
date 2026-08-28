import NoFriendsFound from "../components/NoFriendsFound";
import NoRecommendationsFound from "../components/NoRecommendationsFound";
import UserCard from "../components/UserCard";
import useApiQuery from "../hooks/useApiQuery"


function HomePage() {
  const {
    data: friendsData,
    isLoading: loadingFriends,
    error: friendsError,
  } = useApiQuery('/user/friends', 'friends');

  const {
    data: recData,
    isLoading: loadingRecs,
    error: recsError,
  } = useApiQuery('/user/recommended', 'recommended');

  const friends = friendsData?.friends || [];
  const recommendedUsers = recData?.users || recData || [];

  return (
    <div>
      <section className="pb-6">
      <div>
          <h3>Learning Partners</h3>
          <p className="para">
            Connect and practice skills with your learning partners
          </p>
        </div>

      {loadingFriends? (
        <div className="flexCenter py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
      ): friendsError?(
        <div className="alert alert-error">
            <span>
              {friendsError.response?.data?.message ||
                "Failed to load your friends."}
            </span>
          </div>
      ): friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((user) => (
              <UserCard key={user.id} user={user}
              isFriend={true} />
            ))}
          </div>
        )}
      </section>

      <section>
      <div>
          <h3>Expand Your Network</h3>
          <p className="para">
            Meet new learners ready to exchange skills and practice together
          </p>
        </div>

      {loadingRecs? (
        <div className="flexCenter py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
      ): recsError?(
        <div className="alert alert-error">
            <span>
              {recsError.response?.data?.message ||
                "Failed to load your recommendations."}
            </span>
          </div>
      ): recommendedUsers.length === 0 ? (
          <NoRecommendationsFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {recommendedUsers.map((user) => (
              <UserCard key={user.id} user={user}
              isFriend={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
