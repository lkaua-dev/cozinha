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

Na página inicial, clique em `Entrar`.

Use as credenciais demo:

```text
Usuário: admin
Senha: 123456
```

ou:

```text
Usuário: cozinha@teste.com
Senha: 123456
```

Depois do login, o sistema abre `dashboard.html`.

## Usar o dashboard

O dashboard mostra uma visão geral do negócio:

- Faturamento total.
- Faturamento do dia.
- Pedidos.
- Status dos pedidos.
- Ticket médio.
- Produtos.
- Alertas.
- Pedidos recentes.
- Produtos mais vendidos.

Os valores podem vir de dados salvos no navegador ou de dados demonstrativos.

## Navegar pelas seções

Use o menu lateral para acessar:

- Dashboard.
- Estoque.
- Cardápio.
- Kanban.
- POPs e fichas.
- Analise ABC.
- CMV e custos.
- Relatorios.
- Configuracoes.

Em celular, use o botão de menu para abrir/fechar a navegação.

## Cadastrar item no cardápio

1. Abra a seção `Cardápio`.
2. Clique em `Novo item`.
3. Escolha o dia da semana.
4. Informe o prato principal.
5. Informe o acompanhamento.
6. Escolha o status.
7. Se quiser, selecione uma foto.
8. Confira a prévia da imagem.
9. Clique em `Adicionar`.

O item será exibido na tabela/listagem do cardápio.

## Editar item do cardápio

1. Na linha do item, clique no botão de editar.
2. Altere os dados desejados.
3. Troque ou remova a foto, se necessário.
4. Clique em `Salvar`.

## Remover item do cardápio

1. Clique no botão de remover.
2. Confirme a remoção no modal.

## Usar imagem no cardápio

Ao selecionar uma imagem:

- O sistema mostra uma prévia.
- A imagem e compactada no navegador.
- A imagem e salva junto com o item no `localStorage`.
- A miniatura aparece na listagem.

Se a imagem for muito grande, o navegador pode recusar o salvamento. Nesse caso, tente uma imagem menor.

## Usar estoque

1. Abra a seção `Estoque`.
2. Veja os itens cadastrados e seus status.
3. Clique em `Novo item` para cadastrar.
4. Informe nome, quantidade minima, quantidade atual e quantidade maxima.
5. Salve.

Status visual:

- OK: estoque adequado.
- Alerta: estoque próximo do mínimo.
- Critico: estoque abaixo ou muito próximo do mínimo.

Se o backend estiver ligado, o estoque tenta usar a API. Se não estiver, o sistema mantém uma base demonstrativa.

## Usar Kanban

1. Abra a seção `Kanban`.
2. Clique em `Novo card`.
3. Preencha titulo, coluna, prioridade, tag e data.
4. Salve.
5. Arraste cards entre colunas para atualizar o fluxo.

## Usar POPs e fichas técnicas

1. Abra `POPs e Fichas`.
2. Clique em `Nova ficha`.
3. Informe nome do prato, ícone, tipo, versão e observações.
4. Salve.

## Alterar tema e idioma

1. Abra `Configuracoes`.
2. Escolha tema claro ou escuro.
3. Escolha idioma.

As preferências ficam salvas no navegador.

## Sair do sistema

1. Abra `Configuracoes`.
2. Clique em sair/logout.
3. Confirme.

O token é removido do `localStorage` e o usuário volta para a tela de login.

## Limpar dados locais

Se quiser apagar os dados salvos apenas no navegador:

1. Abra as ferramentas do desenvolvedor.
2. Vá em Application/Aplicacao.
3. Abra Local Storage.
4. Remova as chaves do projeto.

Principais chaves:

- `cozinha-auth-token`
- `cozinha-user`
- `cozinha-cardapio-itens`
- `dark-mode`
- `lang`
- `current-page`
