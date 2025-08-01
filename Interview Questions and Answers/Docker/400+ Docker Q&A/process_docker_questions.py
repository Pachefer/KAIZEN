#!/usr/bin/env python3
"""
Script para procesar las preguntas de Docker extraídas del EPUB
y estructurarlas en un formato más legible y organizado.
"""

import re
import json

def parse_questions(raw_content):
    """Parsea el contenido raw y extrae las preguntas estructuradas."""
    questions = []
    
    # Dividir por separadores de archivos
    parts = raw_content.split("=== OEBPS/part")
    
    for part in parts[1:]:  # Saltar el primer elemento vacío
        lines = part.strip().split('\n')
        
        # Extraer el número de parte
        part_number = lines[0].split('.')[0]
        
        # Buscar la pregunta (línea que contiene "What is" o similar)
        question = None
        options = []
        correct_answer = None
        explanation = None
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('===') or line.startswith('='):
                continue
                
            # Buscar pregunta
            if any(keyword in line for keyword in ['What is', 'Which', 'How', 'When', 'Where', 'Why', 'In Docker', 'Docker containers']):
                if not question and len(line) > 20:
                    question = line
                    
            # Buscar opciones
            elif line.startswith('Option '):
                option_match = re.match(r'Option (\d+):(.+)', line)
                if option_match:
                    option_num = option_match.group(1)
                    option_text = option_match.group(2).strip()
                    options.append({
                        'number': option_num,
                        'text': option_text
                    })
                    
            # Buscar respuesta correcta
            elif line.startswith('Correct Response:'):
                correct_answer = line.split(':')[1].strip()
                
            # Buscar explicación
            elif line.startswith('Explanation:'):
                explanation = line.split(':', 1)[1].strip()
        
        # Solo agregar si tenemos una pregunta válida
        if question and options and correct_answer:
            questions.append({
                'part': part_number,
                'question': question,
                'options': options,
                'correct_answer': correct_answer,
                'explanation': explanation or "Sin explicación disponible"
            })
    
    return questions

def main():
    # Leer el contenido raw
    with open('docker_questions_raw.txt', 'r', encoding='utf-8') as f:
        raw_content = f.read()
    
    print("Procesando preguntas...")
    questions = parse_questions(raw_content)
    
    print(f"Se encontraron {len(questions)} preguntas válidas")
    
    # Guardar en formato JSON para procesamiento posterior
    with open('docker_questions_structured.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print("Preguntas estructuradas guardadas en: docker_questions_structured.json")
    
    # Mostrar algunas estadísticas
    print(f"\nEstadísticas:")
    print(f"- Total de preguntas: {len(questions)}")
    
    # Contar respuestas correctas por opción
    answer_counts = {}
    for q in questions:
        correct = q['correct_answer']
        answer_counts[correct] = answer_counts.get(correct, 0) + 1
    
    print(f"- Distribución de respuestas correctas:")
    for answer, count in sorted(answer_counts.items()):
        print(f"  Opción {answer}: {count} veces")

if __name__ == "__main__":
    main() 