const express = require('express');
const router = express.Router();
const PostagemController = require('../controller/PostagemController');
const UsuarioController = require('../controller/UsuarioController');
const verificarToken = require('../middleware/auth');

const postagemController = new PostagemController();
const usuarioController = new UsuarioController();

router.get('/postagens', postagemController.listarTodos.bind(postagemController));
router.get('/postagens/:id', postagemController.listarPorId.bind(postagemController));
router.post('/postagens', verificarToken, postagemController.cadastrar.bind(postagemController));
router.put('/postagens/:id', verificarToken, postagemController.alterar.bind(postagemController));
router.delete('/postagens/:id', verificarToken, postagemController.excluir.bind(postagemController));

router.post('/usuarios', usuarioController.cadastrar.bind(usuarioController));
router.post('/usuarios/login', usuarioController.logar.bind(usuarioController));

module.exports = router;
