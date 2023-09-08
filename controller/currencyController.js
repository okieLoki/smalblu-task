const axios = require('axios')
const createError = require('http-errors')
const HistoricalData = require('../model/HistoricalData')

const currencyConvert = async (req, res) => {

    const { from, to, amount } = req.query

    try {
        if (!from || !to || !amount) {
            throw createError.BadRequest('Missing required parameters')
        }

        const response = await axios.get(`
            https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}
        `)

        if (!response.data.success) {
            throw createError.InternalServerError('Something went wrong')
        }

        return res.status(200).json({
            success: true,
            data: {
                from,
                to,
                amount: +amount,
                rate: response.data.info.rate,
                date: response.data.date,
                result: response.data.result
            }
        })

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}

const liveRates = async (req, res) => {
    let { base, symbols } = req.query;

    const defaultSymbols = 'USD,EUR,GBP,INR';

    base = base || 'USD';
    symbols = symbols || defaultSymbols;

    try {
        const response = await axios.get(
            `https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`
        );

        if (!response.data.success) {
            throw createError.InternalServerError('Failed to fetch live exchange rates.');
        }

        return res.status(200).json({
            success: true,
            data: {
                base: response.data.base,
                date: response.data.date,
                rates: response.data.rates,
            }
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: 'Error fetching live exchange rates.',
        });
    }
};

const historicalRates = async (req, res) => {
    const { from, to } = req.query;

    try {
        if (!from || !to) {
            throw createError.BadRequest('Missing required parameters');
        }

        const historicalData = await HistoricalData.find({
            base: from,
            target: to,
            timeStamp: {
                $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
            }
        }).sort({ timeStamp: 1 });

        if (historicalData.length === 0) {
            throw createError.NotFound('No historical data found');
        }

        return res.status(200).json({
            success: true,
            data: historicalData
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { currencyConvert, liveRates, historicalRates }