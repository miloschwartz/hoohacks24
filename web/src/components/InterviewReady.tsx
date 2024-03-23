function InterviewReady() {
  return (
    <>
      <div className="card w-100 bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Your Interview is Ready</h2>
          <p>
            Your personalized interview is ready. Click the button below to
            start your interview.
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Begin Now</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default InterviewReady;
