#!/usr/bin/env python3
"""
Script para extraer preguntas de React.js del archivo PDF
Basado en el libro "640+ React.js Interview Questions and Answers" de Salunke, Manish
"""

import os
import re
import json
import PyPDF2
from pathlib import Path

class ReactExtractor:
    def __init__(self, pdf_path):
        """
        Inicializa el extractor con la ruta del archivo PDF
        
        Args:
            pdf_path (str): Ruta al archivo PDF de React.js
        """
        self.pdf_path = pdf_path
        self.extracted_content = []
        self.questions = []
        
    def extract_pdf_content(self):
        """
        Extrae el contenido del archivo PDF
        """
        try:
            # Abre el archivo PDF
            with open(self.pdf_path, 'rb') as pdf_file:
                # Crea un objeto PDF reader
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                
                print(f"📖 PDF tiene {len(pdf_reader.pages)} páginas")
                
                # Extrae texto de cada página
                for page_num, page in enumerate(pdf_reader.pages, 1):
                    try:
                        # Extrae el texto de la página
                        text_content = page.extract_text()
                        
                        # Agrega el contenido extraído
                        self.extracted_content.append({
                            'page': page_num,
                            'content': text_content
                        })
                        
                        print(f"✅ Extraída página {page_num}")
                        
                    except Exception as e:
                        print(f"❌ Error al procesar página {page_num}: {e}")
                        
        except Exception as e:
            print(f"❌ Error al abrir el PDF: {e}")
            return False
            
        return True
    
    def extract_questions(self):
        """
        Extrae las preguntas del contenido del PDF
        """
        print("\n🔍 Extrayendo preguntas...")
        
        # Patrones para identificar preguntas
        question_patterns = [
            r'(\d+\.\s*[A-Z][^?]*\?)',  # Preguntas numeradas
            r'(Q\d+\.\s*[^?]*\?)',      # Preguntas con prefijo Q
            r'(Question\s*\d+[^?]*\?)', # Preguntas con prefijo Question
            r'(\d+\)\s*[A-Z][^?]*\?)',  # Preguntas con paréntesis
        ]
        
        for item in self.extracted_content:
            content = item['content']
            
            # Busca preguntas usando diferentes patrones
            for pattern in question_patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                
                for match in matches:
                    question_text = match.group(1).strip()
                    
                    # Busca la respuesta después de la pregunta
                    start_pos = match.end()
                    end_pos = content.find('\n\n', start_pos)
                    
                    if end_pos == -1:
                        end_pos = len(content)
                    
                    answer_text = content[start_pos:end_pos].strip()
                    
                    # Limpia y estructura la pregunta
                    question_data = {
                        'question': question_text,
                        'answer': answer_text,
                        'page': item['page'],
                        'position': match.start()
                    }
                    
                    self.questions.append(question_data)
        
        print(f"📊 Extraídas {len(self.questions)} preguntas")
    
    def clean_questions(self):
        """
        Limpia y estructura las preguntas extraídas
        """
        print("\n🧹 Limpiando preguntas...")
        
        cleaned_questions = []
        
        for q in self.questions:
            # Limpia la pregunta
            question = q['question']
            answer = q['answer']
            
            # Elimina caracteres especiales y normaliza
            question = re.sub(r'\s+', ' ', question).strip()
            answer = re.sub(r'\s+', ' ', answer).strip()
            
            # Verifica que la pregunta sea válida
            if len(question) > 10 and '?' in question:
                cleaned_questions.append({
                    'question': question,
                    'answer': answer,
                    'page': q['page']
                })
        
        self.questions = cleaned_questions
        print(f"✅ Limpiadas {len(self.questions)} preguntas válidas")
    
    def save_raw_content(self, output_file):
        """
        Guarda el contenido extraído en formato texto
        """
        print(f"\n💾 Guardando contenido raw en {output_file}")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            for item in self.extracted_content:
                f.write(f"=== PÁGINA: {item['page']} ===\n")
                f.write(item['content'])
                f.write('\n\n' + '='*50 + '\n\n')
        
        print(f"✅ Contenido guardado en {output_file}")
    
    def save_structured_questions(self, output_file):
        """
        Guarda las preguntas estructuradas en formato JSON
        """
        print(f"\n💾 Guardando preguntas estructuradas en {output_file}")
        
        structured_data = {
            'metadata': {
                'source': '640+ React.js Interview Questions and Answers',
                'author': 'Salunke, Manish',
                'extraction_date': str(Path().cwd()),
                'total_questions': len(self.questions)
            },
            'questions': self.questions
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(structured_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Preguntas estructuradas guardadas en {output_file}")
    
    def generate_summary(self):
        """
        Genera un resumen de la extracción
        """
        print("\n📊 RESUMEN DE EXTRACCIÓN")
        print("=" * 50)
        print(f"📖 Páginas procesadas: {len(self.extracted_content)}")
        print(f"❓ Preguntas extraídas: {len(self.questions)}")
        print(f"📁 Archivo fuente: {self.pdf_path}")
        
        if self.questions:
            print(f"\n📝 Ejemplos de preguntas extraídas:")
            for i, q in enumerate(self.questions[:3]):
                print(f"  {i+1}. {q['question'][:100]}...")
    
    def run_extraction(self, raw_output="react_questions_raw.txt", 
                      structured_output="react_questions_structured.json"):
        """
        Ejecuta el proceso completo de extracción
        
        Args:
            raw_output (str): Archivo de salida para contenido raw
            structured_output (str): Archivo de salida para preguntas estructuradas
        """
        print("🚀 Iniciando extracción de preguntas de React.js")
        print("=" * 60)
        
        # Verifica que el archivo PDF existe
        if not os.path.exists(self.pdf_path):
            print(f"❌ Error: No se encontró el archivo {self.pdf_path}")
            return False
        
        # Ejecuta el proceso de extracción
        if not self.extract_pdf_content():
            return False
        
        self.extract_questions()
        self.clean_questions()
        
        # Guarda los resultados
        self.save_raw_content(raw_output)
        self.save_structured_questions(structured_output)
        
        # Genera resumen
        self.generate_summary()
        
        print("\n✅ Extracción completada exitosamente!")
        return True

def main():
    """
    Función principal del script
    """
    # Configuración
    pdf_file = "640_ React.js Interview Questions and Answ - Salunke, Manish.pdf"
    raw_output = "react_questions_raw.txt"
    structured_output = "react_questions_structured.json"
    
    # Verifica que estamos en el directorio correcto
    if not os.path.exists(pdf_file):
        print(f"❌ Error: No se encontró el archivo {pdf_file}")
        print("💡 Asegúrate de ejecutar este script en el directorio correcto")
        return
    
    # Crea el extractor y ejecuta la extracción
    extractor = ReactExtractor(pdf_file)
    success = extractor.run_extraction(raw_output, structured_output)
    
    if success:
        print(f"\n🎉 ¡Extracción completada!")
        print(f"📄 Contenido raw: {raw_output}")
        print(f"📊 Preguntas estructuradas: {structured_output}")
    else:
        print("\n❌ La extracción falló")

if __name__ == "__main__":
    main() 