# Cozinha

Sistema web para apoio a gestao de cozinha, cardapio, estoque, pedidos, indicadores operacionais e autenticacao simples.

O projeto foi desenvolvido principalmente com HTML, CSS e JavaScript puro no frontend. Tambem existe um backend Flask simples para login e estoque, mas a maior parte da interface funciona como paginas estaticas no navegador.

## Objetivo

O Cozinha organiza informacoes importantes de uma operacao de restaurante ou cozinha profissional em uma interface administrativa. O sistema centraliza:

- Dashboard com indicadores de faturamento, pedidos, produtos e alertas.
- Estoque com itens, quantidades, status e alertas de nivel critico.
- Cardapio semanal com cadastro, edicao, status e foto dos itens.
- Kanban de processos para acompanhamento de tarefas.
- POPs e fichas tecnicas.
- Analises ABC, CMV, relatorios e configuracoes.
- Login com usuario demonstrativo e tentativa de autenticacao via backend Flask.

## Como abrir o projeto

### Modo frontend estatico

1. Abra a pasta `cozinha/frontend`.
2. Abra o arquivo `index.html` no navegador.
3. Para entrar no painel, use a tela `login.html`.

Credenciais de demonstracao:

- Usuario: `admin`
- Senha: `123456`

Tambem funciona com:

- Usuario: `cozinha@teste.com`
- Senha: `123456`

Depois do login, o navegador salva o token em `localStorage` e redireciona para `dashboard.html`.

### Modo com servidor local

Na pasta `cozinha/frontend`, rode um servidor estatico simples:

```bash
python -m http.server 8026
```

Depois acesse:

```text
http://localhost:8026
```

Esse modo evita alguns problemas comuns de navegador ao abrir arquivos direto pelo sistema de arquivos.

### Backend Flask opcional

O backend fica em `cozinha/backend` e expoe rotas para login e estoque.

Para usar:

```bash
pip install -r requirements.txt
cd cozinha/backend
python main.py
```

Atencao: o backend importa `flask_cors` e `mysql.connector`. Se o ambiente estiver limpo, talvez seja necessario instalar tambem:

```bash
pip install flask-cors mysql-connector-python
```

O banco configurado no arquivo `cozinha/backend/app/database.py` usa:

- Host: `localhost`
- Usuario: `root`
- Senha: `root`
- Banco: `cozinha`

## Estrutura principal

```text
.
├── README.md
├── requirements.txt
├── banco.sql
├── docs/
│   ├── COMO-USAR.md
│   ├── DASHBOARD.md
│   ├── ESTRUTURA.md
│   ├── FUNCIONALIDADES.md
│   ├── GUIA-DE-MANUTENCAO.md
│   └── CHANGELOG.md
└── cozinha/
    ├── backend/
    │   ├── main.py
    │   └── app/
    │       └── database.py
    └── frontend/
        ├── index.html
        ├── login.html
        ├── recuperar.html
        ├── dashboard.html
        ├── css/
        │   ├── index.css
        │   └── style_geral.css
        ├── js/
        │   ├── index.js
        │   └── login_geral.js
        └── assets/
            └── img/
```

Documentacao detalhada:

- [Estrutura do projeto](docs/ESTRUTURA.md)
- [Funcionalidades](docs/FUNCIONALIDADES.md)
- [Dashboard e calculos](docs/DASHBOARD.md)
- [Como usar](docs/COMO-USAR.md)
- [Guia de manutencao](docs/GUIA-DE-MANUTENCAO.md)
- [Changelog](docs/CHANGELOG.md)

## Arquivos do frontend

- `cozinha/frontend/index.html`: pagina publica com apresentacao, metas e equipe.
- `cozinha/frontend/login.html`: tela de login.
- `cozinha/frontend/recuperar.html`: tela de orientacao para recuperacao de acesso.
- `cozinha/frontend/dashboard.html`: painel administrativo completo, incluindo HTML, CSS inline e JavaScript principal do sistema.
- `cozinha/frontend/css/index.css`: estilos da pagina publica.
- `cozinha/frontend/css/style_geral.css`: base visual compartilhada pelas telas de login e recuperacao.
- `cozinha/frontend/js/index.js`: navegacao da pagina publica, menu mobile, animacoes e interacoes.
- `cozinha/frontend/js/login_geral.js`: validacao do login, autenticacao demo/API, toasts e persistencia do usuario.

