const controladorRotas = require('express').Router();
const PostagemController = require('../controller/PostagemController');
const UsuarioController = require('../controller/UsuarioController');
const { request, response } = require('express');



//rotas de acesso postagem

//pegar todas as postagens
controladorRotas.get('/postagem', (request, response) => {
    new PostagemController().listarTodos(request, response);
});

//pegar apenas a postagem desejada
controladorRotas.get('/postagem/:idPostagem', (request, response) => {
    new PostagemController().listarPorId(request, response);
});

//cadastrar uma nova postagem
controladorRotas.post('/postagem', (request, response) => {
    new PostagemController().cadastrar(request, response);
});

//alterar informações de uma postagem em específico
controladorRotas.put('/postagem/:idPostagem', (request, response) => {
    new PostagemController().alterar(request, response);
});

//deletar uma postagem
controladorRotas.delete('/postagem/:idPostagem', (request, response) => {
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
