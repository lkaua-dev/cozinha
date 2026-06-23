# Estrutura do Projeto

Este documento explica a organização de pastas e arquivos do projeto Cozinha.

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

Arquivo inicial da documentação. Explica o objetivo do sistema, como abrir o projeto, quais tecnologias são usadas e onde encontrar os documentos detalhados.

### `requirements.txt`

Lista parte das dependências Python usadas pelo backend Flask. O backend também importa `flask_cors` e `mysql.connector`, então um ambiente limpo pode precisar de `flask-cors` e `mysql-connector-python`.

### `banco.sql`

Arquivo reservado para scripts de banco de dados. Atualmente está vazio.

### `docs/`

Pasta criada para documentação técnica e de uso do projeto.

Arquivos:

- `COMO-USAR.md`: guia pratico para abrir, acessar e usar o sistema.
- `DASHBOARD.md`: explica indicadores, fontes de dados e cálculos do dashboard.
- `ESTRUTURA.md`: este arquivo.
- `FUNCIONALIDADES.md`: descreve as funcionalidades por área.
- `GUIA-DE-MANUTENCAO.md`: orienta alterações futuras sem quebrar o sistema.
- `CHANGELOG.md`: registra as mudanças feitas nesta etapa de documentação.

## `cozinha/backend/`

Backend Flask opcional usado para login e estoque.

### `cozinha/backend/main.py`

Arquivo principal do backend. Responsavel por:

- Criar a aplicacao Flask.
- Habilitar CORS.
- Gerar e validar tokens em memória.
- Expor rota `POST /login`.
- Expor rota `POST /logout`.
- Expor rotas de estoque:
  - `GET /estoque`
  - `POST /estoque`
  - `DELETE /estoque/<id>`

Os tokens ficam apenas em memória. Ao reiniciar o backend, os tokens antigos deixam de existir.

### `cozinha/backend/app/database.py`

Helper de conexão MySQL. Centraliza:

- Dados de conexão.
- Abertura e fechamento de conexão.
- Execução de consultas.
- Retorno de resultados como dicionário.

## `cozinha/frontend/`

Frontend principal do sistema. Usa HTML, CSS e JavaScript puro.

### `cozinha/frontend/index.html`

Página pública inicial. Contém:

- Cabeçalho.
- Menu de navegação.
- Hero de apresentação.
- Área de metas.
- Área de colaboradores/equipe.
- Referência ao CSS `css/index.css`.
- Referência ao JavaScript `js/index.js`.

### `cozinha/frontend/login.html`

Tela de login. Contém:

- Painel visual lateral.
- Formulário de acesso.
- Campos de usuário/e-mail e senha.
- Botão para mostrar/ocultar senha.
- Link para recuperar acesso.
- Referência ao CSS compartilhado `css/style_geral.css`.
- Referência ao JavaScript `js/login_geral.js`.

### `cozinha/frontend/recuperar.html`

Tela de recuperação de acesso. Atualmente funciona como página informativa com instruções de contato administrativo.

### `cozinha/frontend/dashboard.html`

Arquivo central do painel administrativo. Ele concentra:

- HTML das seções internas.
- CSS inline do dashboard e das telas internas.
- JavaScript principal do sistema.
- Modais de cadastro.
- Lógica de navegação interna.
- Calculos do dashboard.
- Persistencia de cardápio em `localStorage`.
- Upload e prévia de imagem do cardápio.
- Integração visual do estoque com fallback demonstrativo.

Secoes principais:

- `section-dashboard`: visão geral do negócio.
- `section-estoque`: controle de estoque.
- `section-cardapio`: cardápio semanal.
- `section-kanban`: fluxo de processos.
- `section-pops`: POPs e fichas técnicas.
- `section-analises-abc`: análise ABC.
- `section-analises-cmv`: análise de CMV e custos.
- `section-relatorios`: relatórios.
- `section-configuracoes`: preferências e logout.

### `cozinha/frontend/css/index.css`

Estilos da página pública:

- Variáveis de cor e tipografia.
- Header.
- Menu desktop/mobile.
- Hero.
- Cards de metas.
- Equipe.
- Responsividade da página inicial.
- Ajustes visuais alinhados ao dashboard.

### `cozinha/frontend/css/style_geral.css`

Base visual compartilhada pelas telas de autenticação:

- Variáveis visuais.
- Reset.
- Botões.
- Campos de formulário.
- Toasts.
- Estados de erro.
- Responsividade básica.

### `cozinha/frontend/js/index.js`

Interações da página pública:

- Troca de seções internas.
- Menu mobile.
- Barra de progresso de rolagem.
- Animacoes de entrada.
- Animacao de barras de progresso.
- Efeito ripple em botões.

### `cozinha/frontend/js/login_geral.js`

Controle da autenticação:

- Verifica se já existe token no `localStorage`.
- Valida campos do formulário.
- Mostra toasts.
- Autentica credenciais demo.
- Tenta autenticar no backend Flask.
- Salva token e usuário.
- Redireciona para `dashboard.html`.
- Alterna visibilidade da senha.

## `cozinha/frontend/assets/`

Pasta de recursos estáticos.

### `cozinha/frontend/assets/img/`

Contém imagens usadas pela página pública, como imagem do time e fotos dos membros.

As imagens enviadas pelo usuário no cardápio não são salvas nessa pasta. Elas são convertidas para base64 e salvas no `localStorage` dentro da chave `cozinha-cardapio-itens`.

## `cozinha/docs/diagramas/`

Pasta antiga/reservada para diagramas internos. Atualmente contém apenas arquivo placeholder.
