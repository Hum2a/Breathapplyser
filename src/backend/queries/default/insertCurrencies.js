const { createTables } = require('./createTables');
const db = require('../../database/db')

const insertCurrencies = async () => {
    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' }
        // Add more currencies as needed
    ];

    for (const currency of currencies) {
        await db.none(
            'INSERT INTO currencies (code, name, symbol) VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',
            [currency.code, currency.name, currency.symbol]
        );
    }

    console.log('InsertCurrencies.js: Currencies inserted successfully');
};

insertCurrencies();
