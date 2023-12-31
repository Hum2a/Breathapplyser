const db = require('../../database/db');

const createTables = async () => {
    // Create tables for users
    await db.none(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        weight REAL,
        height REAL,
        gender TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Create tables for drinks
    await db.none(`
        CREATE TABLE IF NOT EXISTS drinks (
            id SERIAL PRIMARY KEY,
            name TEXT,
            alcohol_content REAL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Create tables for drink_history
    await db.none(`
        CREATE TABLE IF NOT EXISTS drink_history (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            drink_id INT REFERENCES drinks(id),
            units REAL,
            timestamp TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Create tables for drink_charts
    await db.none(`
        CREATE TABLE IF NOT EXISTS drink_charts (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            drunkness REAL,
            individual_chart JSON,
            bac_chart JSON,
            units_chart JSON,
            combined_chart JSON,
            timestamp TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Create tables for user_settings
    await db.none(`
        CREATE TABLE IF NOT EXISTS user_settings (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            spending_limit REAL,
            drinking_limit REAL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // Additional tables based on assumptions from globalData
    await db.none(`
        CREATE TABLE IF NOT EXISTS entries (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    await db.none(`
        CREATE TABLE IF NOT EXISTS profile (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    await db.none(`
        CREATE TABLE IF NOT EXISTS settings (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    await db.none(`
        CREATE TABLE IF NOT EXISTS entries (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            alcohol TEXT,
            amount INT,
            units REAL,
            price REAL,
            type TEXT,
            start_time TIMESTAMPTZ,
            end_time TIMESTAMPTZ,
            BAC_increase REAL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    await db.none(`
    CREATE TABLE IF NOT EXISTS currencies (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE,
        name TEXT,
        symbol TEXT
    );
`);
    // Drunkness data table
    await db.none(`
      CREATE TABLE IF NOT EXISTS drunkness_data (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        drunkness_level REAL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  
    // BAC data table
    await db.none(`
      CREATE TABLE IF NOT EXISTS bac_data (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        bac_level REAL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  
    // Total units data table
    await db.none(`
      CREATE TABLE IF NOT EXISTS total_units_data (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        units REAL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  
    // Real-time BAC data table
    await db.none(`
      CREATE TABLE IF NOT EXISTS real_time_bac_data (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        real_time_bac REAL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('CreateTables.js: Tables created successfully!');
};

module.exports = {
    createTables
};

