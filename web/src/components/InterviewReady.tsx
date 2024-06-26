import { useContext, useState } from "react";
import { apiClient } from "../App";
import { Trans } from "react-i18next";
import * as model from "../../../model";
import { useToast } from "../useToast";
import { InterviewContext } from "../pages/InterviewStatus";

function InterviewReady() {
  const [loading, setLoading] = useState(false);
  const { interview, setInterview } = useContext(InterviewContext);
  const toast = useToast();

  const beginInterview = () => {
    apiClient
      .post(`/begin-interview/${interview.interviewId}`)
      .then(() => {
        setInterview({
          ...interview,
          status: model.InterviewStatus.IN_PROGRESS,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.open({ text: `Error: ${err.message}`, type: "error" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="content-container">
        <div className="small-container">
          <ul className="steps mb-10 w-full">
            <li className="step step-primary">
              <Trans>Provide Info</Trans>
            </li>
            <li className="step step-primary">
              <Trans>Generate</Trans>
            </li>
            <li className="step step-primary">
              <Trans>Interview</Trans>
            </li>
            <li data-content="★" className="step">
              <Trans>Get Feedback</Trans>
            </li>
          </ul>
        </div>
        <div className="card w-100 bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <Trans>Your Interview is Ready</Trans>
            </h2>
            <p>
              <Trans>
                Your personalized interview is ready. Click the button below to
                start your interview.
              </Trans>
            </p>
            <div className="card-actions justify-end mt-10">
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  beginInterview();
                }}
              >
                {loading && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                <Trans>Begin Now</Trans>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InterviewReady;
