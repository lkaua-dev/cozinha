# Dashboard

Este documento explica de onde vem os dados do dashboard, como eles sao normalizados e como os indicadores principais sao calculados.

## Arquivo principal

```text
cozinha/frontend/dashboard.html
```

Esse arquivo contém:

- HTML das seções internas.
- CSS do painel.
- JavaScript de navegação.
- Modais.
- Cálculos do dashboard.
- Estoque.
- Cardápio.
- Kanban.
- Configurações.

## Fontes de dados

O dashboard tenta usar dados reais salvos no navegador antes de usar dados demonstrativos.

### Pedidos

Chaves lidas no `localStorage`:

- `cozinha-pedidos`
- `pedidos`
- `orders`
- `cozinha-orders`

Se nenhuma chave tiver lista valida, usa:

```text
DASHBOARD_DEMO_DATA.pedidos
```

### Produtos

Chaves lidas no `localStorage`:

- `cozinha-produtos`
- `produtos`
- `products`

Também usa os itens do cardápio:

```text
cozinha-cardapio-itens
```

Se não houver produtos nem cardápio salvo, usa:

```text
DASHBOARD_DEMO_DATA.produtos
```

### Estoque

A seção de estoque tenta consultar:

```text
http://localhost:5000/estoque
```

Se o backend não responder, a tela mantem dados demonstrativos.

## Normalização

Como o projeto pode receber dados com nomes diferentes, o dashboard tenta reconhecer campos equivalentes.

### Pedido

A função `normalizarPedidoDashboard` tenta encontrar:

- Identificador: `id`, `codigo` ou `numero`.
- Cliente/origem: `cliente`, `nomeCliente`, `mesa` ou `origem`.
- Status: `status`, `situacao` ou `estado`.
- Valor: `valor`, `total` ou `valorTotal`.
- Itens: `itens`, `items` ou `produtos`.
- Data: `data`, `createdAt`, `criadoEm` ou `updatedAt`.

### Produto

A função `normalizarProdutoDashboard` tenta encontrar:

- Identificador: `id` ou `codigo`.
- Nome: `nome`, `prato`, `name` ou `titulo`.
- Vendidos: `vendidos`, `quantidadeVendida`, `sold` ou `qtdVendida`.
- Valor: `valor`, `preco` ou `price`.

## Status de pedidos

A função `normalizarStatusPedido` reduz textos variados para tres grupos:

- `cancelado`: contém `cancel`.
- `concluido`: contém `concl`, `entreg`, `final` ou `pago`.
- `pendente`: qualquer outro caso.

## Cálculos principais

Função central:

```text
calcularDashboardNegocio()
```

Ela retorna os numeros usados nos cards e painéis.

### Faturamento total

Soma o valor de pedidos que não estao cancelados.

```text
faturamentoTotal = soma(pedidos validos)
```

### Faturamento do dia

Soma pedidos válidos com data igual ao dia atual.

```text
faturamentoDia = soma(pedidos validos de hoje)
```

### Total de pedidos

Conta todos os pedidos encontrados, inclusive cancelados.

### Pedidos por status

Conta pedidos normalizados como:

- `pendente`
- `concluido`
- `cancelado`

### Ticket médio

Divide o faturamento total pela quantidade de pedidos não cancelados.

```text
ticketMedio = faturamentoTotal / pedidosValidos
```

Se não houver pedido válido, o valor fica `0`.

### Produtos mais vendidos

Função:

```text
obterTopProdutos(pedidos, produtos)
```

Fluxo:

1. Ignora pedidos cancelados.
2. Le itens dos pedidos.
3. Agrupa por nome.
4. Soma quantidade vendida.
5. Soma valor vendido.
6. Complementa com produtos cadastrados que não aparecem em pedidos.
7. Ordena por quantidade vendida.
8. Retorna os cinco primeiros.

### Saúde operacional

Indicador visual calculado a partir de:

- Pedidos concluídos.
- Pedidos pendentes.
- Pedidos cancelados.
- Pedidos do dia.

O resultado e limitado para manter uma faixa visual estavel.

## Formatacao monetaria

Função:

```text
formatarMoedaBR(valor)
```

Usa:

- Localidade: `pt-BR`
- Moeda: `BRL`

Exemplo:

```text
R$ 120,00
```

## Atualizacao da tela

Função:

```text
atualizarDashboardNegocio()
```

Responsabilidades:

- Chamar `calcularDashboardNegocio`.
- Atualizar cards.
- Atualizar gráficos.
- Renderizar pedidos recentes.
- Renderizar produtos mais vendidos.
- Renderizar alertas.
- Indicar quando os dados sao demonstrativos.

Essa função também e chamada depois de mudanças no cardápio.

## Dados demonstrativos

O dashboard usa dados demonstrativos quando:

- Não existem pedidos salvos.
- Não existem produtos salvos.
- Não existem itens de cardápio salvos.
- O backend de estoque não responde.

Isso evita uma interface vazia e facilita demonstracoes.

## Pontos de atencao

- `localStorage` é local do navegador atual.
- Dados salvos em um navegador não aparecem automaticamente em outro.
- Imagens em base64 ocupam bastante espaco.
- O navegador pode recusar salvar imagens grandes.
- Se o limite do `localStorage` for atingido, o sistema tenta manter a tela utilizavel e mostrar aviso.
