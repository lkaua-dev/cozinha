# Funcionalidades

Este documento descreve as principais funcionalidades existentes no sistema.

## Pagina publica

Arquivo principal: `cozinha/frontend/index.html`

Recursos:

- Apresentacao do sistema.
- Navegacao entre secoes sem trocar de arquivo.
- Menu responsivo.
- Area de metas com barras de progresso.
- Area de colaboradores/equipe.
- Animacoes leves de entrada.

Script relacionado: `cozinha/frontend/js/index.js`

Estilo relacionado: `cozinha/frontend/css/index.css`

## Login

Arquivos principais:

- `cozinha/frontend/login.html`
- `cozinha/frontend/js/login_geral.js`
- `cozinha/frontend/css/style_geral.css`

Recursos:

- Validacao de usuario/e-mail e senha.
- Mensagens de erro nos campos.
- Toast de sucesso ou erro.
- Botao para mostrar/ocultar senha.
- Credenciais demonstrativas.
- Tentativa de login via backend Flask.
- Salvamento de token e usuario no `localStorage`.
- Redirecionamento para o dashboard.

Credenciais demo:

- `admin` / `123456`
- `cozinha@teste.com` / `123456`

## Recuperacao de acesso

Arquivo principal: `cozinha/frontend/recuperar.html`

Recursos:

- Tela informativa para recuperacao manual de acesso.
- Orientacao para contato com administrador.
- Visual alinhado as telas de autenticacao.

## Dashboard

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Indicadores de faturamento.
- Faturamento do dia.
- Total de pedidos.
- Pedidos pendentes, concluidos e cancelados.
- Ticket medio.
- Produtos cadastrados/vendidos.
- Pedidos recentes.
- Produtos mais vendidos.
- Alertas administrativos.
- Atalhos para areas importantes.
- Navegacao lateral.
- Busca interna.
- Notificacoes.
- Preferencias de tema e idioma.

Os calculos sao explicados em `docs/DASHBOARD.md`.

## Estoque

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Listagem de insumos.
- Quantidade minima, atual e maxima.
- Barra de progresso de estoque.
- Status visual: OK, alerta e critico.
- Cadastro de item pelo modal de estoque.
- Exclusao de item com confirmacao.
- Busca dados do backend Flask quando a rota `GET /estoque` esta disponivel.
- Usa dados demonstrativos quando o backend nao responde ou nao retorna itens.

Rotas backend relacionadas:

- `GET /estoque`
- `POST /estoque`
- `DELETE /estoque/<id>`

## Cardapio

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Listagem do cardapio semanal.
- Cadastro de item.
- Edicao de item existente.
- Remocao de item com confirmacao.
- Status do item: OK, pendente ou critico.
- Upload de foto.
- Previa da imagem antes de salvar.
- Imagem exibida na listagem.
- Persistencia no `localStorage`.

Chave usada:

```text
cozinha-cardapio-itens
```

## Upload de imagens

O upload de imagem esta ligado ao modal de cardapio.

Fluxo:

1. O usuario escolhe uma imagem.
2. O JavaScript valida o tipo do arquivo.
3. A imagem e carregada no navegador.
4. Um `canvas` redimensiona a imagem para reduzir peso.
5. O resultado e salvo como base64.
6. A previa aparece no modal.
7. Ao salvar, a imagem e exibida como miniatura no cardapio.

Funcoes principais:

- `compactarImagemProduto`
- `handleImagemCardapioChange`
- `renderizarPreviewCardapio`
- `salvarCardapioLocal`
- `restaurarCardapioLocal`

## Kanban de processos

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Colunas de processo.
- Cards com prioridade e status.
- Criacao de novos cards.
- Arrastar e soltar entre colunas.
- Atualizacao de contadores.

Funcoes principais:

- `adicionarCardKanban`
- `onDragStart`
- `onDrop`
- `atualizarContagensKanban`

## POPs e fichas tecnicas

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Listagem de fichas.
- Criacao de nova ficha tecnica.
- Remocao com confirmacao.
- Informacoes de prato, tipo, versao e observacoes.

Funcoes principais:

- `adicionarFicha`
- `removerFicha`

## Analises ABC

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Visualizacao de insumos classificados por impacto.
- Status de criticidade.
- Cards e listas de apoio visual.

## Analises CMV

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Graficos visuais de CMV.
- Relacao de custos.
- Estoque por impacto.
- Indicadores estaticos/demonstrativos.

## Relatorios

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Lista visual de relatorios.
- Cards de resumo.
- Botoes/areas de download visual.

Observacao: atualmente os arquivos de relatorio sao demonstrativos; nao ha geracao real de PDF/Excel implementada.

## Configuracoes

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Tema claro/escuro.
- Idioma.
- Preferencias de notificacao.
- Logout.

Preferencias salvas no navegador:

- `dark-mode`
- `lang`
- `sidebar-collapsed`
- `current-page`
