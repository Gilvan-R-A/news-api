//variaveis do servidor base
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const rotas = require('./util/Rotas');

const cors = require('cors');

const app = express();
const porta = process.env.PORT || 3000;


//configurando o servidor
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors({ origin: '*' }));
app.use(rotas);

//start no servidor
app.listen(porta, ()=>{
    console.log(`Servidor rodando no endereço: http://localhost:${porta}/`);
});