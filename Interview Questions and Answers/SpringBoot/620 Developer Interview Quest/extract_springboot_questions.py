#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para extraer preguntas y respuestas del PDF de Spring Boot
Basado en el libro "620 Spring Boot Developer Interview Questions" de Manish Salunke
"""

import PyPDF2
import re
import json
import os
from typing import List, Dict, Any

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extrae texto del archivo PDF
    
    Args:
        pdf_path: Ruta al archivo PDF
        
    Returns:
        Texto extraído del PDF
    """
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            
            # Extraer texto de todas las páginas
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
                
            return text
    except Exception as e:
        print(f"Error al extraer texto del PDF: {e}")
        return ""

def clean_text(text: str) -> str:
    """
    Limpia el texto extraído del PDF
    
    Args:
        text: Texto sin procesar
        
    Returns:
        Texto limpio
    """
    # Eliminar caracteres especiales y normalizar espacios
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s\.\?\!\-\(\)]', '', text)
    
    # Normalizar saltos de línea
    text = text.replace('\n', ' ').replace('\r', ' ')
    
    return text.strip()

def extract_questions_from_text(text: str) -> List[Dict[str, Any]]:
    """
    Extrae preguntas y respuestas del texto
    
    Args:
        text: Texto limpio del PDF
        
    Returns:
        Lista de diccionarios con preguntas y respuestas
    """
    questions = []
    
    # Patrones para identificar preguntas
    patterns = [
        r'(\d+\.\s*[^?]+\?)',  # Número seguido de pregunta
        r'(Q\d+\.\s*[^?]+\?)',  # Q + número + pregunta
        r'(Question\s*\d+\.\s*[^?]+\?)',  # Question + número + pregunta
    ]
    
    # Dividir el texto en líneas
    lines = text.split('.')
    
    current_question = None
    current_answer = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Verificar si es una pregunta
        is_question = False
        for pattern in patterns:
            if re.match(pattern, line, re.IGNORECASE):
                is_question = True
                break
        
        if is_question:
            # Guardar pregunta anterior si existe
            if current_question:
                questions.append({
                    'question': current_question,
                    'answer': ' '.join(current_answer).strip(),
                    'category': 'Spring Boot',
                    'difficulty': 'Intermediate'
                })
            
            # Iniciar nueva pregunta
            current_question = line
            current_answer = []
        else:
            # Agregar línea a la respuesta actual
            if current_question:
                current_answer.append(line)
    
    # Agregar la última pregunta
    if current_question:
        questions.append({
            'question': current_question,
            'answer': ' '.join(current_answer).strip(),
            'category': 'Spring Boot',
            'difficulty': 'Intermediate'
        })
    
    return questions

def categorize_questions(questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Categoriza las preguntas por temas de Spring Boot
    
    Args:
        questions: Lista de preguntas sin categorizar
        
    Returns:
        Lista de preguntas categorizadas
    """
    categories = {
        'Spring Core': ['spring core', 'dependency injection', 'bean', 'application context'],
        'Spring Boot': ['spring boot', 'autoconfiguration', 'starter', 'application properties'],
        'Spring Data': ['jpa', 'hibernate', 'repository', 'entity', 'database'],
        'Spring Security': ['security', 'authentication', 'authorization', 'jwt'],
        'Spring Web': ['controller', 'rest', 'api', 'request mapping'],
        'Testing': ['test', 'junit', 'mock', 'integration test'],
        'Deployment': ['deploy', 'docker', 'cloud', 'production']
    }
    
    for question in questions:
        question_text = question['question'].lower()
        answer_text = question['answer'].lower()
        combined_text = question_text + ' ' + answer_text
        
        # Asignar categoría basada en palabras clave
        assigned_category = 'Spring Boot'  # Categoría por defecto
        
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in combined_text:
                    assigned_category = category
                    break
            if assigned_category != 'Spring Boot':
                break
        
        question['category'] = assigned_category
    
    return questions

def save_questions_to_files(questions: List[Dict[str, Any]], output_dir: str):
    """
    Guarda las preguntas en archivos de texto y JSON
    
    Args:
        questions: Lista de preguntas procesadas
        output_dir: Directorio de salida
    """
    # Crear directorio si no existe
    os.makedirs(output_dir, exist_ok=True)
    
    # Guardar como texto plano
    txt_path = os.path.join(output_dir, 'springboot_questions_raw.txt')
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write("SPRING BOOT INTERVIEW QUESTIONS AND ANSWERS\n")
        f.write("=" * 50 + "\n\n")
        
        for i, q in enumerate(questions, 1):
            f.write(f"PREGUNTA {i}:\n")
            f.write(f"Pregunta: {q['question']}\n")
            f.write(f"Respuesta: {q['answer']}\n")
            f.write(f"Categoría: {q['category']}\n")
            f.write(f"Dificultad: {q['difficulty']}\n")
            f.write("-" * 40 + "\n\n")
    
    # Guardar como JSON estructurado
    json_path = os.path.join(output_dir, 'springboot_questions_structured.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'metadata': {
                'source': '620 Spring Boot Developer Interview Questions - Manish Salunke',
                'total_questions': len(questions),
                'categories': list(set(q['category'] for q in questions))
            },
            'questions': questions
        }, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Preguntas guardadas:")
    print(f"   - Texto plano: {txt_path}")
    print(f"   - JSON estructurado: {json_path}")
    print(f"   - Total de preguntas: {len(questions)}")

def main():
    """Función principal"""
    print("🚀 Iniciando extracción de preguntas de Spring Boot...")
    
    # Configurar rutas
    current_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_path = os.path.join(current_dir, '620_ Spring Boot Developer Interview Quest - Salunke, Manish.pdf')
    
    # Verificar que el archivo existe
    if not os.path.exists(pdf_path):
        print(f"❌ Error: No se encontró el archivo PDF en {pdf_path}")
        return
    
    print(f"📖 Extrayendo texto del PDF: {pdf_path}")
    
    # Extraer texto del PDF
    raw_text = extract_text_from_pdf(pdf_path)
    if not raw_text:
        print("❌ Error: No se pudo extraer texto del PDF")
        return
    
    print(f"📝 Texto extraído: {len(raw_text)} caracteres")
    
    # Limpiar texto
    clean_text_content = clean_text(raw_text)
    print(f"🧹 Texto limpio: {len(clean_text_content)} caracteres")
    
    # Extraer preguntas
    print("🔍 Extrayendo preguntas y respuestas...")
    questions = extract_questions_from_text(clean_text_content)
    print(f"📋 Preguntas extraídas: {len(questions)}")
    
    # Categorizar preguntas
    print("🏷️ Categorizando preguntas...")
    categorized_questions = categorize_questions(questions)
    
    # Mostrar estadísticas
    categories = {}
    for q in categorized_questions:
        cat = q['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n📊 Estadísticas por categoría:")
    for category, count in categories.items():
        print(f"   - {category}: {count} preguntas")
    
    # Guardar resultados
    save_questions_to_files(categorized_questions, current_dir)
    
    print("\n✅ Extracción completada exitosamente!")

if __name__ == "__main__":
    main() 