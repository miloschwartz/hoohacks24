import { useState } from "react";
import * as model from "../../../model";
import Loading from "./Loading";
import InputAnswer from "./RecordAudio";
import { apiClient } from "../App";
import { useToast } from "../useToast";

interface QuestionProps {
  interview: model.Interview;
}

function Question({ interview }: QuestionProps) {
  const [index, setIndex] = useState(0);
  const toast = useToast();

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

  const uploadRecordingToS3 = async (blobUrl: string) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("questionIndex", index.toString());
    formData.append("interviewId", interview.interviewId);

    await apiClient
      .post("/upload-audio", formData, {
        headers: {},
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        toast.open({
          type: "error",
          text: `${err.response.data.message}`,
        });
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
                <li
                  key={idx}
                  className={`step ${idx <= index && "step-primary"}`}
                ></li>
              );
            })}
            <li data-content="★" className="step">
              Get Feedback
            </li>
          </ul>
          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="card-title">Question {index + 1}</div>
              <p>{curQuestion.question}</p>
              {!curQuestion.answer && (
                <InputAnswer
                  onCompleteRecording={(blobUrl) =>
                    uploadRecordingToS3(blobUrl)
                  }
                />
              )}
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
