#!/usr/bin/env python3
"""
Script para generar guía de mejores prácticas de Azure
"""

import json
import re
from pathlib import Path

def generate_architecture_patterns():
    """Genera patrones de arquitectura comunes en Azure"""
    return {
        "microservicios": {
            "descripcion": "Arquitectura de microservicios con Azure",
            "componentes": [
                "Azure Kubernetes Service (AKS)",
                "Azure Container Registry",
                "Azure Service Bus",
                "Azure API Management"
            ],
            "codigo_ejemplo": """
```yaml
# docker-compose.yml para microservicios
version: '3.8'
services:
  api-gateway:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - user-service
      - order-service
  
  user-service:
    image: user-service:latest
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/users
    depends_on:
      - db
  
  order-service:
    image: order-service:latest
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/orders
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```""",
            "mejores_practicas": [
                "Usar circuit breakers para resiliencia",
                "Implementar health checks",
                "Configurar auto-scaling",
                "Usar distributed tracing"
            ]
        },
        "serverless": {
            "descripcion": "Arquitectura serverless con Azure Functions",
            "componentes": [
                "Azure Functions",
                "Azure Logic Apps",
                "Azure Event Grid",
                "Azure Cosmos DB"
            ],
            "codigo_ejemplo": """
```python
# Azure Function con Durable Functions
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    # Step 1: Procesar datos
    result1 = yield context.call_activity('ProcessData', context.get_input())
    
    # Step 2: Validar datos
    result2 = yield context.call_activity('ValidateData', result1)
    
    # Step 3: Guardar en base de datos
    result3 = yield context.call_activity('SaveToDatabase', result2)
    
    return result3

def process_data(input_data):
    # Lógica de procesamiento
    return {"processed": True, "data": input_data}

def validate_data(data):
    # Lógica de validación
    if data.get("processed"):
        return {"valid": True, "data": data}
    return {"valid": False, "error": "Invalid data"}

def save_to_database(data):
    # Lógica de guardado
    return {"saved": True, "id": "12345"}
```""",
            "mejores_practicas": [
                "Usar Durable Functions para workflows complejos",
                "Implementar retry policies",
                "Configurar monitoring y alerting",
                "Optimizar cold start times"
            ]
        },
        "event_driven": {
            "descripcion": "Arquitectura orientada a eventos",
            "componentes": [
                "Azure Event Hubs",
                "Azure Event Grid",
                "Azure Service Bus",
                "Azure Stream Analytics"
            ],
            "codigo_ejemplo": """
```python
# Event-driven architecture con Azure Event Hubs
from azure.eventhub import EventHubProducerClient, EventData
from azure.eventhub import EventHubConsumerClient
import asyncio

# Producer
async def send_events():
    producer = EventHubProducerClient.from_connection_string(
        conn_str="your-connection-string",
        eventhub_name="your-eventhub"
    )
    
    async with producer:
        event_data_batch = await producer.create_batch()
        event_data_batch.add(EventData("Event 1"))
        event_data_batch.add(EventData("Event 2"))
        await producer.send_batch(event_data_batch)

# Consumer
async def receive_events():
    consumer = EventHubConsumerClient.from_connection_string(
        conn_str="your-connection-string",
        consumer_group="$default",
        eventhub_name="your-eventhub"
    )
    
    async with consumer:
        await consumer.receive(
            on_event=on_event,
            on_error=on_error,
            on_partition_close=on_partition_close
        )

def on_event(partition_context, event):
    print(f"Received event: {event.body_as_str()}")
    partition_context.update_checkpoint(event)

def on_error(partition_context, error):
    print(f"Error: {error}")

def on_partition_close(partition_context, reason):
    print(f"Partition closed: {reason}")
```""",
            "mejores_practicas": [
                "Usar event sourcing para auditoría",
                "Implementar dead letter queues",
                "Configurar event versioning",
                "Monitorear throughput y latencia"
            ]
        }
    }

