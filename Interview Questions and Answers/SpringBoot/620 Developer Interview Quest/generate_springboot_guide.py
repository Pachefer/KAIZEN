#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar guías finales de Spring Boot desde preguntas procesadas
"""

import json
import os
from typing import List, Dict, Any

def generate_advanced_guide(questions: List[Dict[str, Any]], output_file: str):
    """
    Genera la guía avanzada con las primeras 3 preguntas
    """
    print("📚 Generando guía avanzada de Spring Boot...")
    
    content = """# Guía Avanzada de Spring Boot - 620 Preguntas y Respuestas

## 🎯 Descripción

Esta guía avanzada contiene preguntas y respuestas detalladas sobre Spring Boot, incluyendo ejemplos de código prácticos, pruebas unitarias y mejoras recomendadas. Basada en el libro "620 Spring Boot Developer Interview Questions" de Manish Salunke.

## 📋 Contenido

- **Preguntas traducidas** al español
- **Ejemplos de código** con documentación línea por línea
- **Pruebas unitarias** completas y explicadas
- **Mejoras y mejores prácticas** para cada concepto
- **Objetivos de aprendizaje** claros

---

"""
    
    # Agregar las primeras 3 preguntas procesadas
    for i, question in enumerate(questions[:3], 1):
        content += f"""## Pregunta {i}: {question['translated_question']}

### 📝 Pregunta Original
{question['original_question']}

### 🔍 Respuesta Traducida
{question['translated_answer']}

### 💻 Ejemplo de Código
{question['code_example']}

### 📖 Explicación del Código
{question['code_explanation']}

### 🧪 Pruebas Unitarias
{question['unit_tests']}

### 📚 Explicación de las Pruebas
{question['test_explanation']}

### 🎯 Resultado Esperado
{question['expected_result']}

### 🚀 Mejoras Recomendadas
"""
        
        for j, improvement in enumerate(question['improvements'], 1):
            content += f"{j}. {improvement}\n"
        
        content += f"""
### 📖 Objetivos de Aprendizaje
"""
        
        for objective in question['learning_objectives']:
            content += f"- {objective}\n"
        
        content += f"""
### 📊 Información Adicional
- **Categoría**: {question['category']}
- **Dificultad**: {question['difficulty']}
- **ID**: {question['id']}

---

"""
    
    # Guardar guía avanzada
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Guía avanzada generada: {output_file}")

def generate_complete_guide(questions: List[Dict[str, Any]], output_file: str):
    """
    Genera la guía completa con las primeras 10 preguntas
    """
    print("📚 Generando guía completa de Spring Boot...")
    
    content = """# Guía Completa de Spring Boot - 620 Preguntas y Respuestas

## 🎯 Descripción

Esta guía completa contiene una selección de preguntas y respuestas detalladas sobre Spring Boot, incluyendo ejemplos de código prácticos, pruebas unitarias y mejoras recomendadas. Basada en el libro "620 Spring Boot Developer Interview Questions" de Manish Salunke.

## 📋 Contenido

- **10 preguntas seleccionadas** de diferentes categorías
- **Traducción completa** al español
- **Ejemplos de código** ejecutables
- **Pruebas unitarias** con JUnit 5 y Mockito
- **Mejoras y mejores prácticas** para cada concepto

## 🏗️ Categorías Cubiertas

"""
    
    # Mostrar categorías
    categories = set(q['category'] for q in questions[:10])
    for category in sorted(categories):
        content += f"- {category}\n"
    
    content += "\n---\n\n"
    
    # Agregar las primeras 10 preguntas procesadas
    for i, question in enumerate(questions[:10], 1):
        content += f"""## Pregunta {i}: {question['translated_question']}

### 📝 Pregunta Original
{question['original_question']}

### 🔍 Respuesta Traducida
{question['translated_answer']}

### 💻 Ejemplo de Código
{question['code_example']}

### 📖 Explicación del Código
{question['code_explanation']}

### 🧪 Pruebas Unitarias
{question['unit_tests']}

### 📚 Explicación de las Pruebas
{question['test_explanation']}

### 🎯 Resultado Esperado
{question['expected_result']}

