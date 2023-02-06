const ConnectionFactory = require('../util/ConnectionFactory');
const Postagem = require('../model/Postagem');

module.exports = class PostagemController{

    constructor(){
        this.conexao = ConnectionFactory.getConnection();
    }

    async listarTodos(request, response){
        try {
            var resultado = await this.conexao.query('select * from postagem');
            response.status(200).json(resultado.rows);
        } catch (error) {
            console.error(`Erro ao listar as postagens!! Erro: ${erro}`);
            response.status(404).send(false);
        }
    }

    async listarPorId(request, response){
        try {
            const idPostagem = parseInt(request.params.idPostagem);
            var resultado = await this.conexao.query('select * from postagem where idpostagem = $1', [idPostagem]);
            response.status(200).json((resultado.rowCount == 0) ? false : resultado.rows);
        } catch (error) {
            console.error(`Erro ao listar por id!! Erro: ${erro}`);
            response.status(404).send(false);
        }
    }

    async cadastrar(request, response){
        try {
            const postagem = new Postagem(null, request.body.tituloPostagem, request.body.conteudoPostagem, request.body.categoriaPostagem, request.body.dataPostagem);
            await this.conexao.query('INSERT INTO postagem(titulopostagem, conteudopostagem, categoriapostagem, datapostagem) VALUES ($1, $2, $3, $4);', 
            [postagem.tituloPostagem, postagem.conteudoPostagem, postagem.categoriaPostagem, postagem.dataPostagem]);
            response.status(201).send(true);
        } catch (error) {
            console.error(`Erro ao cadastrar uma postagem!! Erro: ${erro}`);
            response.status(404).send(false);
        }
    }
    
    async alterar(request, response){
        try {
            const postagem = new Postagem(request.params.idPostagem, request.body.tituloPostagem, request.body.conteudoPostagem, request.body.categoriaPostagem, request.body.dataPostagem);
            await this.conexao.query('UPDATE postagem SET titulopostagem = $1, conteudopostagem = $2, categoriapostagem = $3, datapostagem = $4 WHERE idpostagem = $5;', 
            [postagem.tituloPostagem, postagem.conteudoPostagem, postagem.categoriaPostagem, postagem.dataPostagem, postagem.idPostagem]);
            response.status(200).send(true);
        } catch (error) {
            console.error(`Erro ao alterar uma postagem!! Erro: ${erro}`);
            response.status(404).send(false);
        }
    }

    async excluir(request, response){
        try {
            const idPostagem = parseInt(request.params.idPostagem);
            await this.conexao.query('delete from postagem where idpostagem = $1', [idPostagem]);
            response.status(200).send(true);
        } catch (error) {
            console.error(`Erro ao excluir uma postagem!! Erro: ${erro}`);
            response.status(404).send(false);
        }
    }
}