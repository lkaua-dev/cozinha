import os
from contextlib import contextmanager

import mysql.connector


DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "root"),
    "database": os.getenv("DB_NAME", "cozinha"),
    "port": int(os.getenv("DB_PORT", "3306")),
}


def conectar():
    return mysql.connector.connect(**DB_CONFIG)

# Context manager para gerenciar conexões e cursores do banco de dados, garantindo que sejam fechados corretamente mesmo em caso de erros, e permitindo a execução de múltiplas operações dentro do mesmo contexto
@contextmanager
def get_cursor(dictionary=True):
    conn = conectar()
    cursor = conn.cursor(dictionary=dictionary)
    try:
        yield conn, cursor
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


def executar(query, valores=None, fetchone=False, fetchall=False):
    with get_cursor() as (_conn, cursor):
        cursor.execute(query, valores or ())
        if fetchone:
            return cursor.fetchone()
        if fetchall:
            return cursor.fetchall()
        return cursor.rowcount
