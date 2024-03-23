interface InterviewReadyProps {
  onBeginInterview: () => void;
}

function InterviewReady({ onBeginInterview }: InterviewReadyProps) {
  return (
    <>
      <div className="content-container">
        <div className="small-container">
          <ul className="steps mb-10 w-full">
            <li className="step step-primary">Provide Info</li>
            <li className="step step-primary">Generate</li>
            <li className="step step-primary">Interview</li>
            <li className="step">Get Feedback</li>
          </ul>
        </div>
        <div className="card w-100 bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Your Interview is Ready</h2>
            <p>
              Your personalized interview is ready. Click the button below to
              start your interview.
            </p>
            <div className="card-actions justify-end mt-10">
              <button
                className="btn btn-primary"
                onClick={() => onBeginInterview()}
              >
                Begin Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InterviewReady;
