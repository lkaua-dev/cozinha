import mysql.connector

#conexão com banco de dados
def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="cozinha"
    )

#executa queries
def executar(query, valores=None, fetchone=False, fetchall=False):
    conn = conectar()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(query, valores or ())

    resultado = None

    if fetchone:
        resultado = cursor.fetchone()
    elif fetchall:
        resultado = cursor.fetchall()

    conn.commit()

    cursor.close()
    conn.close()

    return resultado