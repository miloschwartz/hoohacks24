function FeedbackBeingGenerated() {
  const generateFeedback = async () => {};

  return (
    <>
      <div className="content-container">
        <div className="small-container">
          <ul className="steps mb-10 w-full">
            <li className="step step-primary">Provide Info</li>
            <li className="step step-primary">Generate</li>
            <li className="step step-primary">Interview</li>
            <li data-content="★" className="step step-primary">
              Get Feedback
            </li>
          </ul>
          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Analyzing...</h2>
              <p>
                We are analyzing your response and gathering detailed feedback.
                Don't leave! You're almost there. This will only take a few
                moments.
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
