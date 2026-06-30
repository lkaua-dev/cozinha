# Changelog

Registro das mudanças relevantes do projeto.

## 2026-06-30 - Organização da documentação e setup local

### Criado

- `docs/INSTALACAO.md` com passo a passo de ambiente virtual, dependências, `.env`, MySQL, frontend e backend.
- `docs/AGRADECIMENTOS.md` com o contexto do Saga SENAI, demanda real da Kantine Gastronomia, equipe TecnoByte e abertura do código.
- `docs/assets/agradecimentos-banner.svg` como banner local da página de agradecimentos.
- Schema inicial em `banco.sql` para desenvolvimento local.

### Atualizado

- `README.md` reorganizado como porta de entrada do projeto.
- `docs/COMO-USAR.md` reescrito como guia de uso da interface.
- `docs/ESTRUTURA.md` reescrito com mapa de arquivos.
- `docs/FUNCIONALIDADES.md` reorganizado por área.
- `docs/DASHBOARD.md` reescrito com fontes de dados e cálculos.
- `docs/GUIA-DE-MANUTENCAO.md` refeito com orientações praticas de alteracao.
- `cozinha/backend/.env.example` ganhou orientação de copia para `.env`.
- `requirements.txt` da raiz e do backend foram alinhados.

### Corrigido

- Removida uma linha invalida do `cozinha/backend/requirements.txt`.
- `cozinha/backend/app/database.py` agora carrega variaveis do `.env` com `python-dotenv`.

## 2026-06-08 - Documentação geral do projeto

### Criado

- Pasta `docs/`.
- `docs/ESTRUTURA.md`.
- `docs/FUNCIONALIDADES.md`.
- `docs/DASHBOARD.md`.
- `docs/GUIA-DE-MANUTENCAO.md`.
- `docs/COMO-USAR.md`.
- `docs/CHANGELOG.md`.

### Atualizado

- `README.md` com objetivo, execução, estrutura, dados, dashboard, imagens e manutenção.

### Observações

- Nenhuma funcionalidade foi removida nessa etapa.
- A documentação passou a descrever `localStorage`, dados demonstrativos e backend Flask opcional.
