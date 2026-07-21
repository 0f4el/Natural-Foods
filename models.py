from extensions import db

class Categoria(db.Model):
    __tablename__ = 'categorias'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    icone = db.Column(db.String(50), nullable=True) # Ex: 'fa-seedling', 'fa-star'

    # Relacionamento: permite acessar os produtos de uma categoria diretamente (para a Task 03.1)
    produtos = db.relationship('Produto', backref='categoria', lazy=True)

    def __repr__(self):
        return f'<Categoria {self.nome}>'