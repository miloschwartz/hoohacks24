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
    overallFeedback: OverallFeedbackInterview;
    jobTitle: string;
    jobDescription: string;
    interviewType: InterviewType;
    resumeText: string;
    totalWordCount: number;
    averageWordCount: number;
    totalWordsPerMinute: number;
    averageWordsPerMinute: number;
    totalDuration: number;
    averageDuration: number;
}

export type OverallFeedbackInterview = {
    overallRating: Rating;
    overallComments: string;
    pros: string[];
    cons: string[];
}

export enum InterviewType {
    BEHAVIORAL = "BEHAVIORAL",
    TECHNICAL = "TECHNICAL",
}

export type Question = {
    question: string;
    answer: string;
    feedback: QuestionFeedback;
    duration: number;
    totalWordCount: number;
    wordsPerMinute: number;
    start: number;
    end: number;
}

export enum InterviewStatus {
    GENERATING_QUESTIONS = "GENERATING_QUESTIONS",
    READY = "READY",
    IN_PROGRESS = "IN_PROGRESS",
    GENERATING_FEEDBACK = "GENERATING_FEEDBACK",
    FEEDBACK_READY = "FEEDBACK_READY",
}

export type Toast = {
    id?: string;
    text: string;
    type: "success" | "error" | "warning";
}

export type QuestionFeedback = {
    sections: FeedbackSections;
    overallFeedback: OverallFeedbackQuestion
}

export type FeedbackSections = {
    contentQuality: QuestionFeedbackSection
    structureOrganization: QuestionFeedbackSection
    presentationDelivery: QuestionFeedbackSection
    supportJustification: QuestionFeedbackSection
    criticalThinkingInnovation: QuestionFeedbackSection
    culturalContextualFit: QuestionFeedbackSection
    interpersonalDynamics: QuestionFeedbackSection
}

export type QuestionFeedbackSection = {
    comments: string;
    components: QuestionFeedbackComponent[];
}

export type QuestionFeedbackComponent = {
    name: string;
    description: string;
    rating: Rating;
}

export type OverallFeedbackQuestion = {
    comments: string;
    overallRating: Rating;
    pros: string[];
    cons: string[];
}

export enum QuestionFeedbackType {
    CONTENT_QUALITY = "contentQuality",
    STRUCTURE_ORGANIZATION = "structureOrganization",
    PRESENTATION_DELIVERY = "presentationDelivery",
    SUPPORT_JUSTIFICATION = "supportJustification",
    CRITICAL_THINKING_INNOVATION = "criticalThinkingInnovation",
    CULTURAL_CONTEXTUAL_FIT = "culturalContextualFit",
    INTERPERSONAL_DYNAMICS = "interpersonalDynamics",
}


export enum Rating {
    VERY_LOW = "VERY_LOW",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    VERY_HIGH = "VERY_HIGH",
}
