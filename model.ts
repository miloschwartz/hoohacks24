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
    contentQuality: ContentQuality
    structureOrganization: StructureOrganization
    presentationDelivery: PresentationDelivery
    supportJustification: SupportJustification
    criticalThinkingInnovation: CriticalThinkingInnovation
    culturalContextualFit: CulturalContextualFit
    interpersonalDynamics: InterpersonalDynamics
    overallFeedback: OverallFeedbackQuestion
}

export enum QuestionFeedbackType {
    CONTENT_QUALITY = "contentQuality",
    STRUCTURE_ORGANIZATION = "structureOrganization",
    PRESENTATION_DELIVERY = "presentationDelivery",
    SUPPORT_JUSTIFICATION = "supportJustification",
    CRITICAL_THINKING_INNOVATION = "criticalThinkingInnovation",
    CULTURAL_CONTEXTUAL_FIT = "culturalContextualFit",
    INTERPERSONAL_DYNAMICS = "interpersonalDynamics",
    OVERALL_FEEDBACK = "overallFeedback",
}

export type ContentQuality = {
    relevance: Rating;
    depth: Rating;
    accuracy: Rating;
    comments: string;
}

export type StructureOrganization = {
    clarity: Rating;
    flow: Rating;
    brevity: Rating;
    comments: string;
}

export type PresentationDelivery = {
    confidence: Rating;
    articulation: Rating;
    engagement: Rating;
    comments: string;
}

export type SupportJustification = {
    examples: Rating;
    dataBacked: Rating;
    referenceExperience: Rating;
    comments: string;
}

export type CriticalThinkingInnovation = {
    insightfulness: Rating;
    problemSolving: Rating;
    creativity: Rating;
    comments: string;
}

export type CulturalContextualFit = {
    alignmentValues: Rating;
    relevanceRole: Rating;
    awareness: Rating;
    comments: string;
}

export type InterpersonalDynamics = {
    listeningSkills: Rating;
    adaptability: Rating;
    emotionalIntelligence: Rating;
    comments: string;
}

export type OverallFeedbackQuestion = {
    comments: string;
    overallRating: Rating;
    pros: string[];
    cons: string[];
    fillerWords: string[];
}

export enum Rating {
    VERY_LOW = "VERY_LOW",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    VERY_HIGH = "VERY_HIGH",
}