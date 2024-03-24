import { useContext } from "react";
import { InterviewContext } from "../pages/InterviewStatus";
import * as model from "../../../model";
import Rating from "./Rating";

interface QuestionFeedbackProps {
  type: model.QuestionFeedbackType;
  index: number;
}

function QuestionFeedback({ type, index }: QuestionFeedbackProps) {
  const { interview, setInterview } = useContext(InterviewContext);
  const feedback = interview.questions[index].feedback.sections[type];

  return (
    <>
      <div className="flex flex-wrap mt-1">
        {feedback.components.map((component, index) => (
          <div
            className={`w-full md:w-1/3 px-3 mb-6 md:mb-0 ${
              index === 0 ? "md:pl-0" : ""
            } ${index === feedback.components.length - 1 ? "md:pr-0" : ""}`}
            key={index}
          >
            <div className="card bg-base-100 h-full flex flex-col">
              <div className="card-body flex-grow">
                <div className="card-title">{component.name}</div>
                <div className="text-center">
                  <Rating
                    rating={component.rating}
                    key={component.rating}
                    size="sm"
                  />
                </div>
                <p className="text-sm opacity-60">{component.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4">{feedback.comments}</p>
    </>
  );
}

export default QuestionFeedback;
