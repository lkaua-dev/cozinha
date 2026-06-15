# Estrutura do Projeto

Este documento explica a organizacao de pastas e arquivos do projeto Cozinha.

## Visao geral

```text
.
├── README.md
├── requirements.txt
├── banco.sql
├── docs/
└── cozinha/
    ├── backend/
    ├── docs/
    └── frontend/
```

## Raiz do projeto

### `README.md`

Arquivo inicial da documentacao. Explica o objetivo do sistema, como abrir o projeto, quais tecnologias sao usadas e onde encontrar os documentos detalhados.

### `requirements.txt`

Lista parte das dependencias Python usadas pelo backend Flask. O backend tambem importa `flask_cors` e `mysql.connector`, entao um ambiente limpo pode precisar de `flask-cors` e `mysql-connector-python`.

### `banco.sql`

Arquivo reservado para scripts de banco de dados. Atualmente esta vazio.

### `docs/`

Pasta criada para documentacao tecnica e de uso do projeto.

Arquivos:

- `COMO-USAR.md`: guia pratico para abrir, acessar e usar o sistema.
- `DASHBOARD.md`: explica indicadores, fontes de dados e calculos do dashboard.
- `ESTRUTURA.md`: este arquivo.
- `FUNCIONALIDADES.md`: descreve as funcionalidades por area.
- `GUIA-DE-MANUTENCAO.md`: orienta alteracoes futuras sem quebrar o sistema.
- `CHANGELOG.md`: registra as mudancas feitas nesta etapa de documentacao.

## `cozinha/backend/`

Backend Flask opcional usado para login e estoque.

### `cozinha/backend/main.py`

Arquivo principal do backend. Responsavel por:

- Criar a aplicacao Flask.
- Habilitar CORS.
- Gerar e validar tokens em memoria.
- Expor rota `POST /login`.
- Expor rota `POST /logout`.
- Expor rotas de estoque:
  - `GET /estoque`
  - `POST /estoque`
  - `DELETE /estoque/<id>`

Os tokens ficam apenas em memoria. Ao reiniciar o backend, os tokens antigos deixam de existir.

### `cozinha/backend/app/database.py`

Helper de conexao MySQL. Centraliza:

- Dados de conexao.
- Abertura e fechamento de conexao.
- Execucao de consultas.
- Retorno de resultados como dicionario.

## `cozinha/frontend/`

Frontend principal do sistema. Usa HTML, CSS e JavaScript puro.

### `cozinha/frontend/index.html`

Pagina publica inicial. Contem:

- Cabecalho.
- Menu de navegacao.
- Hero de apresentacao.
- Area de metas.
- Area de colaboradores/equipe.
- Referencia ao CSS `css/index.css`.
- Referencia ao JavaScript `js/index.js`.

### `cozinha/frontend/login.html`

Tela de login. Contem:

- Painel visual lateral.
- Formulario de acesso.
- Campos de usuario/e-mail e senha.
- Botao para mostrar/ocultar senha.
- Link para recuperar acesso.
- Referencia ao CSS compartilhado `css/style_geral.css`.
- Referencia ao JavaScript `js/login_geral.js`.

### `cozinha/frontend/recuperar.html`

Tela de recuperacao de acesso. Atualmente funciona como pagina informativa com instrucoes de contato administrativo.

### `cozinha/frontend/dashboard.html`

Arquivo central do painel administrativo. Ele concentra:

- HTML das secoes internas.
- CSS inline do dashboard e das telas internas.
- JavaScript principal do sistema.
- Modais de cadastro.
- Logica de navegacao interna.
- Calculos do dashboard.
- Persistencia de cardapio em `localStorage`.
- Upload e previa de imagem do cardapio.
- Integracao visual do estoque com fallback demonstrativo.

Secoes principais:

- `section-dashboard`: visao geral do negocio.
- `section-estoque`: controle de estoque.
- `section-cardapio`: cardapio semanal.
- `section-kanban`: fluxo de processos.
- `section-pops`: POPs e fichas tecnicas.
- `section-analises-abc`: analise ABC.
- `section-analises-cmv`: analise de CMV e custos.
- `section-relatorios`: relatorios.
- `section-configuracoes`: preferencias e logout.

### `cozinha/frontend/css/index.css`

Estilos da pagina publica:

- Variaveis de cor e tipografia.
- Header.
- Menu desktop/mobile.
- Hero.
- Cards de metas.
- Equipe.
- Responsividade da pagina inicial.
- Ajustes visuais alinhados ao dashboard.

### `cozinha/frontend/css/style_geral.css`

Base visual compartilhada pelas telas de autenticacao:

- Variaveis visuais.
- Reset.
- Botoes.
- Campos de formulario.
- Toasts.
- Estados de erro.
- Responsividade basica.

### `cozinha/frontend/js/index.js`

Interacoes da pagina publica:

- Troca de secoes internas.
- Menu mobile.
- Barra de progresso de rolagem.
- Animacoes de entrada.
- Animacao de barras de progresso.
- Efeito ripple em botoes.

### `cozinha/frontend/js/login_geral.js`

Controle da autenticacao:

- Verifica se ja existe token no `localStorage`.
- Valida campos do formulario.
- Mostra toasts.
- Autentica credenciais demo.
- Tenta autenticar no backend Flask.
- Salva token e usuario.
- Redireciona para `dashboard.html`.
- Alterna visibilidade da senha.

## `cozinha/frontend/assets/`

Pasta de recursos estaticos.

### `cozinha/frontend/assets/img/`

Contem imagens usadas pela pagina publica, como imagem do time e fotos dos membros.

As imagens enviadas pelo usuario no cardapio nao sao salvas nessa pasta. Elas sao convertidas para base64 e salvas no `localStorage` dentro da chave `cozinha-cardapio-itens`.

## `cozinha/docs/diagramas/`

Pasta antiga/reservada para diagramas internos. Atualmente contem apenas arquivo placeholder.
