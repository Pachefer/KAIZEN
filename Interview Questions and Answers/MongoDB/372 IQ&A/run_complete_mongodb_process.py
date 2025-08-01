#!/usr/bin/env python3
"""
Script para ejecutar el proceso completo de generación de la guía de MongoDB
Este script automatiza todo el proceso desde la extracción hasta la generación final
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """
    Ejecuta un comando y maneja errores
    
    Args:
        command (str): Comando a ejecutar
        description (str): Descripción del comando
    """
    print(f"\n🚀 {description}")
    print(f"📝 Ejecutando: {command}")
    print("-" * 50)
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print("✅ Comando ejecutado exitosamente")
        if result.stdout:
            print("📤 Salida:")
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error ejecutando comando: {e}")
        if e.stdout:
            print("📤 Salida estándar:")
            print(e.stdout)
        if e.stderr:
            print("📤 Error estándar:")
            print(e.stderr)
        return False

def check_dependencies():
    """
    Verifica que las dependencias necesarias estén instaladas
    """
    print("🔍 Verificando dependencias...")
    
    required_packages = ['PyPDF2']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package} está instalado")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} no está instalado")
    
    if missing_packages:
        print(f"\n📦 Instalando paquetes faltantes: {', '.join(missing_packages)}")
        install_command = f"pip install {' '.join(missing_packages)}"
        if not run_command(install_command, "Instalando dependencias"):
            print("❌ Error instalando dependencias")
            return False
    
    return True

def check_files():
    """
    Verifica que los archivos necesarios existan
    """
    print("\n📁 Verificando archivos necesarios...")
    
    required_files = [
        "300_ MongoDB Interview Questions and Answe - Salunke, Manish.pdf"
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
            print(f"❌ No se encontró: {file}")
        else:
            print(f"✅ Encontrado: {file}")
    
    if missing_files:
        print(f"\n❌ Archivos faltantes: {', '.join(missing_files)}")
        print("💡 Asegúrate de tener el archivo PDF en el directorio correcto")
        return False
    
    return True

def run_extraction():
    """
    Ejecuta el proceso de extracción
    """
    print("\n📖 PASO 1: Extracción de preguntas del PDF")
    print("=" * 60)
    
    if not run_command("python extract_mongodb_questions.py", "Extrayendo preguntas del PDF"):
        print("❌ Error en la extracción")
        return False
    
    # Verifica que se crearon los archivos de salida
    output_files = ["mongodb_questions_raw.txt", "mongodb_questions_structured.json"]
    for file in output_files:
        if Path(file).exists():
            size = Path(file).stat().st_size
            print(f"✅ {file} creado ({size} bytes)")
        else:
            print(f"❌ {file} no se creó")
            return False
    
    return True

def run_processing():
    """
    Ejecuta el proceso de procesamiento
    """
    print("\n🔄 PASO 2: Procesamiento de preguntas")
    print("=" * 60)
    
    if not run_command("python process_mongodb_questions.py", "Procesando preguntas"):
        print("❌ Error en el procesamiento")
        return False
    
    # Verifica que se creó el archivo procesado
    processed_file = "mongodb_questions_processed.json"
    if Path(processed_file).exists():
        size = Path(processed_file).stat().st_size
        print(f"✅ {processed_file} creado ({size} bytes)")
    else:
        print(f"❌ {processed_file} no se creó")
        return False
    
    return True

def create_example_files():
    """
    Crea archivos de ejemplo para demostración
    """
    print("\n📝 PASO 3: Creando archivos de ejemplo")
    print("=" * 60)
    
    # Crear directorio de ejemplos si no existe
    examples_dir = Path("ejemplos_practicos")
    examples_dir.mkdir(exist_ok=True)
    
    # Crear package.json para ejemplos
    package_json = {
        "name": "mongodb-ejemplos-practicos",
        "version": "1.0.0",
        "description": "Ejemplos prácticos de MongoDB con pruebas unitarias",
        "scripts": {
            "test": "jest",
            "example:basic": "node ejemplos/01-basico.js",
            "example:aggregation": "node ejemplos/02-agregacion.js",
            "example:indexes": "node ejemplos/03-indices.js"
        },
        "dependencies": {
            "mongodb": "^5.0.0"
        },
        "devDependencies": {
            "jest": "^29.0.0",
            "mongodb-memory-server": "^9.0.0"
        }
    }
    
    import json
    with open(examples_dir / "package.json", "w") as f:
        json.dump(package_json, f, indent=2)
    
    print("✅ package.json creado")
    
    # Crear README para ejemplos
    readme_content = """# 🍃 Ejemplos Prácticos de MongoDB

