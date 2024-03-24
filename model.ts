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
    jobTitle: string;
    jobDescription: string;
    interviewType: InterviewType;
    resumeText: string;
}

export enum InterviewType {
    BEHAVIORAL = "BEHAVIORAL",
    TECHNICAL = "TECHNICAL",
}

export type Question = {
    question: string;
    answer: string;
    feedback: QuestionFeedback;
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
    overallFeedback: OverallFeedback
}

export type ContentQuality = {
    relevance: Rating;
    depth: Rating;
    accuracy: Rating;
}

export type StructureOrganization = {
    clarity: Rating;
    flow: Rating;
    brevity: Rating;
}

export type PresentationDelivery = {
    confidence: Rating;
    articulation: Rating;
    engagement: Rating;
}

export type SupportJustification = {
    examples: Rating;
    dataBacked: Rating;
    referenceExperience: Rating;
}

export type CriticalThinkingInnovation = {
    insightfulness: Rating;
    problemSolving: Rating;
    creativity: Rating;
}

export type CulturalContextualFit = {
    alignmentValues: Rating;
    relevanceRole: Rating;
    awareness: Rating;
}

export type InterpersonalDynamics = {
    listeningSkills: Rating;
    adaptability: Rating;
    emotionalIntelligence: Rating;
}

export type OverallFeedback = {
    overallRating: Rating;
    overallComments: string;
}

export enum Rating {
    VERY_LOW = "VERY_LOW",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    VERY_HIGH = "VERY_HIGH",
}