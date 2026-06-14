# API Projeto P1

API REST desenvolvida com Node.js, Express e Sequelize. O projeto permite usar MySQL ou PostgreSQL por meio da variavel `DB_DIALECT`.

Esta versao continua o projeto antigo e inclui as implementacoes das aulas 11 e 12, com validacoes de formularios, validacoes de duplicidade e ajustes no banco de dados para aproximar a API do diagrama do projeto final.

## Tecnologias

- Node.js
- Express
- Sequelize ORM
- MySQL ou PostgreSQL
- dotenv
- Yup
- CORS
- Nodemon

## Estrutura

```text
src/
|-- config/        # Configuracao do banco de dados
|-- controllers/   # Rotas e entrada das requisicoes
|-- entities/      # Entidades do dominio
|-- middlewares/   # Middlewares da aplicacao
|-- migrations/    # Criacao e alteracao das tabelas
|-- models/        # Models do Sequelize
|-- seeders/       # Dados iniciais
|-- services/      # Regras de negocio
|-- utils/         # Utilitarios e validacoes
|-- app.js         # Configuracao do Express
`-- server.js      # Inicializacao do servidor
```

## Requisitos

- Node.js instalado
- MySQL ou PostgreSQL instalado
- Banco de dados criado ou permissao para criar banco via Sequelize CLI

## Instalacao

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` a partir de um dos exemplos:

```bash
copy .env.example .env
```

Para MySQL, use:

```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=api_p1
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
PORT=3000
NODE_ENV=development
```

Para PostgreSQL, use:

```env
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_p1
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres
PORT=3000
NODE_ENV=development
```

## Banco de Dados

Crie o banco configurado em `DB_NAME`:

```bash
npm run db:create
```

Execute as migrations:

```bash
npm run migrate
```

Execute os seeders:

```bash
npm run seed
```

Para desfazer migrations ou seeders:

```bash
npm run migrate:undo
npm run seed:undo
```

Para recriar tudo do zero:

```bash
npm run seed:undo
npm run migrate:undo
npm run migrate
npm run seed
```

## Alteracoes das Aulas 11 e 12

### Banco de dados conforme o diagrama

Foram adicionadas duas migrations:

- `20240101000006-alter-users-add-password-recover-password.js`
- `20240101000007-alter-products-add-slug-description-price.js`

Essas migrations adicionam os campos abaixo.

Tabela `users`:

- `password`
- `recoverPassword`

Tabela `products`:

- `slug`
- `description`
- `price`

### Models atualizados

Foram atualizados:

- `src/models/User.js`
- `src/models/Product.js`

### Validacao de formularios

Foram adicionadas validacoes em:

- Usuarios
- Produtos
- Categorias
- Situacoes
- Situacoes de produto

Exemplos de validacao:

- Campo obrigatorio
- E-mail valido
- Senha com no minimo 6 caracteres
- Preco maior que zero
- IDs numericos validos

### Validacao de duplicidade

Foram adicionadas validacoes para impedir:

- Usuario com e-mail duplicado
- Categoria duplicada
- Situacao duplicada
- Situacao de produto duplicada
- Produto com slug duplicado

### Arquivos utilitarios criados

- `src/utils/validation.js`
- `src/utils/slugify.js`

## Executando

Ambiente de desenvolvimento:

```bash
npm run dev
```

Ambiente normal:

```bash
npm start
```

Por padrao, a API roda em:

```text
http://localhost:3000
```

Rota inicial:

```http
GET /
```

## Scripts

| Script | Descricao |
| --- | --- |
| `npm start` | Inicia a API com Node |
| `npm run dev` | Inicia a API com Nodemon |
| `npm run db:create` | Cria o banco configurado |
| `npm run db:drop` | Remove o banco configurado |
| `npm run migrate` | Executa as migrations |
| `npm run migrate:undo` | Desfaz todas as migrations |
| `npm run seed` | Executa os seeders |
| `npm run seed:undo` | Desfaz todos os seeders |

## Rotas

Todas as rotas principais usam o prefixo `/api`.

