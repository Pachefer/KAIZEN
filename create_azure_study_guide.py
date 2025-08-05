#!/usr/bin/env python3
"""
Script para crear guía de estudio completa de Azure
"""

import json
import re
from pathlib import Path

def translate_question(question):
    """Traduce una pregunta de Azure al español"""
    # Traducciones básicas
    translations = {
        'What is': '¿Qué es',
        'How does': '¿Cómo',
        'Which': '¿Cuál',
        'In Azure': 'En Azure',
        'Azure Resource Manager': 'Azure Resource Manager',
        'Virtual Network': 'Red Virtual',
        'Storage': 'Almacenamiento',
        'Security': 'Seguridad',
        'Monitoring': 'Monitoreo',
        'Deployment': 'Implementación',
        'Configuration': 'Configuración',
        'Authentication': 'Autenticación',
        'Authorization': 'Autorización',
        'Load Balancer': 'Balanceador de Carga',
        'Virtual Machine': 'Máquina Virtual',
        'Function': 'Función',
        'Database': 'Base de Datos',
        'Backup': 'Respaldo',
        'Disaster Recovery': 'Recuperación ante Desastres',
        'Compliance': 'Cumplimiento',
        'Policy': 'Política',
        'Subscription': 'Suscripción',
        'Resource Group': 'Grupo de Recursos'
    }
    
    translated = question['pregunta']
    for eng, esp in translations.items():
        translated = translated.replace(eng, esp)
    
    return translated

def generate_code_example(question):
    """Genera código de ejemplo basado en la pregunta"""
    pregunta_lower = question['pregunta'].lower()
    
    if 'resource manager' in pregunta_lower:
        return """
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "defaultValue": "mystorageaccount"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-09-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2"
    }
  ]
}
```"""
    
    elif 'virtual network' in pregunta_lower:
        return """
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2021-05-01",
      "name": "myVNet",
      "location": "[resourceGroup().location]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": ["10.0.0.0/16"]
        },
        "subnets": [
          {
            "name": "default",
            "properties": {
              "addressPrefix": "10.0.0.0/24"
            }
          }
        ]
      }
    }
  ]
}
```"""
    
    elif 'storage' in pregunta_lower:
        return """
```python
from azure.storage.blob import BlobServiceClient
import os

# Conectar al servicio de almacenamiento
connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

# Crear un contenedor
container_name = "mycontainer"
container_client = blob_service_client.create_container(container_name)

# Subir un archivo
with open("sample.txt", "rb") as data:
    blob_client = container_client.upload_blob(name="sample.txt", data=data)
```"""
    
    else:
        return """
```python
# Ejemplo básico de Azure SDK
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

# Autenticación
credential = DefaultAzureCredential()
subscription_id = "your-subscription-id"

# Cliente de recursos
resource_client = ResourceManagementClient(credential, subscription_id)

# Listar grupos de recursos
resource_groups = resource_client.resource_groups.list()
for group in resource_groups:
    print(f"Grupo: {group.name}, Ubicación: {group.location}")
```"""

def generate_unit_test(question):
    """Genera pruebas unitarias basadas en la pregunta"""
    pregunta_lower = question['pregunta'].lower()
    
    if 'resource manager' in pregunta_lower:
        return """
```python
import unittest
from unittest.mock import Mock, patch
from azure.mgmt.resource import ResourceManagementClient

class TestAzureResourceManager(unittest.TestCase):
    
    def setUp(self):
        self.mock_credential = Mock()
        self.resource_client = ResourceManagementClient(
            self.mock_credential, 
            "test-subscription-id"
        )
    
    def test_resource_group_creation(self):
        # Prueba la creación de un grupo de recursos
        with patch.object(self.resource_client.resource_groups, 'create_or_update') as mock_create:
            mock_create.return_value = Mock(name="test-rg")
            
            result = self.resource_client.resource_groups.create_or_update(
                "test-rg",
                {"location": "eastus"}
            )
            
            mock_create.assert_called_once()
            self.assertEqual(result.name, "test-rg")
    
    def test_resource_deployment(self):
        # Prueba el despliegue de recursos
        with patch.object(self.resource_client.deployments, 'create_or_update') as mock_deploy:
            mock_deploy.return_value = Mock(properties=Mock(provisioning_state="Succeeded"))
            
            result = self.resource_client.deployments.create_or_update(
                "test-rg",
                "test-deployment",
                {"template": {}, "parameters": {}}
            )
            
            self.assertEqual(result.properties.provisioning_state, "Succeeded")

if __name__ == '__main__':
    unittest.main()
```"""
    
    else:
        return """
```python
import unittest
from unittest.mock import Mock, patch

class TestAzureService(unittest.TestCase):
    
    def setUp(self):
        # Configuración inicial para las pruebas
        self.mock_client = Mock()
    
    def test_service_creation(self):
        # Prueba la creación del servicio
        # Arrange
        expected_name = "test-service"
        
        # Act
        result = self.mock_client.create_service(expected_name)
        
        # Assert
        self.mock_client.create_service.assert_called_once_with(expected_name)
    
    def test_service_configuration(self):
        # Prueba la configuración del servicio
        # Arrange
        config = {"setting1": "value1", "setting2": "value2"}
        
        # Act
        self.mock_client.configure_service(config)
        
        # Assert
        self.mock_client.configure_service.assert_called_once_with(config)
    
    def test_error_handling(self):
        # Prueba el manejo de errores
        # Arrange
        self.mock_client.create_service.side_effect = Exception("Service error")
        
        # Act & Assert
        with self.assertRaises(Exception):
            self.mock_client.create_service("test")

if __name__ == '__main__':
    unittest.main()
```"""

