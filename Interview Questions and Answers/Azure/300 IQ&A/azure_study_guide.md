# Guía Completa de Estudio Azure - 300+ Preguntas y Respuestas

Guía completa con traducción al español, código de ejemplo, pruebas unitarias y explicaciones detalladas

## Niveles de Estudio

### Nivel Basico
Conceptos fundamentales de Azure para principiantes
**Preguntas: 3**

#### Pregunta 6
**Original:** global distribution and horizontal scaling for databases. Option 1: Cosmos DB

**Traducida:** global distribution and horizontal scaling for databases. Option 1: Cosmos DB

**Opciones:**
- A. Option 3: Database Scaling
- B. Option 4: Azure Shard

**Respuesta:** Correct Response: 1.0

**Explicación:** Explanation: Azure Cosmos DB is designed for global distribution and horizontal scaling of databases. Options 2, 3, and 4 are not speciﬁcally designed for global distribution and scaling.

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

#### Pregunta 13
**Original:** hybrid networks between on-premises data centers and Azure. Option 1: Hybrid

**Traducida:** hybrid networks between on-premises data centers and Azure. Option 1: Hybrid

**Opciones:**
- A. Option 3: VPN
- B. Option 4: Connectivity

**Respuesta:** Correct Response: 3.0

**Explicación:** Explanation: Azure VPN Gateway facilitates secure and reliable hybrid network connections between on-premises data centers and Azure.

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

#### Pregunta 32
**Original:** should implement Azure _______ Network Security Groups. Option 1: Subnet

**Traducida:** should implement Azure _______ Network Seguridad Groups. Option 1: Subnet

**Opciones:**
- A. Option 3: Inbound
- B. Option 4: Outbound

**Respuesta:** Correct Response: 3.0

**Explicación:** Explanation: Azure Network Security Groups (NSGs) are used to control inbound and outbound trafﬁc to network interfaces, enhancing the security posture of Azure Virtual Machines.

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

### Nivel Intermedio
Servicios y configuraciones avanzadas de Azure
**Preguntas: 24**

#### Pregunta 3
**Original:** the network topology of applications in Azure Architecture. Option 1: Azure Virtual Network

**Traducida:** the network topology of applications in Azure Architecture. Option 1: Azure Red Virtual

**Opciones:**
- A. Option 3: Azure Logic Apps
- B. Option 4: Azure Cosmos DB

**Respuesta:** Correct Response: 1.0

**Explicación:** Explanation: Azure Virtual Network allows you to deﬁne the network topology of applications in Azure. It provides isolation, segmentation, and connectivity for your Azure resources. Azure Functions, Logic Apps, and Cosmos DB serve dif ferent purposes.

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

#### Pregunta 5
**Original:** policies help enforce organizational standards and assess compliance. Option 1: Regulatory

**Traducida:** policies help enforce organizational standards and assess compliance. Option 1: Regulatory

**Opciones:**
- A. Option 3: Compliance
- B. Option 4: Security

**Respuesta:** Correct Response: 2.0

**Explicación:** Explanation: Azure Policy is used to enforce or ganizational standards and assess compliance within Azure Resources and Subscriptions. Options 1, 3, and 4 are related to compliance but not speciﬁc to Azure policies.

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

#### Pregunta 15
**Original:** Management Groups allow for hierarchical management of multiple subscriptions. Option 1: Resource

**Traducida:** Management Groups allow for hierarchical management of multiple subscriptions. Option 1: Resource

**Opciones:**
- A. Option 3: Azure AD
- B. Option 4: Azure Blueprints

**Respuesta:** Correct Response: 1.0

**Explicación:** Explanation: Azure Resource Management Groups provide a hierarchical structure for managing resources and subscriptions, enabling efﬁcient organization and governance.

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

### Nivel Avanzado
Arquitecturas complejas y optimizaciones avanzadas
**Preguntas: 23**

#### Pregunta 1
**Original:** What is the primary purpose of Azure Resource Manager in Azure Architecture? Option 1: Resource provisioning and management

**Traducida:** ¿Qué es the primary purpose of Azure Resource Manager in Azure Architecture? Option 1: Resource provisioning and management

**Opciones:**
- A. Option 3: Security and compliance
- B. Option 4: Data storage and retrieval

**Respuesta:** Correct Response: 1.0

**Explicación:** Explanation: Azure Resource Manager is primarily responsible for provisioning and managing Azure resources. It helps in deploying, updating, and deleting resources, making it an essential component in Azure's infrastructure. It doesn't handle billing, security , or data storage directly .

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

#### Pregunta 2
**Original:** In Azure, which feature allows you to organize resources into logical groups for easy management? Option 1: Resource Groups

**Traducida:** En Azure, which feature allows you to organize resources into logical groups for easy management? Option 1: Grupo de Recursoss

**Opciones:**
- A. Option 3: Azure Active Directory
- B. Option 4: Azure Key Vault

**Respuesta:** Correct Response: 1.0

**Explicación:** Explanation: Azure Resource Groups are used to or ganize and manage Azure resources ef fectively . They provide a way to manage and apply policies and access control to a group of resources. Virtual Networks, Azure Active Directory , and Azure Key Vault serve dif ferent purposes in Azure.

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

#### Pregunta 4
**Original:** Azure _______ is used to automate the deployment and conﬁguration of resources in Azure Architecture. Option 1: Resource Manager (ARM)

**Traducida:** Azure _______ is used to automate the deployment and conﬁguration of resources in Azure Architecture. Option 1: Resource Manager (ARM)

**Opciones:**
- A. Option 3: Deployment Engine
- B. Option 4: Conﬁgurator

**Respuesta:** Correct Response: 2.0

**Explicación:** Explanation: Azure Automation is used to automate the deployment and conﬁguration of resources in Azure. Options 1, 3, and 4 are not speciﬁc to automation in Azure.

**Código de Ejemplo:**

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
```

**Pruebas Unitarias:**

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
```

**Mejoras Sugeridas:**
- Implementar monitoreo adicional
- Considerar alta disponibilidad
- Aplicar mejores prácticas de seguridad
- Optimizar costos

---

## Categorías por Servicio

### Fundamentos
Conceptos básicos de Azure y Resource Manager
**Preguntas: 17**

### Servicios Computo
Virtual Machines, Functions, App Services
**Preguntas: 6**

### Almacenamiento
Storage Accounts, Blob, File, Disk Storage
**Preguntas: 8**

### Redes
Virtual Networks, Load Balancers, Gateways
**Preguntas: 11**

### Seguridad
Identity, Authentication, Authorization, Key Vault
**Preguntas: 7**

### Monitoreo
Monitor, Log Analytics, Alerts, Insights
**Preguntas: 1**

### Devops
Pipelines, Deployment, CI/CD, Automation
**Preguntas: 0**

