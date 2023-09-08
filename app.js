require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const dbConnection = require('./config/dbConfig')
const userRoute = require('./route/userRoute')
const currencyRoute = require('./route/currencyRoute')
const {
    fetchAndStoreHistoricalRates,
    deleteHistoricalRates } = require('./service/historicalRatesService')
const { rateLimit } = require('express-rate-limit')
const cookieParser = require('cookie-parser')

const app = express()

// dbConnection
dbConnection().catch(err => console.log(err))

// rate limiter
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 100,
    message: ()=>{
        return {
            success: false,
            message: 'You have exceeded the 100 requests in 24 hrs limit!'
        }
    },
})

app.use('/api/', limiter)

// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// routes
app.use('/api/user', userRoute)
app.use('/api/currency', currencyRoute)


// cron
const cronJob = cron.schedule('0 0 * * *', async () => {
    try {
        await fetchAndStoreHistoricalRates();
        await deleteHistoricalRates();
    } catch (error) {
        console.error('Cron job error:', error.message);
    }
});

cronJob.start();

module.exports = app