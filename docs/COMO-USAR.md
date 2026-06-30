# Como Usar

Este guia explica o uso diário do sistema Cozinha depois que ele já está rodando.

Para preparar o ambiente do zero, leia primeiro [INSTALACAO.md](INSTALACAO.md).

## Abrir o sistema

Modo recomendado:

```powershell
cd C:\Users\SEU_USUARIO\Desktop\cozinha\cozinha\frontend
python -m http.server 8026
```

Acesse:

```text
http://localhost:8026
```

Também e possível abrir `index.html` direto no navegador, mas o servidor local evita bloqueios e comportamentos diferentes entre navegadores.

## Entrar

Na página inicial, clique em `Entrar`.

Credenciais demo:

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

## Navegar no dashboard

Use o menu lateral para acessar:

- Dashboard.
- Produção.
- Estoque.
- Cardápio / PCP.
- Kanban.
- POPs e Fichas.
- Curva ABC.
- CMV e Custos.
- Relatórios.
- Configurações.

No desktop, o botão do topo abre e recolhe a sidebar. No celular, ele abre e fecha o menu lateral por cima da tela.

## Dashboard

O dashboard mostra uma visão geral da operação:

- Faturamento total.
- Faturamento do dia.
- Total de pedidos.
- Pedidos pendentes, concluídos e cancelados.
- Ticket médio.
- Produtos cadastrados e vendidos.
- Pedidos recentes.
- Produtos mais vendidos.
- Alertas administrativos.

Os valores podem vir de dados salvos no navegador ou de uma base demonstrativa interna.

## Estoque

Na seção `Estoque`, voce pode:

- Ver itens cadastrados.
- Conferir quantidade atual, mínima e máxima.
- Ver status visual: OK, alerta ou crítico.
- Cadastrar item.
- Remover item.

Quando o backend está ligado, o frontend tenta buscar dados em:

```text
http://localhost:5000/estoque
```

Se a API não responder, a tela continua funcionando com dados demonstrativos.

## Cardápio / PCP

Na seção `Cardapio / PCP`, voce pode:

- Cadastrar item do cardápio.
- Escolher dia da semana.
- Informar prato principal e acompanhamento.
- Definir status.
- Enviar foto.
- Editar item existente.
- Remover item.

As imagens sao compactadas no navegador antes de salvar. O item fica no `localStorage`, na chave:

```text
cozinha-cardapio-itens
```

## Kanban

Na seção `Kanban`, voce pode:

- Criar cards de tarefas.
- Definir coluna, prioridade, tag e data.
- Arrastar cards entre colunas.
- Acompanhar os contadores por etapa.

## POPs e fichas

Na seção `POPs e Fichas`, voce pode:

- Criar ficha técnica.
- Informar prato, ícone, tipo, versão e observações.
- Remover fichas.

## Análises

As seções `Curva ABC` e `CMV e Custos` exibem indicadores e painéis visuais para apoiar leitura operacional.

Parte desses dados ainda e demonstrativa.

## Relatórios

A seção `Relatorios` mostra cards e botões visuais de relatório. A geração real de PDF ou Excel ainda não está implementada.

## Configurações

Na seção `Configuracoes`, voce pode:

- Alternar tema claro/escuro.
- Alterar idioma.
- Ajustar preferencias visuais.
- Sair do sistema.

Preferencias salvas no navegador:

- `dark-mode`
- `lang`
- `sidebar-collapsed`
- `current-page`

## Limpar dados locais

Para zerar os dados salvos no navegador:

1. Abra as ferramentas do desenvolvedor.
2. Va em `Application` ou `Aplicacao`.
3. Abra `Local Storage`.
4. Remova as chaves do projeto.

Principais chaves:

- `cozinha-auth-token`
- `cozinha-user`
- `cozinha-cardapio-itens`
- `cozinha-pedidos`
- `cozinha-produtos`
- `dark-mode`
- `lang`
- `sidebar-collapsed`
- `current-page`

## Sair

Use a opção de logout em `Configuracoes`.

O token e removido do navegador e o usuário volta para a tela de login.
