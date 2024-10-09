import * as express from 'express'

declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File // Add file property here
        }
        interface CustomError extends Error {
            status?: number; // optional status code
        }
    }
}