### Usuarios

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/usuarios` | Lista usuarios |
| GET | `/api/usuarios/:id` | Busca usuario por ID |
| POST | `/api/usuarios` | Cria usuario |
| PUT | `/api/usuarios/:id` | Atualiza usuario |
| DELETE | `/api/usuarios/:id` | Remove usuario |

### Produtos

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/produtos` | Lista produtos |
| GET | `/api/produtos/:id` | Busca produto por ID |
| POST | `/api/produtos` | Cria produto |
| PUT | `/api/produtos/:id` | Atualiza produto |
| DELETE | `/api/produtos/:id` | Remove produto |

### Categorias

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/categorias` | Lista categorias |
| GET | `/api/categorias/:id` | Busca categoria por ID |
| POST | `/api/categorias` | Cria categoria |
| PUT | `/api/categorias/:id` | Atualiza categoria |
| DELETE | `/api/categorias/:id` | Remove categoria |

### Situacoes

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/situacoes` | Lista situacoes |
| GET | `/api/situacoes/:id` | Busca situacao por ID |
| POST | `/api/situacoes` | Cria situacao |
| PUT | `/api/situacoes/:id` | Atualiza situacao |
| DELETE | `/api/situacoes/:id` | Remove situacao |

### Situacoes de Produto

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/situacoes-produto` | Lista situacoes de produto |
| GET | `/api/situacoes-produto/:id` | Busca situacao de produto por ID |
| POST | `/api/situacoes-produto` | Cria situacao de produto |
| PUT | `/api/situacoes-produto/:id` | Atualiza situacao de produto |
| DELETE | `/api/situacoes-produto/:id` | Remove situacao de produto |

### Teste para Front-End

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/teste-frontend` | Testa a conexao entre front-end e API |

## Paginacao

As rotas de listagem aceitam os parametros `page` e `limit`:

```http
GET /api/produtos?page=1&limit=10
```

Formato da resposta:

```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

## Exemplos de Requisicao

Criar usuario:

```json
{
  "name": "Wilson Neto",
  "email": "wilson@email.com",
  "password": "123456",
  "situationId": 1
}
```

Criar produto:

```json
{
  "name": "Mouse Gamer",
  "description": "Mouse gamer com iluminacao RGB.",
  "price": 149.9,
  "productSituationId": 1,
  "productCategoryId": 1
}
```

Criar usuario com erro de validacao:

```json
{
  "name": "",
  "email": "email-invalido",
  "password": "123",
  "situationId": "abc"
}
```

Criar produto com slug manual:

```json
{
  "name": "Teclado Mecanico",
  "slug": "teclado-mecanico",
  "description": "Teclado mecanico para jogos e programacao.",
  "price": 299.9,
  "productSituationId": 1,
  "productCategoryId": 1
}
```

Criar categoria, situacao ou situacao de produto:

```json
{
  "name": "Ativo"
}
```

## Validacoes

A API usa Yup para validar os dados recebidos nas rotas de criacao e atualizacao. Tambem possui validacoes para:

- Campos obrigatorios
- E-mail valido
- Preco valido
- IDs numericos
- Duplicidade de e-mail, slug, categoria e situacao
- Existencia de relacionamentos antes de criar ou atualizar registros

## CORS

O CORS esta habilitado globalmente em `src/app.js` com `app.use(cors())`, permitindo que o front-end faca requisicoes para a API.

## Observacoes

- O campo `slug` do produto pode ser enviado manualmente. Se nao for enviado, sera gerado a partir do `name`.
- As senhas ainda sao salvas sem criptografia nesta etapa do projeto.
- Os dados sensiveis `password` e `recoverPassword` nao sao retornados nas consultas de usuarios.

## Proximos Passos

O proximo passo e a Aula 13: requisicao externa, CORS e rota de teste para frontend.

Depois seguem:

- Aula 14: CRUD de Users
- Aula 15: Alter table com Migration
- Aula 16: Criptografia de senha
- Aula 17: Login
- Aula 18: Rota restrita e validacao de token
