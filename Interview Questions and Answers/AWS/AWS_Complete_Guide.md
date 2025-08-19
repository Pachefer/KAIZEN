# ☁️ Guía Completa de AWS - Entrevistas y Dominio

## 🎯 Introducción a AWS

**Amazon Web Services (AWS)** es la plataforma de computación en la nube más grande y adoptada del mundo, ofreciendo más de 200 servicios completos de centros de datos globales.

### 🌟 **¿Por qué AWS?**

- **Líder del mercado** - 32% de cuota de mercado global
- **Servicios completos** - 200+ servicios integrados
- **Escalabilidad global** - 25+ regiones, 80+ zonas de disponibilidad
- **Seguridad empresarial** - Certificaciones SOC, PCI, HIPAA
- **Costo-efectivo** - Modelo de pago por uso

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Qué es EC2 y cuáles son sus tipos de instancias?**

**Respuesta Completa:**

**EC2 (Elastic Compute Cloud)** es el servicio de computación virtual de AWS que permite alquilar servidores virtuales en la nube.

**Tipos de Instancias:**

1. **Propósito General (M, T, A)** - Balance entre CPU, memoria y red
2. **Optimizadas para Computación (C)** - Alto rendimiento de CPU
3. **Optimizadas para Memoria (R, X, High Memory)** - Alta capacidad de RAM
4. **Optimizadas para Almacenamiento (I, D, H)** - Alto rendimiento de I/O
5. **Optimizadas para Aceleración (P, G, F, Inf)** - GPU y FPGA

```bash
# Ejemplo de creación de instancia EC2
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t3.micro \
  --key-name my-key-pair \
  --security-group-ids sg-12345678 \
  --subnet-id subnet-12345678 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=WebServer}]'

# Configuración de instancia con User Data
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name my-key-pair \
  --security-group-ids sg-12345678 \
  --subnet-id subnet-12345678 \
  --user-data file://user-data.sh \
  --iam-instance-profile Name=EC2Role \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Environment,Value=Production}]'
```

**User Data Script (user-data.sh):**
```bash
#!/bin/bash
# Script de inicialización de instancia
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Servidor Web en AWS EC2</h1>" > /var/www/html/index.html
```

**Simulador de EC2:**

