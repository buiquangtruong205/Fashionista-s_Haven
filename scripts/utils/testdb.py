import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT', 5432),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASS'),
            dbname=os.getenv('DB_NAME')
        )
        print("Connected to PostgreSQL successfully!")
        cur = conn.cursor()
        cur.execute("SELECT version();")
        record = cur.fetchone()
        print("You are connected to - ", record)
        cur.close()
        conn.close()
    except Exception as error:
        print("Error while connecting to PostgreSQL:", error)

if __name__ == "__main__":
    test_connection()
