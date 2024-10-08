import { ddbDocClient } from '../dynamodb'
import { ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { Item } from '../models/Item'
import { ReturnValue } from '@aws-sdk/client-dynamodb'  // Import the ReturnValue enum

class DynamoDBService {
    private tableName: string

    constructor(tableName: string) {
        this.tableName = tableName
    }

    async createItem(item: Item): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                ...item,  // Spread the provided item fields
                createdAt: new Date().toISOString(),  // Add createdAt with the current ISO timestamp
            },
        }

        await ddbDocClient.send(new PutCommand(params))
    }

    async getAllItems(): Promise<Item[]> {
        const params = {
            TableName: this.tableName,
        }
        const data = await ddbDocClient.send(new ScanCommand(params))
        return data.Items as Item[] // Return the list of items
    }

    async getItem(id: string): Promise<Item | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                Id: id,  // Ensure "Id" matches your interface
            },
        }
        const data = await ddbDocClient.send(new GetCommand(params))
        return data.Item as Item || null
    }

    async updateItem(id: string, updatedItem: Partial<Item>): Promise<Item | null> {
        // Validation: Ensure only allowed fields are updated and they match expected types
        const updateExpressions: string[] = []
        const expressionAttributeNames: { [key: string]: string } = {}
        const expressionAttributeValues: { [key: string]: any } = {}

        // Check if 'name' is provided and is a string
        if (updatedItem.name !== undefined) {
            if (typeof updatedItem.name !== 'string') {
                throw new Error('Invalid data type for name. Expected a string.')
            }
            updateExpressions.push('#name = :name')
            expressionAttributeNames['#name'] = 'name'
            expressionAttributeValues[':name'] = updatedItem.name
        }

        // Check if 'size' is provided and is a number
        if (updatedItem.size !== undefined) {
            if (typeof updatedItem.size !== 'number') {
                throw new Error('Invalid data type for size. Expected a number.')
            }
            updateExpressions.push('#size = :size')
            expressionAttributeNames['#size'] = 'size'
            expressionAttributeValues[':size'] = updatedItem.size
        }

        // Ensure 'createdAt' is not being updated
        if (updatedItem.createdAt) {
            throw new Error('createdAt field cannot be updated.')
        }

        // If no valid fields to update, throw an error
        if (updateExpressions.length === 0) {
            throw new Error('No valid fields provided for update.')
        }

        // Construct the UpdateCommand parameters
        const params = {
            TableName: this.tableName,
            Key: { Id: id },  // Ensure "Id" matches your interface
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: ReturnValue.UPDATED_NEW,  // Use the enum for the return value
        }

        const data = await ddbDocClient.send(new UpdateCommand(params))
        return data.Attributes as Item || null
    }

    async deleteItem(id: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: { Id: id },  // Ensure "Id" matches your interface
        }
        await ddbDocClient.send(new DeleteCommand(params))
    }
}

export default DynamoDBService
