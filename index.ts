import express from 'express'
import cors from 'cors'
import itemRouter from './routes/itemRoutes'
import fileRouter from './routes/fileroutes'

const port = process.env.PORT || 3000
const app = express()



app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))

// Base route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/items', itemRouter)
app.use('/files', fileRouter)

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
