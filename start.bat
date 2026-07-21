@echo off
title Servidor Flask
color 0A

echo ========================================
echo   Iniciando Servidor Flask
echo ========================================
echo.

REM Verifica se o Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Instale o Python e tente novamente.
    pause
    exit /b 1
)

REM Cria o ambiente virtual se não existir
if not exist "venv\" (
    echo AVISO: Venv não encontrado!
    echo Criando ambiente virtual - venv...
    python -m venv venv
    echo Venv criado com sucesso!
    echo.
)

REM Ativa ambiente virtual se existir
if exist venv\Scripts\activate (
    echo Ativando ambiente virtual...
    call venv\Scripts\activate
)

REM 3. Garantir a instalacao de TODAS as dependencias do requirements.txt
echo Verificando e instalando dependencias do requirements.txt...
pip install -r requirements.txt

REM Define o arquivo principal
set FLASK_APP=app.py
set FLASK_ENV=development
set FLASK_DEBUG=1

REM Abre o Chrome automaticamente
start chrome http://localhost:5000

REM Inicia a aplicação
echo Iniciando aplicacao em http://localhost:5000
echo Pressione CTRL+C para encerrar
echo ========================================
echo.

python app.py

pause