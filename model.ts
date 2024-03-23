export type UserSession = {
    userId: string;
    email: string;
    picture: string;
    name: string;
    credits: number;
}

export type Interview = {
    interviewId: string;
    userId: string;
    created: string;
    status: InterviewStatus;
    questions: string[];
    answers: string[];
    answerFeedback: string[];
    overallFeedback: string;
}

export enum InterviewStatus {
    GENERATING_QUESTIONS = "GENERATING_QUESTIONS",
    READY = "READY",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}

export type Toast = {
    id?: string;
    text: string;
    type: "success" | "error" | "warning";
}