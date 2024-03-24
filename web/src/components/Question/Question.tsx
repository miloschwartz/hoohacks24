import { useState } from "react";
import * as model from "../../../../model";
import Loading from "../Loading";
import InputAnswer from "../RecordAudio";
import { apiClient } from "../../App";
import { useToast } from "../../useToast";
import "./Question.css";
import TextResponse from "../TextResponse";

interface QuestionProps {
  interview: model.Interview;
}

function Question({ interview }: QuestionProps) {
  const [index, setIndex] = useState(0);
  const [responseType, setResponseType] = useState("audio"); // ["audio", "text"]
  const [isRecording, setIsRecording] = useState(false);
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

  const transcribeAudio = async (blobUrl: string) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("questionIndex", index.toString());
    formData.append("interviewId", interview.interviewId);

    await apiClient
      .post("/transcribe-audio", formData, {
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

  const renderResponseType = (type: string) => {
    if (type === "audio") {
      return (
        <>
          <InputAnswer
            onCompleteRecording={(blobUrl) => {
              // uploadRecordingToS3(blobUrl);
              transcribeAudio(blobUrl);
            }}
            onStartRecording={() => {
              setIsRecording(true);
            }}
            onStopRecording={() => {
              setIsRecording(false);
            }}
          />
        </>
      );
    } else if (type === "text") {
      return <TextResponse />;
    }
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
              <div className="chat chat-start">
                <div className="chat-bubble">{curQuestion.question}</div>
              </div>
              <div className="card-actions mt-10">
                {index > 0 && (
                  <button className="btn" onClick={() => prevQuestion()}>
                    Previous
                  </button>
                )}

                {index < totalQuestions && (
                  <button
                    className="btn btn-primary ml-auto"
                    onClick={() => nextQuestion()}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card w-100 bg-base-300 shadow-xl mt-10 answer-area">
            <div className="card-body">
              {!curQuestion.answer ? (
                <>
                  <div className="flex justify-center items-center">
                    <div className="tabs tabs-boxed">
                      <a
                        className={`tab ${
                          responseType === "audio" && "tab-active"
                        }`}
                        onClick={() => setResponseType("audio")}
                      >
                        Record Response
                      </a>
                      <a
                        className={`tab ${
                          responseType === "text" && "tab-active"
                        }`}
                        onClick={() => setResponseType("text")}
                      >
                        Type Response
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-center items-center mt-auto">
                    {!curQuestion.answer && renderResponseType(responseType)}
                  </div>
                </>
              ) : (
                <>
                  <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-accent">
                      {curQuestion.answer}
                    </div>
                  </div>

                  <div className="chat chat-start">
                    {curQuestion.feedback ? (
                      <div className="chat-bubble">{curQuestion.feedback}</div>
                    ) : (
                      <div className="chat-bubble">
                        Working on your feedback...
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Question;
