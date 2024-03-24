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
                        }
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
                        fillerWords: {
                            description: "A list filler words the candidate used in the response if any.",
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

                interview.questions[i].feedback = gptJson;
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

/*
Content Quality:
Relevance: Assesses whether the candidate's answer directly and adequately addressed the posed question. Did they stay on topic, or did they divert?
Depth: Examines the thoroughness of the candidate's response. Did they give a cursory reply or delve into the nuances and intricacies of the topic?
Accuracy: Checks the veracity and correctness of the statements or facts provided by the candidate. Are they well-informed?

Structure & Organization:
Clarity: Determines if the candidate presented their thoughts in a clear and comprehensible manner, without muddling the message with ambiguities.
Flow: Evaluates the logical sequence and progression of the candidate's answer. Was their response well-organized, leading to a coherent conclusion?
Brevity: Assesses if the candidate was concise, providing pertinent information without unnecessary elaboration or digression.

Presentation & Delivery:
Confidence: Gauges the candidate's self-assuredness when delivering their answer. Did they speak with conviction, or did they seem doubtful?
Articulation: Assesses how clearly and effectively the candidate conveyed their thoughts. Were their points easily understandable?
Engagement: Determines if the candidate's manner of response was engaging, capturing the attention of the interviewer.

Support & Justification:
Examples: Checks if the candidate substantiated their claims or points with relevant examples, enhancing the credibility of their response.
Data-backed: Evaluates if the candidate reinforced their statements with data or statistics, demonstrating a fact-based approach.
Reference to Experience: Sees if the candidate related their answer to personal experiences or past work, showcasing real-world applicability.

Critical Thinking & Innovation:
Insightfulness: Gauges whether the candidate's answer showcased deeper insights, reflecting their ability to think critically and perceive nuances.
Problem-Solving: Assesses the candidate's ability to identify, analyze, and propose solutions to challenges presented in the question.
Creativity: Examines the candidate's capacity for original thought or novel approaches in their response.

Cultural & Contextual Fit:
Alignment with Company Values: Assesses if the candidate's answer and approach align with the known ethos, culture, and values of the organization.
Relevance to Role: Determines if the candidate tailored their response considering the specifics of the role they're interviewing for.
Awareness: Evaluates the candidate's knowledge and awareness of the industry, company, or broader context related to the question.

Interpersonal Dynamics:
Listening Skills: Checks if the candidate actively listened to the question, ensuring they responded aptly.
Adaptability: Assesses the candidate's ability to modify or pivot their answer based on feedback or subsequent queries.
Emotional Intelligence: Gauges the candidate's capability to discern and navigate the emotional undertones of the question or conversation.
*/
