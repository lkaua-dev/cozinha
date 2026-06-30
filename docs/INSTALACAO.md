# Instalação e Ambiente

Este guia mostra como preparar o projeto do zero: frontend, backend, ambiente virtual, `.env` e banco MySQL.

## Requisitos

Instale ou tenha disponível:

- Python 3.10 ou superior.
- Navegador moderno.
- MySQL, apenas se for usar o backend com banco.
- Git, opcional, se for baixar o projeto por repositório.
- Node.js, opcional, apenas para validar JavaScript com `node --check`.

## Baixar ou abrir o projeto

Se voce recebeu a pasta pronta, abra:

```text
C:\Users\kaual\Desktop\cozinha
```

Se for baixar por Git:

```powershell
git clone <url-do-repositorio> cozinha
cd cozinha
```

Se for baixar por ZIP:

1. Baixe o arquivo ZIP.
2. Extraia para uma pasta simples, por exemplo `C:\Users\kaual\Desktop\cozinha`.
3. Abra um terminal nessa pasta.

## Rodar apenas o frontend

Esse é o modo mais simples. Ele não exige MySQL nem backend.

```powershell
cd C:\Users\kaual\Desktop\cozinha\cozinha\frontend
python -m http.server 8026
```

Acesse:

```text
http://localhost:8026
```

Use login demo:

```text
Usuario: admin
Senha: 123456
```

ou:

```text
Usuario: cozinha@teste.com
Senha: 123456
```

## Criar ambiente virtual do backend

Entre na pasta do backend:

```powershell
cd C:\Users\kaual\Desktop\cozinha\cozinha\backend
```

Crie o ambiente virtual:

```powershell
python -m venv .venv
```

Ative no PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Se o PowerShell bloquear a ativacao, rode uma vez:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Depois tente ativar de novo.

Em Git Bash, Linux ou macOS, a ativacao seria:

```bash
source .venv/bin/activate
```

## Instalar dependências

Com o ambiente virtual ativado:

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

O backend usa:

- `Flask`
- `flask-cors`
- `mysql-connector-python`
- `python-dotenv`

## Criar o `.env`

Ainda dentro de `cozinha/backend`, copie o exemplo:

```powershell
copy .env.example .env
```

Edite o arquivo `.env` conforme seu MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=cozinha
DB_PORT=3306
```

O `.env` real fica fora do Git. O arquivo versionado é apenas `.env.example`.

## Preparar o MySQL

Abra o MySQL e execute o arquivo da raiz:

```text
banco.sql
```

Ele cria:

- Banco `cozinha`.
- Tabela `usuarios`.
- Tabela `estoque`.
- Usuário demo `cozinha@teste.com` com senha `123456`.
- Alguns itens iniciais de estoque.

Exemplo via linha de comando:

```powershell
mysql -u root -p < C:\Users\kaual\Desktop\cozinha\banco.sql
```

## Rodar o backend

Com o `.venv` ativado:

```powershell
cd C:\Users\kaual\Desktop\cozinha\cozinha\backend
python main.py
```

Por padrão o Flask sobe em:

```text
http://127.0.0.1:5000
```

Teste:

```text
http://127.0.0.1:5000/health
```

Resposta esperada:

```json
{"status":"ok"}
```

## Rodar frontend e backend juntos

Use dois terminais.

Terminal 1:

```powershell
cd C:\Users\kaual\Desktop\cozinha\cozinha\backend
.\.venv\Scripts\Activate.ps1
python main.py
```

Terminal 2:

```powershell
cd C:\Users\kaual\Desktop\cozinha\cozinha\frontend
python -m http.server 8026
```

Abra:

```text
http://localhost:8026
```

## Validar a instalação

Frontend:

- Abra a home.
- Entre no login demo.
- Abra o dashboard.
- Navegue pelas seções.
- Teste sidebar aberta e fechada.
- Teste em largura mobile.

Backend:

```powershell
python -m py_compile main.py app\database.py
```

Rotas uteis para testar:

```text
GET http://127.0.0.1:5000/health
GET http://127.0.0.1:5000/estoque
GET http://127.0.0.1:5000/dashboard/resumo
```

JavaScript externo:

```powershell
node --check C:\Users\kaual\Desktop\cozinha\cozinha\frontend\js\index.js
node --check C:\Users\kaual\Desktop\cozinha\cozinha\frontend\js\login_geral.js
```

## Problemas comuns

### `python` não e reconhecido

Instale Python e marque a opção "Add Python to PATH", ou use o caminho completo do executavel.

### PowerShell não ativa o `.venv`

Rode:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Backend não conecta no banco

Verifique:

- MySQL está aberto.
- `DB_USER` e `DB_PASSWORD` estao corretos.
- O banco `cozinha` existe.
- `banco.sql` foi executado.

### Login via backend falha

Confirme se existe o usuário:

```text
cozinha@teste.com / 123456
```

O login demo `admin / 123456` funciona no frontend mesmo sem backend.

### Porta ocupada

Troque a porta do servidor estático:

```powershell
python -m http.server 8030
```

Depois acesse:

```text
http://localhost:8030
```
