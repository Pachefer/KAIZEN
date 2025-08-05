#!/usr/bin/env python3
"""
Script para extraer y procesar preguntas de Azure del PDF
"""

import PyPDF2
import re
import json
from pathlib import Path

def extract_pdf_text(pdf_path):
    """Extrae texto del PDF"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for i, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                text += f"\n--- PÁGINA {i+1} ---\n"
                text += page_text
                text += "\n"
        return text
    except Exception as e:
        print(f"Error al extraer texto del PDF: {e}")
        return None

def save_raw_text(text, output_file):
    """Guarda el texto raw extraído del PDF"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text)

def parse_azure_questions(text):
    """Parsea las preguntas de Azure del texto extraído"""
    questions = []
    
    # Guardar el texto raw para análisis
    save_raw_text(text, "azure_raw_text.txt")
    
    # Dividir el texto en bloques de preguntas usando el separador
    question_blocks = text.split('------------------------------------------------------------------')
    
    for block in question_blocks:
        block = block.strip()
        if not block or len(block) < 50:  # Ignorar bloques muy pequeños
            continue
        
        lines = block.split('\n')
        current_question = {
            'pregunta': '',
            'opciones': [],
            'respuesta_correcta': '',
            'explicacion': ''
        }
        
        in_question = False
        in_options = False
        in_answer = False
        in_explanation = False
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('--- PÁGINA'):
                continue
            
            # Detectar inicio de pregunta
            if 'Option 1:' in line or 'Option 2:' in line:
                # La pregunta está en las líneas anteriores
                question_lines = []
                for prev_line in reversed(lines[:lines.index(line)]):
                    prev_line = prev_line.strip()
                    if prev_line and not prev_line.startswith('--- PÁGINA'):
                        question_lines.insert(0, prev_line)
                        if len(question_lines) >= 3:  # Tomar hasta 3 líneas para la pregunta
                            break
                current_question['pregunta'] = ' '.join(question_lines)
                in_options = True
                continue
            
            # Procesar opciones
            if in_options and line.startswith('Option '):
                current_question['opciones'].append(line)
                continue
            
            # Detectar respuesta correcta
            if 'Correct Response:' in line:
                in_answer = True
                current_question['respuesta_correcta'] = line
                continue
            
            # Detectar explicación
            if in_answer and line.startswith('Explanation:'):
                in_explanation = True
                current_question['explicacion'] = line
                continue
            elif in_explanation and line:
                current_question['explicacion'] += ' ' + line
        
        # Agregar la pregunta si tiene contenido válido
        if (current_question['pregunta'] and 
            len(current_question['opciones']) >= 2 and 
            current_question['respuesta_correcta']):
            questions.append(current_question)
    
    return questions

def save_questions(questions, output_file):
    """Guarda las preguntas en formato JSON"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

def create_study_guide(questions):
    """Crea una guía de estudio estructurada"""
    guide = {
        'titulo': 'Guía de Estudio Azure - 300+ Preguntas y Respuestas',
        'descripcion': 'Guía completa de preguntas de Azure traducidas al español con explicaciones detalladas',
        'niveles': {
            'basico': [],
            'intermedio': [],
            'avanzado': []
        },
        'categorias': {
            'fundamentos': [],
            'servicios_computo': [],
            'almacenamiento': [],
            'redes': [],
            'seguridad': [],
            'monitoreo': [],
            'devops': []
        }
    }
    
    # Clasificar preguntas por nivel y categoría
    for i, q in enumerate(questions):
        # Determinar nivel basado en complejidad de la pregunta
        nivel = 'basico'
        if len(q['pregunta']) > 100 or 'advanced' in q['pregunta'].lower():
            nivel = 'avanzado'
        elif len(q['pregunta']) > 60:
            nivel = 'intermedio'
        
        # Determinar categoría basada en palabras clave
        categoria = 'fundamentos'
        pregunta_lower = q['pregunta'].lower()
        
        if any(word in pregunta_lower for word in ['virtual machine', 'vm', 'compute', 'function']):
            categoria = 'servicios_computo'
        elif any(word in pregunta_lower for word in ['storage', 'blob', 'file', 'disk']):
            categoria = 'almacenamiento'
        elif any(word in pregunta_lower for word in ['network', 'vnet', 'load balancer', 'gateway']):
            categoria = 'redes'
        elif any(word in pregunta_lower for word in ['security', 'identity', 'authentication', 'authorization']):
            categoria = 'seguridad'
        elif any(word in pregunta_lower for word in ['monitor', 'log', 'alert', 'insights']):
            categoria = 'monitoreo'
        elif any(word in pregunta_lower for word in ['devops', 'pipeline', 'deployment', 'ci/cd']):
            categoria = 'devops'
        
        # Agregar a las categorías correspondientes
        guide['niveles'][nivel].append({
            'id': i + 1,
            'pregunta': q['pregunta'],
            'opciones': q['opciones'],
            'respuesta_correcta': q['respuesta_correcta'],
            'explicacion': q['explicacion']
        })
        
        guide['categorias'][categoria].append({
            'id': i + 1,
            'pregunta': q['pregunta'],
            'opciones': q['opciones'],
            'respuesta_correcta': q['respuesta_correcta'],
            'explicacion': q['explicacion']
        })
    
    return guide

def save_study_guide(guide, output_file):
    """Guarda la guía de estudio en formato JSON"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(guide, f, ensure_ascii=False, indent=2)

def main():
    pdf_path = "Interview Questions and Answers/Azure/300 IQ&A/300_ Azure Interview Questions and Answers - Salunke, Manish.pdf"
    
    print("Extrayendo texto del PDF...")
    text = extract_pdf_text(pdf_path)
    
    if not text:
        print("No se pudo extraer texto del PDF")
        return
    
    print(f"Texto extraído: {len(text)} caracteres")
    print("Texto raw guardado en azure_raw_text.txt")
    
    print("Procesando preguntas...")
    questions = parse_azure_questions(text)
    
    print(f"Se encontraron {len(questions)} preguntas")
    
    # Guardar preguntas en JSON
    output_file = "azure_questions_extracted.json"
    save_questions(questions, output_file)
    print(f"Preguntas guardadas en {output_file}")
    
    # Crear guía de estudio
    print("Creando guía de estudio...")
    guide = create_study_guide(questions)
    guide_file = "azure_study_guide.json"
    save_study_guide(guide, guide_file)
    print(f"Guía de estudio guardada en {guide_file}")
    
    # Mostrar estadísticas
    print("\nEstadísticas de la guía:")
    for nivel, preguntas in guide['niveles'].items():
        print(f"  Nivel {nivel}: {len(preguntas)} preguntas")
    
    print("\nPreguntas por categoría:")
    for categoria, preguntas in guide['categorias'].items():
        print(f"  {categoria}: {len(preguntas)} preguntas")
    
    # Mostrar algunas preguntas de ejemplo
    print("\nEjemplos de preguntas encontradas:")
    for i, q in enumerate(questions[:3]):
        print(f"\nPregunta {i+1}:")
        print(f"Texto: {q['pregunta'][:100]}...")
        print(f"Opciones: {len(q['opciones'])}")
        if q['respuesta_correcta']:
            print(f"Respuesta: {q['respuesta_correcta'][:50]}...")

if __name__ == "__main__":
    main() 