import S3Service from "../services/S3Service" // Adjust the import path as needed
import dotenv from "dotenv"

const bucketName = dotenv.config().parsed?.S3_BUCKET_NAME!
const region = dotenv.config().parsed?.REGION!
const service = new S3Service(bucketName)

describe("S3Service File Operations", () => {
    const key = "test-file.txt"
    const body = "File content"
    const contentType = "text/plain"

    afterAll(async () => {
        // Clean up any files created during tests
        try {
            await service.deleteFile(key)
        } catch (error) {
            console.error("Cleanup error:", error)
        }
    })

    beforeEach(async () => {
        // Upload the file before each test to ensure it's available
        await service.uploadFile(key, body, contentType);
    });

    test("should upload a file", async () => {
        const uploadedFileUrl = await service.getFileUrl(key)
        expect(uploadedFileUrl).toContain(`https://${bucketName}.s3.${region}.amazonaws.com/${key}`)
    })

    test("should get a file URL", async () => {
        // Ensure the file is uploaded before getting its URL

        const url = await service.getFileUrl(key)
        expect(url).toContain(`https://${bucketName}.s3.${region}.amazonaws.com/${key}`)
    })

    test("should get all files", async () => {
        const additionalKey = "additional-file.txt"
        await service.uploadFile(additionalKey, "Another file content", "text/plain") // Add another file

        const files = await service.getAllFiles()

        expect(files).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ key }),
                expect.objectContaining({ key: additionalKey }),
            ])
        )

    })
    test("should delete a file", async () => {

        const deleteResponse = await service.deleteFile(key)
        expect(deleteResponse).toEqual({ message: "File deleted" }) // Expect the specific message

        // After deletion, trying to get the URL should throw an error
        await expect(service.getFileUrl(key)).rejects.toThrow("Failed to get file URL: File does not exist.")
    })


})
