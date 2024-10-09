import express from 'express'
import S3Controller from '../controllers/S3Controller'
import upload from '../middleware/upload'
import dotenv from 'dotenv'

const fileRouter = express.Router()
const bucketName = dotenv.config().parsed?.S3_BUCKET_NAME!
const s3Controller = new S3Controller(bucketName)

// Define routes for CRUD operations

// Create an item
fileRouter.post('/', upload.single('file'), (req, res) => {
    s3Controller.upload(req, res)
})

// Read all items
fileRouter.get('/', (req, res) => {
    s3Controller.getAllFiles(req, res)
})

// Read an item
fileRouter.get('/:key', (req, res) => {
    s3Controller.getFileUrl(req, res)
})


// Delete an item
fileRouter.delete('/:key', (req, res) => {
    s3Controller.delete(req, res)
})

export default fileRouter