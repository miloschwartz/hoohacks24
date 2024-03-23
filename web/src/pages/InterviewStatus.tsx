import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as model from "../../../model";
import { UserContext, apiClient } from "../App";
import QuestionsBeingGeneraterated from "../components/QuestionsBeingGenerated";
import InterviewReady from "../components/InterviewReady";
import Loading from "../components/Loading";
import Question from "../components/Question";

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
    let poll: NodeJS.Timeout;
    const fetchData = async () => {
      const res = await apiClient.get<model.Interview>(
        `/get-interview/${interviewId}`,
        {}
      );

      setInterview(res.data);
      setLoading(false);

      if (res.data.status === "GENERATING_QUESTIONS") {
        poll = setInterval(async () => {
          const res = await apiClient.get(`/get-interview/${interviewId}`, {});

          if (res.data.status === "READY") {
            const updatedUser = { ...user, credits: user.credits - 1 };
            context.setUserContext(updatedUser);
            clearInterval(poll);
            setInterview(res.data);
          }
        }, 3000);
      }
    };

    fetchData();

    return () => {
      clearInterval(poll);
    };
  }, []);

  const beginInterview = () => {
    setInterview((interview) => {
      if (interview) {
        return { ...interview, status: model.InterviewStatus.IN_PROGRESS };
      }
      return interview;
    });
    // TODO: Update intersection status via POST
  };

  const renderInterviewState = (status: string) => {
    switch (status) {
      case "GENERATING_QUESTIONS":
        return <QuestionsBeingGeneraterated />;
      case "READY":
        return <InterviewReady onBeginInterview={beginInterview} />;
      case "IN_PROGRESS":
        return <Question interview={interview!} />;
    }
  };

  if (loading || !context?.userContext) {
    return <Loading />;
  }

  return <>{interview && renderInterviewState(interview.status)}</>;
}

export default InterviewStatus;
