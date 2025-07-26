const ConnectionFactory = require("../util/ConnectionFactory");
const Usuario = require("../model/Usuario");
const ValidadorUsuario = require("../util/ValidadorUsuario");
const jwt = require("jsonwebtoken");

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

      let usuarioEncontrado = null;

      if (this.isSQLite) {
        usuarioEncontrado = this.conexao
          .prepare(`
           SELECT * FROM usuario WHERE emailUsuario = ? AND senhaUsuario = ?
           `)
           .get(usuario.emailUsuario, usuario.senhaUsuario);
      } else {
        const resultado = await this.conexao.query(
          "SELECT * FROM usuario WHERE emailUsuario = $1 AND senhaUsuario = $2", 
          [usuario.emailUsuario, usuario.senhaUsuario]
        );
        usuarioEncontrado = resultado.rowCount > 0 ? resultado.rows[0] : null;
      }

      if (usuarioEncontrado) {
        const token = jwt.sign(
          { email: usuario.emailUsuario}, 
          process.env.JWT_SECRET, 
          { expiresIn: "1h"}
        );

        return response.status(200).json({
          success: true, 
          msg: "Usuário logado", 
          token
        });
      } else {
        return response.status(401).json({
          success: false, 
          error: "Email ou senha inválidos"
        });
      }

    } catch (error) {
      console.error(`Erro ao fazer login!! Erro: ${error}`);
      return response.status(500).json({
        success: false, 
        error: "Erro interno ao tentar fazer login"
      });
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
        return response.status(409).json({ success: false, error: "Usuário com este e-mail já existe"});
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

      return response.status(201).json({ success: true});
    } catch (error) {
      console.error(`Erro ao cadastrar usuário!! Erro: ${error}`);
      return response.status(500).json({ success: false, error: "Erro ao cadastrar usuário" });
    }
  }

};
