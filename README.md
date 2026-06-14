# API de Gerenciamento de Produtos e Usuários

Projeto desenvolvido na disciplina de **Desenvolvimento Web 2**.

A aplicação consiste em uma API REST criada com Node.js, Express, TypeScript e Sequelize. O sistema permite gerenciar usuários, produtos, categorias e situações, além de possuir autenticação e proteção de rotas por token.

## Funcionalidades

* Cadastro, consulta, atualização e exclusão de usuários;
* Cadastro, consulta, atualização e exclusão de produtos;
* Gerenciamento de categorias e situações;
* Login de usuários;
* Autenticação por token;
* Proteção de rotas;
* Criptografia de senhas;
* Recuperação de senha;
* Validação dos dados recebidos;
* Paginação de resultados;
* Suporte aos bancos MySQL e PostgreSQL.

## Tecnologias utilizadas

* Node.js;
* Express;
* TypeScript;
* Sequelize;
* MySQL;
* PostgreSQL;
* Yup;
* Nodemailer;
* CORS.

## Como executar

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o arquivo `.env`

Informe no arquivo `.env` os dados de conexão com o banco de dados e as demais configurações da aplicação.

### 3. Crie e configure o banco de dados

```bash
npm run db:create
npm run migrate
npm run seed
```

### 4. Inicie o projeto

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

## Testes

As rotas da API podem ser testadas utilizando o Postman. O projeto possui uma collection pronta para importação:

```text
API_Projeto_P1_Postman_Collection.json
```
