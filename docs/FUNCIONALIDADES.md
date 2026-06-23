# Funcionalidades

Este documento descreve as principais funcionalidades existentes no sistema.

## Página pública

Arquivo principal: `cozinha/frontend/index.html`

Recursos:

- Apresentacao do sistema.
- Navegacao entre seções sem trocar de arquivo.
- Menu responsivo.
- Área de metas com barras de progresso.
- Área de colaboradores/equipe.
- Animacoes leves de entrada.

Script relacionado: `cozinha/frontend/js/index.js`

Estilo relacionado: `cozinha/frontend/css/index.css`

## Login

Arquivos principais:

- `cozinha/frontend/login.html`
- `cozinha/frontend/js/login_geral.js`
- `cozinha/frontend/css/style_geral.css`

Recursos:

- Validacao de usuário/e-mail e senha.
- Mensagens de erro nos campos.
- Toast de sucesso ou erro.
- Botão para mostrar/ocultar senha.
- Credenciais demonstrativas.
- Tentativa de login via backend Flask.
- Salvamento de token e usuário no `localStorage`.
- Redirecionamento para o dashboard.

Credenciais demo:

- `admin` / `123456`
- `cozinha@teste.com` / `123456`

## Recuperacao de acesso

Arquivo principal: `cozinha/frontend/recuperar.html`

Recursos:

- Tela informativa para recuperação manual de acesso.
- Orientacao para contato com administrador.
- Visual alinhado às telas de autenticação.

## Dashboard

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Indicadores de faturamento.
- Faturamento do dia.
- Total de pedidos.
- Pedidos pendentes, concluídos e cancelados.
- Ticket médio.
- Produtos cadastrados/vendidos.
- Pedidos recentes.
- Produtos mais vendidos.
- Alertas administrativos.
- Atalhos para areas importantes.
- Navegacao lateral.
- Busca interna.
- Notificacoes.
- Preferencias de tema e idioma.

Os cálculos são explicados em `docs/DASHBOARD.md`.

## Estoque

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Listagem de insumos.
- Quantidade minima, atual e maxima.
- Barra de progresso de estoque.
- Status visual: OK, alerta e crítico.
- Cadastro de item pelo modal de estoque.
- Exclusao de item com confirmacao.
- Busca dados do backend Flask quando a rota `GET /estoque` está disponível.
- Usa dados demonstrativos quando o backend não responde ou não retorna itens.

Rotas backend relacionadas:

- `GET /estoque`
- `POST /estoque`
- `DELETE /estoque/<id>`

## Cardápio

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Listagem do cardápio semanal.
- Cadastro de item.
- Edicao de item existente.
- Remocao de item com confirmacao.
- Status do item: OK, pendente ou crítico.
- Upload de foto.
- Previa da imagem antes de salvar.
- Imagem exibida na listagem.
- Persistencia no `localStorage`.

Chave usada:

```text
cozinha-cardapio-itens
```

## Upload de imagens

O upload de imagem está ligado ao modal de cardápio.

Fluxo:

1. O usuário escolhe uma imagem.
2. O JavaScript valida o tipo do arquivo.
3. A imagem é carregada no navegador.
4. Um `canvas` redimensiona a imagem para reduzir peso.
5. O resultado e salvo como base64.
6. A prévia aparece no modal.
7. Ao salvar, a imagem e exibida como miniatura no cardápio.

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

## POPs e fichas técnicas

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Listagem de fichas.
- Criacao de nova ficha técnica.
- Remocao com confirmacao.
- Informacoes de prato, tipo, versão e observações.

Funcoes principais:

- `adicionarFicha`
- `removerFicha`

## Análises ABC

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Visualizacao de insumos classificados por impacto.
- Status de criticidade.
- Cards e listas de apoio visual.

## Análises CMV

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Graficos visuais de CMV.
- Relacao de custos.
- Estoque por impacto.
- Indicadores estáticos/demonstrativos.

## Relatorios

Arquivo principal: `cozinha/frontend/dashboard.html`

Recursos:

- Lista visual de relatórios.
- Cards de resumo.
- Botões/áreas de download visual.

Observação: atualmente os arquivos de relatório são demonstrativos; não há geração real de PDF/Excel implementada.

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
