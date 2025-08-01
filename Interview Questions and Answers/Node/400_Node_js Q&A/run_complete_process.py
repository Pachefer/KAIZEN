#!/usr/bin/env python3
"""
Script para ejecutar el proceso completo de generación de la guía de Node.js
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
    
    required_packages = ['beautifulsoup4', 'lxml']
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
        "400_Node_js Interview Questions and Answers_From Freshers to Experienced Professionals.epub"
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
        print("💡 Asegúrate de tener el archivo EPUB en el directorio correcto")
        return False
    
    return True

def run_extraction():
    """
    Ejecuta el proceso de extracción
    """
    print("\n📖 PASO 1: Extracción de preguntas del EPUB")
    print("=" * 60)
    
    if not run_command("python extract_node_questions.py", "Extrayendo preguntas del EPUB"):
        print("❌ Error en la extracción")
        return False
    
    # Verifica que se crearon los archivos de salida
    output_files = ["node_questions_raw.txt", "node_questions_structured.json"]
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
    
    if not run_command("python process_node_questions.py", "Procesando preguntas"):
        print("❌ Error en el procesamiento")
        return False
    
    # Verifica que se creó el archivo procesado
    processed_file = "node_questions_processed.json"
    if Path(processed_file).exists():
        size = Path(processed_file).stat().st_size
        print(f"✅ {processed_file} creado ({size} bytes)")
    else:
        print(f"❌ {processed_file} no se creó")
        return False
    
    return True

def run_generation():
    """
    Ejecuta el proceso de generación de guías
    """
    print("\n📝 PASO 3: Generación de guías")
    print("=" * 60)
    
    if not run_command("python generate_complete_guide.py", "Generando guías"):
        print("❌ Error en la generación")
        return False
    
    # Verifica que se crearon las guías
    guide_files = [
        "Guia_NodeJS_Final.md",
        "Guia_NodeJS_Completa.md", 
        "Guia_NodeJS_Avanzada.md"
    ]
    
    for file in guide_files:
        if Path(file).exists():
            size = Path(file).stat().st_size
            size_kb = size / 1024
            print(f"✅ {file} creado ({size_kb:.1f} KB)")
        else:
            print(f"❌ {file} no se creó")
    
    return True

def show_final_summary():
    """
    Muestra un resumen final del proceso
    """
    print("\n🎉 PROCESO COMPLETADO EXITOSAMENTE")
    print("=" * 60)
    
    print("📁 Archivos generados:")
    
    files_info = [
        ("node_questions_raw.txt", "Contenido extraído del EPUB"),
        ("node_questions_structured.json", "Preguntas estructuradas"),
        ("node_questions_processed.json", "Preguntas procesadas con mejoras"),
        ("Guia_NodeJS_Final.md", "Guía completa"),
        ("Guia_NodeJS_Completa.md", "Guía resumida"),
        ("Guia_NodeJS_Avanzada.md", "Guía avanzada")
    ]
    
    total_size = 0
    for filename, description in files_info:
        if Path(filename).exists():
            size = Path(filename).stat().st_size
            size_kb = size / 1024
            total_size += size
            print(f"   📄 {filename} ({size_kb:.1f} KB) - {description}")
    
    total_size_mb = total_size / (1024 * 1024)
    print(f"\n📊 Tamaño total: {total_size_mb:.2f} MB")
    
    print("\n🚀 Próximos pasos:")
    print("   1. Revisa las guías generadas")
    print("   2. Ejecuta los ejemplos de código")
    print("   3. Practica con las pruebas unitarias")
    print("   4. Implementa las mejoras sugeridas")
    
    print("\n📖 Guías disponibles:")
    print("   - Guia_NodeJS_Avanzada.md (Recomendada para empezar)")
    print("   - Guia_NodeJS_Completa.md (Versión intermedia)")
    print("   - Guia_NodeJS_Final.md (Versión completa)")

def main():
    """
    Función principal que ejecuta todo el proceso
    """
    print("🟢 PROCESO COMPLETO DE GENERACIÓN DE GUÍA DE NODE.JS")
    print("=" * 80)
    print("Este script automatiza todo el proceso desde la extracción hasta la generación final")
    print("de la guía avanzada de Node.js con ejemplos, pruebas unitarias y mejoras.")
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
        ("Generación", run_generation)
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