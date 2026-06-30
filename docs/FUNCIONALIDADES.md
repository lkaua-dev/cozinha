# Funcionalidades

Este documento lista o que o sistema faz hoje e quais partes ainda sao demonstrativas.

## Página pública

Arquivo principal:

```text
cozinha/frontend/index.html
```

Recursos:

- Apresentacao do sistema.
- Menu responsivo.
- Navegação entre seções da página.
- Área de metas.
- Área de equipe.
- Animações leves.

Arquivos relacionados:

- `cozinha/frontend/css/index.css`
- `cozinha/frontend/js/index.js`

## Login

Arquivos principais:

- `cozinha/frontend/login.html`
- `cozinha/frontend/js/login_geral.js`
- `cozinha/frontend/css/style_geral.css`

Recursos:

- Validação de usuário/e-mail e senha.
- Mensagens de erro.
- Toasts de sucesso/erro.
- Botão para mostrar ou ocultar senha.
- Credenciais demonstrativas.
- Tentativa de login via backend Flask.
- Salvamento do token e usuário no `localStorage`.
- Redirecionamento para o dashboard.

Credenciais demo:

- `admin` / `123456`
- `cozinha@teste.com` / `123456`

## Recuperação de acesso

Arquivo principal:

```text
cozinha/frontend/recuperar.html
```

Recursos:

- Tela informativa.
- Orientacao para contato com administrador.
- Visual alinhado com login.

## Dashboard

Arquivo principal:

```text
cozinha/frontend/dashboard.html
```

Recursos:

- Faturamento total.
- Faturamento do dia.
- Total de pedidos.
- Pedidos pendentes, concluídos e cancelados.
- Ticket médio.
- Produtos cadastrados/vendidos.
- Pedidos recentes.
- Produtos mais vendidos.
- Alertas administrativos.
- Atalhos para áreas importantes.
- Navegação lateral recolhivel.
- Busca interna visual.
- Notificacoes visuais.
- Preferencias de tema e idioma.

Os cálculos estao detalhados em [DASHBOARD.md](DASHBOARD.md).

## Produção

Arquivo principal:

```text
cozinha/frontend/dashboard.html
```

Recursos:

- Paineis de acompanhamento operacional.
- Indicadores visuais de produção.
- Áreas demonstrativas para leitura de rotina.

## Estoque

Arquivo principal:

```text
cozinha/frontend/dashboard.html
```

Recursos:

- Listagem de insumos.
- Quantidade atual, mínima e máxima.
- Unidade de medida.
- Validade.
- Barra de progresso.
- Status: normal, alerta ou crítico.
- Cadastro de item.
- Edicao via backend, quando disponível.
- Exclusao de item.
- Fallback para dados demonstrativos.

Rotas relacionadas:

- `GET /estoque`
- `GET /estoque/<id>`
- `POST /estoque`
- `PUT /estoque/<id>`
- `DELETE /estoque/<id>`

## Cardápio / PCP

Arquivo principal:

```text
cozinha/frontend/dashboard.html
```

Recursos:

- Cadastro de item do cardápio.
- Dia da semana.
- Prato principal.
- Acompanhamento.
- Status.
- Upload de foto.
- Previa antes de salvar.
- Edicao.
- Remoção.
- Persistência no `localStorage`.

Chave usada:

```text
cozinha-cardapio-itens
```

## Upload de imagens

Fluxo:

1. O usuário escolhe uma imagem.
2. O JavaScript valida o tipo.
3. A imagem é carregada no navegador.
4. Um `canvas` redimensiona e compacta.
5. O resultado é salvo como base64.
6. A miniatura aparece na listagem.

Ponto de atencao: imagens grandes demais podem atingir o limite do `localStorage`.

## Kanban

Recursos:

- Criação de cards.
- Colunas de processo.
- Prioridade.
- Tag.
- Data.
- Arrastar e soltar.
- Atualizacao de contadores.

## POPs e Fichas

Recursos:

- Criação de ficha técnica.
- Nome do prato.
- Ícone.
- Tipo.
- Versao.
- Observações.
- Remoção.

## Curva ABC

Recursos:

- Cards de apoio visual.
- Classificacao de itens por impacto.
- Indicadores demonstrativos.

## CMV e Custos

Recursos:

- Gráficos visuais.
- Indicadores de custo.
- Paineis de leitura operacional.
- Dados majoritariamente demonstrativos.

## Relatórios

Recursos:

- Cards de relatório.
- Resumos visuais.
- Botões/áreas de download visual.

Status atual: a geração real de PDF ou Excel ainda não está implementada.

## Configurações

Recursos:

- Tema claro/escuro.
- Idioma.
- Preferencias de notificacao.
- Logout.

Chaves relacionadas:

- `dark-mode`
- `lang`
- `sidebar-collapsed`
- `current-page`

## Backend Flask

Recursos:

- Health check.
- Login via tabela `usuarios`.
- CRUD de estoque.
- Resumo de dashboard baseado no estoque.
- Alertas de validade e estoque.

O backend é opcional para usar a interface, mas necessário para testar rotas reais de estoque e login via banco.
