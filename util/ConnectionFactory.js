const { Pool } = require('pg');

module.exports = class ConnectionFactory{
    static getConnection(){
        return new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'API_Noticias',
            password: '123',
            port: 5432
        });
    }
}