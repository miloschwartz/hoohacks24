import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as model from "../../../model";
import { UserContext, apiClient } from "../App";
import QuestionsBeingGeneraterated from "../components/QuestionsBeingGenerated";
import InterviewReady from "../components/InterviewReady";
import Loading from "../components/Loading";

function Interview() {
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

  const renderStatus = (status: string) => {
    switch (status) {
      case "GENERATING_QUESTIONS":
        return <QuestionsBeingGeneraterated />;
      case "READY":
        return <InterviewReady />;
    }
  };

  if (loading || !context?.userContext) {
    return <Loading />;
  }

  return (
    <>
      {interview && (
        <div className="content-container">
          <div className="small-container">
            <ul className="steps mb-10 w-full">
              <li className="step step-primary">Provide Info</li>
              <li
                className={`step ${
                  interview.status === "GENERATING_QUESTIONS" ||
                  interview.status === "READY"
                    ? "step-primary"
                    : ""
                }`}
              >
                Generate
              </li>
              <li
                className={`step ${
                  interview.status === "READY" ? "step-primary" : ""
                }`}
              >
                Interview
              </li>
              <li className="step">Get Feedback</li>
            </ul>
            {renderStatus(interview.status)}
          </div>
        </div>
      )}
    </>
  );
}

export default Interview;
