const ConnectionFactory = require("../util/ConnectionFactory");
const Usuario = require("../model/Usuario");
const ValidadorUsuario = require("../util/ValidadorUsuario");

module.exports = class UsuarioController {
  constructor() {
    this.conexao = ConnectionFactory.getConnection();
    this.isSQLite = typeof this.conexao.prepare === "function";
  }

  async logar(request, response) {
    try {
      const usuario = new Usuario(
        null,
        request.body.emailUsuario,
        request.body.senhaUsuario
      );

      if (this.isSQLite) {
   
        const row = this.conexao
          .prepare(
            `
                    SELECT * FROM usuario WHERE emailUsuario = ? AND senhaUsuario = ?`
          )
          .get(usuario.emailUsuario, usuario.senhaUsuario);

        if (row) {
          return response.status(200).json({ msg: "Usuário logado" });
        } else {
          return response.status(404).json({ msg: "Email ou senha inválidos" });
        }
      } else {
        const resultado = await this.conexao.query(
          "SELECT * FROM usuario WHERE emailusuario = $1 and senhausuario = $2",
          [usuario.emailUsuario, usuario.senhaUsuario]
        );

        if (resultado.rowCount > 0) {
          response.status(200).json({ msg: "Usuário logado" });
        } else {
          response.status(404).json({ msg: "Email ou senha inválidos" });
        }
      }
    } catch (error) {
      console.error(`Erro ao fazer login!! Erro: ${error}`);
      response.status(404).send(false);
    }
  }

    async cadastrar(request, response) {
    try {
      const usuario = new Usuario(
        null,
        request.body.emailUsuario,
        request.body.senhaUsuario
      );

      if (!ValidadorUsuario.validaEmail(usuario.emailUsuario)) {
        return response.status(400).json({msg: "Email inválido"});
      }

      if (!ValidadorUsuario.validaSenha(usuario.senhaUsuario)) {
        return response.status(400).json({
          msg: "A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
        });
      }

      const existe = await ValidadorUsuario.usuarioJaExiste(
        this.conexao, 
        usuario.emailUsuario, 
        this.isSQLite
      );

      if (existe) {
        return response.status(409).json({msg: "Usuário com este e-mail já existe"});
      }

      if (this.isSQLite) {
        this.conexao.prepare(`
          INSERT INTO usuario (emailUsuario, senhaUsuario) VALUES (?, ?) 
          `).run(usuario.emailUsuario, usuario.senhaUsuario);
      } else {
        await this.conexao.query(
        `INSERT INTO usuario(emailusuario, senhausuario) VALUES ($1, $2)`,
        [usuario.emailUsuario, usuario.senhaUsuario]
      );
      }

      return response.status(201).send(true);
    } catch (error) {
      console.error(`Erro ao cadastrar usuário!! Erro: ${error}`);
      response.status(404).send(false);
    }
  }

};
