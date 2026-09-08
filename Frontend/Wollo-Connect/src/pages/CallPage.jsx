import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useAuthUser from "../hooks/useAuthUser";
import useStreamToken from "../hooks/useStreamToken";

function CallPage() {
  const { id: callId } = useParams();

  const {
    authenticatedUser,
    isLoading: loadingUser,
  } = useAuthUser();

  const {
    token,
    isLoading: loadingToken,
    error: tokenError,
  } = useStreamToken();

  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [callError, setCallError] = useState(null);

  useEffect(() => {
    if (!authenticatedUser || !token || !callId) {
      return;
    }

    let client;

    const initCall = async () => {
      try {
        console.log("Initializing Stream Video...");

        console.log("User:", authenticatedUser.id);
        console.log("Call ID:", callId);
        console.log("Token exists:", !!token);
        console.log("API key exists:", !!STREAM_API_KEY);

        client = new StreamVideoClient({
          apiKey: STREAM_API_KEY,

          user: {
            id: String(authenticatedUser.id),
            name: authenticatedUser.fullName,
            image: authenticatedUser.image,
          },

          token,
        });

        console.log("Video client created");
        const callInstance = client.call(
          "default",
          callId
        );

        console.log("Joining call...");

        await callInstance.join({
          create: true,
        });

        await callInstance.microphone.enable();

        console.log("Joined call successfully");
        console.log("Microphone enabled:", callInstance.microphone.enabled);

        setVideoClient(client);
        setCall(callInstance);

        } catch (error) {
        console.error("Error joining call:", error);
        setCallError(error);
      }
    };

    initCall();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [authenticatedUser, token, callId]);

  if (loadingUser || loadingToken) {
    return (
      <div className="flexCenter py-12">
        <span className="loading loading-spinner loading-lg" />

        <p className="mt-4">
          Connecting to video call...
        </p>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="alert alert-error">
        {tokenError.response?.data?.message ||
          "Failed to get Stream token."}
      </div>
    );
  }

  if (callError) {
    return (
      <div className="alert alert-error">
        {callError.message ||
          "Failed to join video call."}
      </div>
    );
  }
  if (!videoClient || !call) {
    return (
      <div className="flexCenter py-12">
        <span className="loading loading-spinner loading-lg" />

        <p className="mt-4">
          Joining video call...
        </p>
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <StreamTheme>
          <div className="h-screen">
            <SpeakerLayout />

            <CallControls />
          </div>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}

const STREAM_API_KEY =
  import.meta.env.VITE_STREAM_API_KEY;


export default CallPage
