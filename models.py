from extensions import db
import re
from sqlalchemy import event

def slugify(text):
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[àáâãäå]', 'a', text)
    text = re.sub(r'[èéêë]', 'e', text)
    text = re.sub(r'[ìíîï]', 'i', text)
    text = re.sub(r'[òóôõö]', 'o', text)
    text = re.sub(r'[ùúûü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text

# ==========================================
# MODEL: Categoria
# ==========================================
class Categoria(db.Model):
    __tablename__ = 'categorias'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=True)
    icone = db.Column(db.String(50), nullable=True) # Ex: 'fa-seedling', 'fa-star'

    produtos = db.relationship('Produto', backref='categoria', lazy=True)

    def __repr__(self):
        return f'<Categoria {self.nome}>'

@event.listens_for(Categoria, 'before_insert')
@event.listens_for(Categoria, 'before_update')
def receive_before_insert(mapper, connection, target):
    if target.nome and not target.slug:
        target.slug = slugify(target.nome)  

# ==========================================
# MODEL: Produto
# ==========================================
class Produto(db.Model):
    __tablename__ = 'produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150), nullable=False)
    slug = db.Column(db.String(150), unique=True, nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    preco = db.Column(db.Float, nullable=False)
    imagem = db.Column(db.String(255), nullable=True)  # Nome/Caminho da imagem
    destaque = db.Column(db.Boolean, default=False)     # Para exibir na Home se for True

    # Chave Estrangeira apontando para a tabela 'categorias'
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)

# Auto-gera o slug do Produto antes de salvar
@event.listens_for(Produto, 'before_insert')
@event.listens_for(Produto, 'before_update')
def receive_before_insert_produto(mapper, connection, target):
    if target.nome and not target.slug:
        target.slug = slugify(target.nome)