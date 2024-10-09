import DynamoDBService from "../services/DynamoDbService"
import dotenv from "dotenv"

const tableName = dotenv.config().parsed?.DYNAMODB_TABLE_NAME!
const item = { Id: "1", name: "Item 1", size: 10 }

describe("DynamoDBService CRUD Operations", () => {
    let service: DynamoDBService

    beforeEach(async () => {
        service = new DynamoDBService(tableName)
        await service.createItem(item)
    })

    afterEach(async () => {
        await service.deleteItem(item.Id)
    })

    test("should create an item", async () => {
        const newItem = { Id: "1", name: "Item 2", size: 20 }
        await service.createItem(newItem)
        const items = await service.getAllItems()
        expect(items).toContainEqual(newItem)
    })

    test("should get all items", async () => {
        const items = await service.getAllItems()
        expect(items).toContainEqual(item)
    })

    test("should get an item", async () => {
        const fetchedItem = await service.getItem(item.Id)
        expect(fetchedItem).toEqual(item)
    })


    test("should update an item", async () => {
        const updatedItem = { name: "Updated Item 1" }
        await service.updateItem(item.Id, updatedItem)
        const fetchedItem = await service.getItem(item.Id)
        expect(fetchedItem).toEqual({ ...item, ...updatedItem })
    })


    test("should delete an item", async () => {
        await service.deleteItem(item.Id) // Delete the item first
        const items = await service.getAllItems() // Fetch items again after deletion
        expect(items).not.toContainEqual(item) // Ensure the item no longer exists
    })




})
