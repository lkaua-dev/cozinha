# Guia de Manutenção

Este guia orienta alterações futuras sem quebrar funcionalidades existentes.

## Regra de ouro

Antes de mudar algo, descubra:

- Qual arquivo controla a tela.
- Quais IDs o JavaScript usa.
- Quais classes o CSS usa.
- Se existe persistência em `localStorage`.
- Se existe rota backend relacionada.

## Arquivos mais importantes

### Página pública

- HTML: `cozinha/frontend/index.html`
- CSS: `cozinha/frontend/css/index.css`
- JS: `cozinha/frontend/js/index.js`

Use esses arquivos para alterar home, metas, equipe, menu publico e animações.

### Login e recuperação

- Login: `cozinha/frontend/login.html`
- Recuperação: `cozinha/frontend/recuperar.html`
- CSS compartilhado: `cozinha/frontend/css/style_geral.css`
- JS do login: `cozinha/frontend/js/login_geral.js`

Use esses arquivos para alterar layout, validação, toasts e fluxo de entrada.

### Dashboard e telas internas

- Arquivo principal: `cozinha/frontend/dashboard.html`

Esse arquivo concentra dashboard, produção, estoque, cardápio, kanban, fichas, análises, relatórios e configurações.

## Cuidado com IDs

O JavaScript depende de muitos IDs. Exemplos importantes:

- `app`
- `sidebar`
- `btn-sidebar-toggle`
- `section-dashboard`
- `section-estoque`
- `section-cardapio`
- `cardapio-tbody`
- `card-foto`
- `card-foto-preview`
- `estoque-tbody`
- `modal-cardapio`
- `modal-estoque`

Se renomear um ID no HTML, atualize todas as referencias no JavaScript.

## Como alterar estilos

### Home

Edite:

```text
cozinha/frontend/css/index.css
```

Organização recomendada:

1. Variaveis.
2. Base/reset.
3. Header.
4. Seções.
5. Cards.
6. Responsividade.

### Login e recuperação

Edite:

```text
cozinha/frontend/css/style_geral.css
```

Cada página também pode ter um bloco `<style>` próprio.

### Dashboard

O CSS do dashboard fica dentro de `dashboard.html`.

Ao alterar:

- Procure primeiro uma regra existente.
- Evite duplicar seletor sem necessidade.
- Confira se ha média query para mobile.
- Teste desktop e mobile.
- Verifique sidebar aberta e recolhida.

## Como alterar JavaScript

Depois de editar scripts externos:

```powershell
node --check cozinha/frontend/js/index.js
node --check cozinha/frontend/js/login_geral.js
```

Para `dashboard.html`, o script e inline. Se mexer bastante nele, extraia o bloco `<script>` para validar em ambiente de teste ou abra a tela e confira o console do navegador.

## Como alterar o dashboard

Funções importantes:

- `calcularDashboardNegocio`
- `atualizarDashboardNegocio`
- `renderizarPedidosRecentes`
- `renderizarProdutosMaisVendidos`
- `renderizarAlertasDashboard`
- `navegarPara`

Ao criar um novo card:

1. Adicione o HTML na área certa.
2. Crie um ID claro para valor dinamico.
3. Atualize `atualizarDashboardNegocio`.
4. Se precisar de calculo novo, adicione em `calcularDashboardNegocio`.
5. Documente em `docs/DASHBOARD.md`.

## Como alterar cardápio

Funções importantes:

- `criarLinhaCardapio`
- `serializarLinhaCardapio`
- `salvarCardapioLocal`
- `restaurarCardapioLocal`
- `adicionarItemCardapio`
- `editarLinhaCardapio`
- `removerLinhaCardapio`

Ao adicionar campo:

1. Adicione o campo no modal.
2. Inclua em `criarLinhaCardapio`.
3. Inclua em `serializarLinhaCardapio`.
4. Garanta persistência em `salvarCardapioLocal`.
5. Garanta restauracao em `restaurarCardapioLocal`.
6. Atualize a documentação.

## Como alterar upload de imagens

Funções importantes:

- `compactarImagemProduto`
- `handleImagemCardapioChange`
- `renderizarPreviewCardapio`
- `limparImagemCardapio`

Recomendacoes:

- Mantenha validação `image/*`.
- Mantenha compactacao via `canvas`.
- Evite salvar imagens muito grandes em `localStorage`.
- Use `object-fit: cover` em miniaturas.

## Como alterar estoque

Frontend:

- `adicionarItemEstoque`
- `renderizarEstoquePagina`
- `carregarEstoque`
- `excluirItem`
- `normalizarItemEstoqueVisual`
- `atualizarKpisEstoquePagina`

Backend:

- `GET /estoque`
- `GET /estoque/<id>`
- `POST /estoque`
- `PUT /estoque/<id>`
- `DELETE /estoque/<id>`

Fluxo atual:

1. Frontend renderiza dados demonstrativos.
2. Tenta buscar `http://localhost:5000/estoque`.
3. Se a API retornar itens, troca a listagem.
4. Se falhar, mantem dados demonstrativos.

## Como alterar login

Arquivo:

```text
cozinha/frontend/js/login_geral.js
```

Fluxo:

1. Valida campos.
2. Testa credenciais demo.
3. Se não forem demo, chama `http://localhost:5000/login`.
4. Salva token e usuário no `localStorage`.
5. Redireciona para `dashboard.html`.

Para mudar credenciais demo, procure:

- `validDemoUsers`
- `demoPassword`

## Como alterar backend

Arquivos:

- `cozinha/backend/main.py`
- `cozinha/backend/app/database.py`

Dependências:

- `cozinha/backend/requirements.txt`
- `requirements.txt` na raiz, enquanto existir duplicado.

Configuracao:

- `cozinha/backend/.env.example`
- `.env` local criado a partir dele.

Se criar uma rota nova:

1. Adicione no Flask.
2. Teste com backend rodando.
3. Atualize chamada no frontend, se houver.
4. Atualize documentação.

Se mudar tabela ou coluna:

1. Atualize `banco.sql`.
2. Atualize `database.py` ou consultas afetadas.
3. Atualize `docs/INSTALACAO.md`, se o setup mudar.

## Validação recomendada

Frontend:

```powershell
node --check cozinha/frontend/js/index.js
node --check cozinha/frontend/js/login_geral.js
```

Backend:

```powershell
cd cozinha/backend
python -m py_compile main.py app\database.py
python main.py
```

Teste:

- `GET http://127.0.0.1:5000/health`
- `GET http://127.0.0.1:5000/estoque`
- `GET http://127.0.0.1:5000/dashboard/resumo`

Visual:

- Abra `index.html`.
- Entre pelo login.
- Navegue no dashboard.
- Teste modais.
- Teste upload/remoção de imagem.
- Teste sidebar aberta e recolhida.
- Teste em mobile.

## Melhorias futuras sugeridas

- Separar `dashboard.html` em arquivos menores.
- Mover CSS inline para `css/dashboard.css`.
- Mover JavaScript inline para `js/dashboard.js`.
- Centralizar dados em backend/banco em vez de depender tanto de `localStorage`.
- Criar testes automatizados para cálculos do dashboard.
- Melhorar autenticação antes de usar em ambiente real.
- Padronizar um único `requirements.txt`.
