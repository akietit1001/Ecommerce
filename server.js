import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import auth from './routes/auth.js'
import category from './routes/category.js'
import product from './routes/product.js'
import cors from 'cors'

// configure environment
dotenv.config()

// database configuration
connectDB()

// rest object
const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/category', category);
app.use('/api/v1/product', product);

// rest api
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to ecommerce website'
    })
})

// PORT
const PORT = process.env.PORT || 8080

// run listen
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT} on ${process.env.DEV_MODE} mode`)
})