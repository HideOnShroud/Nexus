import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import logger from '../logger' // Import the logger
import DynamoDBService from './DynamoDbService'; // Import DynamoDBService
import dotenv from "dotenv"
import { Item } from "../models/Item"

class S3Service {
    private s3Client: S3Client
    private bucketName: string
    private dynamoDBService: DynamoDBService; // Instance of DynamoDBService
    private tableName: string = dotenv.config().parsed?.DYNAMODB_TABLE_NAME!;
    private region: string = dotenv.config().parsed?.REGION!;


    constructor(bucketName: string) {
        this.s3Client = new S3Client({ region: this.region })
        this.bucketName = bucketName
        this.dynamoDBService = new DynamoDBService(this.tableName); // Initialize DynamoDBService

    }

    // Upload a file
    async uploadFile(key: string, body: Buffer | string, contentType: string): Promise<void> {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: key,
                Body: body,
                ContentType: contentType,
            }
            await this.s3Client.send(new PutObjectCommand(params))
            const item: Item = {
                Id: key,
                name: key,
                size: Buffer.byteLength(body),
                createdAt: new Date().toISOString(),
            };
            await this.dynamoDBService.createItem(item); // Create item in DynamoDB
            logger.info(`File uploaded successfully: ${key}`)
        } catch (error) {
            this.handleError(error, `Error uploading file ${key}`)
            throw new Error('Failed to upload file.')
        }
    }

    // Get all files
    async getAllFiles(): Promise<{ key: string; url: string }[]> {
        try {
            const params = {
                Bucket: this.bucketName,
            }
            const data = await this.s3Client.send(new ListObjectsV2Command(params))

            // Extract the file keys (names), ensuring they are defined
            const files = data.Contents?.map(item => item.Key).filter((key): key is string => key !== undefined) || []
            logger.info(`Retrieved ${files.length} files from bucket: ${this.bucketName}`)

            // Generate presigned URLs for each file
            const fileUrls = await Promise.all(files.map(async (key) => {
                const url = await this.getFileUrl(key) // Get presigned URL
                return { key, url }
            }))

            return fileUrls // Return an array of objects with key and URL
        } catch (error) {
            this.handleError(error, `Error retrieving files from bucket ${this.bucketName}`)
            throw new Error('Failed to retrieve files.')
        }
    }

    // Get a file (returns a presigned URL to download)
    async getFileUrl(key: string): Promise<string> {
        try {
            await this.s3Client.send(new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }))

            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`
        } catch (error) {
            // Check for a specific error type to suppress logging
            if (error instanceof Error && error.name === 'NotFound') {
                // Instead of logging, just throw the error
                throw new Error('Failed to get file URL: File does not exist.')
            }

            // Log unexpected errors
            if (error instanceof Error) {
                logger.error(`Error retrieving file URL: ${error.message}`)
            } else {
                logger.error('Error retrieving file URL: Unknown error occurred')
            }
            throw new Error('Failed to get file URL due to an internal error.')
        }
    }





    // Delete a file
    async deleteFile(key: string): Promise<{ message: string }> {
        try {
            // Check if the file exists first
            await this.s3Client.send(new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }))

            // the file exists, proceed to delete it
            const params = {
                Bucket: this.bucketName,
                Key: key,
            }
            await this.s3Client.send(new DeleteObjectCommand(params))
            logger.info(`File deleted successfully: ${key}`)
            await this.dynamoDBService.deleteItem(key); // Delete item from DynamoDB
            logger.info(`DynamoDB record deleted for file: ${key}`);

            // Return a success message
            return { message: 'File deleted' } // Returning a success message
        } catch (error) {
            if (error instanceof Error && error.name === 'NotFound') {
                // If the error indicates that the file was not found
                logger.error(`File with key ${key} does not exist.`)
                throw new Error(`File with key ${key} does not exist.`)
            } else {
                // Handle any other errors
                this.handleError(error, `Error deleting file ${key}`)
                throw new Error('Failed to delete file.')
            }
        }
    }

    // Handle unknown errors
    private handleError(error: unknown, message: string): void {
        if (error instanceof Error) {
            logger.error(`${message}: ${error.message}`)
        } else {
            logger.error(`${message}: Unknown error occurred`)
        }
    }
}

export default S3Service
