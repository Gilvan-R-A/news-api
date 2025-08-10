const { Pool } = require('pg');
const Database = require('better-sqlite3');

let sqliteDb = null;

module.exports = class ConnectionFactory{
    static getConnection(){

        const isTest = process.env.NODE_ENV === 'test';

        if (process.env.USE_SQLITE === 'true' || isTest) {
            if(!sqliteDb) {
                sqliteDb = new Database('file:testdb?mode=memory&cache=shared');

                sqliteDb.exec(`
                    CREATE TABLE IF NOT EXISTS postagem(
                        idPostagem INTEGER PRIMARY KEY AUTOINCREMENT, 
                        tituloPostagem TEXT NOT NULL, 
                        conteudoPostagem TEXT NOT NULL, 
                        categoriaPostagem TEXT NOT NULL, 
                        dataPostagem TEXT NOT NULL
                        ); 
                    CREATE TABLE IF NOT EXISTS usuario (
                        idUsuario INTEGER PRIMARY KEY AUTOINCREMENT, 
                        emailUsuario TEXT NOT NULL, 
                        senhaUsuario TEXT NOT NULL
                        );
                     `);

                     sqliteDb.prepare(`
                        INSERT INTO postagem (tituloPostagem, conteudoPostagem, categoriaPostagem, dataPostagem) VALUES (?, ?, ?, ?)`).run('Primeira Postagem', 'Essa é a minha primeira postagem', 'Editorial', '06/07/2025');

                    sqliteDb.prepare(`
                        INSERT INTO usuario (emailUsuario, senhaUsuario) 
                        VALUES (?, ?)
                        `).run('admin@teste.com', '!9Cavalo7');
            }
            return sqliteDb;
        }

        return new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            ssl: {
                rejectUnauthorized: false
            },
        });
    }
};