const controladorRotas = require('express').Router();
const PostagemController = require('../controller/PostagemController');
const UsuarioController = require('../controller/UsuarioController');
const { request, response } = require('express');
const verificarToken = require('../middleware/auth');


controladorRotas.get('/postagem', (request, response) => {
    new PostagemController().listarTodos(request, response);
});

controladorRotas.get('/postagem/:idPostagem', (request, response) => {
    new PostagemController().listarPorId(request, response);
});

controladorRotas.post('/postagem', verificarToken, (request, response) => {
    new PostagemController().cadastrar(request, response);
});

controladorRotas.put('/postagem/:idPostagem', verificarToken, (request, response) => {
    new PostagemController().alterar(request, response);
});

controladorRotas.delete('/postagem/:idPostagem', verificarToken, (request, response) => {
    new PostagemController().excluir(request, response);
});

//rotas de acesso ao Usuario
controladorRotas.get('/usuarioLogin', (request, response) => {
    new UsuarioController().logar(request, response);
});

controladorRotas.post('/usuario', (request, response) => {
    new UsuarioController().cadastrar(request, response);
});

module.exports = controladorRotas;
