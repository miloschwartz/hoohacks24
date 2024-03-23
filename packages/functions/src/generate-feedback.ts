import OpenAI from "openai";
import { Config } from "sst/node/config";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Table } from "sst/node/table";
import * as model from "../../../model";

const openaiKey = Config.OPENAI_API_KEY;

export async function handler(event: EventBridgeEvent, context: any, callback: any) {
    console.log("Got event from eventbridge");

    const { interview } = event.detail;

    const openaiClient = new OpenAI({
        apiKey: openaiKey
    });

    const { jobTitle, jobDescription, interviewType } = interview;

    const promises = [];

    for (let i = 0; i < interview.questions.length; i++) {
        const question = interview.questions[i].question;
        const answer = interview.questions[i].answer;
        const prompt = "Analyze the success of the candidate's response to the following interview question: " + question + "\n\nCandidate's response: " + answer + "\n\nThe job title is: " + jobTitle + "\n\nThe job description is: " + jobDescription + "\n\nThe interview type is: " + interviewType;

        const schema = {
            type: "object",
            properties: {
                contentQuality: {
                    type: "object",
                    properties: {
                        relevance: {
                            description: "Does the answer directly address the question?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        depth: {
                            description: "Does the answer provide a deep understanding of the subject?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        accuracy: {
                            description: "Are the statements or facts mentioned in the answer correct and verifiable?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        comments: {
                            description: "Feedback on the content quality of the response: relevance, depth, and accuracy. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                            type: "string"
                        },
                        pros: {
                            description: "A list of what the candidate did well or pros?",
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        cons: {
                            description: "A list of what the candidate did not do well or cons?",
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    }
                },
                structureOrganization: {
                    type: "object",
                    properties: {
                        clarity: {
                            description: "Is the answer clear without ambiguities?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        flow: {
                            description: "Does the answer have a logical progression?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        brevity: {
                            description: "Is the answer concise, avoiding unnecessary information?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        comments: {
                            description: "Feedback on the structure organization of the response: clarity, flow, and brevity. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                            type: "string"
                        },
                    }
                },
                presentationDelivery: {
                    type: "object",
                    properties: {
                        confidence: {
                            description: "Was the answer delivered with confidence?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        articulation: {
                            description: "Was the answer spoken/written clearly and comprehensibly?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        engagement: {
                            description: "Did the respondent engage the interviewer/audience with their response?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        comments: {
                            description: "Feedback on the presentation delivery of the response: confidence, articulation, and engagement. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                            type: "string"
                        }
                    }
                },
                supportJustification: {
                    type: "object",
                    properties: {
                        examples: {
                            description: "Were illustrative examples provided?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        dataBacked: {
                            description: "Were statistics or data points used to reinforce?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        referenceExperience: {
                            description: "Did the respondent relate the answer to their own experiences or previous work?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        comments: {
                            description: "Feedback on the support justification of the response: examples, data backed, and reference experience. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                            type: "string"
                        }
                    }
                },
                criticalThinkingInnovation: {
                    type: "object",
                    properties: {
                        insightfulness: {
                            description: "Does the answer reveal deeper insights or a unique perspective?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        problemSolving: {
                            description: "Does the answer demonstrate problem-solving skills?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        creativity: {
                            description: "Is there evidence of original thought in the response?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        comments: {
                            description: "Feedback on the critical thinking innovation of the response: insightfulness, problem solving, and creativity. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                            type: "string"
                        }
                    }
                },
                culturalContextualFit: {
                    type: "object",
                    properties: {
                        alignmentValues: {
                            description: "Does the answer align with company values?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        relevanceRole: {
                            description: "Is the response tailored to the specifics of the role?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        awareness: {
                            description: "Does the respondent demonstrate knowledge of the context?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        comments: {
                            description: "Feedback on the cultural and contextual fit of the response: alignment values, relevance to role, and awareness. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                            type: "string"
                        }
                    }
                },
                interpersonalDynamics: {
                    type: "object",
                    properties: {
                        listeningSkills: {
                            description: "Did the respondent listen carefully to the question?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        adaptability: {
                            description: "Did the respondent adapt their answer based on feedback?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        emotionalIntelligence: {
                            description: "Did the respondent show empathy and understanding of the emotional context?",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        comments: {
                            description: "Feedback on the interpersonal dynamics of the response: listening skills, adaptability, and emotional intelligence. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                            type: "string"
                        }
                    }
                },
                overallFeedback: {
                    type: "object",
                    properties: {
                        overallRating: {
                            description: "Overall rating of the response",
                            type: "string",
                            enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
                        },
                        comments: {
                            description: "Overall comments on the response. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                            type: "string"
                        },
                        pros: {
                            description: "A list of what the candidate did well or pros?",
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        cons: {
                            description: "A list of what the candidate did not do well or cons?",
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                    }
                }
            }
        }

        // sleep for 1 second to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Calling OpenAI API");
        const gptResponse = openaiClient.chat.completions.create({
            model: "gpt-4-0613",
            messages: [
                { role: "system", content: "You are a job interview coach helping an candidate analyze their response to a given interview question." },
                { role: "user", content: prompt }
            ],
            functions: [{ name: "generate_question_feedback", parameters: schema }],
            function_call: { name: "generate_question_feedback" }
        })
            .then((response) => {
                console.log("Got OpenAI response");

                const gptData = response.choices[0].message.function_call?.arguments;
                if (!gptData) {
                    console.log("No GPT data");
                    return;
                }

                const gptJson = JSON.parse(gptData);

                console.log("Got GPT data");

                interview.questions[i].feedback = convertToQuestionFeedback(gptJson);
                interview.questions[i].duration = calculateDurationOfResponse(interview.questions[i].start, interview.questions[i].end);
                interview.questions[i].totalWordCount = calculateTotalWords(interview.questions[i].answer);
                interview.questions[i].wordsPerMinute = calculateWordsSpokenPerMinute(interview.questions[i].answer, interview.questions[i].duration);
            })
            .catch((err) => {
                console.log("Error calling OpenAI API");
                console.log(err);
            });

        promises.push(gptResponse);
    }

    await Promise.all(promises);

    // generate overall feedback for interview using gpt
    let overallPrompt = "Give a summary of the overall success of the candidate's interview performance. Pretend you are speaking to the candidate themselves.\n\nThe job title is: " + jobTitle + "\n\nThe job description is: " + jobDescription + "\n\nThe interview type is: " + interviewType;
    for (let i = 0; i < interview.questions.length; i++) {
        const question = interview.questions[i].question;
        const answer = interview.questions[i].answer;
        overallPrompt += "\n\nQuestion: " + question + "\n\nAnswer: " + answer;
    }
    const overallSchema = {
        type: "object",
        properties: {
            overallRating: {
                description: "Overall rating of the candidate's performance during the interview",
                type: "string",
                enum: ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]
            },
            overallComments: {
                description: "Overall comments on candidate's performance during the interview. Write in complete sentences, paragraph format. Pretend you are speaking directly to the candidate.",
                type: "string"
            },
            pros: {
                description: "A list of what the candidate did well or pros?",
                type: "array",
                items: {
                    type: "string"
                }
            },
            cons: {
                description: "A list of what the candidate did not do well or cons?",
                type: "array",
                items: {
                    type: "string"
                }
            }
        }
    }

    try {
        const gptResponse = await openaiClient.chat.completions.create({
            model: "gpt-4-0613",
            messages: [
                { role: "system", content: "You are a job interview coach helping an candidate analyze their overall interview performance." },
                { role: "user", content: overallPrompt }
            ],
            functions: [{ name: "generate_overall_feedback", parameters: overallSchema }],
            function_call: { name: "generate_overall_feedback" }
        });

        const gptData = gptResponse.choices[0].message.function_call?.arguments;
        if (!gptData) {
            console.log("No GPT data");
            return;
        }

        const gptJson = JSON.parse(gptData);

        interview.overallFeedback = gptJson;
    } catch (err) {
        console.log("Unable to generate overall feedback");
        console.log(err);
    }

    const totalWordCount = interview.questions.reduce((acc, question) => acc + question.totalWordCount, 0);
    const averageWordCount = totalWordCount / interview.questions.length;
    const totalWordsPerMinute = interview.questions.reduce((acc, question) => acc + question.wordsPerMinute, 0);
    const averageWordsPerMinute = totalWordsPerMinute / interview.questions.length;
    const totalDuration = interview.questions.reduce((acc, question) => acc + question.duration, 0);
    const averageDuration = totalDuration / interview.questions.length;

    interview.totalWordCount = totalWordCount;
    interview.averageWordCount = averageWordCount;
    interview.totalWordsPerMinute = totalWordsPerMinute;
    interview.averageWordsPerMinute = averageWordsPerMinute;
    interview.totalDuration = totalDuration;
    interview.averageDuration = averageDuration;

    const dynamo = new DynamoDBClient({});
    const interviewRes = await dynamo.send(new UpdateItemCommand({
        TableName: Table.interviews.tableName,
        Key: marshall({
            userId: interview.userId,
            interviewId: interview.interviewId,
        }),
        UpdateExpression: "set questions = :questions, #status = :status, totalWordCount = :totalWordCount, averageWordCount = :averageWordCount, totalWordsPerMinute = :totalWordsPerMinute, averageWordsPerMinute = :averageWordsPerMinute, totalDuration = :totalDuration, averageDuration = :averageDuration, overallFeedback = :overallFeedback",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: marshall({
            ":questions": interview.questions,
            ":status": model.InterviewStatus.FEEDBACK_READY,
            ":totalWordCount": totalWordCount,
            ":averageWordCount": averageWordCount,
            ":totalWordsPerMinute": totalWordsPerMinute,
            ":averageWordsPerMinute": averageWordsPerMinute,
            ":totalDuration": totalDuration,
            ":averageDuration": averageDuration,
            ":overallFeedback": interview.overallFeedback,
        }),
    }));

    console.log("Updated interview with feedback");
}

function calculateTotalWords(text: string) {
    return text.split(" ").length;
}

function calculateWordsSpokenPerMinute(text: string, time: number) {
    // time is given in milliseconds
    const minutes = time / 60000;
    const words = text.split(" ").length;
    const wordsPerMinute = words / minutes;
    return wordsPerMinute;
}

function calculateDurationOfResponse(start: number, end: number) {
    const duration = end - start;
    return duration;
}

function convertToQuestionFeedback(feedbackData: any): model.QuestionFeedback {
    const getDescription = (componentName: string): string => {
        switch (componentName) {
            case 'relevance':
                return 'The extent to which the answer directly addresses the question.';
            case 'depth':
                return 'The level of detail and thoroughness in the answer.';
            case 'accuracy':
                return 'The correctness of the information provided.';
            case 'clarity':
                return 'How understandable the answer is.';
            case 'flow':
                return 'The logical progression and organization of the answer.';
            case 'brevity':
                return 'The conciseness of the answer.';
            case 'confidence':
                return 'The level of self-assurance in the delivery of the answer.';
            case 'articulation':
                return 'The clarity and effectiveness of communication.';
            case 'engagement':
                return 'The ability to capture and maintain the interviewer’s attention.';
            case 'dataBacked':
                return 'The use of data or statistics to support statements.';
            case 'examples':
                return 'The use of relevant examples to substantiate claims.';
            case 'referenceExperience':
                return 'The connection of the answer to personal or professional experiences.';
            case 'creativity':
                return 'The originality and novelty of the answer.';
            case 'insightfulness':
                return 'The ability to provide deeper understanding or novel perspectives.';
            case 'problemSolving':
                return 'The capacity to identify and solve challenges.';
            case 'relevanceRole':
                return 'The specificity of the answer to the role being interviewed for.';
            case 'awareness':
                return 'The understanding of the industry and company context.';
            case 'alignmentValues':
                return 'The congruence with the organization’s values and culture.';
            case 'adaptability':
                return 'The ability to adjust the answer based on the conversation flow.';
            case 'listeningSkills':
                return 'The ability to listen and respond appropriately to the question.';
            case 'emotionalIntelligence':
                return 'The ability to perceive and respond to emotional cues.';
            default:
                return 'No description available.';
        }
    };

    const formatSectionName = (sectionName: string) => {
        // convert camel case to title case
        const formatted = sectionName.replace(/([A-Z])/g, ' $1');
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);

    }

    const convertSection = (section: any, sectionComponents: string[]): model.QuestionFeedbackSection => {
        const components = sectionComponents.map(component => ({
            name: formatSectionName(component),
            description: getDescription(component),
            rating: section[component]
        })).filter(component => component.rating !== undefined);

        return {
            comments: section.comments,
            components: components
        };
    };

    return {
        sections: {
            contentQuality: convertSection(feedbackData.contentQuality, ['accuracy', 'depth', 'relevance']),
            structureOrganization: convertSection(feedbackData.structureOrganization, ['clarity', 'brevity', 'flow']),
            presentationDelivery: convertSection(feedbackData.presentationDelivery, ['engagement', 'confidence', 'articulation']),
            supportJustification: convertSection(feedbackData.supportJustification, ['dataBacked', 'examples', 'referenceExperience']),
            criticalThinkingInnovation: convertSection(feedbackData.criticalThinkingInnovation, ['creativity', 'insightfulness', 'problemSolving']),
            culturalContextualFit: convertSection(feedbackData.culturalContextualFit, ['relevanceRole', 'awareness', 'alignmentValues']),
            interpersonalDynamics: convertSection(feedbackData.interpersonalDynamics, ['adaptability', 'listeningSkills', 'emotionalIntelligence']),
        },
        overallFeedback: {
            comments: feedbackData.overallFeedback.comments,
            overallRating: feedbackData.overallFeedback.overallRating,
            pros: feedbackData.overallFeedback.pros,
            cons: feedbackData.overallFeedback.cons
        }
    };
}

interface EventBridgeEvent {
    version: string;
    id: string;
    "detail-type": string;
    source: string;
    account: string;
    time: string;
    region: string;
    resources: string[];
    detail: {
        interview: model.Interview;
    };
}
