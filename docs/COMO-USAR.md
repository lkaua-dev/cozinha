# Como Usar

Este guia explica o uso basico do sistema Cozinha.

## Abrir o sistema

Modo simples:

1. Abra a pasta `cozinha/frontend`.
2. Abra `index.html` no navegador.

Modo recomendado com servidor local:

```bash
cd cozinha/frontend
python -m http.server 8026
```

Acesse:

```text
http://localhost:8026
```

## Entrar no sistema

Na pagina inicial, clique em `Entrar`.

Use as credenciais demo:

```text
Usuario: admin
Senha: 123456
```

ou:

```text
Usuario: cozinha@teste.com
Senha: 123456
```

Depois do login, o sistema abre `dashboard.html`.

## Usar o dashboard

O dashboard mostra uma visao geral do negocio:

- Faturamento total.
- Faturamento do dia.
- Pedidos.
- Status dos pedidos.
- Ticket medio.
- Produtos.
- Alertas.
- Pedidos recentes.
- Produtos mais vendidos.

Os valores podem vir de dados salvos no navegador ou de dados demonstrativos.

## Navegar pelas secoes

Use o menu lateral para acessar:

- Dashboard.
- Estoque.
- Cardapio.
- Kanban.
- POPs e fichas.
- Analise ABC.
- CMV e custos.
- Relatorios.
- Configuracoes.

Em celular, use o botao de menu para abrir/fechar a navegacao.

## Cadastrar item no cardapio

1. Abra a secao `Cardapio`.
2. Clique em `Novo item`.
3. Escolha o dia da semana.
4. Informe o prato principal.
5. Informe o acompanhamento.
6. Escolha o status.
7. Se quiser, selecione uma foto.
8. Confira a previa da imagem.
9. Clique em `Adicionar`.

O item sera exibido na tabela/listagem do cardapio.

## Editar item do cardapio

1. Na linha do item, clique no botao de editar.
2. Altere os dados desejados.
3. Troque ou remova a foto, se necessario.
4. Clique em `Salvar`.

## Remover item do cardapio

1. Clique no botao de remover.
2. Confirme a remocao no modal.

## Usar imagem no cardapio

Ao selecionar uma imagem:

- O sistema mostra uma previa.
- A imagem e compactada no navegador.
- A imagem e salva junto com o item no `localStorage`.
- A miniatura aparece na listagem.

Se a imagem for muito grande, o navegador pode recusar o salvamento. Nesse caso, tente uma imagem menor.

## Usar estoque

1. Abra a secao `Estoque`.
2. Veja os itens cadastrados e seus status.
3. Clique em `Novo item` para cadastrar.
4. Informe nome, quantidade minima, quantidade atual e quantidade maxima.
5. Salve.

Status visual:

- OK: estoque adequado.
- Alerta: estoque proximo do minimo.
- Critico: estoque abaixo ou muito proximo do minimo.

Se o backend estiver ligado, o estoque tenta usar a API. Se nao estiver, o sistema mantem uma base demonstrativa.

## Usar Kanban

1. Abra a secao `Kanban`.
2. Clique em `Novo card`.
3. Preencha titulo, coluna, prioridade, tag e data.
4. Salve.
5. Arraste cards entre colunas para atualizar o fluxo.

## Usar POPs e fichas tecnicas

1. Abra `POPs e Fichas`.
2. Clique em `Nova ficha`.
3. Informe nome do prato, icone, tipo, versao e observacoes.
4. Salve.

## Alterar tema e idioma

1. Abra `Configuracoes`.
2. Escolha tema claro ou escuro.
3. Escolha idioma.

As preferencias ficam salvas no navegador.

## Sair do sistema

1. Abra `Configuracoes`.
2. Clique em sair/logout.
3. Confirme.

O token e removido do `localStorage` e o usuario volta para a tela de login.

## Limpar dados locais

Se quiser apagar os dados salvos apenas no navegador:

1. Abra as ferramentas do desenvolvedor.
2. Va em Application/Aplicacao.
3. Abra Local Storage.
4. Remova as chaves do projeto.

Principais chaves:

- `cozinha-auth-token`
- `cozinha-user`
- `cozinha-cardapio-itens`
- `dark-mode`
- `lang`
- `current-page`
