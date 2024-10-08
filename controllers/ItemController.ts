import { Request, Response } from 'express'
import DynamoDBService from '../services/DynamoDbService'
import { Item } from '../models/Item'

class ItemController {
    private dynamoDBService: DynamoDBService


    constructor(tableName: string) {
        this.dynamoDBService = new DynamoDBService(tableName)
    }

    async create(req: Request, res: Response) {
        const item: Item = req.body

        try {
            await this.dynamoDBService.createItem(item)
            res.status(201).send({ message: 'Item created' })
        } catch (err) {
            console.error('Error creating item:', err)
            res.status(500).send({ error: 'Could not create item' })
        }
    }

    async readAll(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.dynamoDBService.getAllItems()
            res.send(items)
        } catch (err) {
            console.error('Error retrieving items:', err)
            res.status(500).send({ error: 'Could not retrieve items' })
        }
    }

    async read(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        try {
            const item = await this.dynamoDBService.getItem(id)
            if (!item) {
                res.status(404).send({ error: 'Item not found' })
            }
            res.send(item)
        } catch (err) {
            console.error('Error retrieving item:', err)
            res.status(500).send({ error: 'Could not retrieve item' })
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const updatedItem: Partial<Item> = req.body

        try {
            const item = await this.dynamoDBService.updateItem(id, updatedItem)
            if (!item) {
                res.status(404).send({ error: 'Item not found' })
            }
            res.send({ message: 'Item updated', updatedAttributes: item })
        } catch (err) {
            console.error('Error updating item:', err)
            res.status(500).send({ error: 'Could not update item' })
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        try {
            await this.dynamoDBService.deleteItem(id)
            res.send({ message: 'Item deleted' })
        } catch (err) {
            console.error('Error deleting item:', err)
            res.status(500).send({ error: 'Could not delete item' })
        }
    }
}

export default ItemController
