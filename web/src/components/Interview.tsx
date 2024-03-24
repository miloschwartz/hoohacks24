import { useContext, useEffect, useRef, useState } from "react";
import { InterviewContext } from "../pages/InterviewStatus";
import { useReactMediaRecorder } from "react-media-recorder";
import { apiClient } from "../App";
import { useToast } from "../useToast";
import moment from "moment";
import * as model from "../../../model";

function Interview() {
  const { interview, setInterview } = useContext(InterviewContext);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  let currentQuestion = 0;
  const toast = useToast();
  const [startTime, setStartTime] = useState(-1);
  const [endTime, setEndTime] = useState(-1);
  const [curAnswer, setCurAnswer] = useState<string | null>(null);

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      video: false,
      screen: false,
      askPermissionOnMount: true,
    });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [interview, curAnswer]);

  useEffect(() => {
    const transcribe = async () => {
      if (mediaBlobUrl) {
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", blob);
        formData.append("questionIndex", currentQuestion.toString());
        formData.append("interviewId", interview.interviewId);

        clearBlobUrl();

        setTranscribeLoading(true);
        await apiClient
          .post("/transcribe-audio", formData, {
            headers: {},
          })
          .then((res) => {
            if (res && res.data.transcript) {
              const transcript = res.data.transcript;
              setCurAnswer(transcript);
            }
          })
          .catch((err) => {
            toast.open({
              type: "error",
              text: `${err.response.data.message}`,
            });
          })
          .finally(() => {
            setTranscribeLoading(false);
          });
      }
    };

    transcribe();
  }, [mediaBlobUrl]);

  function formatTimeDifference(epochTime1: number, epochTime2: number) {
    const difference = Math.abs(epochTime1 - epochTime2);
    const duration = moment.duration(difference);
    let result = "";

    if (duration.hours() > 0) {
      result +=
        duration.hours() + " hour" + (duration.hours() === 1 ? "" : "s") + " ";
    }

    if (duration.minutes() > 0) {
      result +=
        duration.minutes() +
        " min" +
        (duration.minutes() === 1 ? "" : "s") +
        " ";
    }

    if (duration.seconds() > 0) {
      result +=
        duration.seconds() + " second" + (duration.seconds() === 1 ? "" : "s");
    }

    return result.trim();
  }

  const acceptAnswer = () => {
    if (!curAnswer) {
      return;
    }
    const questions = interview.questions;
    const question = questions[currentQuestion];
    question.answer = curAnswer;
    question.start = startTime;
    question.end = endTime;

    setInterview({ ...interview, questions: questions });
    setCurAnswer(null);
    setStartTime(-1);
    setEndTime(-1);

    apiClient
      .post(`/add-answer/${interview.interviewId}`, {
        start: question.start,
        end: question.end,
        answer: question.answer,
        questionIndex: currentQuestion,
      })
      .then(() => {
        console.log("saved answer");
      })
      .catch((err) => {
        toast.open({
          type: "error",
          text: `${err.response.data.message}`,
        });
      });
  };

  const rejectAnswer = () => {
    setCurAnswer(null);
    setStartTime(-1);
    setEndTime(-1);
  };

  const finishInterview = () => {
    interview.status = model.InterviewStatus.GENERATING_FEEDBACK;
    setInterview({ ...interview, status: interview.status });
    apiClient
      .post(`/finish-interview/${interview.interviewId}`)
      .then(() => {
        console.log("finished interview");
      })
      .catch((err) => {
        toast.open({
          type: "error",
          text: `${err.response.data.message}`,
        });
      });
  };

  const onStart = () => {
    startRecording();
    setCurAnswer(null);
    setStartTime(new Date().getTime());
  };

  const onStop = async () => {
    stopRecording();
    setEndTime(new Date().getTime());
  };

  const renderQuestions = () => {
    const answered = interview.questions.filter(
      (q) => q.answer && q.answer !== "" && q.question && q.start && q.end
    );
    const endSlice =
      answered.length === interview.questions.length
        ? answered.length
        : answered.length + 1;
    currentQuestion = endSlice - 1;
    console.log(currentQuestion);
    const questions = interview.questions.slice(0, endSlice);
    return questions.map((q, idx) => {
      return (
        <div key={idx}>
          <div className="chat chat-start">
            <div className="chat-header mb-1">Interviewer</div>
            <div
              className={`chat-bubble ${
                idx === questions.length - 1 && "chat-bubble-info"
              }`}
            >
              <p>{q.question}</p>
            </div>
            <div className="chat-footer opacity-60 mt-1">
              <span>Question {idx + 1}</span>
            </div>
          </div>
          {q.answer && (
            <div className="chat chat-end">
              <div className="chat-header mb-1">You</div>
              <div className="chat-bubble">
                <p>{q.answer}</p>
              </div>
              {q.start && q.end && (
                <div className="chat-footer opacity-60 mt-1">
                  <span>{formatTimeDifference(q.start, q.end)}</span>
                </div>
              )}
            </div>
          )}
          {curAnswer && !q.answer && (
            <div className="chat chat-end">
              <div className="chat-header mb-1">You</div>
              <div className="chat-bubble chat-bubble-primary">{curAnswer}</div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderActions = () => {
    if (interview.status === model.InterviewStatus.GENERATING_FEEDBACK) {
      return (
        <button className="btn btn-primary" disabled>
          Completing Interview{" "}
          <span className="loading loading-spinner loading-sm"></span>
        </button>
      );
    }
    // if (curAnswer && currentQuestion === interview.questions.length - 1) {
    if (currentQuestion === interview.questions.length - 1) {
      return (
        <>
          <button
            className="btn"
            onClick={() => {
              rejectAnswer();
            }}
          >
            Try Again
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              acceptAnswer();
              finishInterview();
            }}
          >
            Finish Interview
          </button>
        </>
      );
    }
    if (curAnswer) {
      return (
        <>
          <button
            className="btn"
            onClick={() => {
              rejectAnswer();
            }}
          >
            Try Again
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              acceptAnswer();
            }}
          >
            Next Question
          </button>
        </>
      );
    }
    if (transcribeLoading) {
      return (
        <button className="btn" disabled>
          Transcribing{" "}
          <span className="loading loading-spinner loading-sm"></span>
        </button>
      );
    }
    if (status === "recording") {
      return (
        <button className="btn btn-error" onClick={() => onStop()}>
          End Recording
        </button>
      );
    }
    return (
      <button className="btn btn-success" onClick={() => onStart()}>
        Start Recording
      </button>
    );
  };

  return (
    <>
      <div className="content-container">
        <div className="medium-container ">
          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="chat-container" ref={chatContainerRef}>
                {renderQuestions()}
              </div>
              <div className="card-actions justify-center mt-10">
                {renderActions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Interview;
