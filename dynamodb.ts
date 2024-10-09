import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import dotenv from 'dotenv'

const region = dotenv.config().parsed?.REGION!
// Create the DynamoDB client
const client = new DynamoDBClient({ region: region })

// Wrap the client with DynamoDBDocumentClient to simplify data handling
const ddbDocClient = DynamoDBDocumentClient.from(client)

export { ddbDocClient }