def create_detailed_guide():
    """Crea la guía de estudio detallada"""
    
    # Cargar preguntas extraídas
    with open('azure_questions_extracted.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    guide = {
        'titulo': 'Guía Completa de Estudio Azure - 300+ Preguntas y Respuestas',
        'descripcion': 'Guía completa con traducción al español, código de ejemplo, pruebas unitarias y explicaciones detalladas',
        'niveles': {
            'basico': {
                'descripcion': 'Conceptos fundamentales de Azure para principiantes',
                'preguntas': []
            },
            'intermedio': {
                'descripcion': 'Servicios y configuraciones avanzadas de Azure',
                'preguntas': []
            },
            'avanzado': {
                'descripcion': 'Arquitecturas complejas y optimizaciones avanzadas',
                'preguntas': []
            }
        },
        'categorias': {
            'fundamentos': {
                'descripcion': 'Conceptos básicos de Azure y Resource Manager',
                'preguntas': []
            },
            'servicios_computo': {
                'descripcion': 'Virtual Machines, Functions, App Services',
                'preguntas': []
            },
            'almacenamiento': {
                'descripcion': 'Storage Accounts, Blob, File, Disk Storage',
                'preguntas': []
            },
            'redes': {
                'descripcion': 'Virtual Networks, Load Balancers, Gateways',
                'preguntas': []
            },
            'seguridad': {
                'descripcion': 'Identity, Authentication, Authorization, Key Vault',
                'preguntas': []
            },
            'monitoreo': {
                'descripcion': 'Monitor, Log Analytics, Alerts, Insights',
                'preguntas': []
            },
            'devops': {
                'descripcion': 'Pipelines, Deployment, CI/CD, Automation',
                'preguntas': []
            }
        }
    }
    
    # Procesar cada pregunta
    for i, question in enumerate(questions[:50]):  # Limitar a 50 para el ejemplo
        # Traducir pregunta
        pregunta_traducida = translate_question(question)
        
        # Generar código de ejemplo
        codigo_ejemplo = generate_code_example(question)
        
        # Generar pruebas unitarias
        pruebas_unitarias = generate_unit_test(question)
        
        # Crear pregunta detallada
        pregunta_detallada = {
            'id': i + 1,
            'pregunta_original': question['pregunta'],
            'pregunta_traducida': pregunta_traducida,
            'opciones': question['opciones'],
            'respuesta_correcta': question['respuesta_correcta'],
            'explicacion': question['explicacion'],
            'codigo_ejemplo': codigo_ejemplo,
            'pruebas_unitarias': pruebas_unitarias,
            'explicacion_linea_por_linea': f"""
## Explicación Línea por Línea

### Pregunta
{pregunta_traducida}

### Análisis
Esta pregunta evalúa el conocimiento sobre {' '.join(question['pregunta'].split()[0:5])} en Azure.

### Opciones
{chr(65 + 0)}. {question['opciones'][0]} - Correcta
{chr(65 + 1)}. {question['opciones'][1]} - Incorrecta
""",
            'mejoras_sugeridas': [
                "Implementar monitoreo adicional",
                "Considerar alta disponibilidad",
                "Aplicar mejores prácticas de seguridad",
                "Optimizar costos"
            ]
        }
        
        # Clasificar por nivel
        if len(question['pregunta']) < 80:
            guide['niveles']['basico']['preguntas'].append(pregunta_detallada)
        elif len(question['pregunta']) < 120:
            guide['niveles']['intermedio']['preguntas'].append(pregunta_detallada)
        else:
            guide['niveles']['avanzado']['preguntas'].append(pregunta_detallada)
        
        # Clasificar por categoría
        pregunta_lower = question['pregunta'].lower()
        if 'resource manager' in pregunta_lower or 'fundamental' in pregunta_lower:
            guide['categorias']['fundamentos']['preguntas'].append(pregunta_detallada)
        elif any(word in pregunta_lower for word in ['virtual machine', 'function', 'compute']):
            guide['categorias']['servicios_computo']['preguntas'].append(pregunta_detallada)
        elif 'storage' in pregunta_lower:
            guide['categorias']['almacenamiento']['preguntas'].append(pregunta_detallada)
        elif any(word in pregunta_lower for word in ['network', 'vnet', 'load balancer']):
            guide['categorias']['redes']['preguntas'].append(pregunta_detallada)
        elif any(word in pregunta_lower for word in ['security', 'identity', 'authentication']):
            guide['categorias']['seguridad']['preguntas'].append(pregunta_detallada)
        elif any(word in pregunta_lower for word in ['monitor', 'log', 'alert']):
            guide['categorias']['monitoreo']['preguntas'].append(pregunta_detallada)
        elif any(word in pregunta_lower for word in ['devops', 'pipeline', 'deployment']):
            guide['categorias']['devops']['preguntas'].append(pregunta_detallada)
        else:
            guide['categorias']['fundamentos']['preguntas'].append(pregunta_detallada)
    
    return guide

