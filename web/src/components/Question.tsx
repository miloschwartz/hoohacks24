import { useState } from "react";
import * as model from "../../../model";
import Loading from "./Loading";
import InputAnswer from "./InputAnswer";

interface QuestionProps {
  interview: model.Interview;
}

function Question({ interview }: QuestionProps) {
  const [index, setIndex] = useState(0);

  const totalQuestions = interview.questions.length;
  const curQuestion = interview.questions[index];

  const nextQuestion = () => {
    setIndex((idx) => {
      const newIdx = idx + 1;
      return newIdx;
    });
  };

  const prevQuestion = () => {
    setIndex((idx) => {
      const newIdx = idx - 1;
      return newIdx;
    });
  };

  if (!interview) {
    return <Loading />;
  }

  return (
    <>
      <div className="content-container">
        <div className="medium-container">
          <ul className="steps mb-10 w-full">
            {new Array(totalQuestions).fill(0).map((_, idx) => {
              return (
                <li className={`step ${idx <= index && "step-primary"}`}></li>
              );
            })}
            <li className="step">Get Feedback</li>
          </ul>
          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="card-title">Question {index + 1}</div>
              <p>{curQuestion.question}</p>
              {!curQuestion.answer && <InputAnswer />}
              <div className="card-actions mt-10 justify-end">
                {index > 0 && (
                  <button className="btn" onClick={() => prevQuestion()}>
                    Previous
                  </button>
                )}
                {index < totalQuestions && (
                  <button
                    className="btn btn-primary"
                    onClick={() => nextQuestion()}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Question;
