# Backend Flask para autenticação de usuário da aplicação Cozinha.
# Recebe requisições do frontend, valida dados e consulta o banco MySQL.
import uuid

from flask import Flask, request, jsonify
from flask_cors import CORS
from app.database import executar

VALID_TOKENS = set()

# Permite chamadas do frontend local para este backend.
main = Flask(__name__)
CORS(main)


def obter_token():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth.split(" ", 1)[1]
    return request.headers.get("X-Auth-Token") or None


def token_valido(token):
    return token in VALID_TOKENS


def gerar_token():
    token = uuid.uuid4().hex
    VALID_TOKENS.add(token)
    return token


@main.before_request
def validar_token():
    if request.endpoint in ("login", "static", None):
        return None

    token = obter_token()
    if not token or not token_valido(token):
        return jsonify({"erro": "Token inválido"}), 401

    return None


# ── Rota de login ────────────────────────────
@main.route("/login", methods=["POST"])
def login():
    try:
        # Recebe dados do frontend
        data = request.get_json()

        # Validação básica
        if not data:
            return jsonify({"erro": "Dados não enviados"}), 400

        email = data.get("email")
        senha = data.get("senha")

        if not email or not senha:
            return jsonify({"erro": "Preencha todos os campos"}), 400

        # Busca usuário no banco
        usuario = executar(
            """
            SELECT * FROM usuarios
            WHERE email = %s AND senha = %s
        """,
            (email, senha),
            fetchone=True,
        )

        # Usuário não encontrado
        if not usuario:
            return jsonify({"erro": "Usuário ou senha inválidos"}), 401

        token = gerar_token()

        # Sucesso
        return (
            jsonify(
                {
                    "mensagem": "Login realizado com sucesso",
                    "usuario": usuario["email"],
                    "token": token,
                }
            ),
            200,
        )

    # Erro de banco de dados
    except Exception as e:
        print("Erro no login:", e)

        return jsonify({"erro": "Erro interno no servidor"}), 500


# ── Rota de logout ──────────────────────────
@main.route("/logout", methods=["POST"])
def logout():
    token = obter_token()
    if token and token in VALID_TOKENS:
        VALID_TOKENS.discard(token)
        return jsonify({"mensagem": "Logout realizado com sucesso"}), 200

    return jsonify({"erro": "Token inválido"}), 401


# ── Rodar servidor ───────────────────────────
if __name__ == "__main__":
    main.run(debug=True)
