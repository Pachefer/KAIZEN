#!/usr/bin/env python3
"""
Script para extraer preguntas de Node.js del archivo EPUB
Basado en el libro "400+ Node.js Interview Questions and Answers" de Salunke, Manish
"""

import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from pathlib import Path

class NodeJSExtractor:
    def __init__(self, epub_path):
        """
        Inicializa el extractor con la ruta del archivo EPUB
        
        Args:
            epub_path (str): Ruta al archivo EPUB de Node.js
        """
        self.epub_path = epub_path
        self.extracted_content = []
        self.questions = []
        
    def extract_epub_content(self):
        """
        Extrae el contenido del archivo EPUB
        """
        try:
            # Abre el archivo EPUB (es un archivo ZIP)
            with zipfile.ZipFile(self.epub_path, 'r') as epub:
                # Busca el archivo de contenido principal
                content_files = [f for f in epub.namelist() if f.endswith('.xhtml') or f.endswith('.html')]
                
                print(f"📖 Encontrados {len(content_files)} archivos de contenido")
                
                for content_file in content_files:
                    try:
                        # Lee el contenido del archivo
                        content = epub.read(content_file).decode('utf-8')
                        
                        # Parsea el HTML
                        soup = BeautifulSoup(content, 'html.parser')
                        
                        # Extrae el texto limpio
                        text_content = soup.get_text(separator='\n', strip=True)
                        
                        # Agrega el contenido extraído
                        self.extracted_content.append({
                            'file': content_file,
                            'content': text_content
                        })
                        
                        print(f"✅ Extraído: {content_file}")
                        
                    except Exception as e:
                        print(f"❌ Error al procesar {content_file}: {e}")
                        
        except Exception as e:
            print(f"❌ Error al abrir el EPUB: {e}")
            return False
            
        return True
    
    def extract_questions(self):
        """
        Extrae las preguntas del contenido del EPUB
        """
        print("\n🔍 Extrayendo preguntas...")
        
        # Patrones para identificar preguntas
        question_patterns = [
            r'(\d+\.\s*[A-Z][^?]*\?)',  # Preguntas numeradas
            r'(Q\d+\.\s*[^?]*\?)',      # Preguntas con prefijo Q
            r'(Question\s*\d+[^?]*\?)', # Preguntas con prefijo Question
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
                        'source_file': item['file'],
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
                    'source_file': q['source_file']
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
                f.write(f"=== ARCHIVO: {item['file']} ===\n")
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
                'source': '400+ Node.js Interview Questions and Answers',
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
        print(f"📖 Archivos procesados: {len(self.extracted_content)}")
        print(f"❓ Preguntas extraídas: {len(self.questions)}")
        print(f"📁 Archivo fuente: {self.epub_path}")
        
        if self.questions:
            print(f"\n📝 Ejemplos de preguntas extraídas:")
            for i, q in enumerate(self.questions[:3]):
                print(f"  {i+1}. {q['question'][:100]}...")
    
    def run_extraction(self, raw_output="node_questions_raw.txt", 
                      structured_output="node_questions_structured.json"):
        """
        Ejecuta el proceso completo de extracción
        
        Args:
            raw_output (str): Archivo de salida para contenido raw
            structured_output (str): Archivo de salida para preguntas estructuradas
        """
        print("🚀 Iniciando extracción de preguntas de Node.js")
        print("=" * 60)
        
        # Verifica que el archivo EPUB existe
        if not os.path.exists(self.epub_path):
            print(f"❌ Error: No se encontró el archivo {self.epub_path}")
            return False
        
        # Ejecuta el proceso de extracción
        if not self.extract_epub_content():
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
    epub_file = "400_Node_js Interview Questions and Answers_From Freshers to Experienced Professionals.epub"
    raw_output = "node_questions_raw.txt"
    structured_output = "node_questions_structured.json"
    
    # Verifica que estamos en el directorio correcto
    if not os.path.exists(epub_file):
        print(f"❌ Error: No se encontró el archivo {epub_file}")
        print("💡 Asegúrate de ejecutar este script en el directorio correcto")
        return
    
    # Crea el extractor y ejecuta la extracción
    extractor = NodeJSExtractor(epub_file)
    success = extractor.run_extraction(raw_output, structured_output)
    
    if success:
        print(f"\n🎉 ¡Extracción completada!")
        print(f"📄 Contenido raw: {raw_output}")
        print(f"📊 Preguntas estructuradas: {structured_output}")
    else:
        print("\n❌ La extracción falló")

if __name__ == "__main__":
    main() 