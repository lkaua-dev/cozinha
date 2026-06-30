# Estrutura do Projeto

Este documento explica onde cada parte do projeto fica e o que cada arquivo faz.

## Visão geral

```text
.
|-- README.md
|-- requirements.txt
|-- banco.sql
|-- docs/
|   |-- INSTALACAO.md
|   |-- COMO-USAR.md
|   |-- DASHBOARD.md
|   |-- ESTRUTURA.md
|   |-- FUNCIONALIDADES.md
|   |-- GUIA-DE-MANUTENCAO.md
|   |-- AGRADECIMENTOS.md
|   |-- assets/
|   `-- CHANGELOG.md
`-- cozinha/
    |-- backend/
    |   |-- main.py
    |   |-- requirements.txt
    |   |-- .env.example
    |   `-- app/
    |       `-- database.py
    `-- frontend/
        |-- index.html
        |-- login.html
        |-- recuperar.html
        |-- dashboard.html
        |-- css/
        |-- js/
        `-- assets/
```

## Raiz

### `README.md`

Porta de entrada do projeto. Explica o objetivo, o começo rápido, onde fica a documentação e quais partes existem.

### `requirements.txt`

Lista as dependências diretas do backend Flask. Existe também um `requirements.txt` dentro de `cozinha/backend`; mantenha os dois alinhados enquanto os dois existirem.

### `banco.sql`

Script inicial do MySQL para desenvolvimento local. Cria:

- Banco `cozinha`.
- Tabela `usuarios`.
- Tabela `estoque`.
- Usuário demo.
- Itens iniciais de estoque.

## Documentação

### `docs/INSTALACAO.md`

Passo a passo para baixar o projeto, criar `.venv`, instalar dependências, criar `.env`, preparar MySQL e rodar frontend/backend.

### `docs/COMO-USAR.md`

Guia de uso da interface depois que o sistema já está rodando.

### `docs/DASHBOARD.md`

Explica fontes de dados, normalização, cálculos e atualização visual dos indicadores.

### `docs/FUNCIONALIDADES.md`

Lista as funcionalidades existentes por área.

### `docs/GUIA-DE-MANUTENCAO.md`

Orienta como alterar o projeto sem quebrar IDs, classes, seletores e fluxos importantes.

### `docs/AGRADECIMENTOS.md`

Registra o contexto do Saga SENAI, a demanda real da Kantine Gastronomia, a participacao da equipe TecnoByte e a abertura do código para estudos e melhorias.

### `docs/assets/`

Guarda recursos visuais usados pela documentação, como o banner local da página de agradecimentos.

### `docs/CHANGELOG.md`

Registra mudanças relevantes na documentação e no projeto.

## Backend

Pasta:

```text
cozinha/backend
```

### `main.py`

Aplicação Flask. Responsavel por:

- Criar a API.
- Habilitar CORS.
- Expor rota de saúde.
- Realizar login via tabela `usuarios`.
- Listar, criar, atualizar e excluir itens de estoque.
- Fornecer dados resumidos para dashboard.

Rotas principais:

- `GET /health`
- `POST /login`
- `GET /estoque`
- `GET /estoque/<id>`
- `POST /estoque`
- `PUT /estoque/<id>`
- `DELETE /estoque/<id>`
- `GET /dashboard/resumo`
- `GET /dashboard/itens`
- `GET /dashboard/alertas`
- `GET /dashboard/progresso`

### `app/database.py`

Centraliza conexão com MySQL:

- Carrega variaveis do `.env`.
- Monta `DB_CONFIG`.
- Abre conexoes.
- Entrega cursor com context manager.
- Executa consultas simples.

Variaveis esperadas:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`

### `.env.example`

Modelo de configuracao local. Deve ser copiado para `.env`.

O `.env` real não deve ser enviado para o Git.

## Frontend

Pasta:

```text
cozinha/frontend
```

### `index.html`

Página pública inicial. Contem apresentacao, metas, equipe e chamada para login.

Arquivos relacionados:

- `css/index.css`
- `js/index.js`

### `login.html`

Tela de entrada. Usa credenciais demo e também tenta autenticar no backend Flask.

Arquivos relacionados:

- `css/style_geral.css`
- `js/login_geral.js`

### `recuperar.html`

Tela informativa de recuperação de acesso.

### `dashboard.html`

Painel administrativo principal. Concentra:

- Dashboard.
- Produção.
- Estoque.
- Cardápio / PCP.
- Kanban.
- POPs e Fichas.
- Curva ABC.
- CMV e Custos.
- Relatórios.
- Configurações.

Também contém CSS e JavaScript inline. Isso facilita abrir como arquivo único, mas torna o arquivo grande. Alterações devem ser localizadas e testadas.

## Assets

Pasta:

```text
cozinha/frontend/assets
```

Guarda imagens e arquivos estáticos do frontend.

As imagens enviadas pelo usuário no cardápio não sao salvas nessa pasta. Elas sao convertidas para base64 e salvas no `localStorage`.

## Dados locais

O frontend usa `localStorage` para estado local:

- Login.
- Usuário atual.
- Cardápio.
- Pedidos/produtos quando existirem.
- Tema.
- Idioma.
- Sidebar recolhida.
- Ultima página aberta.

Isso significa que os dados ficam no navegador usado. Limpar o armazenamento local remove esses dados.
