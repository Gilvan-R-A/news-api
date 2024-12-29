<h1 align="center">
   API de Notícias - Node.js
</h1>   

Esta é uma API desenvolvida com **Node.js, Express,** e **PostgreSQL** para gerenciar postagens em um site de notícias. Ela permite realizar operações de CRUD (Create, Read, Update, Delete) sobre postagens e também oferece funcionalidades de login de usuários.   

## Estrutura de Diretórios   

```   
news-api/
├── controller/
│   ├── PostagemController.js
│   └── UsuarioController.js
├── model/
│   ├── Postagem.js
│   └── Usuario.js
├── util/
│   ├── ConnectionFactory.js
│   └── Rotas.js
├── main.js
├── meubanco.sql
├── package.json
```   

- **controller/**: Contém os controladores para as postagens e usuários.
- **model/**: Contém as definições dos modelos de dados para postagens e usuários.
- **util/**: Contém utilitários como a fábrica de conexões com o banco e as rotas da API.
- **main.js**: Arquivo principal que configura e inicializa o servidor.
- **meubanco.sql**: Script para criar as tabelas no banco de dados PostgreSQL e inserir dados iniciais.
- **package.json**: Gerenciador de dependências e scripts do projeto.   

## Tecnologias Utilizadas   

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para criar servidores HTTP.
- **PostgreSQL**: Banco de dados relacional para armazenar dados.
- **pg**: Biblioteca para interação com PostgreSQL.
- **body-parser**: Middleware para parsing do corpo das requisições.
- **cors**: Middleware para permitir requisições CORS (Cross-Origin Resource Sharing).   


## Endpoints da API   

### Postagens   

**1. Listar todas as postagens**   

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
**2. Listar postagem por ID**   

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

**3. Cadastrar nova postagem**   

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

**4. Alterar postagem**   

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

**5. Excluir postagem**   

- **Método:** DELETE /postagem/:idPostagem
- **Descrição:** Exclui uma postagem pelo ID.
- **Parâmetros:**   
   - idPostagem: ID da postagem a ser excluída.   

- **Resposta:**   

```  
{ "success": true }
```   

## Usuários   

**1. Login de usuário**   

- **Método:** POST /usuarioLogin
- **Descrição:** Realiza o login de um usuário com email e senha.   
- **Corpo da Requisição:**   

```   
{
  "emailUsuario": "usuario@dominio.com",
  "senhaUsuario": "senha123"
}
```   

- **Resposta:**   
   - **200 OK**:   

```   
{ "msg": "Usuário logado" }
```   
- **404 Not Found:**   

```   
{ "msg": "Email ou senha inválidos" }
```   

**2. Cadastrar novo usuário**   

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
- **PostgreSQL**: Instale o PostgreSQL e configure o banco de dados conforme o arquivo meubanco.sql.   

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

3. Execute o servidor:   

```   
npm start
```   

4. A API estará disponível em **http://localhost:3000**.   
