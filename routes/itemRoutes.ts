import express from 'express'
import ItemController from '../controllers/ItemController'
import dotenv from 'dotenv'

const itemRouter = express.Router()
const tableName = dotenv.config().parsed?.DYNAMODB_TABLE_NAME!
const itemController = new ItemController(tableName)

// Define routes for CRUD operations

// Create an item
itemRouter.post('/', (req, res) => {
    itemController.create(req, res)
})

// Read all items
itemRouter.get('/', (req, res) => {
    itemController.readAll(req, res)
})

// Read an item
itemRouter.get('/:id', (req, res) => {
    itemController.read(req, res)
})

// Update an item
itemRouter.put('/:id', (req, res) => {
    itemController.update(req, res)
})

// Delete an item
itemRouter.delete('/:id', (req, res) => {
    itemController.delete(req, res)
})

export default itemRouter