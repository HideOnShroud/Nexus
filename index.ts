import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import itemRouter from './routes/itemRoutes'
import fileRouter from './routes/fileRoutes'

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))

// Base route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// 404 Not Found middleware
app.use((req: Request, res: Response) => {
    res.status(404).send({ error: 'Page Not Found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error
    res.status((err as any).status || 500).send({ error: err.message || 'Internal Server Error' });
});

// Routes
app.use('/items', itemRouter)
app.use('/files', fileRouter)


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
