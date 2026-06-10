from datetime import date, datetime

from flask import Flask, jsonify, request
from flask_cors import CORS

from app.database import executar, get_cursor


app = Flask(__name__)
CORS(app)

# Função auxiliar para converter valores para float de forma segura, tratando casos de None ou valores inválidos
def float_safe(value):
    if value is None:
        return 0.0
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0

# Calcula o status do estoque com base na quantidade e no mínimo definido
def calcular_status_estoque(quantidade, minimo):
    quantidade = float_safe(quantidade)
    minimo = float_safe(minimo)

    if minimo <= 0:
        return "crítico" if quantidade <= 0 else "normal"

    if quantidade <= minimo:
        return "crítico"
    if quantidade <= (minimo * 1.5):
        return "alerta"
    return "normal"

# Calcula o nível de progresso do estoque em relação ao mínimo, retornando um percentual entre 0 e 100
def calcular_nivel_progresso(quantidade, minimo):
    quantidade = float_safe(quantidade)
    minimo = float_safe(minimo)

    if minimo <= 0:
        return 100 if quantidade > 0 else 0

    pct = (quantidade / minimo) * 100
    return max(0, min(round(pct, 2), 100))

# Calcula o status de validade com base na data de validade, retornando "vencido", "vence_em_7_dias" ou "ok"
def calcular_status_validade(validade):
    if not validade:
        return None

    if isinstance(validade, str):
        validade = datetime.strptime(validade, "%Y-%m-%d").date()

    hoje = date.today()
    dias = (validade - hoje).days

    if dias < 0:
        return "vencido"
    if dias <= 7:
        return "vence_em_7_dias"
    return "ok"

# Enriquecer o item do estoque com os status calculados e outras informações derivadas, como falta para o mínimo e validade formatada
def enriquecer_item(item):
    quantidade = item.get("quantidade")
    minimo = item.get("minimo")
    validade = item.get("validade")

    if validade and not isinstance(validade, str):
        validade = validade.isoformat()

    return {
        **item,
        "quantidade": float_safe(quantidade),
        "minimo": float_safe(minimo),
        "status_estoque": calcular_status_estoque(quantidade, minimo),
        "progresso_estoque": calcular_nivel_progresso(quantidade, minimo),
        "status_validade": calcular_status_validade(validade),
        "falta_para_minimo": max(float_safe(minimo) - float_safe(quantidade), 0),
        "validade": validade,
    }

# le os items do banco, ordenando do mais recente para o mais antigo, e já retorna eles enriquecidos com os status calculados
def buscar_itens():
    itens = executar("SELECT * FROM estoque ORDER BY created_at DESC", fetchall=True) or []
    return [enriquecer_item(item) for item in itens]

# Monta um resumo para o dashboard, calculando totais, contagens por status e percentuais com base nos itens do estoque
def montar_resumo_dashboard():
    itens = buscar_itens()

    total_itens = len(itens)
    total_estoque = round(sum(item["quantidade"] for item in itens), 2)

    itens_criticos = [item for item in itens if item["status_estoque"] == "crítico"]
    itens_alerta = [item for item in itens if item["status_estoque"] == "alerta"]
    itens_normais = [item for item in itens if item["status_estoque"] == "normal"]

    vencidos = [item for item in itens if item["status_validade"] == "vencido"]
    vencendo_7_dias = [item for item in itens if item["status_validade"] == "vence_em_7_dias"]

    return {
        "total_itens": total_itens,
        "estoque_total": total_estoque,
        "itens_criticos": len(itens_criticos),
        "itens_alerta": len(itens_alerta),
        "itens_normais": len(itens_normais),
        "itens_vencidos": len(vencidos),
        "itens_vencendo_7_dias": len(vencendo_7_dias),
        "cmv_status": None,
        "percentual_criticos": round((len(itens_criticos) / total_itens) * 100, 2) if total_itens else 0,
        "percentual_alerta": round((len(itens_alerta) / total_itens) * 100, 2) if total_itens else 0,
    }

# Endpoint para verificar a saúde da API, retornando um status "ok" se estiver funcionando corretamente
@app.get("/health")
def health():
    return jsonify({"status": "ok"}), 200

# Endpoint para login, verificando as credenciais do usuário e retornando uma mensagem de sucesso ou erro conforme o caso
@app.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"erro": "Preencha todos os campos"}), 400

    usuario = executar(
        """
        SELECT id, email
        FROM usuarios
        WHERE email = %s AND senha = %s
        """,
        (email, senha),
        fetchone=True,
    )

    if not usuario:
        return jsonify({"erro": "Usuário ou senha inválidos"}), 401

    return jsonify({
        "mensagem": "Login realizado com sucesso",
        "usuario": usuario,
    }), 200

#   Endpoints para CRUD do estoque, permitindo listar, obter, criar, atualizar e excluir itens do estoque, com validações e respostas adequadas para cada caso
@app.get("/estoque")
def listar_estoque():
    return jsonify(buscar_itens()), 200

# Endpoint para obter um item específico do estoque pelo ID, retornando os detalhes do item ou um erro se não for encontrado
@app.get("/estoque/<int:item_id>")
def obter_item(item_id):
    item = executar(
        "SELECT * FROM estoque WHERE id = %s",
        (item_id,),
        fetchone=True,
    )

    if not item:
        return jsonify({"erro": "Item não encontrado"}), 404

    return jsonify(enriquecer_item(item)), 200

