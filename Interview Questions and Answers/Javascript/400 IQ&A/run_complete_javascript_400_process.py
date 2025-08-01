#!/usr/bin/env python3
"""
Script para ejecutar el proceso completo de JavaScript (400 preguntas)
Incluye extracción, procesamiento y generación de guías
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """
    Ejecuta un comando y maneja errores
    """
    print(f"\n🚀 {description}")
    print("=" * 60)
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completado exitosamente")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}:")
        print(f"Comando: {command}")
        print(f"Error: {e.stderr}")
        return False

def check_dependencies():
    """
    Verifica que las dependencias estén instaladas
    """
    print("🔍 Verificando dependencias...")
    
    try:
        import PyPDF2
        print("✅ PyPDF2 instalado")
    except ImportError:
        print("❌ PyPDF2 no está instalado")
        print("💡 Instala con: pip install PyPDF2")
        return False
    
    return True

def check_files():
    """
    Verifica que los archivos necesarios existan
    """
    print("🔍 Verificando archivos...")
    
    pdf_file = "400_ JavaScript Interview Interview Questi - Salunke, Manish.pdf"
    
    if not os.path.exists(pdf_file):
        print(f"❌ No se encontró el archivo {pdf_file}")
        print("💡 Asegúrate de que el archivo PDF esté en el directorio actual")
        return False
    
    print(f"✅ Archivo PDF encontrado: {pdf_file}")
    return True

def run_extraction():
    """
    Ejecuta la extracción de preguntas del PDF
    """
    return run_command(
        "python extract_javascript_400_questions.py",
        "Extrayendo preguntas del PDF de JavaScript (400 preguntas)"
    )

def run_processing():
    """
    Ejecuta el procesamiento de preguntas
    """
    return run_command(
        "python process_javascript_400_questions.py",
        "Procesando preguntas con traducciones y ejemplos"
    )

def generate_guides():
    """
    Genera las guías finales
    """
    print("\n📚 Generando guías finales...")
    print("=" * 60)
    
    # Verificar que los archivos procesados existan
    if not os.path.exists("javascript_400_questions_processed.json"):
        print("❌ No se encontró el archivo javascript_400_questions_processed.json")
        print("💡 Ejecuta primero el procesamiento")
        return False
    
    print("✅ Archivos procesados encontrados")
    print("📖 Las guías ya están generadas en:")
    print("   - Guia_JavaScript_400_Avanzada.md")
    print("   - README.md")
    
    return True

def show_summary():
    """
    Muestra un resumen del proceso
    """
    print("\n🎉 RESUMEN DEL PROCESO COMPLETO")
    print("=" * 60)
    
    files_to_check = [
        "javascript_400_questions_raw.txt",
        "javascript_400_questions_structured.json", 
        "javascript_400_questions_processed.json",
        "Guia_JavaScript_400_Avanzada.md",
        "README.md"
    ]
    
    print("📁 Archivos generados:")
    for file in files_to_check:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"   ✅ {file} ({size:,} bytes)")
        else:
            print(f"   ❌ {file} (no encontrado)")
    
    print("\n📊 Estadísticas:")
    if os.path.exists("javascript_400_questions_processed.json"):
        import json
        with open("javascript_400_questions_processed.json", 'r', encoding='utf-8') as f:
            data = json.load(f)
            total_questions = data.get('metadata', {}).get('total_processed', 0)
            print(f"   📝 Preguntas procesadas: {total_questions}")
    
    print("\n🚀 Próximos pasos:")
    print("   1. Revisa las guías generadas")
    print("   2. Ejecuta los ejemplos de código")
    print("   3. Ejecuta las pruebas unitarias")
    print("   4. Contribuye con mejoras")

def main():
    """
    Función principal que ejecuta todo el proceso
    """
    print("🚀 PROCESO COMPLETO DE JAVASCRIPT (400 PREGUNTAS)")
    print("=" * 60)
    print("Este script ejecutará todo el pipeline de procesamiento:")
    print("1. Verificación de dependencias")
    print("2. Verificación de archivos")
    print("3. Extracción de preguntas del PDF")
    print("4. Procesamiento con traducciones y ejemplos")
    print("5. Generación de guías")
    print("6. Resumen final")
    
    # Verificar dependencias
    if not check_dependencies():
        print("\n❌ Faltan dependencias. Instala PyPDF2 y vuelve a intentar.")
        return False
    
    # Verificar archivos
    if not check_files():
        print("\n❌ Faltan archivos necesarios.")
        return False
    
    # Ejecutar extracción
    if not run_extraction():
        print("\n❌ La extracción falló. Revisa los errores.")
        return False
    
    # Ejecutar procesamiento
    if not run_processing():
        print("\n❌ El procesamiento falló. Revisa los errores.")
        return False
    
    # Generar guías
    if not generate_guides():
        print("\n❌ La generación de guías falló.")
        return False
    
    # Mostrar resumen
    show_summary()
    
    print("\n🎉 ¡Proceso completado exitosamente!")
    print("📚 Las guías de JavaScript (400 preguntas) están listas para usar.")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 