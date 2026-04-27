from flask import Flask, request, jsonify
from flask_cors import CORS
from app.database import executar
# frontend acessar o backend

main = Flask(__name__)
CORS(main)


# ── Rota de login ────────────────────────────
@main.route('/login', methods=['POST'])
def login():
    try:
        #Recebe dados do frontend
        data = request.get_json()

        # Validação básica
        if not data:
            return jsonify({"erro": "Dados não enviados"}), 400

        email = data.get('email')
        senha = data.get('senha')

        if not email or not senha:
            return jsonify({"erro": "Preencha todos os campos"}), 400

        #Busca usuário no banco
        usuario = executar("""
            SELECT * FROM usuarios
            WHERE email = %s AND senha = %s
        """, (email, senha), fetchone=True)

        #Usuário não encontrado
        if not usuario:
            return jsonify({"erro": "Usuário ou senha inválidos"}), 401

        #Sucesso
        return jsonify({
            "mensagem": "Login realizado com sucesso",
            "usuario": usuario["email"]
        }), 200

    #Erro de banco de dados
    except Exception as e:
        print("Erro no login:", e)

        return jsonify({
            "erro": "Erro interno no servidor"
        }), 500

# ── Rodar servidor ───────────────────────────
if __name__ == '__main__':
    main.run(debug=True)