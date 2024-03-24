import { Trans } from "react-i18next";

function FeedbackBeingGenerated() {
  const generateFeedback = async () => {};

  return (
    <>
      <div className="content-container">
        <div className="small-container">
          <ul className="steps mb-10 w-full">
            <li className="step step-primary"><Trans>Provide Info</Trans></li>
            <li className="step step-primary"><Trans>Generate</Trans></li>
            <li className="step step-primary"><Trans>Interview</Trans></li>
            <li data-content="★" className="step step-primary">
              <Trans>Get Feedback</Trans>
            </li>
          </ul>
          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title"><Trans>Analyzing</Trans>...</h2>
              <p>
                <Trans>We are analyzing your response and gathering detailed feedback. Don't leave! You're almost there. This will only take a few moments.</Trans>
              </p>
              <div className="text-center">
                <span className="loading loading-ball"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeedbackBeingGenerated;
