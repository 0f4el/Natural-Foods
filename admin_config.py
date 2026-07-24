from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from extensions import db
from models import Categoria, Produto
from wtforms.validators import Optional
from flask import current_app
from flask_admin.form.upload import FileUploadField
import os

# Descobre o caminho raiz do seu projeto a partir da localização deste arquivo
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ==========================================
# ADMIN VIEW: Categoria
# ==========================================
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
        ,
        'icone': {
            'label': 'Ícone (FontAwesome)',
            'description': 'Insira as classes do FontAwesome. Exemplo: "fa-solid fa-star", "fa-solid fa-drumstick-bite", "fa-solid fa-seedling". Consulte em: https://fontawesome.com/icons'
        }       
    }

    # Dica visual para o usuário de que o campo pode ser deixado em branco
    form_widget_args = {
        'slug': {
            'placeholder': 'Deixe em branco para gerar automaticamente'
        }
    }

# ==========================================
# ADMIN VIEW: Produto
# ==========================================
class ProdutoAdminView(ModelView):
    # Colunas visíveis na tabela de listagem do painel
    column_list = ('id', 'nome', 'preco', 'destaque', 'categoria', 'slug')
    
    # Campos disponíveis para busca
    column_searchable_list = ['nome', 'descricao', 'slug']
    
    # Filtros na barra lateral (permite filtrar por categoria e destaque)
    column_filters = ['categoria.nome', 'destaque', 'preco']
    
    # Subtitui o campo 'imagem' por um uploader de arquivos
    form_extra_fields = {
        'imagem': FileUploadField(
            'Imagem do Produto',
            # Usa a constante BASE_DIR apontando para a pasta static
            base_path=os.path.join(BASE_DIR, 'static'),
            relative_path='uploads/produtos/',
            allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'gif']
        )
    }

    form_args = {
        'slug': {'validators': [Optional()]},
        'imagem': {'validators': [Optional()]}
    }

    form_optional_types = (db.String,)

    # Customiza visualmente os campos do formulário de criação/edição
    form_widget_args = {
        'slug': {
            'placeholder': 'Deixe em branco para gerar automaticamente'
        },
        'descricao': {
            'rows': 4
        }
    }


# ==========================================
# INICIALIZAÇÃO DO ADMIN
# ==========================================
def init_admin(app):
    admin = Admin(app, name='Natural Foods Admin')   

    # Registra as visões no painel
    admin.add_view(CategoriaAdminView(Categoria, db.session, name='Categorias'))
    admin.add_view(ProdutoAdminView(Produto, db.session, name='Produtos'))