## Instalación
```bash
npm install
```

## Ejecutar ejemplos
```bash
npm run example:basic
npm run example:aggregation
npm run example:indexes
```

## Ejecutar pruebas
```bash
npm test
```
"""
    
    with open(examples_dir / "README.md", "w") as f:
        f.write(readme_content)
    
    print("✅ README.md creado")
    
    return True

def show_final_summary():
    """
    Muestra un resumen final del proceso
    """
    print("\n🎉 PROCESO COMPLETADO EXITOSAMENTE")
    print("=" * 60)
    
    print("📁 Archivos generados:")
    
    files_info = [
        ("mongodb_questions_raw.txt", "Contenido extraído del PDF"),
        ("mongodb_questions_structured.json", "Preguntas estructuradas"),
        ("mongodb_questions_processed.json", "Preguntas procesadas con mejoras"),
        ("Guia_MongoDB_Avanzada.md", "Guía avanzada"),
        ("ejemplos_practicos/", "Directorio de ejemplos prácticos")
    ]
    
    total_size = 0
    for filename, description in files_info:
        if Path(filename).exists():
            if Path(filename).is_file():
                size = Path(filename).stat().st_size
                size_kb = size / 1024
                total_size += size
                print(f"   📄 {filename} ({size_kb:.1f} KB) - {description}")
            else:
                print(f"   📁 {filename} - {description}")
    
    if total_size > 0:
        total_size_mb = total_size / (1024 * 1024)
        print(f"\n📊 Tamaño total: {total_size_mb:.2f} MB")
    
    print("\n🚀 Próximos pasos:")
    print("   1. Revisa la guía generada")
    print("   2. Ejecuta los ejemplos de código")
    print("   3. Practica con las pruebas unitarias")
    print("   4. Implementa las mejoras sugeridas")
    
    print("\n📖 Guías disponibles:")
    print("   - Guia_MongoDB_Avanzada.md (Guía con 3 preguntas detalladas)")
    print("   - ejemplos_practicos/ (Ejemplos ejecutables)")

def main():
    """
    Función principal que ejecuta todo el proceso
    """
    print("🍃 PROCESO COMPLETO DE GENERACIÓN DE GUÍA DE MONGODB")
    print("=" * 80)
    print("Este script automatiza todo el proceso desde la extracción hasta la generación final")
    print("de la guía avanzada de MongoDB con ejemplos, pruebas unitarias y mejoras.")
    print()
    
    # Verifica dependencias
    if not check_dependencies():
        print("❌ Error verificando dependencias")
        return False
    
    # Verifica archivos necesarios
    if not check_files():
        print("❌ Error verificando archivos")
        return False
    
    # Ejecuta el proceso completo
    steps = [
        ("Extracción", run_extraction),
        ("Procesamiento", run_processing),
        ("Creación de Ejemplos", create_example_files)
    ]
    
    for step_name, step_function in steps:
        print(f"\n{'='*20} {step_name.upper()} {'='*20}")
        if not step_function():
            print(f"❌ Error en el paso: {step_name}")
            return False
        print(f"✅ Paso {step_name} completado exitosamente")
    
    # Muestra resumen final
    show_final_summary()
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        if success:
            print("\n🎉 ¡Todo el proceso se completó exitosamente!")
            sys.exit(0)
        else:
            print("\n❌ El proceso falló")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n⏹️ Proceso interrumpido por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Error inesperado: {e}")
        sys.exit(1) 