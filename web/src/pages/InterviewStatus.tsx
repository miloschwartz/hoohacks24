import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as model from "../../../model";
import { UserContext, apiClient } from "../App";
import QuestionsBeingGeneraterated from "../components/QuestionsBeingGenerated";
import InterviewReady from "../components/InterviewReady";
import Loading from "../components/Loading";
import React from "react";
import Interview from "../components/Interview";
import FeedbackBeingGenerated from "../components/FeedbackBeingGenerated";
import Feedback from "../components/Feedback";

interface InterviewContextProps {
  interview: model.Interview;
  setInterview: (interview: model.Interview) => void;
}
export const InterviewContext = React.createContext<InterviewContextProps>({
  interview: {} as model.Interview,
  setInterview: () => {},
});

function InterviewStatus() {
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<model.Interview | null>(null);

  const context = useContext(UserContext);
  const user = context?.userContext;
  const { interviewId } = useParams();

  if (!user) {
    return <Loading />;
  }

  useEffect(() => {
    let socket: WebSocket;
    const createConnection = async () => {
      const queryString = `subId=${user.userId}::${interviewId}`;
      const endpint = `${
        import.meta.env.VITE_WEBSOCKET_ENDPOINT
      }?${queryString}`;
      const socket = new WebSocket(endpint);

      socket.onopen = () => {
        console.log("connected to websocket");
      };

      socket.onmessage = (e) => {
        if (e && e.data) {
          const data = JSON.parse(e.data);
          console.log("interview updated");
          setInterview((interview) => {
            if (interview) {
              return { ...interview, ...data };
            }
            return interview;
          });

          if (data.status === "READY") {
            const updatedUser = { ...user, credits: user.credits - 1 };
            context.setUserContext(updatedUser);
          }
        }
      };

      socket.onclose = () => {
        console.log("closing websocket");
      };
    };

    const getInterview = async () => {
      const { data: interview } = await apiClient.get<model.Interview>(
        `/get-interview/${interviewId}`
      );
      setInterview(interview);
      setLoading(false);
    };

    getInterview();
    createConnection();

    return () => {
      console.log("closing websocket");
      socket?.close();
    };
  }, []);

  const renderInterviewState = (status: string) => {
    switch (status) {
      case model.InterviewStatus.GENERATING_QUESTIONS:
        return <QuestionsBeingGeneraterated />;
      case model.InterviewStatus.READY:
        return <InterviewReady />;
      case model.InterviewStatus.IN_PROGRESS:
        return <Interview />;
      case model.InterviewStatus.GENERATING_FEEDBACK:
        return <FeedbackBeingGenerated />;
      case model.InterviewStatus.FEEDBACK_READY:
        return <Feedback />;
    }
  };

  if (loading || !context?.userContext) {
    return <Loading />;
  }

  return (
    <>
      <InterviewContext.Provider
        value={{ interview: interview!, setInterview }}
      >
        {renderInterviewState(interview!.status)}
      </InterviewContext.Provider>
    </>
  );
}

export default InterviewStatus;