#   Endpoint para criar um novo item no estoque, recebendo os dados do item no corpo da requisição, validando os campos obrigatórios e inserindo no banco de dados
@app.post("/estoque")
def criar_item():
    data = request.get_json(silent=True) or {}

    nome = data.get("nome")
    quantidade = data.get("quantidade")
    unidade = data.get("unidade")
    validade = data.get("validade")
    minimo = data.get("minimo", 0)

    if not nome or quantidade is None or not unidade:
        return jsonify({"erro": "nome, quantidade e unidade são obrigatórios"}), 400

    with get_cursor() as (_conn, cursor):
        cursor.execute(
            """
            INSERT INTO estoque (nome, quantidade, unidade, validade, minimo)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (nome, quantidade, unidade, validade or None, minimo),
        )
        novo_id = cursor.lastrowid

    return jsonify({"mensagem": "Item criado com sucesso", "id": novo_id}), 201

# Endpoint para atualizar um item existente no estoque, recebendo os dados atualizados no corpo da requisição e aplicando as mudanças no banco de dados, mantendo os valores anteriores para campos não fornecidos
@app.put("/estoque/<int:item_id>")
def atualizar_item(item_id):
    data = request.get_json(silent=True) or {}

    item = executar(
        "SELECT * FROM estoque WHERE id = %s",
        (item_id,),
        fetchone=True,
    )

    if not item:
        return jsonify({"erro": "Item não encontrado"}), 404

    nome = data.get("nome", item["nome"])
    quantidade = data.get("quantidade", item["quantidade"])
    unidade = data.get("unidade", item["unidade"])
    validade = data.get("validade", item["validade"])
    minimo = data.get("minimo", item["minimo"])

    with get_cursor() as (_conn, cursor):
        cursor.execute(
            """
            UPDATE estoque
            SET nome = %s,
                quantidade = %s,
                unidade = %s,
                validade = %s,
                minimo = %s
            WHERE id = %s
            """,
            (nome, quantidade, unidade, validade, minimo, item_id),
        )

    return jsonify({"mensagem": "Item atualizado com sucesso"}), 200

# Endpoint para excluir um item do estoque pelo ID, removendo o registro do banco de dados e retornando uma mensagem de sucesso ou erro se o item não for encontrado
@app.delete("/estoque/<int:item_id>")
def excluir_item(item_id):
    item = executar(
        "SELECT id FROM estoque WHERE id = %s",
        (item_id,),
        fetchone=True,
    )

    if not item:
        return jsonify({"erro": "Item não encontrado"}), 404

    executar("DELETE FROM estoque WHERE id = %s", (item_id,))
    return jsonify({"mensagem": "Item excluído com sucesso"}), 200

# Endpoints para o dashboard, fornecendo dados resumidos, listas de itens filtrados por status, alertas de estoque e validade, e progresso do estoque para exibição no frontend
@app.get("/dashboard/resumo")
def dashboard_resumo():
    return jsonify(montar_resumo_dashboard()), 200

# Endpoint para listar os itens do estoque filtrados por status, permitindo que o frontend solicite apenas os itens críticos, em alerta ou normais conforme a necessidade
@app.get("/dashboard/itens")
def dashboard_itens():
    status = request.args.get("status")
    itens = buscar_itens()

    if status:
        itens = [item for item in itens if item["status_estoque"] == status]

    return jsonify(itens), 200

# Endpoint para listar os alertas de estoque e validade, retornando uma lista de itens que estão em status crítico, alerta ou vencidos, com informações relevantes para o usuário tomar ações
@app.get("/dashboard/alertas")
def dashboard_alertas():
    itens = buscar_itens()
    alertas = []

    for item in itens:
        if item["status_estoque"] in ("crítico", "alerta"):
            alertas.append({
                "tipo": "estoque",
                "titulo": f'{item["nome"]} está em {item["status_estoque"]}',
                "descricao": f'Quantidade atual: {item["quantidade"]} {item["unidade"]} | Mínimo: {item["minimo"]} {item["unidade"]}',
                "item_id": item["id"],
            })

        if item["status_validade"] == "vence_em_7_dias":
            alertas.append({
                "tipo": "validade",
                "titulo": f'{item["nome"]} vence em até 7 dias',
                "descricao": f'Validade: {item["validade"]}',
                "item_id": item["id"],
            })

        if item["status_validade"] == "vencido":
            alertas.append({
                "tipo": "validade",
                "titulo": f'{item["nome"]} está vencido',
                "descricao": f'Validade: {item["validade"]}',
                "item_id": item["id"],
            })

    return jsonify(alertas), 200

# Endpoint para fornecer os dados de progresso do estoque, retornando uma lista de itens com seus níveis de estoque e status para exibição em gráficos ou indicadores no frontend
@app.get("/dashboard/progresso")
def dashboard_progresso():
    itens = buscar_itens()
    return jsonify([
        {
            "id": item["id"],
            "nome": item["nome"],
            "progresso_estoque": item["progresso_estoque"],
            "status_estoque": item["status_estoque"],
            "quantidade": item["quantidade"],
            "minimo": item["minimo"],
            "unidade": item["unidade"],
        }
        for item in itens
    ]), 200

# Roda a aplicação Flask em modo de desenvolvimento, permitindo que seja acessada localmente para testes e desenvolvimento do frontend
if __name__ == "__main__":
    app.run(debug=True)