def generate_security_best_practices():
    """Genera mejores prácticas de seguridad"""
    return {
        "identity_management": {
            "descripcion": "Gestión de identidades y acceso",
            "practicas": [
                "Usar Azure Active Directory (Azure AD) para autenticación centralizada",
                "Implementar Multi-Factor Authentication (MFA)",
                "Usar Managed Identities para servicios",
                "Configurar Conditional Access policies",
                "Implementar Just-In-Time (JIT) access"
            ],
            "codigo_ejemplo": """
```python
# Usando Managed Identity
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# Usar Managed Identity automáticamente
credential = DefaultAzureCredential()

# Conectar a Key Vault
vault_url = "https://your-vault.vault.azure.net/"
client = SecretClient(vault_url=vault_url, credential=credential)

# Obtener secretos
secret = client.get_secret("database-password")
print(f"Secret: {secret.value}")

# Configurar Azure AD para aplicaciones
from azure.identity import ClientSecretCredential

tenant_id = "your-tenant-id"
client_id = "your-client-id"
client_secret = "your-client-secret"

credential = ClientSecretCredential(
    tenant_id=tenant_id,
    client_id=client_id,
    client_secret=client_secret
)
```""",
            "implementacion": [
                "Configurar Azure AD Connect para sincronización híbrida",
                "Crear grupos de seguridad para acceso basado en roles",
                "Implementar Privileged Identity Management (PIM)",
                "Configurar audit logs para monitoreo"
            ]
        },
        "network_security": {
            "descripcion": "Seguridad de red en Azure",
            "practicas": [
                "Usar Azure Firewall para protección de red",
                "Implementar Network Security Groups (NSGs)",
                "Configurar Azure DDoS Protection",
                "Usar Azure Private Link para conectividad privada",
                "Implementar Azure Bastion para acceso seguro"
            ],
            "codigo_ejemplo": """
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Network/networkSecurityGroups",
      "apiVersion": "2021-05-01",
      "name": "web-nsg",
      "location": "[resourceGroup().location]",
      "properties": {
        "securityRules": [
          {
            "name": "Allow-HTTP",
            "properties": {
              "priority": 100,
              "protocol": "Tcp",
              "access": "Allow",
              "direction": "Inbound",
              "sourceAddressPrefix": "Internet",
              "sourcePortRange": "*",
              "destinationAddressPrefix": "*",
              "destinationPortRange": "80"
            }
          },
          {
            "name": "Allow-HTTPS",
            "properties": {
              "priority": 110,
              "protocol": "Tcp",
              "access": "Allow",
              "direction": "Inbound",
              "sourceAddressPrefix": "Internet",
              "sourcePortRange": "*",
              "destinationAddressPrefix": "*",
              "destinationPortRange": "443"
            }
          },
          {
            "name": "Deny-All",
            "properties": {
              "priority": 4096,
              "protocol": "*",
              "access": "Deny",
              "direction": "Inbound",
              "sourceAddressPrefix": "*",
              "sourcePortRange": "*",
              "destinationAddressPrefix": "*",
              "destinationPortRange": "*"
            }
          }
        ]
      }
    }
  ]
}
```""",
            "implementacion": [
                "Configurar reglas NSG específicas por aplicación",
                "Implementar Azure Firewall con reglas de aplicación",
                "Configurar Azure DDoS Protection Standard",
                "Usar Azure Private Link para servicios PaaS"
            ]
        }
    }

