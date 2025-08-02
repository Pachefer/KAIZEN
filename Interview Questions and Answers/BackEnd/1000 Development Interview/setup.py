#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de configuración para el proyecto de Guía de Estudio Avanzada
Desarrollo Backend - 1000 Preguntas de Entrevista
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Ejecuta un comando y maneja errores"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completado")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}: {e}")
        print(f"Salida de error: {e.stderr}")
        return False

def check_python_version():
    """Verifica la versión de Python"""
    if sys.version_info < (3, 8):
        print("❌ Se requiere Python 3.8 o superior")
        print(f"Versión actual: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} detectado")
    return True

def install_dependencies():
    """Instala las dependencias del proyecto"""
    if not run_command("pip install -r requirements.txt", "Instalando dependencias"):
        return False
    
    # Instalar dependencias adicionales para desarrollo
    dev_deps = [
        "pytest",
        "black",
        "flake8",
        "mypy"
    ]
    
    for dep in dev_deps:
        if not run_command(f"pip install {dep}", f"Instalando {dep}"):
            print(f"⚠️ Advertencia: No se pudo instalar {dep}")
    
    return True

def create_directories():
    """Crea la estructura de directorios necesaria"""
    directories = [
        "output",
        "logs",
        "temp",
        "Guia_Estudio_Avanzada",
        "Guia_Estudio_Avanzada/categorias",
        "Guia_Estudio_Avanzada/ejemplos_codigo",
        "Guia_Estudio_Avanzada/pruebas_unitarias",
        "Guia_Estudio_Avanzada/ejercicios_practicos",
        "Guia_Estudio_Avanzada/recursos_adicionales"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Directorio creado: {directory}")
    
    return True

def create_config_file():
    """Crea archivo de configuración"""
    config_content = """# Configuración del proyecto de Guía de Estudio Avanzada
# Desarrollo Backend - 1000 Preguntas de Entrevista

[GENERAL]
# Idioma por defecto para las traducciones
default_language = es

# Número máximo de preguntas por categoría en la guía
max_questions_per_category = 50

# Incluir ejemplos de código
include_code_examples = true

# Incluir pruebas unitarias
include_unit_tests = true

[LANGUAGES]
# Lenguajes de programación soportados
supported_languages = javascript,python,java,csharp,go

# Lenguaje principal para ejemplos
primary_language = javascript

[OUTPUT]
# Formato de salida
output_format = markdown,json

# Directorio de salida
output_directory = Guia_Estudio_Avanzada

# Incluir estadísticas
include_statistics = true

[TESTING]
# Framework de testing
test_framework = pytest

# Cobertura mínima de pruebas
min_test_coverage = 80

[DEVELOPMENT]
# Herramientas de desarrollo
code_formatter = black
linter = flake8
type_checker = mypy

# Configuración de calidad de código
max_line_length = 88
"""
    
    with open("config.ini", "w", encoding="utf-8") as f:
        f.write(config_content)
    
    print("✅ Archivo de configuración creado: config.ini")
    return True

def create_gitignore():
    """Crea archivo .gitignore"""
    gitignore_content = """# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
pip-wheel-metadata/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# PyInstaller
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Translations
*.mo
*.pot

# Django stuff:
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal

# Flask stuff:
instance/
.webassets-cache

# Scrapy stuff:
.scrapy

# Sphinx documentation
docs/_build/

# PyBuilder
target/

# Jupyter Notebook
.ipynb_checkpoints

# IPython
profile_default/
ipython_config.py

# pyenv
.python-version

# pipenv
Pipfile.lock

# PEP 582
__pypackages__/

# Celery stuff
celerybeat-schedule
celerybeat.pid

# SageMath parsed files
*.sage.py

# Environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# Spyder project settings
.spyderproject
.spyproject

# Rope project settings
.ropeproject

# mkdocs documentation
/site

# mypy
.mypy_cache/
.dmypy.json
dmypy.json

# Pyre type checker
.pyre/

# Project specific
output/
logs/
temp/
*.pdf
*.epub
*.txt
!requirements.txt
!README.txt
"""
    
    with open(".gitignore", "w", encoding="utf-8") as f:
        f.write(gitignore_content)
    
    print("✅ Archivo .gitignore creado")
    return True

def run_tests():
    """Ejecuta las pruebas básicas"""
    print("🧪 Ejecutando pruebas básicas...")
    
    # Verificar que los scripts principales existen
    scripts = [
        "extract_backend_questions.py",
        "Guia_Estudio_Avanzada/generar_guia_completa.py"
    ]
    
    for script in scripts:
        if not Path(script).exists():
            print(f"⚠️ Advertencia: No se encontró {script}")
        else:
            print(f"✅ {script} encontrado")
    
    # Ejecutar pruebas de sintaxis
    if run_command("python -m py_compile extract_backend_questions.py", "Verificando sintaxis del extractor"):
        print("✅ Sintaxis del extractor correcta")
    
    return True

def main():
    """Función principal de configuración"""
    print("🚀 Configurando proyecto de Guía de Estudio Avanzada...")
    print("=" * 60)
    
    # Verificar versión de Python
    if not check_python_version():
        sys.exit(1)
    
    # Crear estructura de directorios
    if not create_directories():
        print("❌ Error al crear directorios")
        sys.exit(1)
    
    # Instalar dependencias
    if not install_dependencies():
        print("❌ Error al instalar dependencias")
        sys.exit(1)
    
    # Crear archivos de configuración
    create_config_file()
    create_gitignore()
    
    # Ejecutar pruebas básicas
    run_tests()
    
    print("\n" + "=" * 60)
    print("✅ Configuración completada exitosamente!")
    print("\n📋 Próximos pasos:")
    print("1. Coloca el archivo PDF en el directorio actual")
    print("2. Ejecuta: python extract_backend_questions.py")
    print("3. Ejecuta: python Guia_Estudio_Avanzada/generar_guia_completa.py")
    print("4. Revisa la guía generada en el directorio 'Guia_Estudio_Avanzada'")
    print("\n📚 ¡Disfruta aprendiendo desarrollo backend!")

if __name__ == "__main__":
    main() 