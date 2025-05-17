const { Pool } = require('pg');

module.exports = class ConnectionFactory{
    static getConnection(){
        return new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
};