def generate_monitoring_best_practices():
    """Genera mejores prácticas de monitoreo"""
    return {
        "application_insights": {
            "descripcion": "Monitoreo de aplicaciones con Application Insights",
            "practicas": [
                "Configurar Application Insights para todas las aplicaciones",
                "Implementar custom telemetry",
                "Configurar alertas proactivas",
                "Usar Live Metrics para monitoreo en tiempo real",
                "Implementar distributed tracing"
            ],
            "codigo_ejemplo": """
```python
# Application Insights con Python
from opencensus.ext.azure.log_exporter import AzureLogHandler
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.tracer import Tracer
from opencensus.trace.samplers import ProbabilitySampler
import logging

# Configurar logging
logger = logging.getLogger(__name__)
logger.addHandler(AzureLogHandler(
    connection_string='InstrumentationKey=your-key;IngestionEndpoint=https://your-endpoint'
))

# Configurar tracing
tracer = Tracer(
    exporter=AzureExporter(
        connection_string='InstrumentationKey=your-key;IngestionEndpoint=https://your-endpoint'
    ),
    sampler=ProbabilitySampler(1.0)
)

# Ejemplo de uso
def process_order(order_id):
    with tracer.span(name="process_order"):
        logger.info(f"Processing order: {order_id}")
        
        # Simular procesamiento
        with tracer.span(name="validate_order"):
            logger.info("Validating order")
            # Lógica de validación
        
        with tracer.span(name="save_order"):
            logger.info("Saving order to database")
            # Lógica de guardado
        
        logger.info(f"Order {order_id} processed successfully")

# Métricas personalizadas
from opencensus.ext.azure import metrics_exporter
from opencensus.stats import aggregation as aggregation_module
from opencensus.stats import measure as measure_module
from opencensus.stats import stats as stats_module

# Crear métrica personalizada
m_orders_processed = measure_module.MeasureFloat(
    "orders_processed",
    "Number of orders processed",
    "orders"
)

# Configurar agregación
orders_aggregator = aggregation_module.CountAggregation()
orders_view = stats_module.new_view(
    "orders_processed",
    m_orders_processed,
    aggregation=orders_aggregator
)

# Registrar vista
stats_module.view_manager.register_view(orders_view)

# Registrar métrica
stats_module.stats_recorder.new_measurement_map().record(
    {m_orders_processed: 1}
)
```""",
            "implementacion": [
                "Configurar Application Insights en Azure Portal",
                "Implementar custom telemetry en aplicaciones",
                "Configurar alertas basadas en métricas",
                "Usar Log Analytics para queries avanzadas"
            ]
        },
        "log_analytics": {
            "descripcion": "Análisis de logs con Log Analytics",
            "practicas": [
                "Centralizar logs de todas las aplicaciones",
                "Crear queries KQL optimizadas",
                "Configurar alertas basadas en logs",
                "Implementar log retention policies",
                "Usar workbooks para visualización"
            ],
            "codigo_ejemplo": """
```kql
// Query KQL para análisis de errores
AppTraces
| where TimeGenerated > ago(1h)
| where SeverityLevel == 3
| summarize ErrorCount = count() by bin(TimeGenerated, 5m), OperationName
| render timechart

// Query para análisis de performance
AppRequests
| where TimeGenerated > ago(24h)
| summarize 
    AvgDuration = avg(Duration),
    P95Duration = percentile(Duration, 95),
    RequestCount = count()
    by bin(TimeGenerated, 1h), Name
| render timechart

// Query para detección de anomalías
AppRequests
| where TimeGenerated > ago(7d)
| summarize 
    AvgDuration = avg(Duration),
    StdDev = stdev(Duration)
    by Name
| where AvgDuration > 1000
| order by AvgDuration desc

// Query para análisis de usuarios
AppPageViews
| where TimeGenerated > ago(1d)
| summarize 
    UserCount = dcount(UserId),
    PageViewCount = count()
    by PageName
| order by PageViewCount desc
```""",
            "implementacion": [
                "Configurar Log Analytics workspace",
                "Conectar fuentes de datos (VMs, AKS, etc.)",
                "Crear dashboards personalizados",
                "Configurar alertas automáticas"
            ]
        }
    }

