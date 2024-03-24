import { useContext, useState } from "react";
import { InterviewContext } from "../pages/InterviewStatus";
import * as model from "../../../model";
import QuestionFeedback from "./QuestionFeedback";
import Rating from "./Rating";

function Feedback() {
  const { interview, setInterview } = useContext(InterviewContext);
  const [expanded, setExpanded] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<model.QuestionFeedbackType>(
    model.QuestionFeedbackType.OVERALL_FEEDBACK
  );

  // use tailwind colors
  const getRatingColor = (rating: model.Rating) => {
    switch (rating) {
      case model.Rating.VERY_LOW:
        return "bg-red-500";
      case model.Rating.LOW:
        return "bg-yellow-500";
      case model.Rating.MEDIUM:
        return "bg-yellow-500";
      case model.Rating.HIGH:
        return "bg-green-500";
      case model.Rating.VERY_HIGH:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

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
                    <Rating rating={interview.overallFeedback.overallRating} />
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

                  <p className="py-4">
                    {interview.overallFeedback.overallComments}
                  </p>

                  <div className="gap-8 columns-2">
                    <h2 className="text-2xl font-bold text-green-500">
                      Strengths
                    </h2>
                    <ul className="list-disc ml-5 py-4">
                      {interview.overallFeedback.pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                    <h2 className="text-2xl font-bold text-yellow-500">
                      Weaknesses
                    </h2>
                    <ul className="list-disc ml-5 py-4">
                      {interview.overallFeedback.cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="divider">Questions</div>

              {interview?.questions.map((question, index) => {
                const rating = question.feedback.overallFeedback.overallRating;

                return (
                  <div
                    className="collapse collapse-plus bg-base-200"
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
                      <div className="flex flex-row">
                        <div>Question {index + 1} </div>
                        <Rating rating={rating} />
                      </div>
                    </div>
                    <div className="collapse-content">
                      <div className="flex flex-col w-full border-opacity-50">
                        <div className="chat chat-start">
                          <div className="chat-header mb-1">Interviewer</div>
                          <div className="chat-bubble">{question.question}</div>
                        </div>
                        <div className="chat chat-end">
                          <div className="chat-header mb-1">Your Response</div>
                          <div className="chat-bubble chat-bubble-primary">
                            {question.answer}
                          </div>
                        </div>
                        <div className="divider">Feedback</div>
                        <div className="grid rounded-box place-items-center">
                          <div className="tabs tabs-boxed">
                            <a
                              className={`tab ${
                                selectedTab ===
                                  model.QuestionFeedbackType.OVERALL_FEEDBACK &&
                                "tab-active"
                              }`}
                              onClick={() =>
                                setSelectedTab(
                                  model.QuestionFeedbackType.OVERALL_FEEDBACK
                                )
                              }
                            >
                              Overall
                            </a>
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
                          <div>
                            <QuestionFeedback
                              type={selectedTab}
                              index={expanded}
                            />
                          </div>
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
