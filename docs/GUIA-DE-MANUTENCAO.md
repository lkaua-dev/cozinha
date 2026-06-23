# Guia de Manutenção

Este guia orienta alterações futuras sem quebrar as funcionalidades atuais.

## Regras gerais

- Mantenha o projeto com HTML, CSS e JavaScript puro.
- Evite adicionar frameworks sem decisao explicita.
- Antes de alterar uma função, procure onde ela e chamada.
- Preserve os IDs usados por JavaScript.
- Preserve classes usadas por CSS e seletores.
- Em `dashboard.html`, prefira alterações pequenas e localizadas.
- Depois de editar JavaScript, rode validação de sintaxe.

## Arquivos mais importantes

### Página pública

- HTML: `cozinha/frontend/index.html`
- CSS: `cozinha/frontend/css/index.css`
- JS: `cozinha/frontend/js/index.js`

Use esses arquivos para alterar a página inicial, metas, equipe, menu publico e animações da home.

### Login e recuperação

- Login: `cozinha/frontend/login.html`
- Recuperacao: `cozinha/frontend/recuperar.html`
- CSS compartilhado: `cozinha/frontend/css/style_geral.css`
- JS do login: `cozinha/frontend/js/login_geral.js`

Use esses arquivos para alterar layout, validação, toasts e fluxo de entrada.

### Dashboard e telas internas

- Arquivo principal: `cozinha/frontend/dashboard.html`

Este arquivo concentra dashboard, estoque, cardápio, kanban, fichas, análises, relatórios e configurações.

## Cuidado com IDs

O JavaScript depende de muitos IDs do HTML. Exemplos importantes:

- `app`
- `sidebar`
- `btn-sidebar-toggle`
- `kpi-grid`
- `section-dashboard`
- `section-estoque`
- `section-cardapio`
- `cardapio-tbody`
- `card-foto`
- `card-foto-preview`
- `estoque-tbody`
- `modal-cardapio`
- `modal-estoque`

Se renomear um ID no HTML, atualize também todas as referências no JavaScript.

## Como alterar estilos

### Página pública

Edite:

```text
cozinha/frontend/css/index.css
```

Organizacao recomendada:

1. Variáveis globais.
2. Reset/base.
3. Header/menu.
4. Secoes.
5. Cards.
6. Responsividade.

### Login e recuperação

Edite:

```text
cozinha/frontend/css/style_geral.css
```

Esse arquivo contém a base compartilhada. Cada página também possui um bloco `<style>` proprio para seu layout especifico.

### Dashboard

O CSS do dashboard está dentro de `dashboard.html`. Ao alterar:

- Procure primeiro o bloco da seção desejada.
- Mantenha variaveis existentes quando possível.
- Evite duplicar regras.
- Verifique media queries para celular.
- Teste no mínimo desktop e mobile.

## Como alterar o dashboard

Funcoes importantes:

- `calcularDashboardNegocio`: calcula os indicadores.
- `atualizarDashboardNegocio`: escreve os valores na tela.
- `renderizarPedidosRecentes`: monta a lista de pedidos recentes.
- `renderizarProdutosMaisVendidos`: monta a lista de produtos mais vendidos.
- `renderizarAlertasDashboard`: monta alertas administrativos.
- `navegarPara`: troca a seção visível do dashboard.

Ao criar um novo card:

1. Adicione o HTML na area do dashboard.
2. Crie um ID para o valor dinamico.
3. Atualize `atualizarDashboardNegocio`.
4. Se precisar de calculo novo, adicione em `calcularDashboardNegocio`.
5. Documente o novo calculo em `docs/DASHBOARD.md`.

## Como alterar o cardápio

Funcoes importantes:

- `criarLinhaCardapio`
- `serializarLinhaCardapio`
- `salvarCardapioLocal`
- `restaurarCardapioLocal`
- `adicionarItemCardapio`
- `editarLinhaCardapio`
- `removerLinhaCardapio`

Ao adicionar um novo campo no cardápio:

1. Adicione o campo no modal.
2. Inclua o campo em `criarLinhaCardapio`.
3. Inclua o campo em `serializarLinhaCardapio`.
4. Garanta que `salvarCardapioLocal` salve o dado.
5. Garanta que `restaurarCardapioLocal` restaure o dado.
6. Atualize a documentação.

## Como alterar upload de imagens

Funcoes importantes:

- `compactarImagemProduto`
- `handleImagemCardapioChange`
- `renderizarPreviewCardapio`
- `limparImagemCardapio`

Recomendacoes:

- Mantenha validação `image/*`.
- Mantenha compactacao via `canvas`.
- Evite salvar imagens muito grandes em `localStorage`.
- Use `object-fit: cover` nas miniaturas.

## Como alterar estoque

Funcoes importantes:

- `adicionarItemEstoque`
- `renderizarEstoquePagina`
- `carregarEstoque`
- `excluirItem`
- `normalizarItemEstoqueVisual`
- `atualizarKpisEstoquePagina`

Fluxo atual:

1. Renderiza dados demonstrativos imediatamente.
2. Tenta buscar dados em `http://localhost:5000/estoque`.
3. Se a API retornar itens, troca a listagem.
4. Se a API falhar, mantém dados demonstrativos.

## Como alterar login

Arquivo:

```text
cozinha/frontend/js/login_geral.js
```

Fluxo:

1. Verifica campos.
2. Testa credenciais demo.
3. Se não forem demo, chama `http://localhost:5000/login`.
4. Salva token e usuário no `localStorage`.
5. Redireciona para `dashboard.html`.

Para mudar credenciais demo, altere:

```text
validDemoUsers
demoPassword
```

## Como alterar backend

Arquivos:

- `cozinha/backend/main.py`
- `cozinha/backend/app/database.py`

Rotas atuais:

- `POST /login`
- `POST /logout`
- `GET /estoque`
- `POST /estoque`
- `DELETE /estoque/<id>`

Se criar uma rota nova:

1. Adicione no Flask.
2. Teste com backend rodando.
3. Atualize a chamada no frontend.
4. Atualize a documentação.

## Validacao recomendada

JavaScript externo:

```bash
node --check cozinha/frontend/js/index.js
node --check cozinha/frontend/js/login_geral.js
```

HTML/CSS:

- Abra `index.html`, `login.html`, `recuperar.html` e `dashboard.html`.
- Teste em largura de celular, tablet e desktop.
- Verifique se modais abrem e fecham.
- Teste cadastro/edição/remoção de item do cardápio.
- Teste upload e remoção de imagem.
- Teste navegação entre seções.

Backend:

```bash
cd cozinha/backend
python main.py
```

Depois teste:

- `POST http://localhost:5000/login`
- `GET http://localhost:5000/estoque`

## Melhorias técnicas recomendadas

- Separar `dashboard.html` em arquivos menores.
- Mover CSS inline para `css/dashboard.css`.
- Mover JS inline para `js/dashboard.js`.
- Padronizar encoding UTF-8 em todos os arquivos.
- Completar `banco.sql`.
- Criar schema documentado para pedidos, produtos e estoque.
- Adicionar testes para cálculos do dashboard.
- Evitar salvar imagens grandes em `localStorage` no longo prazo.