def generate_cost_optimization_best_practices():
    """Genera mejores prácticas de optimización de costos"""
    return {
        "resource_optimization": {
            "descripcion": "Optimización de recursos de Azure",
            "practicas": [
                "Usar Azure Reserved Instances para cargas de trabajo predecibles",
                "Implementar Azure Hybrid Benefit",
                "Configurar auto-shutdown para VMs de desarrollo",
                "Usar Azure Spot Instances para cargas flexibles",
                "Optimizar tamaños de VM según uso real"
            ],
            "codigo_ejemplo": """
```python
# Script para optimizar costos de VMs
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.monitor import MonitorManagementClient
from azure.identity import DefaultAzureCredential
import datetime

def analyze_vm_usage():
    credential = DefaultAzureCredential()
    subscription_id = "your-subscription-id"
    
    compute_client = ComputeManagementClient(credential, subscription_id)
    monitor_client = MonitorManagementClient(credential, subscription_id)
    
    # Obtener todas las VMs
    vms = compute_client.virtual_machines.list_all()
    
    for vm in vms:
        # Obtener métricas de CPU de los últimos 7 días
        end_time = datetime.datetime.utcnow()
        start_time = end_time - datetime.timedelta(days=7)
        
        metrics = monitor_client.metrics.list(
            vm.id,
            timespan=f"{start_time.isoformat()}/{end_time.isoformat()}",
            interval='PT1H',
            metricnames='Percentage CPU',
            aggregation='Average'
        )
        
        # Analizar uso promedio
        if metrics.value:
            avg_cpu = sum(point.average for point in metrics.value[0].timeseries[0].data if point.average) / len([point.average for point in metrics.value[0].timeseries[0].data if point.average])
            
            print(f"VM: {vm.name}")
            print(f"  Size: {vm.hardware_profile.vm_size}")
            print(f"  Avg CPU: {avg_cpu:.2f}%")
            
            # Recomendaciones
            if avg_cpu < 20:
                print(f"  Recommendation: Consider downsizing to smaller VM")
            elif avg_cpu > 80:
                print(f"  Recommendation: Consider upsizing to larger VM")

# Script para configurar auto-shutdown
def configure_auto_shutdown(vm_name, resource_group, shutdown_time="18:00"):
    from azure.mgmt.devtestlabs import DevTestLabsClient
    
    devtest_client = DevTestLabsClient(credential, subscription_id)
    
    # Configurar auto-shutdown
    schedule = {
        "properties": {
            "timeZoneId": "UTC",
            "dailyRecurrence": {
                "time": shutdown_time
            },
            "targetResourceId": f"/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.Compute/virtualMachines/{vm_name}"
        }
    }
    
    devtest_client.schedules.create_or_update(
        resource_group,
        "lab-name",
        f"{vm_name}-shutdown",
        schedule
    )
```""",
            "implementacion": [
                "Configurar Azure Cost Management",
                "Implementar budgets y alertas de costo",
                "Usar Azure Advisor para recomendaciones",
                "Configurar auto-shutdown para recursos de desarrollo"
            ]
        },
        "storage_optimization": {
            "descripcion": "Optimización de almacenamiento",
            "practicas": [
                "Usar Azure Storage Lifecycle Management",
                "Implementar Azure Blob Storage tiers",
                "Configurar Azure File Sync para archivos",
                "Usar Azure Backup para respaldos",
                "Optimizar transferencias de datos"
            ],
            "codigo_ejemplo": """
```python
# Configurar lifecycle management para Storage
from azure.storage.blob import BlobServiceClient
from azure.storage.blob import BlobClient
import os

def configure_lifecycle_management():
    connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    
    # Configurar reglas de lifecycle
    lifecycle_rules = [
        {
            "id": "move-to-cool",
            "enabled": True,
            "filters": {
                "blob_types": ["blockBlob"],
                "prefix_match": ["logs/"]
            },
            "actions": {
                "base_blob": {
                    "tier_to_cool": {
                        "days_after_modification_greater_than": 30
                    }
                }
            }
        },
        {
            "id": "move-to-archive",
            "enabled": True,
            "filters": {
                "blob_types": ["blockBlob"],
                "prefix_match": ["backups/"]
            },
            "actions": {
                "base_blob": {
                    "tier_to_archive": {
                        "days_after_modification_greater_than": 90
                    }
                }
            }
        },
        {
            "id": "delete-old-backups",
            "enabled": True,
            "filters": {
                "blob_types": ["blockBlob"],
                "prefix_match": ["backups/"]
            },
            "actions": {
                "base_blob": {
                    "delete": {
                        "days_after_modification_greater_than": 365
                    }
                }
            }
        }
    ]
    
    # Aplicar reglas
    blob_service_client.set_service_properties(
        lifecycle_rules=lifecycle_rules
    )

# Optimizar transferencias de datos
def optimize_data_transfer():
    from azure.storage.blob import BlobServiceClient
    from azure.storage.blob import BlobClient
    import asyncio
    import aiohttp
    
    async def upload_blob_async(blob_client, data):
        async with aiohttp.ClientSession() as session:
            await blob_client.upload_blob(data, overwrite=True)
    
    # Upload paralelo de múltiples blobs
    async def upload_multiple_blobs():
        tasks = []
        for i in range(10):
            blob_client = container_client.get_blob_client(f"file-{i}.txt")
            data = f"Content of file {i}".encode()
            task = upload_blob_async(blob_client, data)
            tasks.append(task)
        
        await asyncio.gather(*tasks)
```""",
            "implementacion": [
                "Configurar Storage Lifecycle Management",
                "Implementar Azure File Sync",
                "Configurar Azure Backup",
                "Optimizar transferencias con AzCopy"
            ]
        }
    }

