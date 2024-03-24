import { useContext } from "react";
import { InterviewContext } from "../pages/InterviewStatus";
import * as model from "../../../model";

interface QuestionFeedbackProps {
  type: model.QuestionFeedbackType;
  index: number;
}

function QuestionFeedback({ type, index }: QuestionFeedbackProps) {
  const { interview, setInterview } = useContext(InterviewContext);
  const feedback = interview?.questions[index].feedback[type];

  //   const keysAsArray = Object.keys(feedback);

  const getHeaderText = (type: model.QuestionFeedbackType) => {
    switch (type) {
      case model.QuestionFeedbackType.CONTENT_QUALITY:
        return "Content Quality";
    }
  };

  return <>{/* <p>{feedback.comments}</p> */}</>;
}

export default QuestionFeedback;
