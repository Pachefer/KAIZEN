# 🖥️ PuTTY - Guía Básica para Principiantes

## 📋 Índice

1. [¿Qué es PuTTY?](#qué-es-putty)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Primera Conexión SSH](#primera-conexión-ssh)
4. [Comandos Básicos](#comandos-básicos)
5. [Configuración de Sesiones](#configuración-de-sesiones)

---

## 🤔 ¿Qué es PuTTY?

### Definición Simple
PuTTY es un cliente SSH y Telnet gratuito para Windows que te permite conectarte a servidores remotos de forma segura.

**¿Para qué se usa?**
- **Conexión remota**: Acceder a servidores Linux/Unix desde Windows
- **Administración**: Gestionar servidores web, bases de datos, etc.
- **Transferencia de archivos**: Enviar y recibir archivos de forma segura
- **Ejecución de comandos**: Ejecutar comandos en servidores remotos

### Analogía Simple
Imagina PuTTY como una **llave digital** que te permite:
- **Abrir la puerta** de un servidor remoto (conexión SSH)
- **Acceder a las habitaciones** (directorios del servidor)
- **Mover cosas** (transferir archivos)
- **Dar instrucciones** (ejecutar comandos)

---

## 🔧 Instalación y Configuración

### 1. Descarga e Instalación

**Paso 1: Descargar PuTTY**
1. Ve a [putty.org](https://www.putty.org/)
2. Descarga la versión más reciente para Windows
3. Ejecuta el instalador y sigue las instrucciones

**Paso 2: Verificar la instalación**
- Busca "PuTTY" en el menú de inicio
- Deberías ver varios programas:
  - `PuTTY` - Cliente SSH principal
  - `PSCP` - Transferencia de archivos
  - `PLINK` - Línea de comandos
  - `Pageant` - Gestor de claves SSH

### 2. Configuración Básica

**Configuración de sesión:**
```
Host Name (or IP address): 192.168.1.100
Port: 22
Connection type: SSH
```

**Configuración de terminal:**
```
Terminal type: xterm
Backspace key: Control-H
```

**Configuración de ventana:**
```
Lines of scrollback: 2000
Columns: 80
Rows: 24
```

---

## 🔌 Primera Conexión SSH

### 1. Conexión Básica

**Paso 1: Abrir PuTTY**
1. Ejecuta PuTTY desde el menú de inicio
2. En el campo "Host Name", escribe la IP del servidor
3. Asegúrate de que el puerto sea 22
4. Selecciona "SSH" como tipo de conexión

**Paso 2: Conectar**
1. Haz clic en "Open"
2. Aparecerá una ventana de terminal
3. Si es la primera vez, verás una advertencia de seguridad
4. Haz clic en "Accept" para continuar

**Paso 3: Autenticación**
```
login as: tu_usuario
tu_usuario@servidor's password: tu_contraseña
```

### 2. Ejemplo de Conexión

```bash
# Ejemplo de conexión a un servidor
$ ssh usuario@192.168.1.100
# O usando PuTTY con la misma información

# Después de conectar:
usuario@servidor:~$ whoami
usuario

usuario@servidor:~$ pwd
/home/usuario

usuario@servidor:~$ ls -la
total 32
drwxr-xr-x 2 usuario usuario 4096 Jan 15 10:30 .
drwxr-xr-x 3 root    root    4096 Jan 15 10:00 ..
-rw-r--r-- 1 usuario usuario  220 Jan 15 10:00 .bash_logout
-rw-r--r-- 1 usuario usuario 3771 Jan 15 10:00 .bashrc
-rw-r--r-- 1 usuario usuario  807 Jan 15 10:00 .profile
```

---

## 💻 Comandos Básicos

### 1. Navegación de Directorios

```bash
# Ver directorio actual
pwd

# Listar archivos y directorios
ls
ls -la          # Lista detallada con archivos ocultos
ls -lh          # Lista con tamaños legibles

# Cambiar directorio
cd /home/usuario
cd ..           # Subir un nivel
cd ~            # Ir al directorio home
cd /            # Ir al directorio raíz

# Ver contenido de archivos
cat archivo.txt
less archivo.txt    # Ver archivo página por página
head archivo.txt    # Ver primeras 10 líneas
tail archivo.txt    # Ver últimas 10 líneas
```

### 2. Gestión de Archivos

```bash
# Crear directorio
mkdir nuevo_directorio

# Crear archivo vacío
touch archivo.txt

# Copiar archivos
cp archivo_origen.txt archivo_destino.txt
cp -r directorio_origen/ directorio_destino/

# Mover/renombrar archivos
mv archivo_antiguo.txt archivo_nuevo.txt
mv archivo.txt /ruta/destino/

# Eliminar archivos
rm archivo.txt
rm -r directorio/    # Eliminar directorio y contenido

# Ver permisos
ls -la archivo.txt
chmod 755 archivo.txt    # Cambiar permisos
```

### 3. Información del Sistema

```bash
# Información del sistema
uname -a
cat /etc/os-release

# Información de memoria
free -h
top

# Información de disco
df -h
du -sh directorio/

# Información de red
ifconfig
ip addr
netstat -tuln

# Procesos en ejecución
ps aux
ps aux | grep proceso
```

### 4. Gestión de Usuarios

```bash
# Ver usuario actual
whoami
id

# Ver usuarios conectados
who
w

# Cambiar contraseña
passwd

# Ver historial de comandos
history
history | grep comando
```

---

## ⚙️ Configuración de Sesiones

### 1. Guardar Configuración de Sesión

**Paso 1: Configurar sesión**
1. Abre PuTTY
2. En "Host Name", escribe la IP del servidor
3. En "Port", escribe 22
4. Selecciona "SSH"
5. Ve a "Window" → "Appearance"
6. Cambia "Font" a "Consolas" y tamaño 12

**Paso 2: Guardar sesión**
1. En "Session", escribe un nombre para la sesión
2. Haz clic en "Save"
3. La sesión aparecerá en la lista

**Paso 3: Cargar sesión**
1. Selecciona la sesión guardada
2. Haz clic en "Load"
3. Haz clic en "Open"

### 2. Configuración Avanzada

**Configuración de colores:**
```
Window → Colours
- Default Foreground: RGB(187,187,187)
- Default Background: RGB(0,0,0)
- Cursor Text: RGB(0,0,0)
- Cursor Colour: RGB(255,255,255)
```

**Configuración de teclas:**
```
Terminal → Keyboard
- Backspace key: Control-H
- Home and End keys: Standard
- Function keys and keypad: Xterm R6
```

**Configuración de conexión:**
```
Connection → Data
- Auto-login username: tu_usuario

Connection → SSH → Auth
- Private key file for authentication: ruta/a/tu/clave.ppk
```

---

## 🔐 Autenticación por Clave SSH

### 1. Generar Clave SSH

**Usando PuTTYgen:**
1. Abre PuTTYgen
2. Haz clic en "Generate"
3. Mueve el mouse para generar aleatoriedad
4. Escribe un comentario (ej: "Mi clave SSH")
5. Haz clic en "Save private key"
6. Guarda la clave privada (.ppk)
7. Copia la clave pública

### 2. Configurar Clave en Servidor

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

### 3. Configurar PuTTY

**Paso 1: Cargar clave privada**
1. Abre PuTTY
2. Ve a Connection → SSH → Auth → Credentials
3. Haz clic en "Browse"
4. Selecciona tu archivo .ppk

**Paso 2: Guardar configuración**
1. Regresa a Session
2. Guarda la configuración
3. Ahora puedes conectar sin contraseña

---

## 📁 Transferencia de Archivos con PSCP

### 1. Instalación de PSCP

PSCP viene incluido con PuTTY. Puedes usarlo desde la línea de comandos.

### 2. Comandos Básicos

```bash
# Copiar archivo local a servidor
pscp archivo_local.txt usuario@servidor:/ruta/destino/

# Copiar archivo del servidor a local
pscp usuario@servidor:/ruta/archivo.txt archivo_local.txt

# Copiar directorio completo
pscp -r directorio_local/ usuario@servidor:/ruta/destino/

# Usar clave privada
pscp -i clave.ppk archivo.txt usuario@servidor:/destino/
```

### 3. Ejemplos Prácticos

```bash
# Subir archivo de configuración
pscp config.txt admin@192.168.1.100:/etc/config/

# Descargar log del servidor
pscp admin@192.168.1.100:/var/log/apache2/access.log ./logs/

# Subir directorio de proyecto
pscp -r mi_proyecto/ developer@192.168.1.100:/home/developer/projects/
```

---

## 🛠️ Solución de Problemas Comunes

### 1. Error de Conexión

**Problema: "Connection refused"**
```
Solución:
1. Verificar que el servidor esté encendido
2. Verificar que SSH esté instalado y ejecutándose
3. Verificar que el puerto 22 esté abierto
4. Verificar la IP del servidor
```

**Problema: "Network error: Connection timed out"**
```
Solución:
1. Verificar conectividad de red
2. Verificar firewall
3. Verificar que el servidor sea accesible
4. Probar con ping
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

### 3. Problemas de Rendimiento

**Problema: Conexión lenta**
```
Solución:
1. Habilitar compresión SSH
2. Usar conexión persistente
3. Optimizar configuración de red
4. Verificar ancho de banda
```

---

## 📚 Recursos para Aprender Más

### Herramientas Relacionadas:
- **WinSCP** - Cliente gráfico para transferencia de archivos
- **MobaXterm** - Cliente SSH todo en uno
- **Git Bash** - Terminal con comandos Unix para Windows

### Documentación:
- [Manual oficial de PuTTY](https://the.earth.li/~sgtatham/putty/0.76/htmldoc/)
- [Guía de PuTTYgen](https://the.earth.li/~sgtatham/putty/0.76/htmldoc/Chapter8.html)

### Comandos SSH Avanzados:
```bash
# Conexión con puerto específico
ssh -p 2222 usuario@servidor

# Conexión con compresión
ssh -C usuario@servidor

# Conexión con verbose (debug)
ssh -v usuario@servidor

# Ejecutar comando remoto
ssh usuario@servidor "comando"
```

---

## 🎯 Checklist de Nivel Básico

### Conceptos que debes entender:
- [ ] ¿Qué es PuTTY y para qué se usa?
- [ ] Diferencia entre SSH y Telnet
- [ ] Concepto de cliente y servidor SSH
- [ ] Autenticación por contraseña vs clave
- [ ] Configuración básica de sesiones
- [ ] Comandos básicos de Linux/Unix
- [ ] Transferencia de archivos con PSCP

### Habilidades prácticas:
- [ ] Instalar y configurar PuTTY
- [ ] Conectar a un servidor SSH
- [ ] Navegar por directorios remotos
- [ ] Ejecutar comandos básicos
- [ ] Transferir archivos con PSCP
- [ ] Configurar autenticación por clave
- [ ] Guardar y cargar sesiones
- [ ] Solucionar problemas de conexión

---

**¡Con estos conceptos básicos ya puedes empezar a usar PuTTY de forma efectiva! 🚀** 