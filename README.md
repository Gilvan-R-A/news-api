<h1 align="center">
   API de Notícias - Node.js
</h1>   

Esta é uma API desenvolvida com **Node.js, Express,** e suporte a dos bancos de dados: **PostgreSQL** (produção) e **SQLite** (modo local). Ela permite o gerenciamento de postagens de notícias e autenticação de usuários, com proteção de rotas usando **JWT**.   


## Link do Deploy (Produção)   

A API está disponível publicamente através do Render:   

https://news-api-u1bc.onrender.com

## Estrutura de Diretórios   

```   
news-api/
├── controller/
│   ├── PostagemController.js
│   └── UsuarioController.js
├── middleware/
|   └── auth.js
├── model/
│   ├── Postagem.js
│   └── Usuario.js
├── util/
│   ├── ConnectionFactory.js
│   ├── Rotas.js
|   └── ValidadorUsuario.js
├── .env
├── main.js
├── meubanco.sql
├── package.json
``` 

# Descrição dos Arquivos

- **controller/**: Controladores que contêm a lógica das rotas (Postagem e Usuário).
- **model/**: Modelos de dados.   
- **middleware/auth.js**: Middleware para proteger rotas usando token JWT.
- **util/**: 
  - **ConnectionFactory.js**: Abstrai a conexão com PostgreSQL ou SQLite.
  - **Rotas.js**: Define todas as rotas da API.
  - **ValidadorUsuario.js**: Contém as validações de email, senha e unicidade de usuário.
- **.env**: Variáveis de ambiente (JWT_SECRET, USE_SQLITE, etc).
- **main.js**: Ponto de entrada da aplicação.
- **meubanco.sql**: Script SQL para PostgreSQL.
- **package.json**: Gerenciador de dependências e scripts do projeto.   

## Tecnologias Utilizadas   

- **Node.js**: Backend em JavaScript.
- **Express**: Framework para criar servidores HTTP.
- **PostgreSQL** e **SQLite**: Bancos de dados relacionais para armazenar dados.
- **pg** e **better-sqlite3**: Para conexão com banco.
- **JWT (jsonwebtoken)**: Para autenticação.
- **body-parser**: Middleware para parsing do corpo das requisições.
- **cors**: Middleware para permitir requisições CORS (Cross-Origin Resource Sharing).   
- **dotenv** - Variáveis de ambiente   

## Autenticação JWT   

- O login de usuário retorna um **token JWT**.   
- Esse token deve ser enviado no cabeçalho **Authorization** das requisições protegidas:   

```
Authorization: Bearer SEU_TOKEN_AQUI
```   

- As seguintes rotas exigem autenticação: 

  - POST /postagem
  - PUT /postagem/:idPostagem
  - DELETE  /postagem/:idPostagem   

  
## Endpoints da API   

### Postagens   

| Método | Rota                    | Descrição                    | Ambiente         |
| ------ | ----------------------- | ---------------------------- | ---------------- |
| GET    | `/postagem`             | Listar todas as postagens    | Local e Produção |
| GET    | `/postagem/:idPostagem` | Obter postagem por ID        | Local e Produção |
| POST   | `/postagem`             | Criar nova postagem          | Local e Produção |
| PUT    | `/postagem/:idPostagem` | Atualizar postagem existente | Local e Produção |
| DELETE | `/postagem/:idPostagem` | Deletar uma postagem         | Local e Produção |

### Usuários   

| Método | Rota            | Descrição              | Ambiente         |
| ------ | --------------- | ---------------------- | ---------------- |
| POST   | `/usuario`      | Cadastrar novo usuário | Local e Produção |
| GET   | `/usuarioLogin` | Login e geração do JWT      | Local e Produção |


Para usar em produção, prefixe com https://news-api-u1bc.onrender.com   
Exemplo: https://news-api-u1bc.onrender.com/postagem   

## Validações Implementadas   

- **Email**:   
  - Formato válido (ex: usuario@dominio.com)   

- **Senha**:   

  - Mínimo 8 caracteres;
  - Letras maiúsculas e minúsculas;
  - Pelo menos um número e um caractere especial.   

- **Usuário único:   

  - Não permite duplicação de email, mesmo com IDs diferentes.   

Essas validações são centralizadas no arquivo: util/ValidadorUsuario.js .   

## Exemplo de Login   

### Requisição (POST/usuarioLogin)   

```   
{
  "emailUsuario": "admin@teste.com",
  "senhaUsuario": "123"
}
```   

### Resposta (200 OK)   

```   
{
  "msg": "Usuário logado",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```   

## Exemplos de Requisição   


**1. Cadastro de novo usuário**   

- **Método:** POST /usuario
- **Descrição:** Cadastra um novo usuário.   
- **Corpo da Requisição:**   

```   
{
  "emailUsuario": "novo@usuario.com",
  "senhaUsuario": "senha123"
}
```   

- **Resposta:**   

```   
{ "success": true }
```   


**2. Listar todas as postagens**   

- **Método: GET /postagem**
- **Descrição:** Retorna todas as postagens armazenadas.
- **Resposta:**   

```   
[
  {
    "idPostagem": 1,
    "tituloPostagem": "Primeira Postagem",
    "conteudoPostagem": "Essa é a minha primeira postagem",
    "categoriaPostagem": "teste",
    "dataPostagem": "19/08/2023"
  }
]
```   
**3. Listar postagem por ID**   

- **Método:** GET /postagem/:idPostagem
- **Descrição:** Retorna a postagem com o ID especificado.
- **Parâmetros:**
   - idPostagem: ID da postagem.   
- **Resposta:**   

```   
{
  "idPostagem": 1,
  "tituloPostagem": "Primeira Postagem",
  "conteudoPostagem": "Essa é a minha primeira postagem",
  "categoriaPostagem": "teste",
  "dataPostagem": "19/08/2023"
}
```   

**4. Cadastrar nova postagem**   

- **Método:** POST /postagem
- **Descrição:** Cadastra uma nova postagem.
- **Corpo da Requisição:**   

```   
{
  "tituloPostagem": "Título da Postagem",
  "conteudoPostagem": "Conteúdo da postagem",
  "categoriaPostagem": "Categoria",
  "dataPostagem": "19/08/2023"
}   
```   
- **Resposta:**   

```   
{ "success": true }
```   

**5. Alterar postagem**   

- **Método:** PUT /postagem/:idPostagem
- **Descrição:** Altera os dados de uma postagem existente.
- **Parâmetros:**
   - idPostagem: ID da postagem a ser alterada.   
- **Corpo da Requisição:**   

```   
{
  "tituloPostagem": "Novo Título",
  "conteudoPostagem": "Novo conteúdo",
  "categoriaPostagem": "Nova categoria",
  "dataPostagem": "27/08/2023"
}
```   

- **Resposta:**   

```   
{ "success": true }
```   

**6. Excluir postagem**   

- **Método:** DELETE /postagem/:idPostagem
- **Descrição:** Exclui uma postagem pelo ID.
- **Parâmetros:**   
   - idPostagem: ID da postagem a ser excluída.   

- **Resposta:**   

```  
{ "success": true }
```   

## Configuração do Banco de Dados   

Para configurar o banco de dados PostgreSQL, utilize o script meubanco.sql que cria as tabelas necessárias e insere um exemplo de postagem.   

1. Crie a tabela **postagem** com o seguinte comando SQL:   

```   
create table postagem(
    idPostagem serial primary key,
    tituloPostagem varchar(200) not null,
    conteudoPostagem varchar(500) not null,
    categoriaPostagem varchar(100) not null,
    dataPostagem varchar(20) not null
);
```   

2. Insira um exemplo de postagem:   

```   
insert into postagem (titulopostagem, conteudopostagem, categoriapostagem, datapostagem) 
values ('Primeira Postagem', 'Essa é a minha primeira postagem', 'teste', '19/08/2023');
```   

## Instalação e Execução   

### Requisitos   

- **Node.js**: Baixe e instale a versão mais recente do Node.js.
- **PostgreSQL**: Instale o PostgreSQL e configure o banco de dados conforme o arquivo meubanco.sql (se não for usar SQLite).   

**Passos**   

1. Clone o repositório do projeto:   

```   
git clone https://github.com/Gilvan-R-A/news-api.git
cd news-api
```   

2. Instale as dependências:   

```   
npm install
```   

3. Configure o .env:   

```   
USE_SQLITE=true             # ou false se quiser usar PostgreSQL
JWT_SECRET=sua_chave_jwt_segura
PORT=3000                   # porta local
DB_USER=...
DB_HOST=...
DB_NAME=...
DB_PASSWORD=...
DB_PORT=...
```   

4. Execute o servidor:   

```   
npm start
```   

5. A API estará disponível em **http://localhost:3000**.   

## Testes com Postman   

- **1. Criar usuário**   

  **POST** /usuario   

- **2. Fazer login**   

  **GET** /usuarioLogin   

- **3. Usar token nas rotas protegidas**   

  Copie o token do login e inclua nos headers:   

```   
Authorization: Bearer SEU_TOKEN
```   

