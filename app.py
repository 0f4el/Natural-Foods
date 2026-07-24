from flask import Flask, render_template, request
from extensions import db, migrate
from admin_config import init_admin
from models import Categoria, Produto
import os

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

# Define o caminho absoluto para a pasta de imagens
UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads', 'produtos')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Verifica se a pasta NÃO existe antes de criar
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# === ROTAS ===

@app.route('/')
def index():
    # Captura o slug da categoria passado na URL (ex: /?categoria=low-carb)
    categoria_slug = request.args.get('categoria')
    
    # Busca todas as categorias cadastradas para alimentar os botões do menu
    categorias = Categoria.query.all()

    if categoria_slug:
        # Task 04.1: Junta a tabela Produto com Categoria e filtra pelo slug e por produtos ativos
        produtos = Produto.query.join(Categoria).filter(
            Categoria.slug == categoria_slug,
            Produto.ativo == True
        ).all()
    else:
        # Se nenhum parâmetro for informado, traz todos os produtos ativos
        produtos = Produto.query.filter_by(ativo=True).all()

    return render_template(
        'index.html',
        produtos=produtos,
        categorias=categorias,
        categoria_ativa=categoria_slug
    )

# === ----- ===

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
