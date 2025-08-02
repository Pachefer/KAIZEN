#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para extraer preguntas y respuestas del PDF de Backend Development
Basado en el libro "1000 Back End Development Interview Questions" de Salunke, Manish
"""

import PyPDF2
import re
import json
import os
from typing import List, Dict, Any
from pathlib import Path

class BackendExtractor:
    def __init__(self, pdf_path: str):
        """
        Inicializa el extractor con la ruta del archivo PDF
        
        Args:
            pdf_path (str): Ruta al archivo PDF de Backend Development
        """
        self.pdf_path = pdf_path
        self.extracted_content = []
        self.questions = []
        self.categories = {
            'programming_fundamentals': [],
            'data_structures': [],
            'algorithms': [],
            'databases': [],
            'api_design': [],
            'security': [],
            'performance': [],
            'testing': [],
            'deployment': [],
            'system_design': [],
            'microservices': [],
            'cloud_computing': [],
            'other': []
        }
        
    def extract_pdf_content(self) -> bool:
        """
        Extrae el contenido del archivo PDF
        
        Returns:
            bool: True si la extracción fue exitosa, False en caso contrario
        """
        try:
            with open(self.pdf_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                
                print(f"📖 PDF tiene {len(pdf_reader.pages)} páginas")
                
                for page_num, page in enumerate(pdf_reader.pages, 1):
                    try:
                        text_content = page.extract_text()
                        
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
            r'(\d+\.\s*[^?]*\?)',       # Preguntas simples numeradas
        ]
        
        for item in self.extracted_content:
            content = item['content']
            
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
                        'position': match.start(),
                        'category': self.categorize_question(question_text, answer_text)
                    }
                    
                    self.questions.append(question_data)
        
        print(f"📊 Extraídas {len(self.questions)} preguntas")
    
    def categorize_question(self, question: str, answer: str) -> str:
        """
        Categoriza la pregunta basándose en su contenido
        
        Args:
            question (str): Texto de la pregunta
            answer (str): Texto de la respuesta
            
        Returns:
            str: Categoría de la pregunta
        """
        question_lower = question.lower()
        answer_lower = answer.lower()
        
        # Palabras clave para cada categoría
        keywords = {
            'programming_fundamentals': ['variable', 'function', 'class', 'object', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'oop', 'programming'],
            'data_structures': ['array', 'list', 'stack', 'queue', 'tree', 'graph', 'hash', 'linked list', 'binary tree', 'heap'],
            'algorithms': ['sort', 'search', 'algorithm', 'complexity', 'big o', 'time complexity', 'space complexity', 'recursion'],
            'databases': ['database', 'sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'redis', 'index', 'query', 'transaction'],
            'api_design': ['api', 'rest', 'graphql', 'endpoint', 'http', 'request', 'response', 'json', 'xml'],
            'security': ['security', 'authentication', 'authorization', 'jwt', 'oauth', 'encryption', 'hash', 'password', 'csrf', 'xss'],
            'performance': ['performance', 'optimization', 'caching', 'load balancing', 'scalability', 'memory', 'cpu', 'latency'],
            'testing': ['test', 'unit test', 'integration test', 'tdd', 'bdd', 'mock', 'stub', 'coverage'],
            'deployment': ['deployment', 'ci/cd', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'server', 'production'],
            'system_design': ['system design', 'architecture', 'microservices', 'monolith', 'distributed', 'scalable'],
            'microservices': ['microservice', 'service mesh', 'api gateway', 'circuit breaker', 'load balancer'],
            'cloud_computing': ['cloud', 'aws', 'azure', 'gcp', 'serverless', 'lambda', 'ec2', 's3', 'vpc']
        }
        
        # Busca coincidencias en pregunta y respuesta
        for category, category_keywords in keywords.items():
            for keyword in category_keywords:
                if keyword in question_lower or keyword in answer_lower:
                    return category
        
        return 'other'
    
    def clean_questions(self):
        """
        Limpia y estructura las preguntas extraídas
        """
        print("\n🧹 Limpiando preguntas...")
        
        cleaned_questions = []
        
        for question_data in self.questions:
            question = question_data['question']
            answer = question_data['answer']
            
            # Limpia la pregunta
            question = re.sub(r'\s+', ' ', question).strip()
            question = re.sub(r'^\d+\.\s*', '', question)  # Remueve numeración inicial
            
            # Limpia la respuesta
            answer = re.sub(r'\s+', ' ', answer).strip()
            
            # Filtra preguntas muy cortas o sin respuesta
            if len(question) > 10 and len(answer) > 20:
                cleaned_question = {
                    'id': len(cleaned_questions) + 1,
                    'question': question,
                    'answer': answer,
                    'category': question_data['category'],
                    'page': question_data['page'],
                    'difficulty': self.assess_difficulty(question, answer),
                    'tags': self.extract_tags(question, answer)
                }
                
                cleaned_questions.append(cleaned_question)
        
        self.questions = cleaned_questions
        print(f"✅ Limpiadas {len(self.questions)} preguntas")
    
    def assess_difficulty(self, question: str, answer: str) -> str:
        """
        Evalúa la dificultad de la pregunta
        
        Args:
            question (str): Texto de la pregunta
            answer (str): Texto de la respuesta
            
        Returns:
            str: Nivel de dificultad (beginner, intermediate, advanced)
        """
        question_lower = question.lower()
        answer_lower = answer.lower()
        
        # Palabras clave para diferentes niveles
        advanced_keywords = ['architecture', 'distributed', 'scalability', 'microservices', 'system design', 'complexity', 'algorithm']
        intermediate_keywords = ['api', 'database', 'security', 'testing', 'deployment', 'performance']
        
        for keyword in advanced_keywords:
            if keyword in question_lower or keyword in answer_lower:
                return 'advanced'
        
        for keyword in intermediate_keywords:
            if keyword in question_lower or keyword in answer_lower:
                return 'intermediate'
        
        return 'beginner'
    
    def extract_tags(self, question: str, answer: str) -> List[str]:
        """
        Extrae tags relevantes de la pregunta y respuesta
        
        Args:
            question (str): Texto de la pregunta
            answer (str): Texto de la respuesta
            
        Returns:
            List[str]: Lista de tags
        """
        text = (question + ' ' + answer).lower()
        tags = []
        
        # Tecnologías y conceptos comunes
        tech_keywords = {
            'javascript': ['javascript', 'js', 'node.js', 'nodejs'],
            'python': ['python', 'django', 'flask'],
            'java': ['java', 'spring', 'spring boot'],
            'c#': ['c#', 'csharp', '.net', 'asp.net'],
            'php': ['php', 'laravel', 'symfony'],
            'go': ['go', 'golang'],
            'rust': ['rust'],
            'sql': ['sql', 'mysql', 'postgresql', 'oracle'],
            'nosql': ['mongodb', 'redis', 'cassandra', 'nosql'],
            'docker': ['docker', 'container'],
            'kubernetes': ['kubernetes', 'k8s'],
            'aws': ['aws', 'amazon', 'ec2', 's3', 'lambda'],
            'azure': ['azure', 'microsoft'],
            'gcp': ['gcp', 'google cloud'],
            'rest': ['rest', 'api'],
            'graphql': ['graphql'],
            'microservices': ['microservices', 'microservice'],
            'monolith': ['monolith', 'monolithic'],
            'testing': ['test', 'testing', 'tdd', 'bdd'],
            'security': ['security', 'authentication', 'authorization'],
            'performance': ['performance', 'optimization', 'caching']
        }
        
        for tag, keywords in tech_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    tags.append(tag)
                    break
        
        return list(set(tags))  # Remueve duplicados
    
    def save_to_json(self, output_path: str):
        """
        Guarda las preguntas en formato JSON
        
        Args:
            output_path (str): Ruta del archivo de salida
        """
        output_data = {
            'metadata': {
                'total_questions': len(self.questions),
                'categories': {cat: len([q for q in self.questions if q['category'] == cat]) 
                             for cat in self.categories.keys()},
                'difficulties': {diff: len([q for q in self.questions if q['difficulty'] == diff]) 
                               for diff in ['beginner', 'intermediate', 'advanced']},
                'source': '1000 Back End Development Interview Questions - Salunke, Manish'
            },
            'questions': self.questions
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Guardadas {len(self.questions)} preguntas en {output_path}")
    
    def save_to_markdown(self, output_path: str):
        """
        Guarda las preguntas en formato Markdown
        
        Args:
            output_path (str): Ruta del archivo de salida
        """
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("# 1000 Preguntas de Entrevista de Desarrollo Backend\n\n")
            f.write("Basado en el libro de Salunke, Manish\n\n")
            
            # Estadísticas
            f.write("## Estadísticas\n\n")
            f.write(f"- **Total de preguntas:** {len(self.questions)}\n")
            
            # Por categoría
            f.write("\n### Por Categoría\n")
            for cat in self.categories.keys():
                count = len([q for q in self.questions if q['category'] == cat])
                if count > 0:
                    f.write(f"- {cat.replace('_', ' ').title()}: {count}\n")
            
            # Por dificultad
            f.write("\n### Por Dificultad\n")
            for diff in ['beginner', 'intermediate', 'advanced']:
                count = len([q for q in self.questions if q['difficulty'] == diff])
                f.write(f"- {diff.title()}: {count}\n")
            
            f.write("\n---\n\n")
            
            # Preguntas por categoría
            for cat in self.categories.keys():
                cat_questions = [q for q in self.questions if q['category'] == cat]
                if cat_questions:
                    f.write(f"## {cat.replace('_', ' ').title()}\n\n")
                    
                    for question in cat_questions:
                        f.write(f"### {question['id']}. {question['question']}\n\n")
                        f.write(f"**Respuesta:** {question['answer']}\n\n")
                        f.write(f"**Dificultad:** {question['difficulty'].title()}\n")
                        f.write(f"**Tags:** {', '.join(question['tags'])}\n\n")
                        f.write("---\n\n")
        
        print(f"📝 Guardadas preguntas en formato Markdown: {output_path}")
    
    def run_extraction(self):
        """
        Ejecuta el proceso completo de extracción
        """
        print("🚀 Iniciando extracción de preguntas de Backend Development...")
        
        # Extrae contenido del PDF
        if not self.extract_pdf_content():
            return False
        
        # Extrae preguntas
        self.extract_questions()
        
        # Limpia preguntas
        self.clean_questions()
        
        # Guarda resultados
        output_dir = Path(self.pdf_path).parent
        self.save_to_json(str(output_dir / 'backend_questions_structured.json'))
        self.save_to_markdown(str(output_dir / 'backend_questions_guide.md'))
        
        print("✅ Extracción completada exitosamente!")
        return True

def main():
    """
    Función principal
    """
    # Ruta al archivo PDF
    pdf_path = "1000 Back End Development Interview Questi - Salunke, Manish.pdf"
    
    # Verifica que el archivo existe
    if not os.path.exists(pdf_path):
        print(f"❌ Error: No se encontró el archivo {pdf_path}")
        return
    
    # Crea el extractor y ejecuta la extracción
    extractor = BackendExtractor(pdf_path)
    extractor.run_extraction()

if __name__ == "__main__":
    main() 