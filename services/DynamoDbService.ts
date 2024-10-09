import { ddbDocClient } from '../dynamodb'
import { ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { Item } from '../models/Item'
import { ReturnValue } from '@aws-sdk/client-dynamodb'
import logger from '../logger' // Import the logger

class DynamoDBService {
    private tableName: string

    constructor(tableName: string) {
        this.tableName = tableName
    }

    // Create an item
    async createItem(item: Item): Promise<void> {
        try {
            // Validate the structure of the item
            if (typeof item.Id !== 'string') {
                throw new Error('Invalid data type for Id. Expected a string.')
            }
            if (typeof item.name !== 'string') {
                throw new Error('Invalid data type for name. Expected a string.')
            }
            if (typeof item.size !== 'number') {
                throw new Error('Invalid data type for size. Expected a number.')
            }
            if (item.createdAt !== undefined && typeof item.createdAt !== 'string') {
                throw new Error('Invalid data type for createdAt. Expected a string or undefined.')
            }

            const params = {
                TableName: this.tableName,
                Item: item,
            }
            await ddbDocClient.send(new PutCommand(params))
            logger.info(`Item created: ${JSON.stringify(item)}`)
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error creating item: ${error.message}`)
            } else {
                logger.error('Unknown error occurred while creating item.')
            }
            throw new Error('Failed to create item. Please try again later.')
        }
    }

    // Get all items
    async getAllItems(): Promise<Item[]> {
        try {
            const params = {
                TableName: this.tableName,
            }
            const data = await ddbDocClient.send(new ScanCommand(params))
            logger.info(`Retrieved all items from table: ${this.tableName}`)
            return data.Items as Item[]
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error retrieving items: ${error.message}`)
            } else {
                logger.error('Unknown error occurred while retrieving items.')
            }
            throw new Error('Failed to retrieve items. Please try again later.')
        }
    }

    // Get Item by ID
    async getItem(id: string): Promise<Item | null> {
        try {
            const params = {
                TableName: this.tableName,
                Key: {
                    Id: id,
                },
            }
            const data = await ddbDocClient.send(new GetCommand(params))
            logger.info(`Retrieved item with ID: ${id}`)
            return data.Item as Item || null
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error retrieving item with ID ${id}: ${error.message}`)
            } else {
                logger.error(`Unknown error occurred while retrieving item with ID ${id}.`)
            }
            throw new Error('Failed to retrieve item. Please try again later.')
        }
    }

    // Update an item
    async updateItem(id: string, updatedItem: Partial<Item>): Promise<Item | null> {
        try {
            // Validate the structure of the updated item
            if (updatedItem.name !== undefined && typeof updatedItem.name !== 'string') {
                throw new Error('Invalid data type for name. Expected a string.')
            }
            if (updatedItem.size !== undefined && typeof updatedItem.size !== 'number') {
                throw new Error('Invalid data type for size. Expected a number.')
            }
            if (updatedItem.createdAt !== undefined) {
                throw new Error('createdAt field cannot be updated.')
            }


            const updateExpressions: string[] = []
            const expressionAttributeNames: { [key: string]: string } = {}
            const expressionAttributeValues: { [key: string]: any } = {}

            if (updatedItem.name !== undefined) {
                updateExpressions.push('#name = :name')
                expressionAttributeNames['#name'] = 'name'
                expressionAttributeValues[':name'] = updatedItem.name
            }

            if (updatedItem.size !== undefined) {
                updateExpressions.push('#size = :size')
                expressionAttributeNames['#size'] = 'size'
                expressionAttributeValues[':size'] = updatedItem.size
            }

            if (updateExpressions.length === 0) {
                throw new Error('No valid fields provided for update.')
            }

            // Constructing the parameters for update
            const params = {
                TableName: this.tableName,
                Key: { Id: id },
                UpdateExpression: `SET ${updateExpressions.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: ReturnValue.UPDATED_NEW,
            }

            const data = await ddbDocClient.send(new UpdateCommand(params))
            logger.info(`Item updated with ID: ${id}, Updated fields: ${JSON.stringify(updatedItem)}`)
            return data.Attributes as Item || null
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error updating item with ID ${id}: ${error.message}`)
            } else {
                logger.error(`Unknown error occurred while updating item with ID ${id}.`)
            }
            throw new Error('Failed to update item. Please try again later.')
        }
    }

    // Delete an item
    async deleteItem(id: string): Promise<void> {
        try {
            const item = await this.getItem(id)
            if (!item) {
                logger.warn(`Item with ID ${id} does not exist.`)
                return
            }

            const params = {
                TableName: this.tableName,
                Key: { Id: id },
            }

            await ddbDocClient.send(new DeleteCommand(params))
            logger.info(`Item deleted with ID: ${id}`)
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error deleting item with ID ${id}: ${error.message}`)
            } else {
                logger.error(`Unknown error occurred while deleting item with ID ${id}.`)
            }
            throw new Error('Failed to delete item. Please try again later.')
        }
    }

}

export default DynamoDBService
