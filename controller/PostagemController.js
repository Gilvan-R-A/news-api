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
            return response.status(404).json({
                success: false, 
                error: 'Erro ao listar as postagens'
            });
        }
    }

async listarPorId(request, response) {
    try {
        const idPostagem = parseInt(request.params.idPostagem);
        let postagem;


        if(isNaN(idPostagem)) {
            return response.status(404).json({
                success: false,
                error: 'ID inválido'
            });
        }

        if (this.isSQLite) {
            postagem = this.conexao.prepare('SELECT * FROM postagem WHERE idPostagem = ?').get(idPostagem);
    
        } else {
            const resultado = await this.conexao.query('SELECT * FROM postagem WHERE idPostagem = $1', [idPostagem]);
            postagem = resultado.rowCount === 0 ? null: resultado.rows[0];
        }

        if (!postagem) {
            return response.status(404).json({
                success: false,
                error: 'Postagem não encontrada'
            });
        }

        return response.status(200).json({
            success: true,
            dados: postagem
        });

    } catch (error) {
        console.error(`Erro ao listar por ID: ${error}`);
        return response.status(500).json({
            success: false,
            error: 'Erro interno ao buscar postagem por ID'
        });
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
                const result = this.conexao.prepare(`
                    INSERT INTO postagem (tituloPostagem, conteudoPostagem, categoriaPostagem, dataPostagem) 
                    VALUES (?, ?, ?, ?)
                `).run(postagem.tituloPostagem, postagem.conteudoPostagem, postagem.categoriaPostagem, postagem.dataPostagem);    
                
                postagem.idPostagem = result.lastInsertRowid;
            } else {
                const insertResult = await this.conexao.query(`
                    INSERT INTO postagem (tituloPostagem, conteudoPostagem, categoriaPostagem, dataPostagem) 
                    VALUES ($1, $2, $3, $4) 
                    RETURNING idPostagem
                    `, [
                        postagem.tituloPostagem, 
                        postagem.conteudoPostagem, 
                        postagem.categoriaPostagem, 
                        postagem.dataPostagem
                    ]);

                    postagem.idPostagem = insertResult.rows[0].idPostagem;
            }

            return response.status(201).json({
                success: true,
                dados: postagem
            });

        } catch (error) {
            console.error(`Erro ao cadastrar postagem: ${error}`);
            return response.status(404).json({
                success: false,
                error: 'Erro ao cadastrar postagem'
            });
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

        return response.status(200).json({
            success: true
        });

    } catch (error) {
        console.error(`Erro ao alterar postagem: ${error}`);
        return response.status(404).json({
            success: false,
            error: 'Erro ao alterar postagem'
        });
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

            return response.status(200).json({
                success: true
            });
        } catch (error) {
            console.error(`Erro ao excluir postagem!! Erro: ${error}`);
            return response.status(404).json({
                success: false,
                error: 'Erro ao excluir postagem!'
            });
        }
    }

}