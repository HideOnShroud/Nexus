import { Request, Response } from 'express'
import S3Service from '../services/S3Service'

class S3Controller {
    private s3Service: S3Service

    constructor(bucketName: string) {
        this.s3Service = new S3Service(bucketName)
    }

    // Upload file
    async upload(req: Request, res: Response): Promise<void> {
        const file = req.file // File uploaded via form-data
        if (!file) {
            res.status(400).send({ error: 'No file uploaded' })
            return
        }

        try {
            const key = file.originalname // Use file's original name as the key
            await this.s3Service.uploadFile(key, file.buffer, file.mimetype)
            res.status(201).send({ message: 'File uploaded', key })
        } catch (err) {
            console.error('Error uploading file:', err)
            res.status(500).send({ error: 'Could not upload file' })
        }
    }

    // Get file URL (Presigned URL)
    async getFileUrl(req: Request, res: Response): Promise<void> {
        const { key } = req.params

        try {
            const url = await this.s3Service.getFileUrl(key)
            res.send({ url })
        } catch (err) {
            console.error('Error retrieving file URL:', err)
            res.status(500).send({ error: 'Could not retrieve file' })
        }
    }

    // Get all files
    async getAllFiles(req: Request, res: Response): Promise<void> {
        try {
            const files = await this.s3Service.getAllFiles()
            res.send(files)
        } catch (err) {
            console.error('Error retrieving files:', err)
            res.status(500).send({ error: 'Could not retrieve files' })
        }
    }


    // Delete file
    async delete(req: Request, res: Response): Promise<void> {
        const { key } = req.params

        try {
            await this.s3Service.deleteFile(key)
            res.send({ message: 'File deleted' })
        } catch (err) {
            console.error('Error deleting file:', err)
            res.status(500).send({ error: 'Could not delete file' })
        }
    }
}

export default S3Controller
