import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

class S3Service {
    private s3Client: S3Client
    private bucketName: string

    constructor(bucketName: string) {
        this.s3Client = new S3Client({ region: 'eu-central-1' })
        this.bucketName = bucketName
    }

    // Upload a file
    async uploadFile(key: string, body: Buffer | string, contentType: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: body,
            ContentType: contentType
        }
        await this.s3Client.send(new PutObjectCommand(params))
    }

    async getAllFiles(): Promise<string[]> {
        const params = {
            Bucket: this.bucketName,
        }

        const data = await this.s3Client.send(new ListObjectsV2Command(params))

        // Extract and return the keys (file names) from the response
        const files = data.Contents?.map(item => item.Key) || []
        return files as string[]
    }

    // Get a file (returns a presigned URL to download)
    async getFileUrl(key: string): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: key
        }
        const command = new GetObjectCommand(params)
        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }) // URL expires in 1 hour
        return url
    }

    // Delete a file
    async deleteFile(key: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: key
        }
        await this.s3Client.send(new DeleteObjectCommand(params))
    }
}

export default S3Service