```python
# ec2-simulator.py
import boto3
import time
from datetime import datetime
from typing import Dict, List, Optional

class EC2Simulator:
    def __init__(self):
        self.instances = {}
        self.instance_counter = 0
        self.regions = ['us-east-1', 'us-west-2', 'eu-west-1']
        self.instance_types = {
            't3.micro': {'vCPU': 2, 'RAM': '1 GiB', 'Network': 'Low to Moderate'},
            't3.small': {'vCPU': 2, 'RAM': '2 GiB', 'Network': 'Low to Moderate'},
            't3.medium': {'vCPU': 2, 'RAM': '4 GiB', 'Network': 'Low to Moderate'},
            'm5.large': {'vCPU': 2, 'RAM': '8 GiB', 'Network': 'Up to 10 Gbps'},
            'c5.xlarge': {'vCPU': 4, 'RAM': '8 GiB', 'Network': 'Up to 10 Gbps'},
            'r5.2xlarge': {'vCPU': 8, 'RAM': '64 GiB', 'Network': 'Up to 10 Gbps'}
        }
        self.ami_catalog = {
            'Amazon Linux 2': 'ami-0c55b159cbfafe1f0',
            'Ubuntu 20.04': 'ami-0c2b8ca1dad447f8a',
            'Windows Server 2019': 'ami-0a0c8eebcdd6dcbd0',
            'RHEL 8': 'ami-0b0af3577bf5e2327'
        }
        
    def create_instance(self, 
                       instance_type: str, 
                       ami_name: str, 
                       region: str = 'us-east-1',
                       key_name: str = 'default-key',
                       security_groups: List[str] = None) -> Dict:
        """Crear una nueva instancia EC2"""
        
        if instance_type not in self.instance_types:
            raise ValueError(f"Tipo de instancia no válido: {instance_type}")
            
        if ami_name not in self.ami_catalog:
            raise ValueError(f"AMI no válido: {ami_name}")
            
        self.instance_counter += 1
        instance_id = f"i-{self.instance_counter:08x}"
        
        # Simular tiempo de creación
        creation_time = datetime.now()
        
        instance = {
            'InstanceId': instance_id,
            'InstanceType': instance_type,
            'ImageId': self.ami_catalog[ami_name],
            'State': 'pending',
            'Region': region,
            'KeyName': key_name,
            'SecurityGroups': security_groups or ['default'],
            'LaunchTime': creation_time,
            'Specs': self.instance_types[instance_type],
            'PublicIP': None,
            'PrivateIP': f"10.0.{self.instance_counter}.{self.instance_counter % 255}",
            'Tags': [
                {'Key': 'Name', 'Value': f'Instance-{self.instance_counter}'},
                {'Key': 'Environment', 'Value': 'Development'},
                {'Key': 'CreatedBy', 'Value': 'EC2Simulator'}
            ]
        }
        
        self.instances[instance_id] = instance
        
        print(f"🚀 Creando instancia {instance_id}...")
        print(f"   Tipo: {instance_type}")
        print(f"   AMI: {ami_name}")
        print(f"   Región: {region}")
        
        # Simular proceso de creación
        self._simulate_creation_process(instance_id)
        
        return instance
    
    def _simulate_creation_process(self, instance_id: str):
        """Simular el proceso de creación de instancia"""
        import threading
        
        def creation_process():
            instance = self.instances[instance_id]
            
            # Estado: pending -> running
            time.sleep(2)
            instance['State'] = 'running'
            instance['PublicIP'] = f"52.{self.instance_counter}.{self.instance_counter % 255}.{self.instance_counter % 255}"
            
            print(f"✅ Instancia {instance_id} creada exitosamente!")
            print(f"   Estado: {instance['State']}")
            print(f"   IP Pública: {instance['PublicIP']}")
            print(f"   IP Privada: {instance['PrivateIP']}")
            
            # Simular métricas de la instancia
            self._start_monitoring(instance_id)
        
        thread = threading.Thread(target=creation_process)
        thread.start()
    
    def _start_monitoring(self, instance_id: str):
        """Simular monitoreo de la instancia"""
        import threading
        
        def monitor():
            instance = self.instances[instance_id]
            while instance['State'] == 'running':
                # Simular métricas de CPU y memoria
                cpu_usage = self._simulate_cpu_usage()
                memory_usage = self._simulate_memory_usage()
                
                if cpu_usage > 80 or memory_usage > 80:
                    print(f"⚠️  Alerta: Instancia {instance_id} - CPU: {cpu_usage}%, RAM: {memory_usage}%")
                
                time.sleep(5)
        
        thread = threading.Thread(target=monitor)
        thread.daemon = True
        thread.start()
    
    def _simulate_cpu_usage(self) -> int:
        """Simular uso de CPU"""
        import random
        return random.randint(10, 90)
    
    def _simulate_memory_usage(self) -> int:
        """Simular uso de memoria"""
        import random
        return random.randint(20, 85)
    
    def stop_instance(self, instance_id: str) -> bool:
        """Detener una instancia"""
        if instance_id not in self.instances:
            print(f"❌ Instancia {instance_id} no encontrada")
            return False
        
        instance = self.instances[instance_id]
        if instance['State'] != 'running':
            print(f"⚠️  Instancia {instance_id} no está ejecutándose")
            return False
        
        print(f"🛑 Deteniendo instancia {instance_id}...")
        instance['State'] = 'stopping'
        
        # Simular tiempo de detención
        time.sleep(1)
        instance['State'] = 'stopped'
        instance['PublicIP'] = None
        
        print(f"✅ Instancia {instance_id} detenida")
        return True
    
    def terminate_instance(self, instance_id: str) -> bool:
        """Terminar una instancia"""
        if instance_id not in self.instances:
            print(f"❌ Instancia {instance_id} no encontrada")
            return False
        
        instance = self.instances[instance_id]
        print(f"💀 Terminando instancia {instance_id}...")
        
        # Simular tiempo de terminación
        time.sleep(2)
        
        # Eliminar instancia
        del self.instances[instance_id]
        print(f"✅ Instancia {instance_id} terminada")
        return True
    
    def list_instances(self, filters: Dict = None) -> List[Dict]:
        """Listar instancias con filtros opcionales"""
        instances = list(self.instances.values())
        
        if filters:
            for key, value in filters.items():
                instances = [i for i in instances if i.get(key) == value]
        
        return instances
    
    def get_instance_info(self, instance_id: str) -> Optional[Dict]:
        """Obtener información detallada de una instancia"""
        return self.instances.get(instance_id)
    
    def run_demo(self):
        """Ejecutar demostración del simulador"""
        print("☁️ SIMULADOR DE AWS EC2")
        print("=" * 50)
        
        # Crear múltiples instancias
        print("\n🚀 CREANDO INSTANCIAS...")
        
        # Instancia de desarrollo
        dev_instance = self.create_instance(
            instance_type='t3.micro',
            ami_name='Amazon Linux 2',
            region='us-east-1',
            key_name='dev-key',
            security_groups=['dev-sg']
        )
        
        # Instancia de producción
        prod_instance = self.create_instance(
            instance_type='m5.large',
            ami_name='Ubuntu 20.04',
            region='us-west-2',
            key_name='prod-key',
            security_groups=['prod-sg', 'web-sg']
        )
        
        # Instancia de base de datos
        db_instance = self.create_instance(
            instance_type='r5.2xlarge',
            ami_name='RHEL 8',
            region='eu-west-1',
            key_name='db-key',
            security_groups=['db-sg', 'internal-sg']
        )
        
        # Esperar a que todas las instancias estén running
        time.sleep(5)
        
        # Mostrar estado de todas las instancias
        print("\n📊 ESTADO DE INSTANCIAS:")
        print("-" * 50)
        
        for instance_id, instance in self.instances.items():
            print(f"ID: {instance_id}")
            print(f"   Tipo: {instance['InstanceType']}")
            print(f"   Estado: {instance['State']}")
            print(f"   Región: {instance['Region']}")
            print(f"   IP Pública: {instance['PublicIP'] or 'N/A'}")
            print(f"   IP Privada: {instance['PrivateIP']}")
            print()
        
        # Simular operaciones de mantenimiento
        print("🔧 OPERACIONES DE MANTENIMIENTO:")
        print("-" * 50)
        
        # Detener instancia de desarrollo
        time.sleep(2)
        self.stop_instance(dev_instance['InstanceId'])
        
        # Terminar instancia de base de datos
        time.sleep(2)
        self.terminate_instance(db_instance['InstanceId'])
        
        # Mostrar estado final
        time.sleep(2)
        print("\n📊 ESTADO FINAL:")
        print("-" * 50)
        
        remaining_instances = self.list_instances()
        for instance in remaining_instances:
            print(f"ID: {instance['InstanceId']} - Estado: {instance['State']}")
        
        # Estadísticas finales
        print(f"\n📈 ESTADÍSTICAS:")
        print(f"   Instancias creadas: {self.instance_counter}")
        print(f"   Instancias activas: {len([i for i in self.instances.values() if i['State'] == 'running'])}")
        print(f"   Instancias detenidas: {len([i for i in self.instances.values() if i['State'] == 'stopped'])}")
        print(f"   Instancias terminadas: {self.instance_counter - len(self.instances)}")

# Ejecutar simulador
if __name__ == "__main__":
    simulator = EC2Simulator()
    simulator.run_demo()
```

