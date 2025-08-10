const request = require('supertest');
const app = require('../main');
const db = require('../util/ConnectionFactory').getConnection();

let token;
let idNovaPostagem;

beforeAll(async () => {
    db.prepare(`DELETE FROM postagem`).run();
    db.prepare(`DELETE FROM usuario`).run();

   db.prepare(`
        INSERT INTO usuario (emailUsuario, senhaUsuario) 
        VALUES (?, ?)
    `).run('admin@teste.com', '!9Cavalo7')

    const login = await request(app)
        .post('/usuarios/login')
        .send({
            emailUsuario: 'admin@teste.com', 
            senhaUsuario: '!9Cavalo7'
    });

    if(!login.body?.token) {
        throw new Error(`Falha no login: ${JSON.stringify(login.body)}`);
    }

    token = login.body.token;

});

beforeEach(async () => {
    db.prepare('DELETE FROM postagem').run();

    const res = await request(app)
        .post('/postagens')
        .set('Authorization', `Bearer ${token}`)
        .send({
            tituloPostagem: 'Postagem de Teste',
            conteudoPostagem: 'Este é o conteúdo da postagem de teste.',
            categoriaPostagem: 'Notícias',
            dataPostagem: '2025-08-01'
        });
    
    if (!res.body?.dados?.idPostagem) {
        throw new Error(`Erro ao criar postagem de teste: ${JSON.stringify(res.body)}`);
    }

    idNovaPostagem = res.body.dados.idPostagem;
});

describe('Testes de Postagens', () => {

    it('Deve criar uma nova postagem com sucesso', async () => {
        const res = await request(app)
            .post('/postagens')
            .set('Authorization', `Bearer ${token}`)
            .send({
                tituloPostagem: 'Postagem de Teste 2',
                conteudoPostagem: 'Conteúdo da nova postagem.',
                categoriaPostagem: 'Notícias',
                dataPostagem: '2025-08-01'
            });
       
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.dados).toHaveProperty('idPostagem');

    });

    it('Deve listar todas as postagens', async () => {
        const res = await request(app).get('/postagens');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Deve buscar uma postagem por ID', async () => {
        const res = await request(app).get(`/postagens/${idNovaPostagem}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('dados');
        expect(res.body.dados).toHaveProperty('idPostagem', idNovaPostagem);
 
    });

    it('Deve atualizar uma postagem existente', async () => {
        const res = await request(app)
            .put(`/postagens/${idNovaPostagem}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                tituloPostagem: 'Postagem Atualizada',
                conteudoPostagem: 'Conteúdo atualizado da postagem.',
                categoriaPostagem: 'Notícia',
                dataPostagem: '2025-08-01'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('Deve retornar erro ao buscar postagem inexistente', async () => {
        const res = await request(app).get('/postagens/999999');

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Postagem não encontrada');
    })

    it('Deve excluir uma postagem existente', async () => {
        const res = await request(app)
            .delete(`/postagens/${idNovaPostagem}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    
    });
});

    afterAll(() => {
        db.prepare('DELETE FROM postagem').run();
        db.prepare('DELETE FROM usuario').run();
    })

