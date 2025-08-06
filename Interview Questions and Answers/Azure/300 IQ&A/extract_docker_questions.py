#!/usr/bin/env python3
"""
Script para extraer contenido del EPUB de Docker Interview Questions
y convertirlo a un formato de texto legible para procesamiento posterior.
"""

import zipfile
import re
import html
from bs4 import BeautifulSoup
import os

def clean_html_content(html_content):
    """Limpia el contenido HTML y extrae solo el texto relevante."""
    # Parsear HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Extraer texto de párrafos y encabezados
    text_content = []
    
    for element in soup.find_all(['h1', 'h2', 'h3', 'p']):
        # Obtener el texto del elemento
        text = element.get_text(strip=True)
        if text:
            # Limpiar caracteres especiales y espacios extra
            text = re.sub(r'\s+', ' ', text)
            text = text.strip()
            if text:
                text_content.append(text)
    
    return '\n'.join(text_content)

def extract_epub_content(epub_path):
    """Extrae todo el contenido del EPUB."""
    all_content = []
    
    with zipfile.ZipFile(epub_path, 'r') as z:
        # Obtener lista de archivos HTML/XHTML
        html_files = [f for f in z.namelist() if f.endswith('.xhtml') and 'part' in f]
        html_files.sort()  # Ordenar por número de parte
        
        for html_file in html_files:
            try:
                content = z.read(html_file).decode('utf-8')
                cleaned_content = clean_html_content(content)
                if cleaned_content.strip():
                    all_content.append(f"=== {html_file} ===")
                    all_content.append(cleaned_content)
                    all_content.append("\n" + "="*50 + "\n")
            except Exception as e:
                print(f"Error procesando {html_file}: {e}")
    
    return '\n'.join(all_content)

def main():
    epub_file = "400+ Docker Interview Questions and Answers.epub"
    output_file = "docker_questions_raw.txt"
    
    print("Extrayendo contenido del EPUB...")
    content = extract_epub_content(epub_file)
    
    print("Guardando contenido extraído...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Contenido extraído guardado en: {output_file}")
    print(f"Tamaño del archivo: {len(content)} caracteres")

if __name__ == "__main__":
    main() 