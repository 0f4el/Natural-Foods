from flask import Flask, render_template
from extensions import db, migrate

app = Flask(__name__)

# Configurações do Banco de Dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///NTFood.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Chave secreta (necessária para sessões e Flask-Admin)
app.config['SECRET_KEY'] = 'natural-foods-secret-key-123'

# Inicializa as extensões do banco de dados e migrações
db.init_app(app)
migrate.init_app(app, db)

# Importa os models para o SQLAlchemy reconhecer as tabelas
import models

@app.route("/")
def hello_world():
    return render_template("teste.html")

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