## Como os dados sao salvos

O projeto usa `localStorage` para persistir dados no navegador. As principais chaves sao:

- `cozinha-auth-token`: token usado para manter o login ativo.
- `cozinha-user`: dados basicos do usuario logado.
- `cozinha-cardapio-itens`: itens cadastrados no cardapio, incluindo imagem em base64 quando enviada.
- `cozinha-pedidos`, `pedidos`, `orders`, `cozinha-orders`: chaves lidas pelo dashboard para tentar encontrar pedidos existentes.
- `cozinha-produtos`, `produtos`, `products`: chaves lidas pelo dashboard para tentar encontrar produtos existentes.
- `sidebar-collapsed`, `dark-mode`, `lang`, `current-page`: preferencias de interface.

Quando nao encontra dados reais, o dashboard usa uma base demonstrativa interna para manter os cards preenchidos.

## Dashboard e calculos

O dashboard calcula os principais indicadores a partir de pedidos e produtos encontrados no `localStorage`. Se nao houver dados, usa dados demonstrativos.

Os calculos principais sao:

- Faturamento total: soma dos valores dos pedidos que nao estao cancelados.
- Faturamento do dia: soma dos pedidos validos com data igual ao dia atual.
- Total de pedidos: quantidade total de pedidos encontrados.
- Pedidos pendentes, concluidos e cancelados: contagem por status normalizado.
- Ticket medio: faturamento total dividido pela quantidade de pedidos validos.
- Produtos vendidos: soma dos produtos mais vendidos calculados a partir dos itens dos pedidos ou do cadastro de produtos.
- Saude operacional: indicador visual calculado com base em concluidos, pendentes, cancelados e pedidos do dia.

Mais detalhes em [docs/DASHBOARD.md](docs/DASHBOARD.md).

## Imagens dos produtos e cardapio

O cadastro de itens do cardapio aceita upload de imagem no modal de item. O fluxo e:

1. Usuario escolhe uma imagem.
2. O JavaScript valida se o arquivo e imagem.
3. A imagem e carregada em um `canvas`.
4. O sistema reduz o tamanho maximo e converte para JPEG em base64.
5. A previa aparece antes de salvar.
6. Ao salvar, a imagem fica no item do cardapio e e persistida em `localStorage`.

As miniaturas usam proporcao fixa e `object-fit: cover` para evitar distorcao.

## Manutencao rapida

- Para alterar textos da pagina publica, edite `cozinha/frontend/index.html`.
- Para alterar estilos da pagina publica, edite `cozinha/frontend/css/index.css`.
- Para alterar login e recuperacao, use `login.html`, `recuperar.html` e `css/style_geral.css`.
- Para alterar dashboard, estoque, cardapio, kanban, fichas, analises ou relatorios, edite `cozinha/frontend/dashboard.html`.
- Para alterar rotas do backend, edite `cozinha/backend/main.py`.
- Para alterar conexao MySQL, edite `cozinha/backend/app/database.py`.

Antes de entregar mudancas, valide JavaScript com:

```bash
node --check cozinha/frontend/js/index.js
node --check cozinha/frontend/js/login_geral.js
```

Para o `dashboard.html`, como o script e inline, valide extraindo ou executando o conteudo do bloco `<script>` em ambiente de teste.

## Melhorias futuras sugeridas

- Separar o JavaScript inline do `dashboard.html` em arquivos menores.
- Separar o CSS inline do dashboard em uma folha propria.
- Criar um modelo unico de dados para pedidos, produtos e cardapio.
- Persistir produtos, pedidos e imagens em backend/banco em vez de apenas `localStorage`.
- Completar o arquivo `banco.sql` com a estrutura de tabelas.
- Adicionar testes automatizados para calculos do dashboard e fluxos de cadastro.
- Ajustar o `requirements.txt` para listar todas as dependencias reais do backend.