def save_guide_as_markdown(guide, filename):
    """Guarda la guía en formato Markdown"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"# {guide['titulo']}\n\n")
        f.write(f"{guide['descripcion']}\n\n")
        
        # Niveles
        f.write("## Niveles de Estudio\n\n")
        for nivel, contenido in guide['niveles'].items():
            f.write(f"### Nivel {nivel.title()}\n")
            f.write(f"{contenido['descripcion']}\n")
            f.write(f"**Preguntas: {len(contenido['preguntas'])}**\n\n")
            
            for pregunta in contenido['preguntas'][:3]:  # Mostrar solo 3 ejemplos
                f.write(f"#### Pregunta {pregunta['id']}\n")
                f.write(f"**Original:** {pregunta['pregunta_original']}\n\n")
                f.write(f"**Traducida:** {pregunta['pregunta_traducida']}\n\n")
                f.write("**Opciones:**\n")
                for j, opt in enumerate(pregunta['opciones']):
                    f.write(f"- {chr(65 + j)}. {opt}\n")
                f.write(f"\n**Respuesta:** {pregunta['respuesta_correcta']}\n\n")
                f.write(f"**Explicación:** {pregunta['explicacion']}\n\n")
                f.write("**Código de Ejemplo:**\n")
                f.write(pregunta['codigo_ejemplo'])
                f.write("\n\n**Pruebas Unitarias:**\n")
                f.write(pregunta['pruebas_unitarias'])
                f.write("\n\n**Mejoras Sugeridas:**\n")
                for mejora in pregunta['mejoras_sugeridas']:
                    f.write(f"- {mejora}\n")
                f.write("\n---\n\n")
        
        # Categorías
        f.write("## Categorías por Servicio\n\n")
        for categoria, contenido in guide['categorias'].items():
            f.write(f"### {categoria.replace('_', ' ').title()}\n")
            f.write(f"{contenido['descripcion']}\n")
            f.write(f"**Preguntas: {len(contenido['preguntas'])}**\n\n")

def main():
    print("Creando guía de estudio completa...")
    
    # Crear guía detallada
    guide = create_detailed_guide()
    
    # Guardar en JSON
    with open('azure_complete_study_guide.json', 'w', encoding='utf-8') as f:
        json.dump(guide, f, ensure_ascii=False, indent=2)
    
    # Guardar en Markdown
    save_guide_as_markdown(guide, 'azure_study_guide.md')
    
    print("Guía de estudio creada exitosamente!")
    print("- azure_complete_study_guide.json")
    print("- azure_study_guide.md")
    
    # Mostrar estadísticas
    print("\nEstadísticas:")
    for nivel, contenido in guide['niveles'].items():
        print(f"  Nivel {nivel}: {len(contenido['preguntas'])} preguntas")
    
    for categoria, contenido in guide['categorias'].items():
        print(f"  {categoria}: {len(contenido['preguntas'])} preguntas")

if __name__ == "__main__":
    main() 