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

class Categoria(db.Model):
    __tablename__ = 'categorias'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=True)
    icone = db.Column(db.String(50), nullable=True) # Ex: 'fa-seedling', 'fa-star'

    # Relacionamento: permite acessar os produtos de uma categoria diretamente (para a Task 03.1)
    # produtos = db.relationship('Produto', backref='categoria', lazy=True)

    def __repr__(self):
        return f'<Categoria {self.nome}>'

@event.listens_for(Categoria, 'before_insert')
@event.listens_for(Categoria, 'before_update')
def receive_before_insert(mapper, connection, target):
    if target.nome and not target.slug:
        target.slug = slugify(target.nome)  