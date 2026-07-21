from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from extensions import db
from models import Categoria
from wtforms.validators import Optional

# Personalização da visão da Categoria no Painel
class CategoriaAdminView(ModelView):
    # Colunas visíveis na tabela de listagem do painel
    column_list = ('id', 'nome', 'slug', 'icone')
    
    # Campos que você pode buscar pelo campo de pesquisa no painel
    column_searchable_list = ['nome', 'slug']
    
    # Filtros rápidos na barra lateral do painel
    column_filters = ['nome']

    # Remove a obrigatoriedade do campo 'slug' no formulário
    form_args = {
        'slug': {
            'validators': [Optional()]
        }
    }

    # Dica visual para o usuário de que o campo pode ser deixado em branco
    form_widget_args = {
        'slug': {
            'placeholder': 'Deixe em branco para gerar automaticamente'
        }
    }

def init_admin(app):
    admin = Admin(app, name='Natural Foods Admin')   

    # Registra o Model Categoria no Flask-Admin usando a visão customizada
    admin.add_view(CategoriaAdminView(Categoria, db.session, name='Categorias'))