---

### 🔴 **PREGUNTA 2: ¿Qué es S3 y cuáles son sus clases de almacenamiento?**

**Respuesta Completa:**

**S3 (Simple Storage Service)** es el servicio de almacenamiento de objetos de AWS, diseñado para almacenar y recuperar cualquier cantidad de datos desde cualquier lugar.

**Clases de Almacenamiento:**

1. **S3 Standard** - Acceso frecuente, alta disponibilidad
2. **S3 Intelligent-Tiering** - Optimización automática de costos
3. **S3 Standard-IA** - Acceso infrecuente, menor costo
4. **S3 One Zone-IA** - Acceso infrecuente, una zona
5. **S3 Glacier** - Archivo a largo plazo, muy bajo costo
6. **S3 Glacier Deep Archive** - Archivo más bajo costo

```python
# Ejemplo de uso de S3 con boto3
import boto3
import json
from botocore.exceptions import ClientError

class S3Manager:
    def __init__(self, region_name='us-east-1'):
        self.s3_client = boto3.client('s3', region_name=region_name)
        self.s3_resource = boto3.resource('s3', region_name=region_name)
    
    def create_bucket(self, bucket_name: str, region: str = None) -> bool:
        """Crear un bucket S3"""
        try:
            if region and region != 'us-east-1':
                self.s3_client.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': region}
                )
            else:
                self.s3_client.create_bucket(Bucket=bucket_name)
            
            # Configurar versioning
            self.s3_client.put_bucket_versioning(
                Bucket=bucket_name,
                VersioningConfiguration={'Status': 'Enabled'}
            )
            
            # Configurar encriptación por defecto
            self.s3_client.put_bucket_encryption(
                Bucket=bucket_name,
                ServerSideEncryptionConfiguration={
                    'Rules': [
                        {
                            'ApplyServerSideEncryptionByDefault': {
                                'SSEAlgorithm': 'AES256'
                            }
                        }
                    ]
                }
            )
            
            print(f"✅ Bucket '{bucket_name}' creado exitosamente")
            return True
            
        except ClientError as e:
            print(f"❌ Error creando bucket: {e}")
            return False
    
    def upload_file(self, bucket_name: str, file_path: str, object_key: str, 
                   storage_class: str = 'STANDARD', metadata: dict = None) -> bool:
        """Subir archivo a S3"""
        try:
            extra_args = {'StorageClass': storage_class}
            if metadata:
                extra_args['Metadata'] = metadata
            
            self.s3_client.upload_file(
                file_path, 
                bucket_name, 
                object_key,
                ExtraArgs=extra_args
            )
            
            print(f"✅ Archivo '{file_path}' subido como '{object_key}'")
            print(f"   Bucket: {bucket_name}")
            print(f"   Clase de almacenamiento: {storage_class}")
            return True
            
        except ClientError as e:
            print(f"❌ Error subiendo archivo: {e}")
            return False
    
    def download_file(self, bucket_name: str, object_key: str, file_path: str) -> bool:
        """Descargar archivo de S3"""
        try:
            self.s3_client.download_file(bucket_name, object_key, file_path)
            print(f"✅ Archivo '{object_key}' descargado a '{file_path}'")
            return True
            
        except ClientError as e:
            print(f"❌ Error descargando archivo: {e}")
            return False
    
    def list_objects(self, bucket_name: str, prefix: str = '') -> list:
        """Listar objetos en un bucket"""
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=bucket_name,
                Prefix=prefix
            )
            
            objects = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    objects.append({
                        'Key': obj['Key'],
                        'Size': obj['Size'],
                        'LastModified': obj['LastModified'],
                        'StorageClass': obj['StorageClass']
                    })
            
            return objects
            
        except ClientError as e:
            print(f"❌ Error listando objetos: {e}")
            return []
    
    def change_storage_class(self, bucket_name: str, object_key: str, 
                           new_storage_class: str) -> bool:
        """Cambiar clase de almacenamiento de un objeto"""
        try:
            # Copiar objeto con nueva clase de almacenamiento
            copy_source = {'Bucket': bucket_name, 'Key': object_key}
            
            self.s3_client.copy_object(
                CopySource=copy_source,
                Bucket=bucket_name,
                Key=object_key,
                StorageClass=new_storage_class,
                MetadataDirective='REPLACE'
            )
            
            print(f"✅ Clase de almacenamiento cambiada a '{new_storage_class}'")
            return True
            
        except ClientError as e:
            print(f"❌ Error cambiando clase de almacenamiento: {e}")
            return False
    
    def set_lifecycle_policy(self, bucket_name: str) -> bool:
        """Configurar política de ciclo de vida"""
        try:
            lifecycle_config = {
                'Rules': [
                    {
                        'ID': 'TransitionToIA',
                        'Status': 'Enabled',
                        'Filter': {'Prefix': ''},
                        'Transitions': [
                            {
                                'Days': 30,
                                'StorageClass': 'STANDARD_IA'
                            },
                            {
                                'Days': 90,
                                'StorageClass': 'GLACIER'
                            },
                            {
                                'Days': 365,
                                'StorageClass': 'DEEP_ARCHIVE'
                            }
                        ]
                    }
                ]
            }
            
            self.s3_client.put_bucket_lifecycle_configuration(
                Bucket=bucket_name,
                LifecycleConfiguration=lifecycle_config
            )
            
            print(f"✅ Política de ciclo de vida configurada para '{bucket_name}'")
            return True
            
        except ClientError as e:
            print(f"❌ Error configurando política de ciclo de vida: {e}")
            return False

# Ejemplo de uso
def demo_s3():
    s3_manager = S3Manager()
    
    # Crear bucket
    bucket_name = 'mi-bucket-demo-2024'
    s3_manager.create_bucket(bucket_name, 'us-west-2')
    
    # Subir archivos con diferentes clases de almacenamiento
    s3_manager.upload_file(
        bucket_name, 
        'documento.txt', 
        'documentos/importante.txt',
        'STANDARD'
    )
    
    s3_manager.upload_file(
        bucket_name, 
        'backup.zip', 
        'backups/mensual.zip',
        'STANDARD_IA'
    )
    
    s3_manager.upload_file(
        bucket_name, 
        'archivo_antiguo.pdf', 
        'archivos/2020/reporte.pdf',
        'GLACIER'
    )
    
    # Listar objetos
    objects = s3_manager.list_objects(bucket_name)
    print(f"\n📁 Objetos en bucket '{bucket_name}':")
    for obj in objects:
        print(f"   {obj['Key']} - {obj['Size']} bytes - {obj['StorageClass']}")
    
    # Configurar política de ciclo de vida
    s3_manager.set_lifecycle_policy(bucket_name)

if __name__ == "__main__":
    demo_s3()
```

