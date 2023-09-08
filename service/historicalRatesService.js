const HistoricalData = require('../model/HistoricalData');
const axios = require('axios');

const BASE = ['USD', 'EUR', 'GBP', 'INR'];
const TARGET = ['USD', 'EUR', 'GBP', 'INR'];

const fetchAndStoreHistoricalRates = async () => {
    const promises = [];

    for (let i = 0; i < BASE.length; i++) {
        for (let j = 0; j < TARGET.length; j++) {
            if (BASE[i] === TARGET[j]) continue;

            promises.push(
                axios.get(
                    `https://api.exchangerate.host/convert?from=${BASE[i]}&to=${TARGET[j]}&amount=1`
                )
            );
        }
    }

    try {
        const responses = await Promise.all(promises);
        const historicalData = [];

        responses.forEach((response) => {
            const { query, result } = response.data

            historicalData.push({
                base: query.from,
                target: query.to,
                value: result,
                timeStamp: new Date()
            })
        })

        await HistoricalData.insertMany(historicalData);

        console.log('Historical data stored successfully');

    } catch (error) {
        console.error('Error storing historical data:', error.message);
    }
};


const deleteHistoricalRates = async () => {
    try {

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        await HistoricalData.deleteMany({
            timeStamp: {
                $lt: sevenDaysAgo
            },
        });

        console.log(`Deleted Historical Data`);

    } catch (error) {
        console.error('Error deleting historical rates:', error.message);
    }
};


module.exports = {fetchAndStoreHistoricalRates, deleteHistoricalRates};
