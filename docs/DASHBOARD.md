# Dashboard

Este documento explica de onde vem os dados do dashboard e como os principais indicadores são calculados.

## Arquivo principal

O dashboard fica em:

```text
cozinha/frontend/dashboard.html
```

Esse arquivo contém:

- HTML das seções do painel.
- CSS inline do painel e das telas internas.
- JavaScript de navegação, modais, dashboard, estoque, cardápio e configurações.

## Fontes de dados

O dashboard tenta usar dados existentes no navegador antes de usar dados demonstrativos.

### Pedidos

Chaves lidas no `localStorage`:

- `cozinha-pedidos`
- `pedidos`
- `orders`
- `cozinha-orders`

Se nenhuma chave tiver uma lista valida, o dashboard usa `DASHBOARD_DEMO_DATA.pedidos`.

### Produtos

Chaves lidas no `localStorage`:

- `cozinha-produtos`
- `produtos`
- `products`

O dashboard também usa os itens salvos do cardápio:

- `cozinha-cardapio-itens`

Se não houver produtos nem cardápio salvo, usa `DASHBOARD_DEMO_DATA.produtos`.

### Cardápio

O cardápio e salvo em:

```text
cozinha-cardapio-itens
```

Cada item pode conter:

- Dia da semana.
- Prato principal.
- Acompanhamento.
- Status.
- Imagem em base64.

## Normalizacao de dados

Como o projeto pode receber dados com nomes diferentes, o dashboard normaliza pedidos e produtos.

### Pedido normalizado

A função `normalizarPedidoDashboard` tenta encontrar:

- `id`, `codigo` ou `numero`.
- `cliente`, `nomeCliente`, `mesa` ou `origem`.
- `status`, `situacao` ou `estado`.
- `valor`, `total` ou `valorTotal`.
- `itens`, `items` ou `produtos`.
- `data`, `createdAt`, `criadoEm` ou `updatedAt`.

### Produto normalizado

A função `normalizarProdutoDashboard` tenta encontrar:

- `id` ou `codigo`.
- `nome`, `prato`, `name` ou `titulo`.
- `vendidos`, `quantidadeVendida`, `sold` ou `qtdVendida`.
- `valor`, `preco` ou `price`.

## Status de pedidos

A função `normalizarStatusPedido` converte textos diferentes para três estados principais:

- `cancelado`: quando o status contém `cancel`.
- `concluido`: quando contém `concl`, `entreg`, `final` ou `pago`.
- `pendente`: qualquer outro caso.

## Calculos principais

Funcao central:

```text
calcularDashboardNegocio()
```

Ela retorna todos os números usados nos cards e painéis do dashboard.

### Faturamento total

Soma o valor de todos os pedidos que não estão cancelados.

```text
faturamentoTotal = soma(pedidos com status diferente de cancelado)
```

### Faturamento do dia

Filtra os pedidos válidos pela data atual e soma seus valores.

```text
faturamentoDia = soma(pedidos válidos cuja data é hoje)
```

### Total de pedidos

Conta todos os pedidos encontrados, incluindo cancelados.

```text
totalPedidos = quantidade total de pedidos
```

### Pedidos concluídos

Conta pedidos com status normalizado igual a `concluido`.

### Pedidos pendentes

Conta pedidos com status normalizado igual a `pendente`.

### Pedidos cancelados

Conta pedidos com status normalizado igual a `cancelado`.

### Ticket médio

Divide o faturamento total pela quantidade de pedidos válidos.

```text
ticketMedio = faturamentoTotal / quantidade de pedidos não cancelados
```

Se não houver pedido válido, o valor fica `0`.

### Produtos mais vendidos

Funcao:

```text
obterTopProdutos(pedidos, produtos)
```

O calculo:

1. Ignora pedidos cancelados.
2. Le os itens de cada pedido.
3. Agrupa os itens por nome.
4. Soma quantidade vendida.
5. Soma valor vendido.
6. Complementa com produtos cadastrados que ainda não aparecem nos pedidos.
7. Ordena por quantidade vendida.
8. Retorna os 5 primeiros.

### Produtos vendidos

Soma as quantidades dos produtos retornados em `topProdutos`.

### Saúde operacional

Indicador visual calculado por uma formula simples:

```text
saude = 72
  + pontos por pedidos concluídos
  - pontos por pedidos pendentes
  - pontos por pedidos cancelados
  + pontos por pedidos do dia
```

O resultado e limitado entre `52` e `98` para manter o indicador em uma faixa visual adequada.

## Formatacao monetaria

Funcao:

```text
formatarMoedaBR(valor)
```

Usa `Intl.NumberFormat` com:

- Localidade: `pt-BR`
- Moeda: `BRL`

Exemplo de saida:

```text
R$ 120,00
```

## Atualizacao da tela

Funcao:

```text
atualizarDashboardNegocio()
```

Responsabilidades:

- Chamar `calcularDashboardNegocio`.
- Atualizar os textos dos cards.
- Atualizar grafico de faturamento.
- Renderizar pedidos recentes.
- Renderizar produtos mais vendidos.
- Renderizar alertas.
- Indicar quando os dados são demonstrativos.

Essa função também e chamada depois de mudanças no cardápio para refletir novos dados.

## Quando os dados são demonstrativos

O dashboard usa dados demonstrativos quando:

- Nao existem pedidos salvos no `localStorage`.
- Nao existem produtos nem itens de cardápio salvos no `localStorage`.

Esse comportamento evita uma tela vazia e ajuda a demonstrar a interface.

## Pontos de atenção

- `localStorage` e salvo apenas no navegador atual.
- Imagens em base64 aumentam o tamanho do item salvo.
- O navegador tem limite de armazenamento local.
- Se uma imagem for muito grande, o sistema tenta compactar antes de salvar.
- Se o limite do `localStorage` for atingido, o sistema mantém o item na tela e mostra aviso.
