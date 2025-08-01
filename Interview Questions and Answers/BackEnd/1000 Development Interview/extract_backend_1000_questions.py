#!/usr/bin/env python3
"""
Script para extraer preguntas de Backend Development del archivo de 1000 preguntas
Basado en el libro "1000+ Back End Development Interview Questions and Answers" de Salunke, Manish
"""

import os
import re
import json
from pathlib import Path

class Backend1000Extractor:
    def __init__(self, text_path):
        """
        Inicializa el extractor con la ruta del archivo de texto
        
        Args:
            text_path (str): Ruta al archivo de texto de Backend Development (1000 preguntas)
        """
        self.text_path = text_path
        self.extracted_content = []
        self.questions = []
        
    def extract_text_content(self):
        """
        Extrae el contenido del archivo de texto
        """
        try:
            # Abre el archivo de texto
            with open(self.text_path, 'r', encoding='utf-8') as text_file:
                content = text_file.read()
                
                # Divide el contenido en líneas
                lines = content.split('\n')
                
                print(f"📖 Archivo tiene {len(lines)} líneas")
                
                # Procesa cada línea
                for line_num, line in enumerate(lines, 1):
                    if line.strip():  # Ignora líneas vacías
                        self.extracted_content.append({
                            'line': line_num,
                            'content': line.strip()
                        })
                        
                        if line_num % 100 == 0:
                            print(f"✅ Procesada línea {line_num}")
                        
        except Exception as e:
            print(f"❌ Error al abrir el archivo: {e}")
            return False
            
        return True
    
    def extract_questions(self):
        """
        Extrae las preguntas del contenido del archivo
        """
        print("\n🔍 Extrayendo preguntas...")
        
        # Patrones para identificar preguntas (adaptados para 1000 preguntas de Backend)
        question_patterns = [
            r'(\d+\.\s*[A-Z][^?]*\?)',  # Preguntas numeradas
            r'(Q\d+\.\s*[^?]*\?)',      # Preguntas con prefijo Q
            r'(Question\s*\d+[^?]*\?)', # Preguntas con prefijo Question
            r'(\d+\)\s*[A-Z][^?]*\?)',  # Preguntas con paréntesis
            r'(\d+\.\s*[A-Z][^.]*\.)',  # Preguntas que terminan en punto
            r'(\d+\.\s*[A-Z][^:]*:)',   # Preguntas que terminan en dos puntos
        ]
        
        current_question = None
        current_answer = []
        
        for item in self.extracted_content:
            content = item['content']
            
            # Busca preguntas usando diferentes patrones
            question_found = False
            for pattern in question_patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                
                for match in matches:
                    question_text = match.group(1).strip()
                    
                    # Si encontramos una nueva pregunta, guardamos la anterior
                    if current_question:
                        question_data = {
                            'question': current_question,
                            'answer': ' '.join(current_answer).strip(),
                            'line': item['line'],
                            'position': match.start()
                        }
                        self.questions.append(question_data)
                    
                    # Iniciamos una nueva pregunta
                    current_question = question_text
                    current_answer = []
                    question_found = True
                    break
                
                if question_found:
                    break
            
            # Si no es una pregunta, es parte de la respuesta
            if not question_found and current_question:
                current_answer.append(content)
        
        # Guardar la última pregunta
        if current_question:
            question_data = {
                'question': current_question,
                'answer': ' '.join(current_answer).strip(),
                'line': len(self.extracted_content),
                'position': 0
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
            if len(question) > 10 and (question.endswith('?') or question.endswith('.') or question.endswith(':')):
                cleaned_questions.append({
                    'question': question,
                    'answer': answer,
                    'line': q['line']
                })
        
        self.questions = cleaned_questions
        print(f"✅ Limpiadas {len(self.questions)} preguntas válidas")
    
    def categorize_questions(self):
        """
        Categoriza las preguntas por temas de Backend Development
        """
        print("\n📂 Categorizando preguntas...")
        
        categories = {
            'arquitectura': [],
            'apis': [],
            'bases_datos': [],
            'autenticacion': [],
            'microservicios': [],
            'testing': [],
            'devops': [],
            'performance': [],
            'seguridad': [],
            'cloud': [],
            'frameworks': [],
            'lenguajes': [],
            'patrones': [],
            'escalabilidad': [],
            'monitoreo': [],
            'otros': []
        }
        
        keywords = {
            'arquitectura': ['architecture', 'pattern', 'design', 'layered', 'mvc', 'mvvm', 'clean architecture', 'hexagonal', 'ddd'],
            'apis': ['api', 'rest', 'graphql', 'soap', 'endpoint', 'controller', 'routing', 'middleware', 'swagger', 'openapi'],
            'bases_datos': ['database', 'sql', 'nosql', 'mysql', 'postgresql', 'mongodb', 'redis', 'orm', 'migration', 'query', 'index'],
            'autenticacion': ['authentication', 'authorization', 'jwt', 'oauth', 'session', 'token', 'password', 'encryption', 'bcrypt'],
            'microservicios': ['microservice', 'microservices', 'service', 'distributed', 'communication', 'api gateway', 'load balancer'],
            'testing': ['test', 'unit test', 'integration test', 'e2e', 'jest', 'junit', 'mocha', 'coverage', 'tdd', 'bdd'],
            'devops': ['devops', 'ci/cd', 'docker', 'kubernetes', 'deployment', 'pipeline', 'jenkins', 'gitlab', 'github actions'],
            'performance': ['performance', 'optimization', 'caching', 'load balancing', 'scaling', 'memory', 'cpu', 'latency'],
            'seguridad': ['security', 'vulnerability', 'xss', 'csrf', 'sql injection', 'authentication', 'authorization', 'encryption'],
            'cloud': ['cloud', 'aws', 'azure', 'gcp', 'lambda', 'ec2', 's3', 'rds', 'kubernetes', 'docker'],
            'frameworks': ['framework', 'spring', 'express', 'django', 'flask', 'laravel', 'rails', 'asp.net', 'fastapi'],
            'lenguajes': ['java', 'python', 'javascript', 'node.js', 'php', 'ruby', 'go', 'c#', 'typescript', 'kotlin'],
            'patrones': ['pattern', 'singleton', 'factory', 'observer', 'strategy', 'adapter', 'decorator', 'facade'],
            'escalabilidad': ['scalability', 'horizontal', 'vertical', 'load balancing', 'clustering', 'sharding', 'replication'],
            'monitoreo': ['monitoring', 'logging', 'metrics', 'alerting', 'health check', 'dashboard', 'prometheus', 'grafana']
        }
        
        for question in self.questions:
            question_lower = question['question'].lower()
            categorized = False
            
            for category, words in keywords.items():
                if any(word in question_lower for word in words):
                    categories[category].append(question)
                    categorized = True
                    break
            
            if not categorized:
                categories['otros'].append(question)
        
        # Agregar información de categorías a las preguntas
        for category, questions in categories.items():
            for question in questions:
                question['category'] = category
        
        print("📊 Categorización completada:")
        for category, questions in categories.items():
            print(f"   {category}: {len(questions)} preguntas")
    
    def save_raw_content(self, output_file):
        """
        Guarda el contenido extraído en formato texto
        """
        print(f"\n💾 Guardando contenido raw en {output_file}")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            for item in self.extracted_content:
                f.write(f"=== LÍNEA: {item['line']} ===\n")
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
                'source': '1000+ Back End Development Interview Questions and Answers',
                'author': 'Salunke, Manish',
                'extraction_date': str(Path().cwd()),
                'total_questions': len(self.questions),
                'version': '1.0'
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
        print(f"📖 Líneas procesadas: {len(self.extracted_content)}")
        print(f"❓ Preguntas extraídas: {len(self.questions)}")
        print(f"📁 Archivo fuente: {self.text_path}")
        
        if self.questions:
            print(f"\n📝 Ejemplos de preguntas extraídas:")
            for i, q in enumerate(self.questions[:3]):
                print(f"  {i+1}. {q['question'][:100]}...")
            
            # Mostrar estadísticas por categoría
            categories = {}
            for q in self.questions:
                cat = q.get('category', 'sin_categoria')
                categories[cat] = categories.get(cat, 0) + 1
            
            print(f"\n📂 Distribución por categorías:")
            for cat, count in sorted(categories.items()):
                print(f"  {cat}: {count} preguntas")
    
    def run_extraction(self, raw_output="backend_1000_questions_raw.txt", 
                      structured_output="backend_1000_questions_structured.json"):
        """
        Ejecuta el proceso completo de extracción
        
        Args:
            raw_output (str): Archivo de salida para contenido raw
            structured_output (str): Archivo de salida para preguntas estructuradas
        """
        print("🚀 Iniciando extracción de preguntas de Backend Development (1000)")
        print("=" * 60)
        
        # Verifica que el archivo existe
        if not os.path.exists(self.text_path):
            print(f"❌ Error: No se encontró el archivo {self.text_path}")
            return False
        
        # Ejecuta el proceso de extracción
        if not self.extract_text_content():
            return False
        
        self.extract_questions()
        self.clean_questions()
        self.categorize_questions()
        
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
    text_file = "1000 Back End Development Interview Questi - Salunke, Manish.txt"
    raw_output = "backend_1000_questions_raw.txt"
    structured_output = "backend_1000_questions_structured.json"
    
    # Verifica que estamos en el directorio correcto
    if not os.path.exists(text_file):
        print(f"❌ Error: No se encontró el archivo {text_file}")
        print("💡 Asegúrate de ejecutar este script en el directorio correcto")
        return
    
    # Crea el extractor y ejecuta la extracción
    extractor = Backend1000Extractor(text_file)
    success = extractor.run_extraction(raw_output, structured_output)
    
    if success:
        print(f"\n🎉 ¡Extracción completada!")
        print(f"📄 Contenido raw: {raw_output}")
        print(f"📊 Preguntas estructuradas: {structured_output}")
    else:
        print("\n❌ La extracción falló")

if __name__ == "__main__":
    main() 