def create_best_practices_guide():
    """Crea la guía completa de mejores prácticas"""
    
    guide = {
        "titulo": "Guía de Mejores Prácticas Azure - Patrones y Optimizaciones",
        "descripcion": "Guía completa de mejores prácticas, patrones de arquitectura y optimizaciones para Azure",
        "patrones_arquitectura": generate_architecture_patterns(),
        "seguridad": generate_security_best_practices(),
        "monitoreo": generate_monitoring_best_practices(),
        "optimizacion_costos": generate_cost_optimization_best_practices(),
        "checklist_implementacion": {
            "seguridad": [
                "✅ Configurar Azure AD con MFA",
                "✅ Implementar Network Security Groups",
                "✅ Configurar Azure Key Vault",
                "✅ Habilitar Azure Security Center",
                "✅ Configurar audit logs"
            ],
            "monitoreo": [
                "✅ Configurar Application Insights",
                "✅ Implementar Log Analytics",
                "✅ Configurar alertas proactivas",
                "✅ Crear dashboards personalizados",
                "✅ Configurar distributed tracing"
            ],
            "costos": [
                "✅ Configurar Azure Cost Management",
                "✅ Implementar budgets y alertas",
                "✅ Usar Reserved Instances",
                "✅ Configurar auto-shutdown",
                "✅ Optimizar tamaños de recursos"
            ],
            "resiliencia": [
                "✅ Implementar Availability Zones",
                "✅ Configurar backup automático",
                "✅ Usar circuit breakers",
                "✅ Implementar retry policies",
                "✅ Configurar disaster recovery"
            ]
        }
    }
    
    return guide

