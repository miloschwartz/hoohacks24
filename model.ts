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
    created: string; // iso string 
    completed: string;  // iso string
    status: InterviewStatus;
    questions: Question[];
    overallFeedback: string;
}

export type Question = {
    question: string;
    answer: string;
    feedback: string;
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