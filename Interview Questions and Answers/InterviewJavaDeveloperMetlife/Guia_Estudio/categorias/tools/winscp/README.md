# 📁 WinSCP - Guía Completa de Transferencia de Archivos

## 📋 Índice

1. [Configuración Básica](#configuración-básica)
2. [Transferencia de Archivos](#transferencia-de-archivos)
3. [Automatización](#automatización)
4. [Configuración Avanzada](#configuración-avanzada)
5. [Troubleshooting](#troubleshooting)

---

## ⚙️ Configuración Básica

### Script de Configuración WinSCP

```batch
@echo off
REM winscp_config.bat - Script de configuración de WinSCP
REM Configuración automática de sesiones WinSCP

REM Variables de configuración
set HOSTNAME=192.168.1.100
set PORT=22
set USERNAME=admin
set KEY_FILE=C:\Users\%USERNAME%\.ssh\id_rsa.ppk
set LOG_FILE=winscp_session.log

REM RESULTADO ESPERADO: Variables de configuración definidas correctamente

echo === Configurando WinSCP para %HOSTNAME% ===

REM Crear archivo de configuración INI para WinSCP
echo [Sessions\%HOSTNAME%] > winscp_config.ini
echo HostName=%HOSTNAME% >> winscp_config.ini
echo PortNumber=%PORT% >> winscp_config.ini
echo UserName=%USERNAME% >> winscp_config.ini
echo PublicKeyFile=%KEY_FILE% >> winscp_config.ini
echo LogFileName=%LOG_FILE% >> winscp_config.ini
echo LogLevel=1 >> winscp_config.ini
echo SshHostKeyFingerprint= >> winscp_config.ini
echo SshProt=3 >> winscp_config.ini
echo SshNoAuth=0 >> winscp_config.ini
echo AuthTIS=0 >> winscp_config.ini
echo AuthKI=1 >> winscp_config.ini
echo AuthGSSAPI=1 >> winscp_config.ini
echo GSSLibs=gssapi32,sspi,custom >> winscp_config.ini
echo GSSCustom= >> winscp_config.ini
echo Cipher=aes,blowfish,3des,WARN,arcfour,des >> winscp_config.ini
echo KEX=dh-gex-sha1,dh-group14-sha1,rsa,WARN,dh-group1-sha1 >> winscp_config.ini
echo RekeyTime=60 >> winscp_config.ini
echo RekeyBytes=0 >> winscp_config.ini
echo SshNoShell=0 >> winscp_config.ini
echo Compression=0 >> winscp_config.ini
echo TryAgent=1 >> winscp_config.ini
echo AgentFwd=0 >> winscp_config.ini
echo GssapiFwd=0 >> winscp_config.ini
echo ChangeUsername=0 >> winscp_config.ini
echo SshBanner=1 >> winscp_config.ini
echo Ssh2DES=0 >> winscp_config.ini
echo SshNoAuth=0 >> winscp_config.ini
echo SshProt=3 >> winscp_config.ini
echo SshHostKeyFingerprint= >> winscp_config.ini
echo SshHostKeyPolicy=2 >> winscp_config.ini
echo SshHostKeyPolicyAcceptNew=1 >> winscp_config.ini
echo SshHostKeyPolicyAcceptChanged=1 >> winscp_config.ini
echo SshHostKeyPolicyAcceptMismatch=0 >> winscp_config.ini

REM RESULTADO ESPERADO: Archivo de configuración INI creado exitosamente

echo Configuración de WinSCP creada para %HOSTNAME%
echo Archivo de configuración: winscp_config.ini
echo Log file: %LOG_FILE%

REM Función para validar conectividad
echo === Validando conectividad con %HOSTNAME% ===

REM Verificar si el host está alcanzable
ping -n 1 %HOSTNAME% >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Host %HOSTNAME% es alcanzable
    
    REM Verificar si el puerto SSH está abierto
    powershell -Command "Test-NetConnection -ComputerName %HOSTNAME% -Port %PORT%" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Puerto %PORT% está abierto en %HOSTNAME%
    ) else (
        echo ❌ Puerto %PORT% no está abierto en %HOSTNAME%
        exit /b 1
    )
) else (
    echo ❌ Host %HOSTNAME% no es alcanzable
    exit /b 1
)

REM RESULTADO ESPERADO: Conectividad validada correctamente

echo ✅ Configuración de WinSCP completada exitosamente
echo 📝 Para aplicar la configuración:
echo    1. Copiar winscp_config.ini a la carpeta de configuración de WinSCP
echo    2. Abrir WinSCP y seleccionar la sesión '%HOSTNAME%'
echo    3. Conectar con la clave SSH configurada
```

### Script de Conexión Automática

```batch
@echo off
REM winscp_auto_connect.bat - Script de conexión automática WinSCP

REM Configuración de conexión
set SESSION_NAME=production_server
set HOSTNAME=192.168.1.100
set USERNAME=admin
set LOCAL_PATH=C:\temp\upload
set REMOTE_PATH=/home/admin/uploads

REM RESULTADO ESPERADO: Variables de conexión definidas

echo 🔌 Conectando a %HOSTNAME%...

REM Crear script de comandos WinSCP
echo option batch abort > winscp_commands.txt
echo option confirm off >> winscp_commands.txt
echo open %SESSION_NAME% >> winscp_commands.txt
echo cd %REMOTE_PATH% >> winscp_commands.txt
echo put "%LOCAL_PATH%\*" >> winscp_commands.txt
echo close >> winscp_commands.txt
echo exit >> winscp_commands.txt

REM RESULTADO ESPERADO: Script de comandos creado

REM Ejecutar WinSCP con script
winscp.exe /script=winscp_commands.txt

if %errorlevel% equ 0 (
    echo ✅ Conexión y transferencia completadas exitosamente
) else (
    echo ❌ Error en la conexión o transferencia
    exit /b 1
)

REM Limpiar archivo temporal
del winscp_commands.txt

REM RESULTADO ESPERADO: Conexión automática completada
```

---

## 📁 Transferencia de Archivos

### Script de Transferencia Avanzada

```batch
@echo off
REM winscp_transfer.bat - Script de transferencia avanzada

REM Configuración
set HOSTNAME=192.168.1.100
set USERNAME=admin
set KEY_FILE=C:\Users\%USERNAME%\.ssh\id_rsa.ppk
set LOCAL_DIR=C:\backup
set REMOTE_DIR=/backup
set LOG_FILE=transfer.log

REM RESULTADO ESPERADO: Variables de transferencia definidas

echo 📁 Iniciando transferencia de archivos...

REM Función para transferir archivos con sincronización
echo option batch abort > transfer_script.txt
echo option confirm off >> transfer_script.txt
echo option transfer binary >> transfer_script.txt
echo open sftp://%USERNAME%@%HOSTNAME%/ -privatekey="%KEY_FILE%" >> transfer_script.txt
echo cd %REMOTE_DIR% >> transfer_script.txt
echo put -r "%LOCAL_DIR%\*" >> transfer_script.txt
echo close >> transfer_script.txt
echo exit >> transfer_script.txt

REM RESULTADO ESPERADO: Script de transferencia creado

REM Ejecutar transferencia
winscp.exe /script=transfer_script.txt /log=%LOG_FILE%

if %errorlevel% equ 0 (
    echo ✅ Transferencia completada exitosamente
    echo 📊 Log de transferencia: %LOG_FILE%
) else (
    echo ❌ Error en la transferencia
    echo 📋 Revisar log: %LOG_FILE%
    exit /b 1
)

REM Limpiar archivo temporal
del transfer_script.txt

REM RESULTADO ESPERADO: Transferencia de archivos completada
```

### Script de Sincronización Bidireccional

```batch
@echo off
REM winscp_sync.bat - Sincronización bidireccional

REM Configuración
set HOSTNAME=192.168.1.100
set USERNAME=admin
set LOCAL_DIR=C:\sync
set REMOTE_DIR=/sync
set SYNC_LOG=sync.log

REM RESULTADO ESPERADO: Variables de sincronización definidas

echo 🔄 Iniciando sincronización bidireccional...

REM Crear script de sincronización
echo option batch abort > sync_script.txt
echo option confirm off >> sync_script.txt
echo option transfer binary >> sync_script.txt
echo open sftp://%USERNAME%@%HOSTNAME%/ >> sync_script.txt
echo cd %REMOTE_DIR% >> sync_script.txt
echo synchronize local "%LOCAL_DIR%" >> sync_script.txt
echo close >> sync_script.txt
echo exit >> sync_script.txt

REM RESULTADO ESPERADO: Script de sincronización creado

REM Ejecutar sincronización
winscp.exe /script=sync_script.txt /log=%SYNC_LOG%

if %errorlevel% equ 0 (
    echo ✅ Sincronización completada exitosamente
    echo 📊 Log de sincronización: %SYNC_LOG%
) else (
    echo ❌ Error en la sincronización
    echo 📋 Revisar log: %SYNC_LOG%
    exit /b 1
)

REM Limpiar archivo temporal
del sync_script.txt

REM RESULTADO ESPERADO: Sincronización bidireccional completada
```

---

## 🤖 Automatización

### Script de Backup Automático

```batch
@echo off
REM winscp_backup.bat - Backup automático con WinSCP

REM Configuración de backup
set HOSTNAME=192.168.1.100
set USERNAME=admin
set REMOTE_BACKUP_DIR=/backup
set LOCAL_BACKUP_DIR=C:\backups\%date:~-4,4%%date:~-10,2%%date:~-7,2%
set BACKUP_LOG=backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.log

REM RESULTADO ESPERADO: Variables de backup definidas

echo 💾 Iniciando backup automático...

REM Crear directorio de backup local
if not exist "%LOCAL_BACKUP_DIR%" mkdir "%LOCAL_BACKUP_DIR%"

REM Crear script de backup
echo option batch abort > backup_script.txt
echo option confirm off >> backup_script.txt
echo option transfer binary >> backup_script.txt
echo open sftp://%USERNAME%@%HOSTNAME%/ >> backup_script.txt
echo cd %REMOTE_BACKUP_DIR% >> backup_script.txt
echo get -r * "%LOCAL_BACKUP_DIR%\" >> backup_script.txt
echo close >> backup_script.txt
echo exit >> backup_script.txt

REM RESULTADO ESPERADO: Script de backup creado

REM Ejecutar backup
winscp.exe /script=backup_script.txt /log=%BACKUP_LOG%

if %errorlevel% equ 0 (
    echo ✅ Backup completado exitosamente
    echo 📁 Backup guardado en: %LOCAL_BACKUP_DIR%
    echo 📊 Log de backup: %BACKUP_LOG%
    
    REM Comprimir backup
    powershell -Command "Compress-Archive -Path '%LOCAL_BACKUP_DIR%' -DestinationPath '%LOCAL_BACKUP_DIR%.zip' -Force"
    echo 📦 Backup comprimido: %LOCAL_BACKUP_DIR%.zip
) else (
    echo ❌ Error en el backup
    echo 📋 Revisar log: %BACKUP_LOG%
    exit /b 1
)

REM Limpiar archivo temporal
del backup_script.txt

REM RESULTADO ESPERADO: Backup automático completado
```

### Script de Deploy Automático

```batch
@echo off
REM winscp_deploy.bat - Deploy automático con WinSCP

REM Configuración de deploy
set HOSTNAME=192.168.1.100
set USERNAME=admin
set LOCAL_BUILD_DIR=C:\build\latest
set REMOTE_DEPLOY_DIR=/var/www/app
set DEPLOY_LOG=deploy_%date:~-4,4%%date:~-10,2%%date:~-7,2%.log

REM RESULTADO ESPERADO: Variables de deploy definidas

echo 🚀 Iniciando deploy automático...

REM Verificar que existe el directorio de build
if not exist "%LOCAL_BUILD_DIR%" (
    echo ❌ Directorio de build no encontrado: %LOCAL_BUILD_DIR%
    exit /b 1
)

REM Crear script de deploy
echo option batch abort > deploy_script.txt
echo option confirm off >> deploy_script.txt
echo option transfer binary >> deploy_script.txt
echo open sftp://%USERNAME%@%HOSTNAME%/ >> deploy_script.txt
echo cd %REMOTE_DEPLOY_DIR% >> deploy_script.txt
echo put -r "%LOCAL_BUILD_DIR%\*" >> deploy_script.txt
echo chmod 755 *.sh >> deploy_script.txt
echo chmod 644 *.php >> deploy_script.txt
echo chmod 644 *.html >> deploy_script.txt
echo chmod 644 *.css >> deploy_script.txt
echo chmod 644 *.js >> deploy_script.txt
echo close >> deploy_script.txt
echo exit >> deploy_script.txt

REM RESULTADO ESPERADO: Script de deploy creado

REM Ejecutar deploy
winscp.exe /script=deploy_script.txt /log=%DEPLOY_LOG%

if %errorlevel% equ 0 (
    echo ✅ Deploy completado exitosamente
    echo 📊 Log de deploy: %DEPLOY_LOG%
    
    REM Ejecutar comando post-deploy
    plink -i C:\Users\%USERNAME%\.ssh\id_rsa.ppk %USERNAME%@%HOSTNAME% "cd %REMOTE_DEPLOY_DIR% && ./post_deploy.sh"
    echo 🔄 Comando post-deploy ejecutado
) else (
    echo ❌ Error en el deploy
    echo 📋 Revisar log: %DEPLOY_LOG%
    exit /b 1
)

REM Limpiar archivo temporal
del deploy_script.txt

REM RESULTADO ESPERADO: Deploy automático completado
```

---

## 🔧 Configuración Avanzada

### Script de Configuración de Túneles

```batch
@echo off
REM winscp_tunnel.bat - Configuración de túneles WinSCP

REM Configuración de túnel
set LOCAL_PORT=8080
set REMOTE_HOST=internal-server
set REMOTE_PORT=80
set SSH_HOST=gateway.example.com
set USERNAME=admin

REM RESULTADO ESPERADO: Variables de túnel definidas

echo 🔗 Configurando túnel WinSCP...

REM Crear script de túnel
echo option batch abort > tunnel_script.txt
echo option confirm off >> tunnel_script.txt
echo open sftp://%USERNAME%@%SSH_HOST%/ -rawsettings LocalPort=%LOCAL_PORT%,RemoteHost=%REMOTE_HOST%,RemotePort=%REMOTE_PORT% >> tunnel_script.txt
echo cd / >> tunnel_script.txt
echo ls >> tunnel_script.txt
echo close >> tunnel_script.txt
echo exit >> tunnel_script.txt

REM RESULTADO ESPERADO: Script de túnel creado

REM Ejecutar túnel
winscp.exe /script=tunnel_script.txt

if %errorlevel% equ 0 (
    echo ✅ Túnel configurado exitosamente
    echo 🌐 Puerto local: %LOCAL_PORT%
    echo 🖥️ Servidor remoto: %REMOTE_HOST%:%REMOTE_PORT%
) else (
    echo ❌ Error configurando túnel
    exit /b 1
)

REM Limpiar archivo temporal
del tunnel_script.txt

REM RESULTADO ESPERADO: Túnel configurado correctamente
```

---

## 📊 Troubleshooting

### Script de Diagnóstico

```batch
@echo off
REM winscp_troubleshoot.bat - Diagnóstico de problemas WinSCP

REM Configuración
set HOSTNAME=192.168.1.100
set USERNAME=admin
set KEY_FILE=C:\Users\%USERNAME%\.ssh\id_rsa.ppk
set DIAGNOSTIC_LOG=winscp_diagnostic.log

REM RESULTADO ESPERADO: Variables de diagnóstico definidas

echo 🔍 Iniciando diagnóstico de WinSCP...

REM Función para diagnosticar conectividad
echo === Diagnóstico de Conectividad ===
ping -n 3 %HOSTNAME% >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Host %HOSTNAME% es alcanzable
) else (
    echo ❌ Host %HOSTNAME% no es alcanzable
)

REM Verificar puerto SSH
powershell -Command "Test-NetConnection -ComputerName %HOSTNAME% -Port 22" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Puerto SSH abierto
) else (
    echo ❌ Puerto SSH cerrado
)

REM Función para diagnosticar autenticación
echo === Diagnóstico de Autenticación ===
if exist "%KEY_FILE%" (
    echo ✅ Archivo de clave existe: %KEY_FILE%
    
    REM Verificar permisos del archivo
    powershell -Command "Get-Acl '%KEY_FILE%' | Select-Object -ExpandProperty Access" | findstr "FullControl" >nul
    if %errorlevel% equ 0 (
        echo ✅ Permisos de archivo correctos
    ) else (
        echo ❌ Permisos de archivo incorrectos
    )
) else (
    echo ❌ Archivo de clave no existe: %KEY_FILE%
)

REM Función para diagnosticar configuración WinSCP
echo === Diagnóstico de Configuración WinSCP ===
if exist "winscp_config.ini" (
    echo ✅ Archivo de configuración existe
) else (
    echo ❌ Archivo de configuración no existe
)

REM Función para generar reporte
echo === Generando Reporte de Diagnóstico ===
echo Fecha: %date% %time% > %DIAGNOSTIC_LOG%
echo Hostname: %HOSTNAME% >> %DIAGNOSTIC_LOG%
echo Usuario: %USERNAME% >> %DIAGNOSTIC_LOG%
echo Archivo de clave: %KEY_FILE% >> %DIAGNOSTIC_LOG%
echo. >> %DIAGNOSTIC_LOG%

echo ✅ Reporte de diagnóstico generado: %DIAGNOSTIC_LOG%

REM RESULTADO ESPERADO: Diagnóstico completado
```

---

## 📈 Predicciones de Resultados

### Resultados Esperados por Funcionalidad

| Funcionalidad | Resultado Esperado | Indicadores de Éxito |
|---------------|-------------------|---------------------|
| **Configuración Básica** | Sesión WinSCP configurada | Archivo INI creado, conexión establecida |
| **Transferencia de Archivos** | Archivos transferidos | Archivos en destino, sin errores |
| **Sincronización** | Directorios sincronizados | Archivos actualizados, logs limpios |
| **Backup Automático** | Backup completado | Archivos respaldados, compresión exitosa |
| **Deploy Automático** | Aplicación desplegada | Archivos en servidor, permisos correctos |
| **Túneles SSH** | Túnel activo | Puerto local escuchando, conectividad |
| **Troubleshooting** | Problemas identificados | Reporte generado, soluciones aplicadas |

### Métricas de Rendimiento

```batch
@echo off
REM winscp_metrics.bat - Métricas de rendimiento WinSCP

REM Configuración
set HOSTNAME=192.168.1.100
set USERNAME=admin
set TEST_FILE=test_100mb.dat
set METRICS_LOG=winscp_metrics.log

REM RESULTADO ESPERADO: Variables de métricas definidas

echo 📈 Generando métricas de rendimiento WinSCP...

REM Crear archivo de prueba
echo Creando archivo de prueba de 100MB...
fsutil file createnew %TEST_FILE% 104857600

REM Medir tiempo de transferencia
echo Iniciando transferencia de prueba...
set start_time=%time%

echo option batch abort > metrics_script.txt
echo option confirm off >> metrics_script.txt
echo open sftp://%USERNAME%@%HOSTNAME%/ >> metrics_script.txt
echo put %TEST_FILE% /tmp/ >> metrics_script.txt
echo close >> metrics_script.txt
echo exit >> metrics_script.txt

winscp.exe /script=metrics_script.txt

set end_time=%time%

REM Calcular duración
echo Tiempo de inicio: %start_time%
echo Tiempo de fin: %end_time%
echo Archivo transferido: %TEST_FILE%

REM Limpiar archivo de prueba
del %TEST_FILE%
del metrics_script.txt

echo ✅ Métricas de rendimiento generadas
echo 📊 Log de métricas: %METRICS_LOG%

REM RESULTADO ESPERADO: Métricas de rendimiento calculadas
```

---

## 🎯 Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es WinSCP y para qué se usa?**
   - Cliente SFTP/SCP para Windows, transferencia segura de archivos

2. **¿Cuáles son los protocolos soportados por WinSCP?**
   - SFTP, SCP, FTP, FTPS, WebDAV

3. **¿Cómo configurar una sesión en WinSCP?**
   - Hostname, puerto, usuario, autenticación, protocolo

### Preguntas Intermedias

4. **¿Cómo automatizar transferencias con WinSCP?**
   - Scripts de comandos, línea de comandos, programación

5. **¿Cómo configurar sincronización bidireccional?**
   - Comando synchronize, configuración de directorios

6. **¿Cómo manejar archivos grandes con WinSCP?**
   - Transferencia binaria, compresión, resumen de transferencias

### Preguntas Avanzadas

7. **¿Cómo configurar túneles SSH con WinSCP?**
   - Configuración de proxy, túneles locales y dinámicos

8. **¿Cómo optimizar el rendimiento de WinSCP?**
   - Configuración de buffer, compresión, algoritmos de cifrado

9. **¿Cómo integrar WinSCP en pipelines de CI/CD?**
   - Scripts de deploy, automatización de builds, monitoreo

---

**¡Dominar WinSCP te hará un experto en transferencia segura de archivos! 🚀** 