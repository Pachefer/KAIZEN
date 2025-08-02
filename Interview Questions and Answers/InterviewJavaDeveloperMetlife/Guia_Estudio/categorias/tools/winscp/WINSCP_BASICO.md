# 📁 WinSCP - Guía Básica para Principiantes

## 📋 Índice

1. [¿Qué es WinSCP?](#qué-es-winscp)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Primera Conexión](#primera-conexión)
4. [Interfaz Básica](#interfaz-básica)
5. [Transferencia de Archivos](#transferencia-de-archivos)

---

## 🤔 ¿Qué es WinSCP?

### Definición Simple
WinSCP es un cliente gráfico gratuito para Windows que te permite transferir archivos entre tu computadora y servidores remotos de forma segura usando protocolos como SFTP, SCP, FTP y WebDAV.

**¿Para qué se usa?**
- **Transferencia segura**: Enviar y recibir archivos de forma encriptada
- **Sincronización**: Mantener archivos sincronizados entre local y remoto
- **Administración**: Gestionar archivos en servidores web, bases de datos, etc.
- **Backup**: Hacer copias de seguridad de archivos remotos

### Analogía Simple
Imagina WinSCP como un **gestor de archivos especial** que:
- **Conecta dos computadoras** como si estuvieran en la misma red
- **Muestra archivos** de ambas computadoras lado a lado
- **Permite arrastrar y soltar** archivos entre ellas
- **Mantiene todo seguro** con encriptación

---

## 🔧 Instalación y Configuración

### 1. Descarga e Instalación

**Paso 1: Descargar WinSCP**
1. Ve a [winscp.net](https://winscp.net/)
2. Descarga la versión más reciente para Windows
3. Ejecuta el instalador y sigue las instrucciones

**Paso 2: Verificar la instalación**
- Busca "WinSCP" en el menú de inicio
- Deberías ver el icono de WinSCP
- Al abrirlo, verás la ventana de inicio de sesión

### 2. Configuración Inicial

**Configuración de sesión básica:**
```
File protocol: SFTP
Host name: 192.168.1.100
Port number: 22
User name: tu_usuario
Password: tu_contraseña
```

**Configuración de interfaz:**
```
Interface: Commander (recomendado para principiantes)
- Panel izquierdo: Archivos locales
- Panel derecho: Archivos remotos
```

---

## 🔌 Primera Conexión

### 1. Crear Nueva Sesión

**Paso 1: Abrir WinSCP**
1. Ejecuta WinSCP desde el menú de inicio
2. Verás la ventana de inicio de sesión

**Paso 2: Configurar conexión**
1. En "File protocol", selecciona "SFTP"
2. En "Host name", escribe la IP del servidor
3. En "Port number", escribe 22
4. En "User name", escribe tu usuario
5. En "Password", escribe tu contraseña

**Paso 3: Conectar**
1. Haz clic en "Login"
2. Si es la primera vez, verás una advertencia de seguridad
3. Haz clic en "Yes" para continuar
4. Se abrirá la interfaz principal

### 2. Interfaz Principal

```
┌─────────────────────────────────────────────────────────┐
│ WinSCP - [nombre_del_servidor]                         │
├─────────────────────────────────────────────────────────┤
│ Panel Local (izquierda)    │ Panel Remoto (derecha)    │
│                            │                            │
│ C:\Users\Usuario\          │ /home/usuario/             │
│ ├── Desktop\               │ ├── Documents/             │
│ ├── Documents\             │ ├── Downloads/             │
│ ├── Downloads\             │ └── Pictures/              │
│ └── Pictures\              │                            │
│                            │                            │
│ Barra de herramientas:     │ Barra de herramientas:     │
│ [↑] [↓] [↔] [↻] [×]       │ [↑] [↓] [↔] [↻] [×]       │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ Interfaz Básica

### 1. Paneles de Archivos

**Panel Local (izquierda):**
- Muestra archivos de tu computadora
- Navega por carpetas como en el Explorador de Windows
- Puedes crear, renombrar y eliminar archivos

**Panel Remoto (derecha):**
- Muestra archivos del servidor
- Navega por la estructura de directorios del servidor
- Puedes gestionar archivos remotos

### 2. Barra de Herramientas

**Botones principales:**
- **↑** - Subir archivo (local → remoto)
- **↓** - Descargar archivo (remoto → local)
- **↔** - Sincronizar directorios
- **↻** - Actualizar vista
- **×** - Cerrar conexión

### 3. Barra de Estado

**Información mostrada:**
- Estado de la conexión
- Progreso de transferencias
- Mensajes de error o éxito
- Tiempo de conexión

---

## 📁 Transferencia de Archivos

### 1. Transferencia Básica

**Subir archivo (local → remoto):**
1. En el panel izquierdo, navega hasta el archivo
2. Arrastra el archivo al panel derecho
3. O selecciona el archivo y haz clic en ↑
4. Confirma la transferencia

**Descargar archivo (remoto → local):**
1. En el panel derecho, navega hasta el archivo
2. Arrastra el archivo al panel izquierdo
3. O selecciona el archivo y haz clic en ↓
4. Confirma la transferencia

### 2. Transferencia de Múltiples Archivos

**Seleccionar múltiples archivos:**
- **Ctrl + clic**: Seleccionar archivos individuales
- **Shift + clic**: Seleccionar rango de archivos
- **Ctrl + A**: Seleccionar todos los archivos

**Transferir selección:**
1. Selecciona los archivos deseados
2. Arrastra la selección al otro panel
3. Confirma la transferencia

### 3. Transferencia de Carpetas

**Subir carpeta completa:**
1. Navega hasta la carpeta en el panel local
2. Arrastra la carpeta al panel remoto
3. WinSCP transferirá toda la carpeta y su contenido

**Descargar carpeta completa:**
1. Navega hasta la carpeta en el panel remoto
2. Arrastra la carpeta al panel local
3. Se descargará toda la carpeta y su contenido

---

## ⚙️ Configuración de Sesiones

### 1. Guardar Sesión

**Paso 1: Configurar sesión**
1. En la ventana de inicio de sesión, configura la conexión
2. Haz clic en "Save"
3. Escribe un nombre para la sesión
4. Haz clic en "OK"

**Paso 2: Cargar sesión**
1. En la lista de sesiones, selecciona la guardada
2. Haz clic en "Login"
3. Se conectará automáticamente

### 2. Configuración Avanzada

**Configuración de transferencia:**
```
Preferences → Transfer
- Transfer mode: Binary (para archivos binarios)
- Preserve timestamp: Yes
- Transfer resume: Yes
```

**Configuración de seguridad:**
```
Preferences → Security
- Store password: No (más seguro)
- Use master password: Yes
```

**Configuración de interfaz:**
```
Preferences → Interface
- Interface: Commander
- Show hidden files: Yes
- Show file extensions: Yes
```

---

## 🔐 Autenticación por Clave

### 1. Generar Clave SSH

**Usando PuTTYgen:**
1. Abre PuTTYgen
2. Haz clic en "Generate"
3. Mueve el mouse para generar aleatoriedad
4. Escribe un comentario
5. Haz clic en "Save private key"
6. Guarda la clave privada (.ppk)

### 2. Configurar Clave en WinSCP

**Paso 1: Cargar clave**
1. En la ventana de inicio de sesión
2. Haz clic en "Advanced"
3. Ve a "SSH" → "Authentication"
4. En "Private key file", haz clic en "Browse"
5. Selecciona tu archivo .ppk

**Paso 2: Guardar configuración**
1. Regresa a la ventana principal
2. Guarda la sesión
3. Ahora puedes conectar sin contraseña

### 3. Configurar Clave en Servidor

```bash
# En el servidor, crear directorio .ssh
mkdir ~/.ssh
chmod 700 ~/.ssh

# Crear archivo authorized_keys
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Agregar clave pública
echo "tu_clave_publica_aqui" >> ~/.ssh/authorized_keys
```

---

## 🔄 Sincronización de Directorios

### 1. Sincronización Manual

**Paso 1: Abrir sincronización**
1. Navega al directorio que quieres sincronizar
2. Haz clic en el botón ↔ (Sincronizar)
3. Se abrirá la ventana de sincronización

**Paso 2: Configurar sincronización**
```
Direction: Both (bidireccional)
- Local → Remote: Subir archivos nuevos/modificados
- Remote → Local: Descargar archivos nuevos/modificados
- Both: Sincronizar en ambas direcciones
```

**Paso 3: Ejecutar sincronización**
1. Revisa los archivos que se van a sincronizar
2. Haz clic en "OK"
3. Confirma cada transferencia

### 2. Sincronización Automática

**Configurar sincronización automática:**
1. En la ventana de sincronización
2. Marca "Synchronize on startup"
3. Marca "Synchronize on disconnect"
4. Guarda la configuración

---

## 📋 Gestión de Archivos

### 1. Operaciones Básicas

**Crear carpeta:**
1. Haz clic derecho en el panel
2. Selecciona "New" → "Directory"
3. Escribe el nombre de la carpeta

**Renombrar archivo:**
1. Selecciona el archivo
2. Haz clic derecho → "Rename"
3. Escribe el nuevo nombre

**Eliminar archivo:**
1. Selecciona el archivo
2. Haz clic derecho → "Delete"
3. Confirma la eliminación

### 2. Permisos de Archivos

**Ver permisos:**
1. Selecciona el archivo
2. Haz clic derecho → "Properties"
3. Ve a la pestaña "Permissions"

**Cambiar permisos:**
1. En Properties → Permissions
2. Marca/desmarca los permisos deseados:
   - Read (lectura)
   - Write (escritura)
   - Execute (ejecución)
3. Haz clic en "OK"

### 3. Edición de Archivos

**Editar archivo remoto:**
1. Selecciona el archivo
2. Haz clic derecho → "Edit"
3. Se abrirá en el editor configurado
4. Guarda los cambios

**Configurar editor:**
```
Preferences → Editors
- External editor: Notepad++ (o tu editor preferido)
- Internal editor: Built-in editor
```

---

## 🛠️ Solución de Problemas Comunes

### 1. Error de Conexión

**Problema: "Connection failed"**
```
Solución:
1. Verificar que el servidor esté encendido
2. Verificar que SSH esté instalado y ejecutándose
3. Verificar que el puerto 22 esté abierto
4. Verificar la IP del servidor
5. Probar con ping
```

**Problema: "Connection timed out"**
```
Solución:
1. Verificar conectividad de red
2. Verificar firewall
3. Verificar que el servidor sea accesible
4. Probar con otro cliente SSH
```

### 2. Error de Autenticación

**Problema: "Access denied"**
```
Solución:
1. Verificar usuario y contraseña
2. Verificar que el usuario tenga permisos SSH
3. Verificar configuración de clave SSH
4. Verificar archivo authorized_keys
```

**Problema: "Server refused our key"**
```
Solución:
1. Verificar formato de clave pública
2. Verificar permisos de ~/.ssh/authorized_keys
3. Verificar configuración SSH del servidor
4. Regenerar clave SSH
```

### 3. Problemas de Transferencia

**Problema: "Transfer failed"**
```
Solución:
1. Verificar espacio en disco
2. Verificar permisos de escritura
3. Verificar que el archivo no esté en uso
4. Probar con archivo más pequeño
```

**Problema: "Permission denied"**
```
Solución:
1. Verificar permisos del directorio destino
2. Verificar permisos del usuario
3. Usar sudo si es necesario
4. Cambiar permisos del archivo
```

---

## 📚 Recursos para Aprender Más

### Herramientas Relacionadas:
- **PuTTY** - Cliente SSH para línea de comandos
- **FileZilla** - Cliente FTP/SFTP alternativo
- **MobaXterm** - Cliente todo en uno

### Documentación:
- [Manual oficial de WinSCP](https://winscp.net/eng/docs/start)
- [Guía de scripting](https://winscp.net/eng/docs/scripting)

### Comandos SFTP Avanzados:
```bash
# Conectar via línea de comandos
sftp usuario@servidor

# Comandos SFTP básicos
sftp> ls                    # Listar archivos
sftp> cd directorio         # Cambiar directorio
sftp> put archivo           # Subir archivo
sftp> get archivo           # Descargar archivo
sftp> mkdir directorio      # Crear directorio
sftp> rm archivo            # Eliminar archivo
sftp> bye                   # Salir
```

---

## 🎯 Checklist de Nivel Básico

### Conceptos que debes entender:
- [ ] ¿Qué es WinSCP y para qué se usa?
- [ ] Diferencia entre SFTP, SCP y FTP
- [ ] Concepto de cliente y servidor SFTP
- [ ] Autenticación por contraseña vs clave
- [ ] Configuración básica de sesiones
- [ ] Interfaz Commander vs Explorer
- [ ] Transferencia de archivos y carpetas

### Habilidades prácticas:
- [ ] Instalar y configurar WinSCP
- [ ] Conectar a un servidor SFTP
- [ ] Navegar por archivos remotos
- [ ] Transferir archivos individuales
- [ ] Transferir múltiples archivos
- [ ] Transferir carpetas completas
- [ ] Configurar autenticación por clave
- [ ] Guardar y cargar sesiones
- [ ] Sincronizar directorios
- [ ] Gestionar permisos de archivos
- [ ] Solucionar problemas de conexión

---

**¡Con estos conceptos básicos ya puedes empezar a usar WinSCP de forma efectiva! 🚀** 