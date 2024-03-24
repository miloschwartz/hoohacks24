export type UserSession = {
    userId: string;
    email: string;
    picture: string;
    name: string;
}

export type Interview = {
    interviewId: string;
    userId: string;
    created: string;
    status: "GENERATING_QUESTIONS" | "QUESTIONS_GENERATED" | "IN_PROGRESS" | "COMPLETED";
    questions: string[];
    answers: string[];
    answerFeedback: string[];
    overallFeedback: string;
}

export type Toast = {
    id?: string;
    text: string;
    type: "success" | "error" | "warning";
}