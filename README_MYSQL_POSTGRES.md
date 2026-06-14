# Projeto P1 - MySQL e PostgreSQL

Este projeto agora pode rodar com **MySQL** ou **PostgreSQL** usando a variável `DB_DIALECT` no arquivo `.env`.

## Rotas principais

As rotas usam o prefixo `/api` e os nomes em português:

- `GET http://localhost:3000/api/usuarios`
- `GET http://localhost:3000/api/produtos`
- `GET http://localhost:3000/api/categorias`
- `GET http://localhost:3000/api/situacoes`
- `GET http://localhost:3000/api/situacoes-produto`

A rota raiz continua sendo:

- `GET http://localhost:3000/`

## Rodar com MySQL

1. Copie o exemplo:

```bash
cp .env.mysql.example .env
```

2. Edite o `.env`:

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

3. Crie o banco no MySQL:

```sql
CREATE DATABASE IF NOT EXISTS api_p1;
```

4. Rode:

```bash
npm install
npm run migrate
npm run seed
npm run dev
```

## Rodar com PostgreSQL

1. Copie o exemplo:

```bash
cp .env.postgres.example .env
```

No PowerShell, use:

```powershell
copy .env.postgres.example .env
```

2. Edite o `.env`:

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

3. Crie o banco no pgAdmin ou no Query Tool:

```sql
CREATE DATABASE api_p1;
```

4. Rode:

```bash
npm install
npm run migrate
npm run seed
npm run dev
```

## Trocar de banco

Para trocar entre MySQL e PostgreSQL, altere apenas o `.env`:

```env
DB_DIALECT=mysql
DB_PORT=3306
DB_USER=root
```

ou:

```env
DB_DIALECT=postgres
DB_PORT=5432
DB_USER=postgres
```

Depois use um banco vazio e rode novamente:

```bash
npm run migrate
npm run seed
npm run dev
```

## Observação importante

MySQL e PostgreSQL não compartilham o mesmo banco. Cada um precisa ter seu próprio banco `api_p1` criado no respectivo gerenciador.
