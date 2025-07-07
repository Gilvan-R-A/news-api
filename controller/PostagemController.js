const ConnectionFactory = require('../util/ConnectionFactory');
const Postagem = require('../model/Postagem');

module.exports = class PostagemController{

    constructor(){
        this.conexao = ConnectionFactory.getConnection();
        this.isSQLite = typeof this.conexao.prepare === 'function';
    }

    async listarTodos(request, response) {
        try {
            if (this.isSQLite) {
                const rows = this.conexao.prepare('SELECT * FROM postagem').all();
                return response.status(200).json(rows);
            } else {
                const resultado = await this.conexao.query('SELECT * FROM postagem');
                return response.status(200).json(resultado.rows);
            }
        } catch (error) {
            console.error(`Erro ao listar as postagens: ${error}`);
            return response.status(404).send(false);
        }
    }

async listarPorId(request, response) {
    try {
        const idPostagem = parseInt(request.params.idPostagem);
        if (this.isSQLite) {
            const row = this.conexao.prepare('SELECT * FROM postagem WHERE idPostagem = ?').get(idPostagem);
            return response.status(200).json(row || false);
        } else {
            const resultado = await this.conexao.query('SELECT * FROM postagem WHERE idPostagem = $1', [idPostagem]);
            return response.status(200).json(resultado.rowCount === 0 ? false : resultado.rows[0]);
        }
    } catch (error) {
        console.error(`Erro ao listar por ID: ${error}`);
        return response.status(404).send(false);
    }
}

    async cadastrar(request, response) {
        try {
            const postagem = new Postagem(
                null, 
                request.body.tituloPostagem,
                request.body.conteudoPostagem, 
                request.body.categoriaPostagem, 
                request.body.dataPostagem
            );

            if (this.isSQLite) {
                this.conexao.prepare(`
                    INSERT INTO postagem (tituloPostagem, conteudoPostagem, categoriaPostagem, dataPostagem) 
                    VALUES (?, ?, ?, ?)
                `).run(postagem.tituloPostagem, postagem.conteudoPostagem, postagem.categoriaPostagem, postagem.dataPostagem);       
            } else {
                await this.conexao.query(`
                    INSERT INTO postagem (tituloPostagem, conteudoPostagem, categoriaPostagem, dataPostagem) 
                    VALUES ($1, $2, $3, $4)
                    `, [
                        postagem.tituloPostagem, 
                        postagem.conteudoPostagem, 
                        postagem.categoriaPostagem, 
                        postagem.dataPostagem
                    ]);
            }

            return response.status(201).send(true);

        } catch (error) {
            console.error(`Erro ao cadastrar postagem: ${error}`);
            return response.status(404).send(false);
        }
    }

async alterar(request, response) {
    try{
        const postagem = new Postagem(
            request.params.idPostagem, 
            request.body.tituloPostagem, 
            request.body.conteudoPostagem, 
            request.body.categoriaPostagem, 
            request.body.dataPostagem
        );

        if (this.isSQLite) {
            this.conexao.prepare(`
                UPDATE postagem SET 
                tituloPostagem = ?, 
                conteudoPostagem = ?, 
                categoriaPostagem = ?, 
                dataPostagem = ? 
                WHERE idPostagem = ? 
                `).run(
                    postagem.tituloPostagem, 
                    postagem.conteudoPostagem, 
                    postagem.categoriaPostagem, 
                    postagem.dataPostagem, 
                    postagem.idPostagem
                );
        } else {
            await this.conexao.query(`
                UPDATE postagem SET 
                tituloPostagem = $1, 
                conteudoPostagem = $2, 
                categoriaPostagem = $3, 
                dataPostagem = $4 
                WHERE idPostagem = $5
                `, [
                    postagem.tituloPostagem, 
                    postagem.conteudoPostagem, 
                    postagem.categoriaPostagem, 
                    postagem.dataPostagem, 
                    postagem.idPostagem
                ]);
        }

        return response.status(200).send(true);

    } catch (error) {
        console.error(`Erro ao alterar postagem: ${error}`);
        return response.status(404).send(false);
    }
}

    async excluir(request, response){
        try {
            const idPostagem = parseInt(request.params.idPostagem);

            if (this.isSQLite) {
                this.conexao.prepare('DELETE FROM postagem WHERE idPostagem = ?').run(idPostagem);
            } else {
                await this.conexao.query('DELETE FROM  postagem WHERE idpostagem = $1', [idPostagem]);
            }

            return response.status(200).send(true);
        } catch (error) {
            console.error(`Erro ao excluir postagem!! Erro: ${erro}`);
            return response.status(404).send(false);
        }
    }

}