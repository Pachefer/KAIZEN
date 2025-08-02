#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script maestro para ejecutar todo el proceso de generación de guías de Spring Boot
"""

import os
import subprocess
import sys
from pathlib import Path

def run_script(script_name: str, description: str) -> bool:
    """
    Ejecuta un script de Python y maneja errores
    
    Args:
        script_name: Nombre del script a ejecutar
        description: Descripción del paso
        
    Returns:
        True si el script se ejecutó exitosamente, False en caso contrario
    """
    print(f"\n🔄 {description}...")
    print(f"📁 Ejecutando: {script_name}")
    
    try:
        # Obtener el directorio actual
        current_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(current_dir, script_name)
        
        # Verificar que el script existe
        if not os.path.exists(script_path):
            print(f"❌ Error: No se encontró el script {script_path}")
            return False
        
        # Ejecutar el script
        result = subprocess.run([sys.executable, script_path], 
                              cwd=current_dir,
                              capture_output=True,
                              text=True,
                              encoding='utf-8')
        
        if result.returncode == 0:
            print(f"✅ {description} completado exitosamente")
            if result.stdout:
                print(result.stdout)
            return True
        else:
            print(f"❌ Error en {description}")
            if result.stderr:
                print(f"Error: {result.stderr}")
            if result.stdout:
                print(f"Output: {result.stdout}")
            return False
            
    except Exception as e:
        print(f"❌ Excepción en {description}: {e}")
        return False

def check_dependencies() -> bool:
    """
    Verifica que las dependencias necesarias estén instaladas
    
    Returns:
        True si todas las dependencias están disponibles
    """
    print("🔍 Verificando dependencias...")
    
    required_packages = ['PyPDF2', 'json', 'os']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Faltan las siguientes dependencias: {', '.join(missing_packages)}")
        print("💡 Instala las dependencias con: pip install PyPDF2")
        return False
    
    print("✅ Todas las dependencias están disponibles")
    return True

def check_input_files() -> bool:
    """
    Verifica que los archivos de entrada existan
    
    Returns:
        True si todos los archivos de entrada están disponibles
    """
    print("🔍 Verificando archivos de entrada...")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    required_files = [
        '620_ Spring Boot Developer Interview Quest - Salunke, Manish.pdf'
    ]
    
    missing_files = []
    for file_name in required_files:
        file_path = os.path.join(current_dir, file_name)
        if not os.path.exists(file_path):
            missing_files.append(file_name)
    
    if missing_files:
        print(f"❌ Faltan los siguientes archivos: {', '.join(missing_files)}")
        return False
    
    print("✅ Todos los archivos de entrada están disponibles")
    return True

def create_sample_data():
    """
    Crea datos de muestra si no existen archivos procesados
    """
    print("📝 Creando datos de muestra...")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Crear datos de muestra para springboot_questions_processed.json
    sample_data = {
        "metadata": {
            "source": "620 Spring Boot Developer Interview Questions - Manish Salunke",
            "processed_questions": 3,
            "categories": ["Spring Boot", "Spring Core", "Spring Data"]
        },
        "questions": [
            {
                "id": 1,
                "original_question": "What is Spring Boot?",
                "translated_question": "¿Qué es Spring Boot?",
                "original_answer": "Spring Boot is a framework that simplifies the development of Spring applications.",
                "translated_answer": "Spring Boot es un framework que simplifica el desarrollo de aplicaciones Spring.",
                "category": "Spring Boot",
                "difficulty": "Intermediate",
                "code_example": "```java\n@SpringBootApplication\npublic class MyApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(MyApplication.class, args);\n    }\n}\n```",
                "code_explanation": "Ejemplo básico de una aplicación Spring Boot.",
                "unit_tests": "```java\n@SpringBootTest\nclass MyApplicationTest {\n    @Test\n    void contextLoads() {\n        // Verifica que el contexto se carga correctamente\n    }\n}\n```",
                "test_explanation": "Prueba que verifica que la aplicación Spring Boot se inicia correctamente.",
                "improvements": [
                    "Agregar configuración de propiedades",
                    "Implementar health checks",
                    "Configurar logging"
                ],
                "expected_result": "Aplicación Spring Boot que se inicia correctamente",
                "learning_objectives": [
                    "Comprender Spring Boot",
                    "Crear aplicaciones básicas",
                    "Configurar el entorno"
                ]
            },
            {
                "id": 2,
                "original_question": "What is dependency injection?",
                "translated_question": "¿Qué es la inyección de dependencias?",
                "original_answer": "Dependency injection is a design pattern where dependencies are provided to a class rather than created inside it.",
                "translated_answer": "La inyección de dependencias es un patrón de diseño donde las dependencias se proporcionan a una clase en lugar de crearse dentro de ella.",
                "category": "Spring Core",
                "difficulty": "Intermediate",
                "code_example": "```java\n@Component\npublic class UserService {\n    private final UserRepository userRepository;\n    \n    @Autowired\n    public UserService(UserRepository userRepository) {\n        this.userRepository = userRepository;\n    }\n}\n```",
                "code_explanation": "Ejemplo de inyección de dependencias por constructor.",
                "unit_tests": "```java\n@ExtendWith(MockitoExtension.class)\nclass UserServiceTest {\n    @Mock\n    private UserRepository userRepository;\n    \n    @InjectMocks\n    private UserService userService;\n    \n    @Test\n    void constructorInjection_WorksCorrectly() {\n        assertThat(userService).isNotNull();\n    }\n}\n```",
                "test_explanation": "Prueba que verifica la inyección de dependencias.",
                "improvements": [
                    "Usar constructor injection",
                    "Implementar interfaces",
                    "Agregar validaciones"
                ],
                "expected_result": "Servicio con dependencias inyectadas correctamente",
                "learning_objectives": [
                    "Comprender DI",
                    "Implementar patrones",
                    "Escribir pruebas"
                ]
            },
            {
                "id": 3,
                "original_question": "What is JPA?",
                "translated_question": "¿Qué es JPA?",
                "original_answer": "JPA (Java Persistence API) is a specification for managing relational data in Java applications.",
                "translated_answer": "JPA (Java Persistence API) es una especificación para gestionar datos relacionales en aplicaciones Java.",
                "category": "Spring Data",
                "difficulty": "Intermediate",
                "code_example": "```java\n@Entity\n@Table(name = \"users\")\npublic class User {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    \n    @Column(nullable = false)\n    private String name;\n}\n```",
                "code_explanation": "Ejemplo de entidad JPA básica.",
                "unit_tests": "```java\n@DataJpaTest\nclass UserRepositoryTest {\n    @Autowired\n    private UserRepository userRepository;\n    \n    @Test\n    void saveUser_WorksCorrectly() {\n        User user = new User();\n        user.setName(\"Test User\");\n        \n        User saved = userRepository.save(user);\n        \n        assertThat(saved.getId()).isNotNull();\n    }\n}\n```",
                "test_explanation": "Prueba que verifica la persistencia de entidades.",
                "improvements": [
                    "Agregar validaciones",
                    "Implementar auditoría",
                    "Optimizar consultas"
                ],
                "expected_result": "Entidad JPA que se persiste correctamente",
                "learning_objectives": [
                    "Comprender JPA",
                    "Crear entidades",
                    "Gestionar datos"
                ]
            }
        ]
    }
    
    import json
    output_file = os.path.join(current_dir, 'springboot_questions_processed.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Datos de muestra creados: {output_file}")

def main():
    """Función principal"""
    print("🚀 Iniciando proceso completo de generación de guías de Spring Boot")
    print("=" * 70)
    
    # Verificar dependencias
    if not check_dependencies():
        print("❌ No se pueden continuar sin las dependencias necesarias")
        return
    
    # Verificar archivos de entrada
    if not check_input_files():
        print("❌ No se pueden continuar sin los archivos de entrada")
        return
    
    # Paso 1: Extraer preguntas del PDF
    if not run_script('extract_springboot_questions.py', 'Extrayendo preguntas del PDF'):
        print("⚠️ Continuando con datos de muestra...")
        create_sample_data()
    
    # Paso 2: Procesar y traducir preguntas
    if not run_script('process_springboot_questions.py', 'Procesando y traduciendo preguntas'):
        print("⚠️ Continuando con datos de muestra...")
        create_sample_data()
    
    # Paso 3: Generar guías finales
    if not run_script('generate_springboot_guide.py', 'Generando guías finales'):
        print("❌ Error al generar las guías finales")
        return
    
    print("\n" + "=" * 70)
    print("🎉 ¡Proceso completado exitosamente!")
    print("\n📁 Archivos generados:")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    generated_files = [
        'Guia_SpringBoot_Avanzada.md',
        'Guia_SpringBoot_Completa.md',
        'Guia_SpringBoot_Final.md',
        'springboot_questions_processed.json'
    ]
    
    for file_name in generated_files:
        file_path = os.path.join(current_dir, file_name)
        if os.path.exists(file_path):
            print(f"   ✅ {file_name}")
        else:
            print(f"   ❌ {file_name} (no encontrado)")
    
    print("\n📖 Próximos pasos:")
    print("   1. Revisar las guías generadas")
    print("   2. Ejecutar los ejemplos de código")
    print("   3. Crear ejemplos prácticos adicionales")
    print("   4. Expandir con más preguntas del libro")

if __name__ == "__main__":
    main() 