def save_best_practices_guide(guide, filename):
    """Guarda la guía de mejores prácticas en formato Markdown"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"# {guide['titulo']}\n\n")
        f.write(f"{guide['descripcion']}\n\n")
        
        # Patrones de Arquitectura
        f.write("## 🏗️ Patrones de Arquitectura\n\n")
        for pattern_name, pattern_data in guide['patrones_arquitectura'].items():
            f.write(f"### {pattern_name.replace('_', ' ').title()}\n")
            f.write(f"{pattern_data['descripcion']}\n\n")
            f.write("**Componentes:**\n")
            for component in pattern_data['componentes']:
                f.write(f"- {component}\n")
            f.write("\n**Código de Ejemplo:**\n")
            f.write(pattern_data['codigo_ejemplo'])
            f.write("\n**Mejores Prácticas:**\n")
            for practice in pattern_data['mejores_practicas']:
                f.write(f"- {practice}\n")
            f.write("\n---\n\n")
        
        # Seguridad
        f.write("## 🔒 Mejores Prácticas de Seguridad\n\n")
        for security_area, security_data in guide['seguridad'].items():
            f.write(f"### {security_area.replace('_', ' ').title()}\n")
            f.write(f"{security_data['descripcion']}\n\n")
            f.write("**Prácticas:**\n")
            for practice in security_data['practicas']:
                f.write(f"- {practice}\n")
            f.write("\n**Código de Ejemplo:**\n")
            f.write(security_data['codigo_ejemplo'])
            f.write("\n**Implementación:**\n")
            for implementation in security_data['implementacion']:
                f.write(f"- {implementation}\n")
            f.write("\n---\n\n")
        
        # Monitoreo
        f.write("## 📊 Mejores Prácticas de Monitoreo\n\n")
        for monitoring_area, monitoring_data in guide['monitoreo'].items():
            f.write(f"### {monitoring_area.replace('_', ' ').title()}\n")
            f.write(f"{monitoring_data['descripcion']}\n\n")
            f.write("**Prácticas:**\n")
            for practice in monitoring_data['practicas']:
                f.write(f"- {practice}\n")
            f.write("\n**Código de Ejemplo:**\n")
            f.write(monitoring_data['codigo_ejemplo'])
            f.write("\n**Implementación:**\n")
            for implementation in monitoring_data['implementacion']:
                f.write(f"- {implementation}\n")
            f.write("\n---\n\n")
        
        # Optimización de Costos
        f.write("## 💰 Optimización de Costos\n\n")
        for cost_area, cost_data in guide['optimizacion_costos'].items():
            f.write(f"### {cost_area.replace('_', ' ').title()}\n")
            f.write(f"{cost_data['descripcion']}\n\n")
            f.write("**Prácticas:**\n")
            for practice in cost_data['practicas']:
                f.write(f"- {practice}\n")
            f.write("\n**Código de Ejemplo:**\n")
            f.write(cost_data['codigo_ejemplo'])
            f.write("\n**Implementación:**\n")
            for implementation in cost_data['implementacion']:
                f.write(f"- {implementation}\n")
            f.write("\n---\n\n")
        
        # Checklist de Implementación
        f.write("## ✅ Checklist de Implementación\n\n")
        for area, checklist in guide['checklist_implementacion'].items():
            f.write(f"### {area.replace('_', ' ').title()}\n")
            for item in checklist:
                f.write(f"{item}\n")
            f.write("\n")

def main():
    print("Creando guía de mejores prácticas de Azure...")
    
    # Crear guía de mejores prácticas
    guide = create_best_practices_guide()
    
    # Guardar en JSON
    with open('azure_best_practices.json', 'w', encoding='utf-8') as f:
        json.dump(guide, f, ensure_ascii=False, indent=2)
    
    # Guardar en Markdown
    save_best_practices_guide(guide, 'azure_best_practices_guide.md')
    
    print("Guía de mejores prácticas creada exitosamente!")
    print("- azure_best_practices.json")
    print("- azure_best_practices_guide.md")
    
    # Mostrar estadísticas
    print("\nEstadísticas:")
    print(f"  Patrones de arquitectura: {len(guide['patrones_arquitectura'])}")
    print(f"  Áreas de seguridad: {len(guide['seguridad'])}")
    print(f"  Áreas de monitoreo: {len(guide['monitoreo'])}")
    print(f"  Áreas de optimización: {len(guide['optimizacion_costos'])}")
    
    total_checklist_items = sum(len(checklist) for checklist in guide['checklist_implementacion'].values())
    print(f"  Total checklist items: {total_checklist_items}")

if __name__ == "__main__":
    main() 