### 🚀 Mejoras Recomendadas
"""
        
        for j, improvement in enumerate(question['improvements'], 1):
            content += f"{j}. {improvement}\n"
        
        content += f"""
### 📖 Objetivos de Aprendizaje
"""
        
        for objective in question['learning_objectives']:
            content += f"- {objective}\n"
        
        content += f"""
### 📊 Información Adicional
- **Categoría**: {question['category']}
- **Dificultad**: {question['difficulty']}
- **ID**: {question['id']}

---

"""
    
    # Guardar guía completa
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Guía completa generada: {output_file}")

def generate_final_guide(questions: List[Dict[str, Any]], output_file: str):
    """
    Genera la guía final con todas las preguntas procesadas
    """
    print("📚 Generando guía final de Spring Boot...")
    
    content = """# Guía Final de Spring Boot - 620 Preguntas y Respuestas

## 🎯 Descripción

Esta es la guía final completa que contiene todas las preguntas procesadas sobre Spring Boot, incluyendo ejemplos de código prácticos, pruebas unitarias y mejoras recomendadas. Basada en el libro "620 Spring Boot Developer Interview Questions" de Manish Salunke.

## 📋 Contenido

- **Todas las preguntas procesadas** ({len(questions)} preguntas)
- **Traducción completa** al español
- **Ejemplos de código** ejecutables para cada categoría
- **Pruebas unitarias** con JUnit 5 y Mockito
- **Mejoras y mejores prácticas** para cada concepto
- **Objetivos de aprendizaje** claros

## 🏗️ Categorías Cubiertas

"""
    
    # Mostrar categorías
    categories = set(q['category'] for q in questions)
    for category in sorted(categories):
        count = len([q for q in questions if q['category'] == category])
        content += f"- {category}: {count} preguntas\n"
    
    content += f"\n## 📊 Estadísticas\n"
    content += f"- **Total de preguntas**: {len(questions)}\n"
    content += f"- **Categorías**: {len(categories)}\n"
    content += f"- **Dificultad promedio**: Intermediate\n\n"
    
    content += "---\n\n"
    
    # Agregar todas las preguntas procesadas
    for i, question in enumerate(questions, 1):
        content += f"""## Pregunta {i}: {question['translated_question']}

### 📝 Pregunta Original
{question['original_question']}

### 🔍 Respuesta Traducida
{question['translated_answer']}

### 💻 Ejemplo de Código
{question['code_example']}

### 📖 Explicación del Código
{question['code_explanation']}

### 🧪 Pruebas Unitarias
{question['unit_tests']}

### 📚 Explicación de las Pruebas
{question['test_explanation']}

### 🎯 Resultado Esperado
{question['expected_result']}

### 🚀 Mejoras Recomendadas
"""
        
        for j, improvement in enumerate(question['improvements'], 1):
            content += f"{j}. {improvement}\n"
        
        content += f"""
### 📖 Objetivos de Aprendizaje
"""
        
        for objective in question['learning_objectives']:
            content += f"- {objective}\n"
        
        content += f"""
### 📊 Información Adicional
- **Categoría**: {question['category']}
- **Dificultad**: {question['difficulty']}
- **ID**: {question['id']}

---

"""
    
    # Guardar guía final
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Guía final generada: {output_file}")

def main():
    """Función principal"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(current_dir, 'springboot_questions_processed.json')
    
    if not os.path.exists(input_file):
        print(f"❌ Error: No se encontró el archivo de entrada: {input_file}")
        print("💡 Ejecuta primero: python process_springboot_questions.py")
        return
    
    # Leer preguntas procesadas
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data['questions']
    print(f"📖 Cargadas {len(questions)} preguntas procesadas")
    
    # Generar guías
    generate_advanced_guide(questions, os.path.join(current_dir, 'Guia_SpringBoot_Avanzada.md'))
    generate_complete_guide(questions, os.path.join(current_dir, 'Guia_SpringBoot_Completa.md'))
    generate_final_guide(questions, os.path.join(current_dir, 'Guia_SpringBoot_Final.md'))
    
    print("\n✅ Todas las guías han sido generadas exitosamente!")

if __name__ == "__main__":
    main() 