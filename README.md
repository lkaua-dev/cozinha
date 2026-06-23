# Cozinha

Sistema web para apoio a gestão de cozinha, cardápio, estoque, pedidos, indicadores operacionais e autenticação simples.

O projeto foi desenvolvido principalmente com HTML, CSS e JavaScript puro no frontend. Também existe um backend Flask simples para login e estoque, mas a maior parte da interface funciona como páginas estáticas no navegador.

## Objetivo

O Cozinha organiza informações importantes de uma operação de restaurante ou cozinha profissional em uma interface administrativa. O sistema centraliza:

- Dashboard com indicadores de faturamento, pedidos, produtos e alertas.
- Estoque com itens, quantidades, status e alertas de nível crítico.
- Cardápio semanal com cadastro, edição, status e foto dos itens.
- Kanban de processos para acompanhamento de tarefas.
- POPs e fichas técnicas.
- Análises ABC, CMV, relatórios e configurações.
- Login com usuário demonstrativo e tentativa de autenticação via backend Flask.

## Como abrir o projeto

### Modo frontend estático

1. Abra a pasta `cozinha/frontend`.
2. Abra o arquivo `index.html` no navegador.
3. Para entrar no painel, use a tela `login.html`.

Credenciais de demonstração:

- Usuário: `admin`
- Senha: `123456`

Também funciona com:

- Usuário: `cozinha@teste.com`
- Senha: `123456`

Depois do login, o navegador salva o token em `localStorage` e redireciona para `dashboard.html`.

### Modo com servidor local

Na pasta `cozinha/frontend`, rode um servidor estático simples:

```bash
python -m http.server 8026
```

Depois acesse:

```text
http://localhost:8026
```

Esse modo evita alguns problemas comuns de navegador ao abrir arquivos direto pelo sistema de arquivos.

### Backend Flask opcional

O backend fica em `cozinha/backend` e expõe rotas para login e estoque.

Para usar:

```bash
pip install -r requirements.txt
cd cozinha/backend
python main.py
```

Atenção: o backend importa `flask_cors` e `mysql.connector`. Se o ambiente estiver limpo, talvez seja necessário instalar também:

```bash
pip install flask-cors mysql-connector-python
```

O banco configurado no arquivo `cozinha/backend/app/database.py` usa:

- Host: `localhost`
- Usuário: `root`
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

Documentação detalhada:

- [Estrutura do projeto](docs/ESTRUTURA.md)
- [Funcionalidades](docs/FUNCIONALIDADES.md)
- [Dashboard e cálculos](docs/DASHBOARD.md)
- [Como usar](docs/COMO-USAR.md)
- [Guia de manutenção](docs/GUIA-DE-MANUTENCAO.md)
- [Changelog](docs/CHANGELOG.md)

## Arquivos do frontend

- `cozinha/frontend/index.html`: página pública com apresentação, metas e equipe.
- `cozinha/frontend/login.html`: tela de login.
- `cozinha/frontend/recuperar.html`: tela de orientação para recuperação de acesso.
- `cozinha/frontend/dashboard.html`: painel administrativo completo, incluindo HTML, CSS inline e JavaScript principal do sistema.
- `cozinha/frontend/css/index.css`: estilos da página pública.
- `cozinha/frontend/css/style_geral.css`: base visual compartilhada pelas telas de login e recuperação.
- `cozinha/frontend/js/index.js`: navegação da página pública, menu mobile, animações e interações.
- `cozinha/frontend/js/login_geral.js`: validação do login, autenticação demo/API, toasts e persistência do usuário.

## Como os dados são salvos

O projeto usa `localStorage` para persistir dados no navegador. As principais chaves são:

- `cozinha-auth-token`: token usado para manter o login ativo.
- `cozinha-user`: dados básicos do usuário logado.
- `cozinha-cardapio-itens`: itens cadastrados no cardápio, incluindo imagem em base64 quando enviada.
- `cozinha-pedidos`, `pedidos`, `orders`, `cozinha-orders`: chaves lidas pelo dashboard para tentar encontrar pedidos existentes.
- `cozinha-produtos`, `produtos`, `products`: chaves lidas pelo dashboard para tentar encontrar produtos existentes.
- `sidebar-collapsed`, `dark-mode`, `lang`, `current-page`: preferências de interface.

Quando não encontra dados reais, o dashboard usa uma base demonstrativa interna para manter os cards preenchidos.

## Dashboard e cálculos

O dashboard calcula os principais indicadores a partir de pedidos e produtos encontrados no `localStorage`. Se não houver dados, usa dados demonstrativos.

Os cálculos principais são:

- Faturamento total: soma dos valores dos pedidos que não estão cancelados.
- Faturamento do dia: soma dos pedidos válidos com data igual ao dia atual.
- Total de pedidos: quantidade total de pedidos encontrados.
- Pedidos pendentes, concluídos e cancelados: contagem por status normalizado.
- Ticket médio: faturamento total dividido pela quantidade de pedidos válidos.
- Produtos vendidos: soma dos produtos mais vendidos calculados a partir dos itens dos pedidos ou do cadastro de produtos.
- Saúde operacional: indicador visual calculado com base em concluídos, pendentes, cancelados e pedidos do dia.

Mais detalhes em [docs/DASHBOARD.md](docs/DASHBOARD.md).

## Imagens dos produtos e cardápio

O cadastro de itens do cardápio aceita upload de imagem no modal de item. O fluxo é:

1. Usuário escolhe uma imagem.
2. O JavaScript valida se o arquivo e imagem.
3. A imagem é carregada em um `canvas`.
4. O sistema reduz o tamanho maximo e converte para JPEG em base64.
5. A prévia aparece antes de salvar.
6. Ao salvar, a imagem fica no item do cardápio e é persistida em `localStorage`.

As miniaturas usam proporção fixa e `object-fit: cover` para evitar distorção.

## Manutenção rápida

- Para alterar textos da página pública, edite `cozinha/frontend/index.html`.
- Para alterar estilos da página pública, edite `cozinha/frontend/css/index.css`.
- Para alterar login e recuperação, use `login.html`, `recuperar.html` e `css/style_geral.css`.
- Para alterar dashboard, estoque, cardápio, kanban, fichas, análises ou relatórios, edite `cozinha/frontend/dashboard.html`.
- Para alterar rotas do backend, edite `cozinha/backend/main.py`.
- Para alterar conexão MySQL, edite `cozinha/backend/app/database.py`.

Antes de entregar mudanças, valide JavaScript com:

```bash
node --check cozinha/frontend/js/index.js
node --check cozinha/frontend/js/login_geral.js
```

Para o `dashboard.html`, como o script é inline, valide extraindo ou executando o conteúdo do bloco `<script>` em ambiente de teste.

## Melhorias futuras sugeridas

- Separar o JavaScript inline do `dashboard.html` em arquivos menores.
- Separar o CSS inline do dashboard em uma folha própria.
- Criar um modelo único de dados para pedidos, produtos e cardápio.
- Persistir produtos, pedidos e imagens em backend/banco em vez de apenas `localStorage`.
- Completar o arquivo `banco.sql` com a estrutura de tabelas.
- Adicionar testes automatizados para cálculos do dashboard e fluxos de cadastro.
- Ajustar o `requirements.txt` para listar todas as dependências reais do backend.
