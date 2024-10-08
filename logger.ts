import winston from 'winston'
import path from 'path'

// Create a logs directory if it doesn't exist (optional)
// You might want to manage this separately or via a build step.

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Log in JSON format for better structure
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error', // Log error messages to this file
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json() // Log in JSON format
            ),
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
            level: 'info', // Log all info and above level messages to this file
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
})

export default logger
