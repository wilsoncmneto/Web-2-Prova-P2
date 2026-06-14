# API REST para Gerenciamento de Produtos e Usuários

Este projeto consiste no desenvolvimento de uma API REST para gerenciamento de usuários, produtos, categorias e situações. A aplicação foi desenvolvida com Node.js, Express, TypeScript e Sequelize, permitindo a utilização dos bancos de dados MySQL ou PostgreSQL.

O objetivo do projeto é demonstrar a construção de um back-end organizado, com operações de cadastro, consulta, atualização e exclusão de dados, além de autenticação de usuários, validação de informações, recuperação de senha e controle de acesso a rotas restritas.

## Funcionalidades

**Gerenciamento de usuários:** permite cadastrar, listar, consultar, atualizar e excluir usuários.

**Gerenciamento de produtos:** disponibiliza operações completas de cadastro, consulta, atualização e exclusão de produtos.

**Gerenciamento de categorias:** permite organizar os produtos por diferentes categorias.

**Gerenciamento de situações:** controla as situações relacionadas aos usuários, como ativo ou inativo.

**Gerenciamento de situações de produtos:** permite definir o estado de cada produto dentro do sistema.

**Autenticação de usuários:** possibilita realizar login utilizando e-mail e senha.

**Proteção de rotas:** utiliza token de autenticação para controlar o acesso às rotas restritas da aplicação.

**Criptografia de senhas:** as senhas dos usuários são armazenadas de forma protegida no banco de dados.

**Recuperação de senha:** permite gerar uma chave de recuperação, enviar um e-mail ao usuário e cadastrar uma nova senha.

**Validação de dados:** verifica campos obrigatórios, formato de e-mail, tamanho da senha, valores numéricos e outros dados recebidos pela API.

**Validação de duplicidade:** impede o cadastro de usuários com o mesmo e-mail, produtos com o mesmo slug e categorias ou situações duplicadas.

**Geração automática de slug:** cria automaticamente um identificador amigável para cada produto com base em seu nome.

**Paginação de resultados:** as rotas de listagem permitem controlar a página e a quantidade de registros retornados.

**Integração com o front-end:** possui configuração de CORS e uma rota específica para testar a comunicação entre o front-end e a API.

**Suporte a diferentes bancos de dados:** o projeto pode ser configurado para funcionar com MySQL ou PostgreSQL.

## Tecnologias Utilizadas

* Node.js;
* Express;
* TypeScript;
* Sequelize ORM;
* MySQL;
* PostgreSQL;
* Yup;
* CORS;
* Nodemailer;
* dotenv;
* Nodemon.

## Estrutura do Projeto

`/src/config`: contém as configurações de conexão com o banco de dados.

`/src/controllers`: contém as rotas da API e o tratamento das requisições HTTP.

`/src/entities`: contém as entidades utilizadas para representar os dados do sistema.

`/src/middlewares`: contém os intermediários responsáveis pela autenticação e pelo tratamento de erros.

`/src/migrations`: contém os arquivos responsáveis pela criação e alteração das tabelas do banco de dados.

`/src/models`: contém os modelos do Sequelize e os relacionamentos entre as tabelas.

`/src/seeders`: contém os dados iniciais utilizados para preencher o banco de dados.

`/src/services`: contém as regras de negócio, paginação, envio de e-mails e demais serviços da aplicação.

`/src/utils`: contém funções auxiliares de validação, geração de slug, criptografia de senha e autenticação.

`src/app.ts`: configura o Express, os middlewares e as rotas da aplicação.

`src/server.ts`: inicia o servidor da API.

`.env`: contém as configurações do ambiente, banco de dados, autenticação e servidor de e-mail.

## Como Executar o Projeto

Antes de iniciar, certifique-se de que o Node.js e um dos bancos de dados compatíveis, MySQL ou PostgreSQL, estejam instalados no computador.

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Crie ou edite o arquivo `.env` na pasta principal do projeto.

Exemplo de configuração para PostgreSQL:

```env
APP_NAME=API_P1
PORT=3000
NODE_ENV=development

DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_p1
DB_USER=postgres
DB_PASSWORD=sua_senha

AUTH_TOKEN_SECRET=sua_chave_secreta
```

Exemplo de configuração para MySQL:

```env
APP_NAME=API_P1
PORT=3000
NODE_ENV=development

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=api_p1
DB_USER=root
DB_PASSWORD=sua_senha

AUTH_TOKEN_SECRET=sua_chave_secreta
```

### 3. Crie o banco de dados

```bash
npm run db:create
```

### 4. Execute as migrations

```bash
npm run migrate
```

### 5. Execute os seeders

```bash
npm run seed
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Para executar a versão compilada do projeto, utilize:

```bash
npm run build
npm start
```

### 7. Acesse a API

Após iniciar o servidor, a API estará disponível no endereço:

```text
http://localhost:3000
```

Para verificar se a aplicação está funcionando, acesse:

```text
http://localhost:3000
```

A resposta esperada será:

```json
{
  "message": "API Projeto P1 - Funcionando"
}
```

## Principais Rotas

### Autenticação

```http
POST /api/login
POST /api/recuperar-senha
POST /api/validar-recuperar-senha
PUT /api/atualizar-senha
GET /api/validar-token
GET /api/rota-restrita
```

### Usuários

```http
POST /api/novo-usuario
GET /api/usuarios
GET /api/usuarios/:id
POST /api/usuarios
PUT /api/usuarios/:id
DELETE /api/usuarios/:id
```

### Produtos

```http
GET /api/produtos
GET /api/produtos/:id
POST /api/produtos
PUT /api/produtos/:id
DELETE /api/produtos/:id
```

### Categorias

```http
GET /api/categorias
GET /api/categorias/:id
POST /api/categorias
PUT /api/categorias/:id
DELETE /api/categorias/:id
```

### Situações

```http
GET /api/situacoes
GET /api/situacoes/:id
POST /api/situacoes
PUT /api/situacoes/:id
DELETE /api/situacoes/:id
```

### Situações de produtos

```http
GET /api/situacoes-produto
GET /api/situacoes-produto/:id
POST /api/situacoes-produto
PUT /api/situacoes-produto/:id
DELETE /api/situacoes-produto/:id
```

### Teste de integração com o front-end

```http
GET /api/teste-frontend
```

## Paginação

As rotas de listagem permitem utilizar os parâmetros `page` e `limit`.

Exemplo:

```http
GET /api/produtos?page=1&limit=10
```

Essa requisição retorna a primeira página com até dez produtos, além de informações como total de registros, número de páginas e disponibilidade das páginas anterior e seguinte.

## Testes da API

As rotas podem ser testadas utilizando o Postman. O projeto possui o arquivo:

```text
API_Projeto_P1_Postman_Collection.json
```

Esse arquivo pode ser importado no Postman para testar as rotas de autenticação, usuários, produtos, categorias, situações e rotas restritas.
