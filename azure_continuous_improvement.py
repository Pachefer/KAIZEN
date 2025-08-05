#!/usr/bin/env python3
"""
Sistema de Mejora Continua para Azure
Incluye automatización, monitoreo, optimización y herramientas de análisis
"""

import json
import yaml
import datetime
import asyncio
from pathlib import Path
from typing import Dict, List, Any

class AzureContinuousImprovement:
    """Sistema de mejora continua para Azure"""
    
    def __init__(self):
        self.config = self.load_config()
        self.metrics = {}
        self.recommendations = []
    
    def load_config(self) -> Dict[str, Any]:
        """Carga la configuración del sistema"""
        return {
            "monitoring": {
                "enabled": True,
                "interval_minutes": 15,
                "retention_days": 30
            },
            "optimization": {
                "auto_scale": True,
                "cost_alerts": True,
                "performance_threshold": 80
            },
            "security": {
                "compliance_checks": True,
                "vulnerability_scanning": True,
                "access_reviews": True
            }
        }
    
    def generate_automation_scripts(self) -> Dict[str, str]:
        """Genera scripts de automatización para Azure"""
        return {
            "resource_monitoring": """
```python
# Script de monitoreo automático de recursos
import azure.mgmt.monitor as monitor
from azure.identity import DefaultAzureCredential
import schedule
import time

class AzureResourceMonitor:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.monitor_client = monitor.MonitorManagementClient(
            self.credential, 
            subscription_id="your-subscription-id"
        )
    
    def check_resource_health(self):
        # Verificar salud de recursos críticos
        resources = self.get_critical_resources()
        
        for resource in resources:
            metrics = self.get_resource_metrics(resource.id)
            if self.is_resource_unhealthy(metrics):
                self.send_alert(f"Resource {resource.name} is unhealthy")
    
    def get_critical_resources(self):
        # Obtener recursos críticos (VMs, databases, etc.)
        pass
    
    def get_resource_metrics(self, resource_id):
        # Obtener métricas del recurso
        pass
    
    def is_resource_unhealthy(self, metrics):
        # Evaluar si el recurso está saludable
        pass
    
    def send_alert(self, message):
        # Enviar alerta
        print(f"ALERT: {message}")

# Configurar monitoreo cada 15 minutos
monitor = AzureResourceMonitor()
schedule.every(15).minutes.do(monitor.check_resource_health)

while True:
    schedule.run_pending()
    time.sleep(60)
```""",
            
            "cost_optimization": """
```python
# Script de optimización automática de costos
import azure.mgmt.compute as compute
import azure.mgmt.monitor as monitor
from azure.identity import DefaultAzureCredential
import datetime

class AzureCostOptimizer:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.compute_client = compute.ComputeManagementClient(
            self.credential, 
            subscription_id="your-subscription-id"
        )
        self.monitor_client = monitor.MonitorManagementClient(
            self.credential, 
            subscription_id="your-subscription-id"
        )
    
    def analyze_vm_usage(self):
        vms = self.compute_client.virtual_machines.list_all()
        
        for vm in vms:
            usage = self.get_vm_usage(vm.id)
            recommendation = self.get_optimization_recommendation(usage)
            
            if recommendation:
                self.apply_optimization(vm, recommendation)
    
    def get_vm_usage(self, vm_id):
        # Obtener métricas de uso de la VM
        end_time = datetime.datetime.utcnow()
        start_time = end_time - datetime.timedelta(days=7)
        
        metrics = self.monitor_client.metrics.list(
            vm_id,
            timespan=f"{start_time.isoformat()}/{end_time.isoformat()}",
            interval='PT1H',
            metricnames='Percentage CPU,Percentage Memory',
            aggregation='Average'
        )
        
        return metrics
    
    def get_optimization_recommendation(self, usage):
        # Analizar uso y generar recomendaciones
        avg_cpu = self.calculate_average_cpu(usage)
        avg_memory = self.calculate_average_memory(usage)
        
        if avg_cpu < 20 and avg_memory < 30:
            return "downsize"
        elif avg_cpu > 80 or avg_memory > 80:
            return "upsize"
        
        return None
    
    def apply_optimization(self, vm, recommendation):
        # Aplicar optimización
        if recommendation == "downsize":
            self.downsize_vm(vm)
        elif recommendation == "upsize":
            self.upsize_vm(vm)
    
    def downsize_vm(self, vm):
        # Reducir tamaño de VM
        print(f"Downsizing VM: {vm.name}")
    
    def upsize_vm(self, vm):
        # Aumentar tamaño de VM
        print(f"Upsizing VM: {vm.name}")

# Ejecutar optimización diariamente
optimizer = AzureCostOptimizer()
optimizer.analyze_vm_usage()
```""",
            
            "security_automation": """
```python
# Script de automatización de seguridad
import azure.mgmt.security as security
import azure.mgmt.keyvault as keyvault
from azure.identity import DefaultAzureCredential
import datetime

class AzureSecurityAutomation:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.security_client = security.SecurityCenter(
            self.credential, 
            subscription_id="your-subscription-id"
        )
        self.keyvault_client = keyvault.KeyVaultManagementClient(
            self.credential, 
            subscription_id="your-subscription-id"
        )
    
    def run_security_checks(self):
        # Ejecutar verificaciones de seguridad
        self.check_vulnerabilities()
        self.check_compliance()
        self.rotate_secrets()
        self.review_access()
    
    def check_vulnerabilities(self):
        # Verificar vulnerabilidades
        assessments = self.security_client.assessments.list()
        
        for assessment in assessments:
            if assessment.status.code == "Unhealthy":
                self.create_security_ticket(assessment)
    
    def check_compliance(self):
        # Verificar cumplimiento
        compliance_results = self.security_client.compliance.list()
        
        for compliance in compliance_results:
            if compliance.score < 80:
                self.send_compliance_alert(compliance)
    
    def rotate_secrets(self):
        # Rotar secretos automáticamente
        vaults = self.keyvault_client.vaults.list()
        
        for vault in vaults:
            secrets = self.get_vault_secrets(vault.name)
            
            for secret in secrets:
                if self.should_rotate_secret(secret):
                    self.rotate_secret(vault.name, secret.name)
    
    def review_access(self):
        # Revisar acceso de usuarios
        users = self.get_active_users()
        
        for user in users:
            if self.should_review_access(user):
                self.send_access_review_request(user)
    
    def create_security_ticket(self, assessment):
        # Crear ticket de seguridad
        print(f"Security ticket created for: {assessment.display_name}")
    
    def send_compliance_alert(self, compliance):
        # Enviar alerta de cumplimiento
        print(f"Compliance alert: {compliance.name} score: {compliance.score}")
    
    def rotate_secret(self, vault_name, secret_name):
        # Rotar secreto
        print(f"Rotating secret: {secret_name} in vault: {vault_name}")
    
    def send_access_review_request(self, user):
        # Enviar solicitud de revisión de acceso
        print(f"Access review requested for user: {user.name}")

# Ejecutar verificaciones de seguridad semanalmente
security_automation = AzureSecurityAutomation()
security_automation.run_security_checks()
```""",
            
            "backup_automation": """
```python
# Script de automatización de respaldos
import azure.mgmt.recoveryservices as recoveryservices
import azure.mgmt.recoveryservicesbackup as backup
from azure.identity import DefaultAzureCredential
import datetime

class AzureBackupAutomation:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.backup_client = backup.RecoveryServicesBackupClient(
            self.credential, 
            subscription_id="your-subscription-id"
        )
        self.recovery_client = recoveryservices.RecoveryServicesClient(
            self.credential, 
            subscription_id="your-subscription-id"
        )
    
    def manage_backups(self):
        # Gestionar respaldos automáticamente
        self.create_backups()
        self.verify_backups()
        self.cleanup_old_backups()
        self.test_restore()
    
    def create_backups(self):
        # Crear respaldos programados
        backup_policies = self.get_backup_policies()
        
        for policy in backup_policies:
            if self.should_create_backup(policy):
                self.execute_backup(policy)
    
    def verify_backups(self):
        # Verificar integridad de respaldos
        backups = self.get_recent_backups()
        
        for backup in backups:
            if not self.verify_backup_integrity(backup):
                self.send_backup_failure_alert(backup)
    
    def cleanup_old_backups(self):
        # Limpiar respaldos antiguos
        old_backups = self.get_old_backups()
        
        for backup in old_backups:
            if self.should_delete_backup(backup):
                self.delete_backup(backup)
    
    def test_restore(self):
        # Probar restauración de respaldos
        test_backups = self.get_test_backups()
        
        for backup in test_backups:
            if self.should_test_restore(backup):
                self.execute_test_restore(backup)
    
    def should_create_backup(self, policy):
        # Determinar si se debe crear respaldo
        last_backup = self.get_last_backup(policy)
        return datetime.datetime.now() - last_backup > datetime.timedelta(days=1)
    
    def execute_backup(self, policy):
        # Ejecutar respaldo
        print(f"Executing backup for policy: {policy.name}")
    
    def verify_backup_integrity(self, backup):
        # Verificar integridad del respaldo
        return True  # Simulado
    
    def send_backup_failure_alert(self, backup):
        # Enviar alerta de fallo de respaldo
        print(f"Backup failure alert for: {backup.name}")
    
    def should_delete_backup(self, backup):
        # Determinar si se debe eliminar respaldo
        return backup.age > datetime.timedelta(days=30)
    
    def delete_backup(self, backup):
        # Eliminar respaldo
        print(f"Deleting old backup: {backup.name}")
    
    def should_test_restore(self, backup):
        # Determinar si se debe probar restauración
        return backup.last_test_restore < datetime.datetime.now() - datetime.timedelta(days=7)
    
    def execute_test_restore(self, backup):
        # Ejecutar prueba de restauración
        print(f"Testing restore for backup: {backup.name}")

# Ejecutar gestión de respaldos diariamente
backup_automation = AzureBackupAutomation()
backup_automation.manage_backups()
```"""
        }
    
    def generate_monitoring_dashboards(self) -> Dict[str, str]:
        """Genera dashboards de monitoreo"""
        return {
            "performance_dashboard": """
```json
{
  "dashboard": {
    "name": "Azure Performance Dashboard",
    "widgets": [
      {
        "type": "metric",
        "name": "CPU Usage",
        "query": "Perf | where ObjectName == 'Processor' | where CounterName == '% Processor Time' | summarize avg(CounterValue) by bin(TimeGenerated, 5m)",
        "visualization": "timechart"
      },
      {
        "type": "metric",
        "name": "Memory Usage",
        "query": "Perf | where ObjectName == 'Memory' | where CounterName == '% Committed Bytes In Use' | summarize avg(CounterValue) by bin(TimeGenerated, 5m)",
        "visualization": "timechart"
      },
      {
        "type": "metric",
        "name": "Disk I/O",
        "query": "Perf | where ObjectName == 'LogicalDisk' | where CounterName == 'Disk Reads/sec' | summarize avg(CounterValue) by bin(TimeGenerated, 5m)",
        "visualization": "timechart"
      },
      {
        "type": "metric",
        "name": "Network Usage",
        "query": "Perf | where ObjectName == 'Network Interface' | where CounterName == 'Bytes Total/sec' | summarize avg(CounterValue) by bin(TimeGenerated, 5m)",
        "visualization": "timechart"
      }
    ]
  }
}
```""",
            
            "cost_dashboard": """
```json
{
  "dashboard": {
    "name": "Azure Cost Dashboard",
    "widgets": [
      {
        "type": "cost",
        "name": "Daily Cost Trend",
        "query": "Usage | where TimeGenerated > ago(30d) | summarize sum(Quantity) by bin(TimeGenerated, 1d), ResourceType | render timechart",
        "visualization": "timechart"
      },
      {
        "type": "cost",
        "name": "Cost by Resource Type",
        "query": "Usage | where TimeGenerated > ago(7d) | summarize sum(Quantity) by ResourceType | render piechart",
        "visualization": "piechart"
      },
      {
        "type": "cost",
        "name": "Top Expensive Resources",
        "query": "Usage | where TimeGenerated > ago(7d) | summarize sum(Quantity) by ResourceId | top 10 by sum_Quantity | render barchart",
        "visualization": "barchart"
      },
      {
        "type": "cost",
        "name": "Cost Optimization Opportunities",
        "query": "Usage | where TimeGenerated > ago(7d) | where ResourceType == 'virtualMachines' | summarize avg(Quantity) by ResourceId | where avg_Quantity < 20",
        "visualization": "table"
      }
    ]
  }
}
```""",
            
            "security_dashboard": """
```json
{
  "dashboard": {
    "name": "Azure Security Dashboard",
    "widgets": [
      {
        "type": "security",
        "name": "Security Score",
        "query": "SecurityEvent | where TimeGenerated > ago(7d) | summarize count() by EventID | render gauge",
        "visualization": "gauge"
      },
      {
        "type": "security",
        "name": "Failed Login Attempts",
        "query": "SecurityEvent | where TimeGenerated > ago(24h) | where EventID == 4625 | summarize count() by bin(TimeGenerated, 1h) | render timechart",
        "visualization": "timechart"
      },
      {
        "type": "security",
        "name": "Vulnerability Assessment",
        "query": "SecurityRecommendation | where TimeGenerated > ago(7d) | summarize count() by RecommendationType | render barchart",
        "visualization": "barchart"
      },
      {
        "type": "security",
        "name": "Compliance Status",
        "query": "ComplianceAssessment | where TimeGenerated > ago(7d) | summarize avg(Score) by ComplianceStandard | render table",
        "visualization": "table"
      }
    ]
  }
}
```"""
        }
    
    def generate_improvement_workflows(self) -> Dict[str, str]:
        """Genera flujos de trabajo de mejora"""
        return {
            "incident_response": """
```yaml
# Flujo de trabajo de respuesta a incidentes
name: Incident Response Workflow
description: Workflow automatizado para respuesta a incidentes de Azure

triggers:
  - name: high_cpu_alert
    condition: CPU > 90% for 5 minutes
    actions:
      - scale_out_vm
      - send_alert
      - create_incident_ticket
  
  - name: security_breach
    condition: Failed login attempts > 10 in 1 hour
    actions:
      - block_ip_address
      - notify_security_team
      - create_security_incident
  
  - name: cost_spike
    condition: Daily cost > 150% of average
    actions:
      - analyze_cost_breakdown
      - send_cost_alert
      - review_resource_usage

actions:
  scale_out_vm:
    type: azure_automation
    script: scale_vm.ps1
    parameters:
      resource_group: "{{ resource_group }}"
      vm_name: "{{ vm_name }}"
      scale_factor: 1.5
  
  send_alert:
    type: notification
    channel: teams
    message: "Alert: {{ alert_message }}"
  
  create_incident_ticket:
    type: service_now
    template: incident_template.json
    data:
      priority: "{{ priority }}"
      description: "{{ description }}"
  
  block_ip_address:
    type: azure_automation
    script: block_ip.ps1
    parameters:
      ip_address: "{{ source_ip }}"
      duration: "1 hour"
  
  notify_security_team:
    type: notification
    channel: email
    recipients: ["security@company.com"]
    subject: "Security Incident Detected"
  
  analyze_cost_breakdown:
    type: azure_automation
    script: analyze_cost.ps1
    parameters:
      time_range: "24h"
  
  review_resource_usage:
    type: azure_automation
    script: review_resources.ps1
    parameters:
      resource_types: ["virtualMachines", "storageAccounts"]
```
""",
            
            "deployment_automation": """
```yaml
# Flujo de trabajo de despliegue automatizado
name: Automated Deployment Workflow
description: Workflow para despliegue automatizado con CI/CD

stages:
  - name: build
    steps:
      - name: code_analysis
        type: static_analysis
        tools: ["sonarqube", "eslint"]
      
      - name: unit_tests
        type: testing
        framework: "jest"
        coverage_threshold: 80
      
      - name: security_scan
        type: security_scanning
        tools: ["snyk", "dependency-check"]
      
      - name: build_artifacts
        type: build
        platform: "docker"
        output: "container_registry"
  
  - name: test
    environment: "staging"
    steps:
      - name: deploy_staging
        type: deployment
        method: "blue_green"
      
      - name: integration_tests
        type: testing
        framework: "cypress"
      
      - name: performance_tests
        type: testing
        framework: "k6"
        thresholds:
          response_time: "200ms"
          error_rate: "1%"
      
      - name: security_tests
        type: testing
        framework: "zap"
      
      - name: user_acceptance_tests
        type: testing
        framework: "selenium"
  
  - name: deploy
    environment: "production"
    steps:
      - name: pre_deployment_checks
        type: validation
        checks:
          - resource_availability
          - cost_impact
          - security_compliance
      
      - name: deploy_production
        type: deployment
        method: "rolling_update"
        rollback_enabled: true
      
      - name: post_deployment_validation
        type: validation
        checks:
          - health_checks
          - performance_metrics
          - security_scan
      
      - name: monitoring_setup
        type: configuration
        tools:
          - application_insights
          - log_analytics
          - alert_rules

rollback:
  triggers:
    - health_check_failure
    - performance_degradation
    - security_vulnerability
  
  actions:
    - revert_deployment
    - notify_team
    - create_incident
```
""",
            
            "optimization_workflow": """
```yaml
# Flujo de trabajo de optimización continua
name: Continuous Optimization Workflow
description: Workflow para optimización automática de recursos

schedules:
  - name: daily_optimization
    frequency: "daily"
    time: "02:00 UTC"
  
  - name: weekly_review
    frequency: "weekly"
    day: "monday"
    time: "09:00 UTC"

tasks:
  - name: resource_analysis
    type: analysis
    scope: "all_resources"
    metrics:
      - cpu_usage
      - memory_usage
      - disk_io
      - network_usage
      - cost_performance
    
  - name: performance_optimization
    type: optimization
    conditions:
      - cpu_usage > 80% for 1 hour
      - memory_usage > 85% for 1 hour
      - response_time > 500ms
    actions:
      - scale_up_resources
      - optimize_queries
      - add_caching
    
  - name: cost_optimization
    type: optimization
    conditions:
      - cost_increase > 20% from baseline
      - resource_utilization < 30%
      - unused_resources_detected
    actions:
      - scale_down_resources
      - delete_unused_resources
      - switch_to_reserved_instances
    
  - name: security_optimization
    type: optimization
    conditions:
      - security_score < 80
      - vulnerabilities_detected
      - compliance_violations
    actions:
      - apply_security_patches
      - update_access_policies
      - enable_additional_security_features

reports:
  - name: optimization_summary
    frequency: "weekly"
    content:
      - resource_utilization_summary
      - cost_savings_achieved
      - performance_improvements
      - security_enhancements
      - recommendations
    
  - name: executive_dashboard
    frequency: "monthly"
    content:
      - cost_trends
      - performance_metrics
      - security_status
      - compliance_score
      - optimization_opportunities
```
"""
        }
    
    def generate_metrics_collection(self) -> Dict[str, str]:
        """Genera scripts de recolección de métricas"""
        return {
            "performance_metrics": """
```python
# Recolección de métricas de rendimiento
import psutil
import time
import json
from datetime import datetime
from azure.monitor.ingestion import LogsIngestionClient
from azure.identity import DefaultAzureCredential

class PerformanceMetricsCollector:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.logs_client = LogsIngestionClient(
            endpoint="https://your-workspace.ingest.monitor.azure.com",
            credential=self.credential
        )
        self.workspace_id = "your-workspace-id"
        self.table_name = "PerformanceMetrics"
    
    def collect_system_metrics(self):
        # Recolecta métricas del sistema
        metrics = {
            "timestamp": datetime.utcnow().isoformat(),
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_usage_percent": psutil.disk_usage('/').percent,
            "network_io": self.get_network_io(),
            "process_count": len(psutil.pids())
        }
        
        return metrics
    
    def get_network_io(self):
        # Obtiene estadísticas de red
        net_io = psutil.net_io_counters()
        return {
            "bytes_sent": net_io.bytes_sent,
            "bytes_recv": net_io.bytes_recv,
            "packets_sent": net_io.packets_sent,
            "packets_recv": net_io.packets_recv
        }
    
    def send_metrics(self, metrics):
        # Envía métricas a Azure Monitor
        try:
            self.logs_client.upload(
                rule_id=self.workspace_id,
                stream_name=self.table_name,
                logs=[metrics]
            )
            print(f"Metrics sent successfully: {metrics['timestamp']}")
        except Exception as e:
            print(f"Error sending metrics: {e}")
    
    def run_collection(self, interval_seconds=60):
        # Ejecuta recolección continua de métricas
        print("Starting performance metrics collection...")
        
        while True:
            try:
                metrics = self.collect_system_metrics()
                self.send_metrics(metrics)
                time.sleep(interval_seconds)
            except KeyboardInterrupt:
                print("Stopping metrics collection...")
                break
            except Exception as e:
                print(f"Error in metrics collection: {e}")
                time.sleep(interval_seconds)

# Ejecutar recolector de métricas
collector = PerformanceMetricsCollector()
collector.run_collection()
```""",
            
            "cost_metrics": """
```python
# Recolección de métricas de costo
from azure.mgmt.consumption import ConsumptionManagementClient
from azure.identity import DefaultAzureCredential
from datetime import datetime, timedelta
import json

class CostMetricsCollector:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.consumption_client = ConsumptionManagementClient(
            self.credential, 
            subscription_id="your-subscription-id"
        )
    
    def collect_cost_metrics(self):
        # Recolecta métricas de costo
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        usage_details = self.consumption_client.usage_details.list(
            scope=f"/subscriptions/your-subscription-id",
            filter=f"usageStart ge '{start_date.isoformat()}' and usageEnd le '{end_date.isoformat()}'"
        )
        
        cost_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "daily_costs": {},
            "resource_type_costs": {},
            "total_cost": 0
        }
        
        for usage in usage_details:
            date = usage.usage_start.date().isoformat()
            cost = float(usage.cost)
            resource_type = usage.consumed_service
            
            # Acumular costos diarios
            if date not in cost_data["daily_costs"]:
                cost_data["daily_costs"][date] = 0
            cost_data["daily_costs"][date] += cost
            
            # Acumular costos por tipo de recurso
            if resource_type not in cost_data["resource_type_costs"]:
                cost_data["resource_type_costs"][resource_type] = 0
            cost_data["resource_type_costs"][resource_type] += cost
            
            cost_data["total_cost"] += cost
        
        return cost_data
    
    def analyze_cost_trends(self, cost_data):
        # Analiza tendencias de costo
        daily_costs = list(cost_data["daily_costs"].values())
        
        if len(daily_costs) >= 7:
            recent_avg = sum(daily_costs[-7:]) / 7
            previous_avg = sum(daily_costs[-14:-7]) / 7
            
            trend = {
                "recent_average": recent_avg,
                "previous_average": previous_avg,
                "change_percentage": ((recent_avg - previous_avg) / previous_avg) * 100,
                "trend": "increasing" if recent_avg > previous_avg else "decreasing"
            }
            
            return trend
        
        return None
    
    def generate_cost_recommendations(self, cost_data, trends):
        # Genera recomendaciones de optimización de costo
        recommendations = []
        
        # Análisis de recursos costosos
        for resource_type, cost in cost_data["resource_type_costs"].items():
            if cost > cost_data["total_cost"] * 0.2:  # Más del 20% del costo total
                recommendations.append({
                    "type": "high_cost_resource",
                    "resource_type": resource_type,
                    "cost": cost,
                    "percentage": (cost / cost_data["total_cost"]) * 100,
                    "suggestion": f"Review {resource_type} usage and consider optimization"
                })
        
        # Análisis de tendencias
        if trends and trends["change_percentage"] > 20:
            recommendations.append({
                "type": "cost_spike",
                "change_percentage": trends["change_percentage"],
                "suggestion": "Investigate recent cost increase"
            })
        
        return recommendations
    
    def send_cost_report(self, cost_data, trends, recommendations):
        # Envía reporte de costos
        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "cost_data": cost_data,
            "trends": trends,
            "recommendations": recommendations
        }
        
        # Enviar a Azure Monitor o sistema de alertas
        print(json.dumps(report, indent=2))
    
    def run_cost_analysis(self):
        # Ejecuta análisis completo de costos
        print("Starting cost analysis...")
        
        cost_data = self.collect_cost_metrics()
        trends = self.analyze_cost_trends(cost_data)
        recommendations = self.generate_cost_recommendations(cost_data, trends)
        
        self.send_cost_report(cost_data, trends, recommendations)

# Ejecutar análisis de costos
cost_collector = CostMetricsCollector()
cost_collector.run_cost_analysis()
```""",
            
            "security_metrics": """
```python
# Recolección de métricas de seguridad
from azure.mgmt.security import SecurityCenter
from azure.identity import DefaultAzureCredential
from datetime import datetime
import json

class SecurityMetricsCollector:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.security_client = SecurityCenter(
            self.credential, 
            subscription_id="your-subscription-id"
        )
    
    def collect_security_metrics(self):
        # Recolecta métricas de seguridad
        metrics = {
            "timestamp": datetime.utcnow().isoformat(),
            "security_score": self.get_security_score(),
            "compliance_status": self.get_compliance_status(),
            "vulnerabilities": self.get_vulnerabilities(),
            "security_alerts": self.get_security_alerts(),
            "access_reviews": self.get_access_reviews()
        }
        
        return metrics
    
    def get_security_score(self):
        # Obtiene puntuación de seguridad
        try:
            score = self.security_client.secure_scores.list()
            return next(score).score
        except:
            return None
    
    def get_compliance_status(self):
        # Obtiene estado de cumplimiento
        try:
            compliance = self.security_client.compliance.list()
            return [item.as_dict() for item in compliance]
        except:
            return []
    
    def get_vulnerabilities(self):
        # Obtiene vulnerabilidades detectadas
        try:
            vulnerabilities = self.security_client.assessments.list()
            return [
                {
                    "name": v.display_name,
                    "status": v.status.code,
                    "severity": v.status.severity
                }
                for v in vulnerabilities
                if v.status.code == "Unhealthy"
            ]
        except:
            return []
    
    def get_security_alerts(self):
        # Obtiene alertas de seguridad
        try:
            alerts = self.security_client.alerts.list()
            return [
                {
                    "name": alert.alert_display_name,
                    "severity": alert.severity,
                    "status": alert.status
                }
                for alert in alerts
            ]
        except:
            return []
    
    def get_access_reviews(self):
        # Obtiene revisiones de acceso pendientes
        try:
            # Implementar lógica para obtener revisiones de acceso
            return []
        except:
            return []
    
    def analyze_security_risks(self, metrics):
        # Analiza riesgos de seguridad
        risks = []
        
        # Análisis de puntuación de seguridad
        if metrics["security_score"] and metrics["security_score"] < 70:
            risks.append({
                "type": "low_security_score",
                "score": metrics["security_score"],
                "severity": "high",
                "description": "Security score below recommended threshold"
            })
        
        # Análisis de vulnerabilidades
        high_severity_vulns = [
            v for v in metrics["vulnerabilities"] 
            if v["severity"] == "high"
        ]
        
        if high_severity_vulns:
            risks.append({
                "type": "high_severity_vulnerabilities",
                "count": len(high_severity_vulns),
                "severity": "critical",
                "description": f"Found {len(high_severity_vulns)} high severity vulnerabilities"
            })
        
        # Análisis de alertas de seguridad
        critical_alerts = [
            a for a in metrics["security_alerts"] 
            if a["severity"] == "high"
        ]
        
        if critical_alerts:
            risks.append({
                "type": "critical_security_alerts",
                "count": len(critical_alerts),
                "severity": "critical",
                "description": f"Found {len(critical_alerts)} critical security alerts"
            })
        
        return risks
    
    def generate_security_recommendations(self, metrics, risks):
        # Genera recomendaciones de seguridad
        recommendations = []
        
        for risk in risks:
            if risk["type"] == "low_security_score":
                recommendations.append({
                    "priority": "high",
                    "action": "Review and implement security recommendations",
                    "description": "Address security gaps to improve overall security score"
                })
            
            elif risk["type"] == "high_severity_vulnerabilities":
                recommendations.append({
                    "priority": "critical",
                    "action": "Patch high severity vulnerabilities immediately",
                    "description": "Prioritize fixing critical security vulnerabilities"
                })
            
            elif risk["type"] == "critical_security_alerts":
                recommendations.append({
                    "priority": "critical",
                    "action": "Investigate and resolve security alerts",
                    "description": "Address security incidents promptly"
                })
        
        return recommendations
    
    def send_security_report(self, metrics, risks, recommendations):
        # Envía reporte de seguridad
        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "metrics": metrics,
            "risks": risks,
            "recommendations": recommendations
        }
        
        # Enviar a sistema de alertas o dashboard
        print(json.dumps(report, indent=2))
    
    def run_security_analysis(self):
        # Ejecuta análisis completo de seguridad
        print("Starting security analysis...")
        
        metrics = self.collect_security_metrics()
        risks = self.analyze_security_risks(metrics)
        recommendations = self.generate_security_recommendations(metrics, risks)
        
        self.send_security_report(metrics, risks, recommendations)

# Ejecutar análisis de seguridad
security_collector = SecurityMetricsCollector()
security_collector.run_security_analysis()
```"""
        }
    
    def create_continuous_improvement_guide(self) -> Dict[str, Any]:
        """Crea la guía completa de mejora continua"""
        return {
            "titulo": "Sistema de Mejora Continua Azure - Automatización y Optimización",
            "descripcion": "Sistema completo de mejora continua con automatización, monitoreo y optimización",
            "automatizacion": self.generate_automation_scripts(),
            "dashboards": self.generate_monitoring_dashboards(),
            "workflows": self.generate_improvement_workflows(),
            "metricas": self.generate_metrics_collection(),
            "roadmap_mejora": {
                "corto_plazo": [
                    "Implementar monitoreo básico de recursos",
                    "Configurar alertas de costo",
                    "Establecer respaldos automáticos",
                    "Implementar verificaciones de seguridad básicas"
                ],
                "mediano_plazo": [
                    "Automatizar escalado de recursos",
                    "Implementar análisis predictivo de costos",
                    "Configurar dashboards avanzados",
                    "Establecer flujos de trabajo de incidentes"
                ],
                "largo_plazo": [
                    "Implementar IA/ML para optimización",
                    "Automatización completa de operaciones",
                    "Análisis avanzado de seguridad",
                    "Optimización predictiva de recursos"
                ]
            },
            "kpis_mejora": {
                "rendimiento": [
                    "Tiempo de respuesta promedio < 200ms",
                    "Disponibilidad > 99.9%",
                    "Throughput optimizado",
                    "Latencia reducida en 20%"
                ],
                "costos": [
                    "Reducción de costos en 15%",
                    "Optimización de recursos en 25%",
                    "Eliminación de recursos no utilizados",
                    "Uso eficiente de Reserved Instances"
                ],
                "seguridad": [
                    "Puntuación de seguridad > 90",
                    "Cumplimiento 100%",
                    "Tiempo de respuesta a incidentes < 1 hora",
                    "Vulnerabilidades críticas = 0"
                ],
                "operaciones": [
                    "Automatización del 80% de tareas",
                    "Tiempo de despliegue < 30 minutos",
                    "Recuperación ante desastres < 4 horas",
                    "Disponibilidad del equipo 24/7"
                ]
            }
        }
    
    def save_continuous_improvement_guide(self, guide: Dict[str, Any], filename: str):
        """Guarda la guía de mejora continua en formato Markdown"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"# {guide['titulo']}\n\n")
            f.write(f"{guide['descripcion']}\n\n")
            
            # Automatización
            f.write("## 🤖 Scripts de Automatización\n\n")
            for script_name, script_content in guide['automatizacion'].items():
                f.write(f"### {script_name.replace('_', ' ').title()}\n")
                f.write(script_content)
                f.write("\n---\n\n")
            
            # Dashboards
            f.write("## 📊 Dashboards de Monitoreo\n\n")
            for dashboard_name, dashboard_content in guide['dashboards'].items():
                f.write(f"### {dashboard_name.replace('_', ' ').title()}\n")
                f.write(dashboard_content)
                f.write("\n---\n\n")
            
            # Workflows
            f.write("## 🔄 Flujos de Trabajo de Mejora\n\n")
            for workflow_name, workflow_content in guide['workflows'].items():
                f.write(f"### {workflow_name.replace('_', ' ').title()}\n")
                f.write(workflow_content)
                f.write("\n---\n\n")
            
            # Métricas
            f.write("## 📈 Recolección de Métricas\n\n")
            for metric_name, metric_content in guide['metricas'].items():
                f.write(f"### {metric_name.replace('_', ' ').title()}\n")
                f.write(metric_content)
                f.write("\n---\n\n")
            
            # Roadmap
            f.write("## 🗺️ Roadmap de Mejora\n\n")
            for timeframe, items in guide['roadmap_mejora'].items():
                f.write(f"### {timeframe.replace('_', ' ').title()}\n")
                for item in items:
                    f.write(f"- {item}\n")
                f.write("\n")
            
            # KPIs
            f.write("## 🎯 KPIs de Mejora\n\n")
            for kpi_category, kpis in guide['kpis_mejora'].items():
                f.write(f"### {kpi_category.replace('_', ' ').title()}\n")
                for kpi in kpis:
                    f.write(f"- {kpi}\n")
                f.write("\n")

def main():
    print("Creando sistema de mejora continua para Azure...")
    
    # Crear sistema de mejora continua
    ci_system = AzureContinuousImprovement()
    guide = ci_system.create_continuous_improvement_guide()
    
    # Guardar en JSON
    with open('azure_continuous_improvement.json', 'w', encoding='utf-8') as f:
        json.dump(guide, f, ensure_ascii=False, indent=2)
    
    # Guardar en Markdown
    ci_system.save_continuous_improvement_guide(guide, 'azure_continuous_improvement_guide.md')
    
    print("Sistema de mejora continua creado exitosamente!")
    print("- azure_continuous_improvement.json")
    print("- azure_continuous_improvement_guide.md")
    
    # Mostrar estadísticas
    print("\nEstadísticas:")
    print(f"  Scripts de automatización: {len(guide['automatizacion'])}")
    print(f"  Dashboards de monitoreo: {len(guide['dashboards'])}")
    print(f"  Flujos de trabajo: {len(guide['workflows'])}")
    print(f"  Recolectores de métricas: {len(guide['metricas'])}")
    print(f"  KPIs definidos: {sum(len(kpis) for kpis in guide['kpis_mejora'].values())}")

if __name__ == "__main__":
    main() 