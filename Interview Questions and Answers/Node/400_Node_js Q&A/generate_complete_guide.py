#!/usr/bin/env python3
"""
Script para generar la guía completa de Node.js en español
Incluye todas las preguntas procesadas con ejemplos y mejoras
"""

import json
import os
from datetime import datetime
from pathlib import Path

class NodeJSGuideGenerator:
    def __init__(self, input_file="node_questions_processed.json"):
        """
        Inicializa el generador de guías
        
        Args:
            input_file (str): Archivo JSON con preguntas procesadas
        """
        self.input_file = input_file
        self.processed_questions = []
        self.guide_content = ""
        
    def load_processed_questions(self):
        """
        Carga las preguntas procesadas desde el archivo JSON
        """
        try:
            with open(self.input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.processed_questions = data.get('questions', [])
            
            print(f"✅ Cargadas {len(self.processed_questions)} preguntas procesadas")
            return True
            
        except FileNotFoundError:
            print(f"❌ No se encontró el archivo {self.input_file}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Error al parsear JSON: {e}")
            return False
    
    def generate_header(self):
        """
        Genera el encabezado de la guía
        """
        header = f"""# 🟢 Guía Avanzada de Node.js: 400+ Preguntas y Respuestas

## 📋 Descripción

Esta guía es una **traducción y mejora completa** del libro "400+ Node.js Interview Questions and Answers" de Salunke, Manish. Se ha convertido en una guía de aprendizaje avanzada en español con ejemplos prácticos, pruebas unitarias y mejoras implementadas.

## 🎯 Objetivos de la Guía

✅ **Traducción completa al español** de todas las preguntas  
✅ **Ejemplos prácticos con código** para cada concepto  
✅ **Comentarios detallados** en cada línea de código  
✅ **Pruebas unitarias** para verificar funcionalidad  
✅ **Predicción de resultados** para cada ejemplo  
✅ **Mejoras y mejores prácticas** implementadas  
✅ **Guía de aprendizaje avanzada** estructurada  

## 📊 Estadísticas

- **Total de preguntas procesadas**: {len(self.processed_questions)}
- **Fecha de generación**: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}
- **Versión**: 1.0
- **Estado**: En desarrollo activo

## 📚 Estructura de la Guía

Cada pregunta incluye:
- 📝 Pregunta original en inglés
- 🌍 Traducción al español
- 💡 Explicación detallada
- 🔧 Ejemplo práctico con código
- 🧪 Pruebas unitarias
- 📊 Predicción de resultados
- 🚀 Mejoras implementadas

---

"""
        return header
    
    def generate_question_section(self, question_data, question_number):
        """
        Genera la sección de una pregunta individual
        
        Args:
            question_data (dict): Datos de la pregunta procesada
            question_number (int): Número de la pregunta
            
        Returns:
            str: Sección de la pregunta en markdown
        """
        section = f"""## 🎯 Pregunta {question_number}: {question_data['translated_question']}

### 📝 Pregunta Original
```
{question_data['original_question']}
```

### 🌍 Traducción al Español
```
{question_data['translated_question']}
```

### 💡 Explicación Detallada
{question_data['original_answer']}

### 🔧 Ejemplo Práctico con Código

#### {question_data['example']['title']}

```javascript
{question_data['example']['code']}
```

**Explicación del código:**
{question_data['example']['explanation']}

### 🧪 Pruebas Unitarias

```javascript
{question_data['unit_tests']}
```

### 📊 Predicción de Resultados

{question_data['results_prediction']}

### 🚀 Mejoras Implementadas

{question_data['improvements']}

---

"""
        return section
    
    def generate_toc(self):
        """
        Genera la tabla de contenidos
        """
        toc = """## 📑 Tabla de Contenidos

"""
        
        for i, question in enumerate(self.processed_questions, 1):
            # Limita el título a 80 caracteres para la TOC
            title = question['translated_question'][:80]
            if len(question['translated_question']) > 80:
                title += "..."
            
            toc += f"{i}. [{title}](#pregunta-{i}-{question['translated_question'].lower().replace(' ', '-').replace('?', '').replace('¿', '').replace('?', '')[:50]})\n"
        
        toc += "\n---\n\n"
        return toc
    
    def generate_footer(self):
        """
        Genera el pie de página de la guía
        """
        footer = f"""## 🎉 Conclusión

Esta guía contiene **{len(self.processed_questions)} preguntas procesadas** con ejemplos prácticos, pruebas unitarias y mejoras implementadas. Cada pregunta ha sido cuidadosamente traducida y mejorada para proporcionar una experiencia de aprendizaje completa.

## 🚀 Próximos Pasos

1. **Practicar con los ejemplos**: Ejecuta cada ejemplo de código en tu entorno Node.js
2. **Ejecutar las pruebas unitarias**: Verifica que todo funcione correctamente
3. **Implementar las mejoras**: Aplica las sugerencias de mejora en tus proyectos
4. **Contribuir**: Ayuda a mejorar esta guía con nuevas preguntas o ejemplos

## 🤝 Contribuciones

Este proyecto está abierto a contribuciones. Puedes:

- 🔧 Mejorar las traducciones
- 📝 Agregar nuevos ejemplos
- 🧪 Crear más pruebas unitarias
- 📚 Documentar mejores prácticas
- 🌍 Traducir a otros idiomas

## 📞 Contacto

Para preguntas, sugerencias o contribuciones:

- 📧 Crear un issue en el repositorio
- 💬 Contactar al equipo de desarrollo
- 📖 Revisar la documentación adicional

## 📄 Licencia

Este proyecto mantiene los derechos de autor originales del libro de Salunke, Manish, pero las mejoras, traducciones y ejemplos adicionales están disponibles para uso educativo.

---

*Guía creada con ❤️ para la comunidad de desarrolladores Node.js*

**Fecha de generación**: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}  
**Versión**: 1.0  
**Total de preguntas**: {len(self.processed_questions)}  
**Estado**: En desarrollo activo
"""
        return footer
    
    def generate_guide(self, output_file="Guia_NodeJS_Final.md"):
        """
        Genera la guía completa
        
        Args:
            output_file (str): Archivo de salida para la guía
        """
        print(f"📝 Generando guía completa...")
        
        # Genera el contenido de la guía
        self.guide_content = ""
        
        # Agrega el encabezado
        self.guide_content += self.generate_header()
        
        # Agrega la tabla de contenidos
        self.guide_content += self.generate_toc()
        
        # Agrega cada pregunta
        for i, question_data in enumerate(self.processed_questions, 1):
            print(f"📝 Generando pregunta {i}/{len(self.processed_questions)}")
            section = self.generate_question_section(question_data, i)
            self.guide_content += section
        
        # Agrega el pie de página
        self.guide_content += self.generate_footer()
        
        # Guarda la guía
        print(f"💾 Guardando guía en {output_file}")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(self.guide_content)
        
        print(f"✅ Guía guardada exitosamente en {output_file}")
        
        # Calcula estadísticas del archivo
        file_size = os.path.getsize(output_file)
        file_size_kb = file_size / 1024
        
        print(f"📊 Estadísticas del archivo:")
        print(f"   - Tamaño: {file_size_kb:.1f} KB")
        print(f"   - Preguntas incluidas: {len(self.processed_questions)}")
        print(f"   - Líneas de código: {self.guide_content.count('```') // 2}")
    
    def generate_summary_guide(self, output_file="Guia_NodeJS_Completa.md", limit=10):
        """
        Genera una guía resumida con menos preguntas
        
        Args:
            output_file (str): Archivo de salida
            limit (int): Número de preguntas a incluir
        """
        print(f"📝 Generando guía resumida con {limit} preguntas...")
        
        # Toma solo las primeras preguntas
        limited_questions = self.processed_questions[:limit]
        
        # Genera el contenido
        guide_content = self.generate_header()
        guide_content += f"## 📊 Guía Resumida ({limit} preguntas)\n\n"
        
        for i, question_data in enumerate(limited_questions, 1):
            section = self.generate_question_section(question_data, i)
            guide_content += section
        
        guide_content += self.generate_footer()
        
        # Guarda la guía resumida
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(guide_content)
        
        print(f"✅ Guía resumida guardada en {output_file}")
    
    def generate_advanced_guide(self, output_file="Guia_NodeJS_Avanzada.md", limit=3):
        """
        Genera una guía avanzada con preguntas seleccionadas
        
        Args:
            output_file (str): Archivo de salida
            limit (int): Número de preguntas a incluir
        """
        print(f"📝 Generando guía avanzada con {limit} preguntas...")
        
        # Selecciona preguntas que contengan palabras clave avanzadas
        advanced_keywords = ['event loop', 'stream', 'cluster', 'worker', 'performance', 'memory', 'security']
        advanced_questions = []
        
        for question in self.processed_questions:
            question_lower = question['original_question'].lower()
            if any(keyword in question_lower for keyword in advanced_keywords):
                advanced_questions.append(question)
                if len(advanced_questions) >= limit:
                    break
        
        # Si no hay suficientes preguntas avanzadas, toma las primeras
        if len(advanced_questions) < limit:
            advanced_questions = self.processed_questions[:limit]
        
        # Genera el contenido
        guide_content = self.generate_header()
        guide_content += f"## 🚀 Guía Avanzada ({len(advanced_questions)} preguntas)\n\n"
        
        for i, question_data in enumerate(advanced_questions, 1):
            section = self.generate_question_section(question_data, i)
            guide_content += section
        
        guide_content += self.generate_footer()
        
        # Guarda la guía avanzada
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(guide_content)
        
        print(f"✅ Guía avanzada guardada en {output_file}")
    
    def run_generation(self):
        """
        Ejecuta la generación completa de guías
        """
        print("🚀 Iniciando generación de guías de Node.js")
        print("=" * 60)
        
        # Carga las preguntas procesadas
        if not self.load_processed_questions():
            return False
        
        # Genera las diferentes versiones de la guía
        self.generate_guide("Guia_NodeJS_Final.md")
        self.generate_summary_guide("Guia_NodeJS_Completa.md", 10)
        self.generate_advanced_guide("Guia_NodeJS_Avanzada.md", 3)
        
        print("\n✅ Generación de guías completada exitosamente!")
        print("\n📁 Archivos generados:")
        print("   - Guia_NodeJS_Final.md (Guía completa)")
        print("   - Guia_NodeJS_Completa.md (Guía resumida)")
        print("   - Guia_NodeJS_Avanzada.md (Guía avanzada)")
        
        return True

def main():
    """
    Función principal del script
    """
    # Configuración
    input_file = "node_questions_processed.json"
    
    # Verifica que el archivo de entrada existe
    if not Path(input_file).exists():
        print(f"❌ Error: No se encontró el archivo {input_file}")
        print("💡 Ejecuta primero process_node_questions.py")
        return
    
    # Crea el generador y ejecuta la generación
    generator = NodeJSGuideGenerator(input_file)
    success = generator.run_generation()
    
    if success:
        print(f"\n🎉 ¡Generación completada!")
        print("📖 Las guías están listas para usar")
    else:
        print("\n❌ La generación falló")

if __name__ == "__main__":
    main() 