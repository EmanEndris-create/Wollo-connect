import { StreamChat } from "stream-chat";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser  from "../hooks/useAuthUser";
import useStreamToken from '../hooks/useStreamToken';
import { Channel, ChannelHeader, Chat, MessageList, Thread, MessageComposer, Window } from 'stream-chat-react'
// import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
  const { id: targetUserId } = useParams();

  const {
    authenticatedUser,
    isLoading: loadingUser,
  } = useAuthUser();

  const {
    token,
    isLoading: loadingToken,
    error,
  } = useStreamToken();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!authenticatedUser || !token || !targetUserId) {
      return;
    }

    let client;

    const initChat = async () => {
      try {
        client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: String(authenticatedUser.id),
            name: authenticatedUser.fullName,
            image: authenticatedUser.image,
          },
          token
        );

        const channelId = [
          String(authenticatedUser.id),
          String(targetUserId),
        ]
          .sort()
          .join("-");

          const currentChannel = client.channel(
          "messaging",
          channelId,
          {
            members: [
              String(authenticatedUser.id),
              String(targetUserId),
            ],
          }
        );

        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);

      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    initChat();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [authenticatedUser, token, targetUserId]);
  

  if (loadingUser||loadingToken|| !chatClient || !channel) {
    return (
      <div className="flexCenter py-12">
        <span className="loading loading-spinner loading-lg" />
        <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>
          {error.response?.data?.message ||
            "Failed to initialize chat."}
        </span>
      </div>
    );
  }

  return (
    <div className="h-[87vh] overflow-hidden">
      <div className="card bg-base-100 card-sm h-full">
        <div className="card-body p-0 h-full">
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <div className="w-full relative h-full">
                {/* <CallButton handleVideoCall={'handleVideoCall'} /> */}
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageComposer focus />
                </Window>
              </div>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
