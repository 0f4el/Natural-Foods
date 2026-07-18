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

REM Ativa ambiente virtual se existir
if exist venv\Scripts\activate (
    echo Ativando ambiente virtual...
    call venv\Scripts\activate
)

REM Verifica se o Flask está instalado
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo AVISO: Flask nao encontrado!
    echo Instalando Flask...
    pip install flask
    echo.
)

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