**Simulador de S3:**

```python
# s3-simulator.py
import time
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import hashlib

class S3Simulator:
    def __init__(self):
        self.buckets = {}
        self.objects = {}
        self.storage_classes = {
            'STANDARD': {
                'availability': '99.99%',
                'durability': '99.999999999%',
                'cost_per_gb': 0.023,
                'retrieval_time': 'milliseconds'
            },
            'STANDARD_IA': {
                'availability': '99.9%',
                'durability': '99.999999999%',
                'cost_per_gb': 0.0125,
                'retrieval_time': 'milliseconds'
            },
            'ONEZONE_IA': {
                'availability': '99.5%',
                'durability': '99.999999999%',
                'cost_per_gb': 0.01,
                'retrieval_time': 'milliseconds'
            },
            'INTELLIGENT_TIERING': {
                'availability': '99.9%',
                'durability': '99.999999999%',
                'cost_per_gb': 0.023,
                'retrieval_time': 'milliseconds'
            },
            'GLACIER': {
                'availability': '99.9%',
                'durability': '99.999999999%',
                'cost_per_gb': 0.004,
                'retrieval_time': 'minutes to hours'
            },
            'DEEP_ARCHIVE': {
                'availability': '99.9%',
                'durability': '99.999999999%',
                'cost_per_gb': 0.00099,
                'retrieval_time': 'hours'
            }
        }
        
    def create_bucket(self, bucket_name: str, region: str = 'us-east-1') -> Dict:
        """Crear un bucket S3"""
        if bucket_name in self.buckets:
            raise ValueError(f"Bucket '{bucket_name}' ya existe")
        
        bucket = {
            'Name': bucket_name,
            'Region': region,
            'CreationDate': datetime.now(),
            'Versioning': 'Enabled',
            'Encryption': 'AES256',
            'PublicAccessBlock': {
                'BlockPublicAcls': True,
                'IgnorePublicAcls': True,
                'BlockPublicPolicy': True,
                'RestrictPublicBuckets': True
            },
            'LifecycleRules': [],
            'Tags': [
                {'Key': 'Environment', 'Value': 'Development'},
                {'Key': 'CreatedBy', 'Value': 'S3Simulator'}
            ]
        }
        
        self.buckets[bucket_name] = bucket
        print(f"✅ Bucket '{bucket_name}' creado en región '{region}'")
        
        return bucket
    
    def upload_object(self, bucket_name: str, key: str, data: str, 
                     storage_class: str = 'STANDARD', metadata: Dict = None) -> Dict:
        """Subir objeto a S3"""
        if bucket_name not in self.buckets:
            raise ValueError(f"Bucket '{bucket_name}' no existe")
        
        if storage_class not in self.storage_classes:
            raise ValueError(f"Clase de almacenamiento no válida: {storage_class}")
        
        # Generar ID único para el objeto
        object_id = hashlib.md5(f"{bucket_name}:{key}:{time.time()}".encode()).hexdigest()
        
        object_info = {
            'Key': key,
            'Bucket': bucket_name,
            'Size': len(data.encode('utf-8')),
            'StorageClass': storage_class,
            'LastModified': datetime.now(),
            'ETag': f'"{hashlib.md5(data.encode()).hexdigest()}"',
            'Metadata': metadata or {},
            'ObjectId': object_id
        }
        
        # Almacenar objeto
        if bucket_name not in self.objects:
            self.objects[bucket_name] = {}
        
        self.objects[bucket_name][key] = object_info
        
        print(f"✅ Objeto '{key}' subido a bucket '{bucket_name}'")
        print(f"   Tamaño: {object_info['Size']} bytes")
        print(f"   Clase: {storage_class}")
        print(f"   Costo estimado: ${self._calculate_cost(object_info['Size'], storage_class):.6f}/mes")
        
        return object_info
    
    def _calculate_cost(self, size_bytes: int, storage_class: str) -> float:
        """Calcular costo mensual del almacenamiento"""
        gb_size = size_bytes / (1024 ** 3)
        monthly_cost = gb_size * self.storage_classes[storage_class]['cost_per_gb']
        return monthly_cost
    
    def download_object(self, bucket_name: str, key: str) -> Optional[Dict]:
        """Descargar objeto de S3"""
        if bucket_name not in self.objects or key not in self.objects[bucket_name]:
            print(f"❌ Objeto '{key}' no encontrado en bucket '{bucket_name}'")
            return None
        
        obj = self.objects[bucket_name][key]
        
        # Simular tiempo de descarga según clase de almacenamiento
        if obj['StorageClass'] in ['GLACIER', 'DEEP_ARCHIVE']:
            print(f"⏳ Objeto en {obj['StorageClass']} - Iniciando restauración...")
            time.sleep(2)  # Simular tiempo de restauración
        
        print(f"✅ Objeto '{key}' descargado")
        print(f"   Tamaño: {obj['Size']} bytes")
        print(f"   Última modificación: {obj['LastModified']}")
        
        return obj
    
    def list_objects(self, bucket_name: str, prefix: str = '') -> List[Dict]:
        """Listar objetos en un bucket"""
        if bucket_name not in self.objects:
            return []
        
        objects = []
        for key, obj in self.objects[bucket_name].items():
            if key.startswith(prefix):
                objects.append(obj)
        
        return sorted(objects, key=lambda x: x['LastModified'], reverse=True)
    
    def change_storage_class(self, bucket_name: str, key: str, 
                           new_storage_class: str) -> bool:
        """Cambiar clase de almacenamiento"""
        if bucket_name not in self.objects or key not in self.objects[bucket_name]:
            print(f"❌ Objeto '{key}' no encontrado")
            return False
        
        if new_storage_class not in self.storage_classes:
            print(f"❌ Clase de almacenamiento no válida: {new_storage_class}")
            return False
        
        obj = self.objects[bucket_name][key]
        old_class = obj['StorageClass']
        
        # Cambiar clase de almacenamiento
        obj['StorageClass'] = new_storage_class
        obj['LastModified'] = datetime.now()
        
        print(f"✅ Clase de almacenamiento cambiada")
        print(f"   Objeto: {key}")
        print(f"   De: {old_class}")
        print(f"   A: {new_storage_class}")
        print(f"   Nuevo costo mensual: ${self._calculate_cost(obj['Size'], new_storage_class):.6f}")
        
        return True
    
    def set_lifecycle_policy(self, bucket_name: str, rules: List[Dict]) -> bool:
        """Configurar política de ciclo de vida"""
        if bucket_name not in self.buckets:
            print(f"❌ Bucket '{bucket_name}' no encontrado")
            return False
        
        self.buckets[bucket_name]['LifecycleRules'] = rules
        
        print(f"✅ Política de ciclo de vida configurada para '{bucket_name}'")
        for rule in rules:
            print(f"   Regla: {rule.get('ID', 'Sin ID')}")
            print(f"   Estado: {rule.get('Status', 'Desconocido')}")
        
        return True
    
    def apply_lifecycle_policies(self):
        """Aplicar políticas de ciclo de vida a todos los buckets"""
        print("\n🔄 APLICANDO POLÍTICAS DE CICLO DE VIDA...")
        
        for bucket_name, bucket in self.buckets.items():
            if not bucket['LifecycleRules']:
                continue
            
            print(f"\n📦 Procesando bucket: {bucket_name}")
            
            for rule in bucket['LifecycleRules']:
                if rule.get('Status') != 'Enabled':
                    continue
                
                # Simular transiciones automáticas
                for transition in rule.get('Transitions', []):
                    days = transition.get('Days', 0)
                    storage_class = transition.get('StorageClass', 'STANDARD')
                    
                    print(f"   🔄 Transición a {storage_class} después de {days} días")
                    
                    # Aplicar a objetos existentes
                    if bucket_name in self.objects:
                        for key, obj in self.objects[bucket_name].items():
                            age_days = (datetime.now() - obj['LastModified']).days
                            if age_days >= days and obj['StorageClass'] != storage_class:
                                self.change_storage_class(bucket_name, key, storage_class)
    
    def get_bucket_analytics(self, bucket_name: str) -> Dict:
        """Obtener análisis del bucket"""
        if bucket_name not in self.buckets:
            return {}
        
        if bucket_name not in self.objects:
            return {
                'total_objects': 0,
                'total_size': 0,
                'storage_classes': {},
                'monthly_cost': 0
            }
        
        objects = self.objects[bucket_name].values()
        total_objects = len(objects)
        total_size = sum(obj['Size'] for obj in objects)
        
        # Agrupar por clase de almacenamiento
        storage_classes = {}
        for obj in objects:
            sc = obj['StorageClass']
            if sc not in storage_classes:
                storage_classes[sc] = {'count': 0, 'size': 0}
            storage_classes[sc]['count'] += 1
            storage_classes[sc]['size'] += obj['Size']
        
        # Calcular costo total mensual
        monthly_cost = sum(
            self._calculate_cost(obj['Size'], obj['StorageClass']) 
            for obj in objects
        )
        
        return {
            'total_objects': total_objects,
            'total_size': total_size,
            'storage_classes': storage_classes,
            'monthly_cost': monthly_cost
        }
    
    def run_demo(self):
        """Ejecutar demostración del simulador"""
        print("☁️ SIMULADOR DE AWS S3")
        print("=" * 50)
        
        # Crear buckets
        print("\n🚀 CREANDO BUCKETS...")
        self.create_bucket('mi-aplicacion-web', 'us-east-1')
        self.create_bucket('backups-empresa', 'us-west-2')
        self.create_bucket('archivos-legales', 'eu-west-1')
        
        # Subir objetos con diferentes clases
        print("\n📤 SUBIENDO OBJETOS...")
        
        # Archivos web (acceso frecuente)
        self.upload_object(
            'mi-aplicacion-web', 
            'index.html', 
            '<html><body>Mi Aplicación</body></html>',
            'STANDARD'
        )
        
        self.upload_object(
            'mi-aplicacion-web', 
            'styles.css', 
            'body { font-family: Arial; }',
            'STANDARD'
        )
        
        # Backups (acceso infrecuente)
        self.upload_object(
            'backups-empresa', 
            'backup-2024-01.zip', 
            'contenido del backup' * 1000,
            'STANDARD_IA'
        )
        
        self.upload_object(
            'backups-empresa', 
            'backup-2023-12.zip', 
            'contenido del backup' * 1000,
            'GLACIER'
        )
        
        # Archivos legales (archivo a largo plazo)
        self.upload_object(
            'archivos-legales', 
            'contrato-2020.pdf', 
            'contenido del contrato' * 500,
            'DEEP_ARCHIVE'
        )
        
        # Configurar políticas de ciclo de vida
        print("\n⚙️ CONFIGURANDO POLÍTICAS DE CICLO DE VIDA...")
        
        lifecycle_rules = [
            {
                'ID': 'TransitionToIA',
                'Status': 'Enabled',
                'Transitions': [
                    {'Days': 30, 'StorageClass': 'STANDARD_IA'},
                    {'Days': 90, 'StorageClass': 'GLACIER'},
                    {'Days': 365, 'StorageClass': 'DEEP_ARCHIVE'}
                ]
            }
        ]
        
        self.set_lifecycle_policy('mi-aplicacion-web', lifecycle_rules)
        self.set_lifecycle_policy('backups-empresa', lifecycle_rules)
        
        # Aplicar políticas
        self.apply_lifecycle_policies()
        
        # Mostrar análisis de buckets
        print("\n📊 ANÁLISIS DE BUCKETS:")
        print("-" * 50)
        
        for bucket_name in self.buckets.keys():
            analytics = self.get_bucket_analytics(bucket_name)
            print(f"\n📦 Bucket: {bucket_name}")
            print(f"   Objetos totales: {analytics['total_objects']}")
            print(f"   Tamaño total: {analytics['total_size']:,} bytes")
            print(f"   Costo mensual: ${analytics['monthly_cost']:.4f}")
            
            print("   Clases de almacenamiento:")
            for sc, info in analytics['storage_classes'].items():
                print(f"     {sc}: {info['count']} objetos, {info['size']:,} bytes")
        
        # Simular operaciones de mantenimiento
        print("\n🔧 OPERACIONES DE MANTENIMIENTO:")
        print("-" * 50)
        
        # Cambiar clase de almacenamiento
        self.change_storage_class('mi-aplicacion-web', 'index.html', 'STANDARD_IA')
        
        # Descargar objeto
        self.download_object('backups-empresa', 'backup-2023-12.zip')
        
        print("\n🎉 Demostración completada!")

# Ejecutar simulador
if __name__ == "__main__":
    simulator = S3Simulator()
    simulator.run_demo()
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Servicios de Computación**
   - EC2, Lambda, ECS, EKS
   - Auto Scaling, Load Balancing
   - Elastic Beanstalk

2. **Servicios de Almacenamiento**
   - S3, EBS, EFS, Glacier
   - Storage Gateway, DataSync
   - Backup, Disaster Recovery

3. **Servicios de Red**
   - VPC, Route 53, CloudFront
   - API Gateway, Direct Connect
   - Transit Gateway

4. **Servicios de Base de Datos**
   - RDS, DynamoDB, ElastiCache
   - Redshift, Neptune, DocumentDB
   - Aurora, Timestream

5. **Servicios de Seguridad**
   - IAM, KMS, Secrets Manager
   - CloudTrail, Config, GuardDuty
   - WAF, Shield, Cognito

### 🚀 **Proyectos Prácticos Recomendados:**

1. **Aplicación web serverless con Lambda**
2. **Sistema de backup automatizado**
3. **API REST con API Gateway y Lambda**
4. **Sitio web estático con S3 y CloudFront**
5. **Base de datos multi-región con RDS**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de AWS! ☁️**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como arquitecto de soluciones en la nube! 🎯**
