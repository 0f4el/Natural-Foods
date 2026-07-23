from flask import Flask, render_template
from extensions import db, migrate
from admin_config import init_admin
from models import Produto

app = Flask(__name__)

# Configurações do Banco de Dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///NTFood.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Chave secreta (necessária para sessões e Flask-Admin)
app.config['SECRET_KEY'] = 'natural-foods-secret-key-8681273123124'

# Inicializa as extensões do banco de dados e migrações
db.init_app(app)
migrate.init_app(app, db)

# Importa os models para o SQLAlchemy reconhecer as tabelas
import models

# Inicializa o Flask-Admin
init_admin(app)


# === ROTAS ===

@app.route('/')
def index():
    # Realiza a consulta no banco buscando apenas produtos ativos
    produtos = Produto.query.filter_by(ativo=True).all()
    
    # Retorna o template 'index.html' passando a lista de produtos
    return render_template('index.html', produtos=produtos)

# === ----- ===

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
