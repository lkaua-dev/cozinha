# Cozinha

Sistema web para apoio a gestão de cozinha, cardápio, estoque, pedidos, indicadores e rotinas administrativas.

O projeto funciona principalmente como frontend estático com HTML, CSS e JavaScript puro. Também existe um backend Flask opcional para login, estoque e endpoints de dashboard usando MySQL.

## Status do projeto

- Frontend: pronto para abrir no navegador ou servir com `python -m http.server`.
- Login: possui credenciais demonstrativas e tentativa de login via backend.
- Dashboard: usa dados salvos no navegador e cai para dados demonstrativos quando não encontra dados reais.
- Backend: opcional, em Flask, com rotas de login, estoque e resumo.
- Banco: MySQL opcional, com schema inicial em `banco.sql`.

## Começo rápido

Para testar apenas a interface:

```powershell
cd C:\Users\SEU_USUARIO\Desktop\cozinha\cozinha\frontend
python -m http.server 8026
```

Depois abra:

```text
http://localhost:8026
```

Credenciais demo:

```text
Usuario: admin
Senha: 123456
```

Também funciona:

```text
Usuario: cozinha@teste.com
Senha: 123456
```

## Instalação completa

O passo a passo completo está em:

- [docs/INSTALACAO.md](docs/INSTALACAO.md)

Esse guia mostra como:

- Baixar ou abrir o projeto.
- Criar ambiente virtual Python.
- Instalar dependências.
- Criar o `.env`.
- Preparar o MySQL.
- Rodar frontend e backend.
- Testar se tudo está respondendo.

## Documentação

- [Como usar](docs/COMO-USAR.md): fluxo de uso da interface.
- [Instalação](docs/INSTALACAO.md): ambiente virtual, dependências, `.env`, banco e execução.
- [Estrutura](docs/ESTRUTURA.md): organização de pastas e arquivos.
- [Funcionalidades](docs/FUNCIONALIDADES.md): recursos disponíveis por área.
- [Dashboard](docs/DASHBOARD.md): fontes de dados, normalização e cálculos.
- [Guia de manutenção](docs/GUIA-DE-MANUTENCAO.md): como alterar sem quebrar o projeto.
- [Changelog](docs/CHANGELOG.md): histórico de mudanças.
- [Agradecimentos](docs/AGRADECIMENTOS.md): contexto do Saga SENAI, demanda real e equipe TecnoByte.

## Agradecimentos

Este projeto faz parte do Saga SENAI, nasceu de uma demanda real da Kantine Gastronomia e foi desenvolvido pela equipe TecnoByte como TCC do curso técnico em Desenvolvimento de Sistemas.

O código é aberto para estudo, melhorias, sugestões e novas contribuições. Mais detalhes em [docs/AGRADECIMENTOS.md](docs/AGRADECIMENTOS.md).

## Como funciona

### Frontend

O frontend fica em `cozinha/frontend` e concentra:

- `index.html`: página pública.
- `login.html`: entrada do sistema.
- `recuperar.html`: recuperação de acesso.
- `dashboard.html`: painel administrativo completo.
- `css/`: estilos externos da home, login e recuperação.
- `js/`: scripts externos da home e login.

O `dashboard.html` ainda concentra bastante coisa em um arquivo só: HTML, CSS inline e JavaScript inline. Por isso, alterações nele devem ser pequenas e testadas em desktop e mobile.

### Dados no navegador

Boa parte do sistema usa `localStorage`. Principais chaves:

- `cozinha-auth-token`
- `cozinha-user`
- `cozinha-cardapio-itens`
- `cozinha-pedidos`
- `cozinha-produtos`
- `sidebar-collapsed`
- `dark-mode`
- `lang`
- `current-page`

Se não houver dados salvos, o dashboard mostra dados demonstrativos para evitar uma tela vazia.

### Backend

O backend fica em `cozinha/backend`.

Rotas principais:

- `GET /health`
- `POST /login`
- `GET /estoque`
- `GET /estoque/<id>`
- `POST /estoque`
- `PUT /estoque/<id>`
- `DELETE /estoque/<id>`
- `GET /dashboard/resumo`
- `GET /dashboard/itens`
- `GET /dashboard/alertas`
- `GET /dashboard/progresso`

As configurações do banco ficam em `.env`, criado a partir de:

```text
cozinha/backend/.env.example
```

## Manutenção rapida

Antes de entregar mudanças, valide o que foi alterado:

```powershell
node --check cozinha/frontend/js/index.js
node --check cozinha/frontend/js/login_geral.js
python -m py_compile cozinha/backend/main.py cozinha/backend/app/database.py
```

Para testar visualmente:

- Abra `index.html`.
- Teste login.
- Abra `dashboard.html`.
- Confira sidebar aberta/fechada.
- Confira mobile.
- Teste cadastro, edicao e remoção no cardápio/estoque.

## Observações importantes

- O backend usa senha simples apenas para ambiente local/demonstrativo.
- O arquivo `.env` real não deve ser enviado para o Git.
- Imagens do cardápio sao salvas em base64 no `localStorage`; imagens muito grandes podem estourar o limite do navegador.
- `banco.sql` contém um schema inicial para desenvolvimento local.
