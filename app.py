from flask import Flask, render_template
<<<<<<< HEAD

app = Flask(__name__)

=======
<<<<<<< HEAD

app = Flask(__name__)

=======
from extensions import db, migrate

app = Flask(__name__)

# Configura o banco SQLite (criará um arquivo chamado 'marmitas.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///NTFood.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco de dados e as migrações na aplicação
db.init_app(app)
migrate.init_app(app, db)

# Importa os models para que o Flask reconheça as tabelas
import models

>>>>>>> 0a9b4c3 ((feat-BE): Criação de Models categorias e inicialização do DB)
>>>>>>> 85e3744 ((feat-BE): Criação do Models Categorias e Inicialização do DB)
@app.route("/")
def hello_world():
    return render_template("teste.html")

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)