import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// Create the DynamoDB client
const client = new DynamoDBClient({ region: 'eu-central-1' })

// Wrap the client with DynamoDBDocumentClient to simplify data handling
const ddbDocClient = DynamoDBDocumentClient.from(client)

export { ddbDocClient }
