const request = require('supertest');
const app = require('../main');
const db = require('../util/ConnectionFactory').getConnection();

beforeEach(() => {
    db.prepare('DELETE FROM usuario').run();
})

describe('Testes de Usuário', () => {
    it('Deve cadastrar um novo usuário com sucesso', async () => {
        const res = await request(app)
            .post('/usuarios')
            .send({
                emailUsuario: 'teste@teste.com',
                senhaUsuario: 'Senha@123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('Não deve cadastrar usuário com email duplicado', async () => {
        await request(app).post('/usuarios').send({
            emailUsuario: 'repetido@teste.com', 
            senhaUsuario: 'Senha@123'
        });

        const res = await request(app).post('/usuarios').send({
            emailUsuario: 'repetido@teste.com',
            senhaUsuario: 'Senha@123'
        });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBeDefined();
    });

    it('Deve fazer login e retornar um token JWT', async () => {

        await db.prepare(`INSERT INTO usuario (emailUsuario, senhaUsuario) VALUES(?, ?)`).run(
            'admin@teste.com', 
            '!9Cavalo7'
        );

        const res = await request(app)
        .post('/usuarios/login')
        .send({
            emailUsuario: 'admin@teste.com', 
            senhaUsuario: '!9Cavalo7'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    })
});

