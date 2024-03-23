import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    console.log(event.body);
    return {
        statusCode: 200,
        body: "Hello world"
    }
}
