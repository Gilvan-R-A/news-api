const ConnectionFactory = require('../util/ConnectionFactory');
const Usuario = require('../model/Usuario');

module.exports = class UsuarioController{

    constructor(){
        this.conexao = ConnectionFactory.getConnection();
    }

    async logar(request, response){
        try {
            var usuario = new Usuario(null, request.body.emailUsuario, request.body.senhaUsuario);
            var resultado = await this.conexao.query('select * from usuario where emailusuario = $1 and senhausuario = $2', [usuario.emailUsuario, usuario.senhaUsuario]);
            console.log(resultado.rows);
            if(resultado.rowCount > 0){
                response.status(200).json({msg : "Usuário logado"});
            }else{
                response.status(404).json({msg : "Email ou senha inválidos"});
            }
        } catch (error) {
            console.error(`Erro ao fazer login!! Erro: ${error}`);
            response.status(404).send(false);
        }
    }

    async cadastrar(request, response){
        try {
            var usuario = new Usuario(null, request.body.emailUsuario, request.body.senhaUsuario);
            await this.conexao.query('INSERT INTO usuario(emailusuario, senhausuario) VALUES ($1, $2);', [usuario.emailUsuario, usuario.senhaUsuario]);
            response.status(200).send(true);
        } catch (error) {
            console.error(`Erro ao cadastrar usuário!! Erro: ${error}`);
            response.status(404).send(false);
        }
    }
}