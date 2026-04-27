from flask import Flask, request, jsonify
from flask_cors import CORS
from database import executar
# frontend acessar o backend

main = Flask(__name__)
CORS(main)


# ── Rota de login ────────────────────────────
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    senha = data.get('senha')

    usuario = executar("""
        SELECT * FROM usuarios
        WHERE email = %s AND senha = %s
    """, (email, senha), fetchone=True)

    if usuario:
        return jsonify({"mensagem": "Login realizado com sucesso"}), 200
    else:
        return jsonify({"erro": "Usuário ou senha inválidos"}), 401

# ── Rodar servidor ───────────────────────────
if __name__ == '__main__':
    main.run(debug=True)