import { useContext, useState } from "react";
import { InterviewContext } from "../pages/InterviewStatus";
import * as model from "../../../model";
import QuestionFeedback from "./QuestionFeedback";
import Rating from "./Rating";
import { IoSparkles } from "react-icons/io5";

function Feedback() {
  const { interview, setInterview } = useContext(InterviewContext);
  const [expanded, setExpanded] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<model.QuestionFeedbackType>(
    model.QuestionFeedbackType.CONTENT_QUALITY
  );

  return (
    <>
      <div className="content-container">
        <div className="large-container ">
          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex flex-row">
                    <h2 className="card-title">Overall Feedback</h2>
                    <Rating
                      rating={interview.overallFeedback.overallRating}
                      size="md"
                    />
                  </div>

                  <div className="stats stats-vertical lg:stats-horizontal mt-4">
                    <div className="stat">
                      <div className="stat-title">Total Questions</div>
                      <div className="stat-value">
                        {interview.questions.length}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">Total Duration</div>
                      <div className="stat-value">
                        {(interview.totalDuration / 1000 / 60).toFixed(2)}
                      </div>
                      <div className="stat-desc">minutes</div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">
                        Average Response Duration
                      </div>
                      <div className="stat-value">
                        {(interview.averageDuration / 1000 / 60).toFixed(2)}
                      </div>
                      <div className="stat-desc">minutes</div>
                    </div>
                  </div>

                  <p className="mt-4">
                    {interview.overallFeedback.overallComments}
                  </p>

                  <div className="flex flex-wrap mt-4">
                    <div className="w-full md:w-1/2 mb-6 md:mb-0 pr-6">
                      <div className="card bg-base-100 h-full flex flex-col">
                        <div className="card-body flex-grow">
                          <div className="card-title">Strengths</div>
                          <ul className="list-disc ml-5 py-4">
                            {interview.overallFeedback.pros.map((pro, idx) => (
                              <li key={idx} className="opacity-60">
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                      <div className="card bg-base-100 h-full flex flex-col">
                        <div className="card-body flex-grow">
                          <div className="card-title">Weaknesses</div>
                          <ul className="list-disc ml-5 py-4">
                            {interview.overallFeedback.cons.map((con, idx) => (
                              <li key={idx} className="opacity-60">
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-secondary">
                      <IoSparkles />
                      Enhance Responses
                    </button>
                  </div>
                </div>
              </div>

              <div className="divider">Questions</div>

              {interview?.questions.map((question, index) => {
                const rating = question.feedback.overallFeedback.overallRating;

                return (
                  <div
                    className="collapse collapse-plus bg-base-200 p-3"
                    key={index}
                  >
                    <input
                      type="radio"
                      name="my-accordion-3"
                      checked={expanded === index}
                      onChange={() => {
                        setExpanded(index);
                      }}
                    />
                    <div className="collapse-title text-xl font-medium">
                      <div className="flex flex-row items-center">
                        <div>Question {index + 1} </div>
                        <Rating rating={rating} size="md" />
                      </div>
                    </div>
                    <div className="collapse-content">
                      <div className="flex flex-col w-full border-opacity-60">
                        <div className="chat chat-start">
                          <div className="chat-header mb-1">Interviewer</div>
                          <div className="chat-bubble">{question.question}</div>
                        </div>
                        <div className="chat chat-end">
                          <div className="chat-header mb-1">Your Response</div>
                          <div className="chat-bubble chat-bubble-primary">
                            <p>{question.answer}</p>
                            <div className="text-end">
                              <div
                                className="tooltip"
                                data-tip="Enhance Response"
                              >
                                <button className="btn btn-circle btn-sm mt-1">
                                  <IoSparkles />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="chat-footer opacity-60 mt-1">
                            <span>
                              {question.totalWordCount} words &middot;{" "}
                              {(question.duration / 1000 / 60).toFixed(2)}{" "}
                              minutes &middot;{" "}
                              {question.wordsPerMinute.toFixed(2)} wpm
                            </span>
                          </div>
                        </div>

                        <div className="place-items-center grid py-4">
                          <div className="tabs tabs-boxed">
                            <a
                              className={`tab ${
                                selectedTab ===
                                  model.QuestionFeedbackType.CONTENT_QUALITY &&
                                "tab-active"
                              }`}
                              onClick={() =>
                                setSelectedTab(
                                  model.QuestionFeedbackType.CONTENT_QUALITY
                                )
                              }
                            >
                              Content
                            </a>
                            <a
                              className={`tab ${
                                selectedTab ===
                                  model.QuestionFeedbackType
                                    .STRUCTURE_ORGANIZATION && "tab-active"
                              }`}
                              onClick={() =>
                                setSelectedTab(
                                  model.QuestionFeedbackType
                                    .STRUCTURE_ORGANIZATION
                                )
                              }
                            >
                              Structure
                            </a>
                            <a
                              className={`tab ${
                                selectedTab ===
                                  model.QuestionFeedbackType
                                    .PRESENTATION_DELIVERY && "tab-active"
                              }`}
                              onClick={() =>
                                setSelectedTab(
                                  model.QuestionFeedbackType
                                    .PRESENTATION_DELIVERY
                                )
                              }
                            >
                              Presentation
                            </a>
                            <a
                              className={`tab ${
                                selectedTab ===
                                  model.QuestionFeedbackType
                                    .SUPPORT_JUSTIFICATION && "tab-active"
                              }`}
                              onClick={() =>
                                setSelectedTab(
                                  model.QuestionFeedbackType
                                    .SUPPORT_JUSTIFICATION
                                )
                              }
                            >
                              Support
                            </a>
                            <a
                              className={`tab ${
                                selectedTab ===
                                  model.QuestionFeedbackType
                                    .CRITICAL_THINKING_INNOVATION &&
                                "tab-active"
                              }`}
                              onClick={() =>
                                setSelectedTab(
                                  model.QuestionFeedbackType
                                    .CRITICAL_THINKING_INNOVATION
                                )
                              }
                            >
                              Innovation
                            </a>
                            <a
                              className={`tab ${
                                selectedTab ===
                                  model.QuestionFeedbackType
                                    .CULTURAL_CONTEXTUAL_FIT && "tab-active"
                              }`}
                              onClick={() =>
                                setSelectedTab(
                                  model.QuestionFeedbackType
                                    .CULTURAL_CONTEXTUAL_FIT
                                )
                              }
                            >
                              Fit
                            </a>
                            <a
                              className={`tab ${
                                selectedTab ===
                                  model.QuestionFeedbackType
                                    .INTERPERSONAL_DYNAMICS && "tab-active"
                              }`}
                              onClick={() =>
                                setSelectedTab(
                                  model.QuestionFeedbackType
                                    .INTERPERSONAL_DYNAMICS
                                )
                              }
                            >
                              Interpersonal
                            </a>
                          </div>
                        </div>
                        <div>
                          <QuestionFeedback
                            type={selectedTab}
                            index={expanded}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Feedback;
