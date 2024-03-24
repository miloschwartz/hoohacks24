import { BsFillLightbulbFill } from "react-icons/bs";

function QuestionsBeingGeneraterated() {
  return (
    <>
      <div className="content-container">
        <div className="small-container">
          <ul className="steps mb-10 w-full">
            <li className="step step-primary">Provide Info</li>
            <li className="step step-primary">Generate</li>
            <li className="step">Interview</li>
            <li data-content="★" className="step">
              Get Feedback
            </li>
          </ul>
          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Working on it!</h2>
              <p>
                Your personalized interview is being generated. This may take a
                few moments.
              </p>
              <div className="text-center">
                <span className="loading loading-ball"></span>
              </div>
            </div>
          </div>
          <div className="card w-100 bg-base-300 shadow-xl mt-10">
            <div className="card-body">
              <h2 className="card-title">Tip</h2>
              <p>
                Your interview history will always be saved. If you need to
                leave this page before starting your interview, you can view the
                interview later by clicking your avatar in the top right and
                selecting "My Interviews".
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuestionsBeingGeneraterated;
