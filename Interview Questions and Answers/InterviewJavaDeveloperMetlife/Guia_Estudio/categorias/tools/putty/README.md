# 🖥️ PuTTY - Guía Completa de Herramienta SSH

## 📋 Índice

1. [Configuración Básica](#configuración-básica)
2. [Conexiones SSH](#conexiones-ssh)
3. [Configuración Avanzada](#configuración-avanzada)
4. [Scripts y Automatización](#scripts-y-automatización)
5. [Troubleshooting](#troubleshooting)

---

## ⚙️ Configuración Básica

### Configuración de Sesión SSH

```bash
# putty_config.sh - Script de configuración de PuTTY
#!/bin/bash

# Variables de configuración
HOSTNAME="192.168.1.100"           # Dirección IP del servidor objetivo
PORT="22"                          # Puerto SSH estándar
USERNAME="admin"                   # Usuario para conexión
KEY_FILE="~/.ssh/id_rsa"          # Archivo de clave privada
LOG_FILE="putty_session.log"       # Archivo de log de sesión

# RESULTADO ESPERADO: Variables de configuración definidas correctamente

# Función para crear configuración de PuTTY
create_putty_config() {
    echo "=== Configurando PuTTY para $HOSTNAME ==="
    
    # Crear archivo de configuración PuTTY (.reg)
    cat > putty_config.reg << EOF
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\SimonTatham\PuTTY\Sessions\$HOSTNAME]
"HostName"="$HOSTNAME"
"PortNumber"=dword:00000016
"ConnectionType"=dword:00000000
"CloseOnExit"=dword:00000001
"WarnOnClose"=dword:00000001
"PingInterval"=dword:00000000
"PingIntervalSecs"=dword:00000000
"TCPNoDelay"=dword:00000001
"TCPKeepalives"=dword:00000001
"TerminalType"="xterm"
"TerminalSpeed"="38400,38400"
"TerminalModes"="CS7=A,CS8=A,DISCARD=A,DSUSP=A,ECHO=A,ECHOCTL=A,ECHOE=A,ECHOK=A,ECHOKE=A,ECHONL=A,EOF=A,EOL=A,EOL2=A,ERASE=A,FLUSH=A,FORW1=A,FORW2=A,ICANON=A,ICRNL=A,IEXTEN=A,IGNCR=A,IGNPAR=A,IMAXBEL=A,INLCR=A,INPCK=A,ISIG=A,ISTRIP=A,IUCLC=A,IUTF8=A,IXANY=A,IXOFF=A,IXON=A,KILL=A,LNEXT=A,NOFLSH=A,OCRNL=A,OLCUC=A,ONLCR=A,ONLRET=A,ONOCR=A,OPOST=A,PARENB=A,PARMRK=A,PARODD=A,PENDIN=A,QUIT=A,REPRINT=A,START=A,STOP=A,SUSP=A,SWTCH=A,TOSTOP=A,WERASE=A,XCASE=A"
"AddressFamily"=dword:00000000
"ProxyExcludeList"=""
"ProxyDNS"=dword:00000001
"ProxyLocalhost"=dword:00000000
"ProxyMethod"=dword:00000000
"ProxyHost"="proxy"
"ProxyPort"=dword:00000050
"ProxyUsername"=""
"ProxyPassword"=""
"ProxyTelnetCommand"="connect %host %port\\n"
"Environment"=""
"UserName"="$USERNAME"
"LocalUserName"=""
"NoPTY"=dword:00000000
"Compression"=dword:00000000
"TryAgent"=dword:00000001
"AgentFwd"=dword:00000000
"GssapiFwd"=dword:00000000
"ChangeUsername"=dword:00000000
"Cipher"="aes,blowfish,3des,WARN,arcfour,des"
"KEX"="dh-gex-sha1,dh-group14-sha1,rsa,WARN,dh-group1-sha1"
"RekeyTime"=dword:0000003c
"RekeyBytes"=dword:00000000
"SshNoAuth"=dword:00000000
"SshBanner"=dword:00000001
"AuthTIS"=dword:00000000
"AuthKI"=dword:00000001
"AuthGSSAPI"=dword:00000001
"GSSLibs"="gssapi32,sspi,custom"
"GSSCustom"=""
"SshNoShell"=dword:00000000
"SshProt"=dword:00000003
"LogHost"=""
"SSH2DES"=dword:00000000
"PublicKeyFile"="$KEY_FILE"
"RemoteCommand"=""
"RFCEnviron"=dword:00000000
"PassiveTelnet"=dword:00000000
"BackspaceIsDelete"=dword:00000001
"RXVTHomeEnd"=dword:00000000
"LinuxFunctionKeys"=dword:00000000
"NoApplicationKeys"=dword:00000000
"NoApplicationCursors"=dword:00000000
"NoMouseReporting"=dword:00000000
"NoRemoteResize"=dword:00000000
"NoAltScreen"=dword:00000000
"NoRemoteWinTitle"=dword:00000000
"NoRemoteClearScroll"=dword:00000000
"RemoteQTitleAction"=dword:00000001
"NoDBackspace"=dword:00000000
"NoRemoteCharset"=dword:00000000
"ApplicationCursorKeys"=dword:00000000
"ApplicationKeypad"=dword:00000000
"NetHackKeypad"=dword:00000000
"AltF4"=dword:00000001
"AltSpace"=dword:00000000
"AltOnly"=dword:00000000
"ComposeKey"=dword:00000000
"CtrlAltKeys"=dword:00000001
"TelnetKey"=dword:00000000
"TelnetRet"=dword:00000001
"LocalEcho"=dword:00000002
"LocalEdit"=dword:00000002
"Answerback"="PuTTY"
"AlwaysOnTop"=dword:00000000
"FullScreenOnAltEnter"=dword:00000000
"HideMousePtr"=dword:00000000
"SunkenEdge"=dword:00000000
"WindowBorder"=dword:00000001
"CurType"=dword:00000000
"BlinkCur"=dword:00000000
"Beep"=dword:00000001
"BeepInd"=dword:00000000
"BellOverload"=dword:00000001
"BellOverloadN"=dword:00000005
"BellOverloadT"=dword:000007d0
"BellOverloadS"=dword:00001388
"ScrollbackLines"=dword:00002000
"DECOriginMode"=dword:00000000
"AutoWrapMode"=dword:00000001
"LFImpliesCR"=dword:00000000
"CRImpliesLF"=dword:00000000
"DisableArabicShaping"=dword:00000000
"DisableBidi"=dword:00000000
"WinNameAlways"=dword:00000001
"WinTitle"=""
"TermWidth"=dword:00000050
"TermHeight"=dword:00000018
"Font"="Consolas"
"FontIsBold"=dword:00000000
"FontCharSet"=dword:00000000
"FontHeight"=dword:0000000e
"FontQuality"=dword:00000000
"FontVTMode"=dword:00000004
"UseSystemColours"=dword:00000000
"TryPalette"=dword:00000000
"ANSIColour"=dword:00000001
"Xterm256Colour"=dword:00000001
"BoldAsColour"=dword:00000001
"BoldAsFont"=dword:00000000
"LogType"=dword:00000000
"LogFileName"="$LOG_FILE"
"LogFlush"=dword:00000001
"SSHLogOmitPasswords"=dword:00000001
"SSHLogOmitData"=dword:00000000
"ProxyLogToTerm"=dword:00000001
EOF

    # RESULTADO ESPERADO: Archivo de configuración PuTTY creado exitosamente
    
    echo "Configuración de PuTTY creada para $HOSTNAME"
    echo "Archivo de configuración: putty_config.reg"
    echo "Log file: $LOG_FILE"
}

# Función para validar conectividad
validate_connectivity() {
    echo "=== Validando conectividad con $HOSTNAME ==="
    
    # Verificar si el host está alcanzable
    if ping -c 1 $HOSTNAME > /dev/null 2>&1; then
        echo "✅ Host $HOSTNAME es alcanzable"
        
        # Verificar si el puerto SSH está abierto
        if nc -z $HOSTNAME $PORT 2>/dev/null; then
            echo "✅ Puerto $PORT está abierto en $HOSTNAME"
            return 0
        else
            echo "❌ Puerto $PORT no está abierto en $HOSTNAME"
            return 1
        fi
    else
        echo "❌ Host $HOSTNAME no es alcanzable"
        return 1
    fi
}

# Función para generar clave SSH
generate_ssh_key() {
    echo "=== Generando clave SSH ==="
    
    # Verificar si ya existe la clave
    if [ -f "$KEY_FILE" ]; then
        echo "✅ Clave SSH ya existe en $KEY_FILE"
        return 0
    fi
    
    # Crear directorio .ssh si no existe
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    
    # Generar clave SSH RSA
    ssh-keygen -t rsa -b 4096 -f $KEY_FILE -N "" -C "$USERNAME@$HOSTNAME"
    
    if [ $? -eq 0 ]; then
        echo "✅ Clave SSH generada exitosamente"
        echo "Clave pública: ${KEY_FILE}.pub"
        echo "Clave privada: $KEY_FILE"
        
        # Establecer permisos correctos
        chmod 600 $KEY_FILE
        chmod 644 ${KEY_FILE}.pub
        
        return 0
    else
        echo "❌ Error generando clave SSH"
        return 1
    fi
}

# Función principal
main() {
    echo "🚀 Iniciando configuración de PuTTY"
    
    # Validar conectividad
    if ! validate_connectivity; then
        echo "❌ No se puede conectar al servidor. Verificar configuración de red."
        exit 1
    fi
    
    # Generar clave SSH si es necesario
    if ! generate_ssh_key; then
        echo "❌ Error en la generación de clave SSH"
        exit 1
    fi
    
    # Crear configuración de PuTTY
    create_putty_config
    
    echo "✅ Configuración de PuTTY completada exitosamente"
    echo "📝 Para aplicar la configuración:"
    echo "   1. Ejecutar: regedit putty_config.reg"
    echo "   2. Abrir PuTTY y seleccionar la sesión '$HOSTNAME'"
    echo "   3. Conectar con la clave SSH generada"
}

# Ejecutar función principal
main "$@"
```

### Script de Conexión Automática

```bash
# putty_auto_connect.sh - Script de conexión automática
#!/bin/bash

# Configuración de conexión
SESSION_NAME="production_server"    # Nombre de la sesión PuTTY
HOSTNAME="192.168.1.100"           # IP del servidor
USERNAME="admin"                   # Usuario
COMMAND="uptime && who"            # Comando a ejecutar

# RESULTADO ESPERADO: Variables de conexión definidas

# Función para conectar y ejecutar comando
connect_and_execute() {
    echo "🔌 Conectando a $HOSTNAME..."
    
    # Crear script temporal para PuTTY
    cat > temp_script.txt << EOF
$USERNAME
$COMMAND
exit
EOF
    
    # RESULTADO ESPERADO: Script temporal creado
    
    # Ejecutar PuTTY con script
    putty -load "$SESSION_NAME" -m temp_script.txt
    
    # Limpiar archivo temporal
    rm -f temp_script.txt
    
    echo "✅ Conexión completada"
}

# Función para transferir archivo
transfer_file() {
    local local_file="$1"
    local remote_path="$2"
    
    echo "📁 Transfiriendo $local_file a $remote_path"
    
    # Usar pscp para transferir archivo
    pscp -i ~/.ssh/id_rsa "$local_file" "$USERNAME@$HOSTNAME:$remote_path"
    
    if [ $? -eq 0 ]; then
        echo "✅ Archivo transferido exitosamente"
    else
        echo "❌ Error en la transferencia"
    fi
}

# Función para ejecutar comando remoto
execute_remote_command() {
    local command="$1"
    
    echo "⚡ Ejecutando comando remoto: $command"
    
    # Usar plink para ejecutar comando
    plink -i ~/.ssh/id_rsa "$USERNAME@$HOSTNAME" "$command"
    
    if [ $? -eq 0 ]; then
        echo "✅ Comando ejecutado exitosamente"
    else
        echo "❌ Error ejecutando comando"
    fi
}

# Función para monitorear sistema
monitor_system() {
    echo "📊 Iniciando monitoreo del sistema..."
    
    # Comandos de monitoreo
    local monitor_commands=(
        "uptime"
        "free -h"
        "df -h"
        "ps aux --sort=-%cpu | head -10"
        "netstat -tuln"
    )
    
    for cmd in "${monitor_commands[@]}"; do
        echo "--- Ejecutando: $cmd ---"
        execute_remote_command "$cmd"
        echo ""
    done
}

# Función principal
main() {
    case "$1" in
        "connect")
            connect_and_execute
            ;;
        "transfer")
            if [ -z "$2" ] || [ -z "$3" ]; then
                echo "Uso: $0 transfer <archivo_local> <ruta_remota>"
                exit 1
            fi
            transfer_file "$2" "$3"
            ;;
        "execute")
            if [ -z "$2" ]; then
                echo "Uso: $0 execute <comando>"
                exit 1
            fi
            execute_remote_command "$2"
            ;;
        "monitor")
            monitor_system
            ;;
        *)
            echo "Uso: $0 {connect|transfer|execute|monitor}"
            echo "  connect                    - Conectar y ejecutar comando básico"
            echo "  transfer <local> <remote>  - Transferir archivo"
            echo "  execute <comando>          - Ejecutar comando remoto"
            echo "  monitor                    - Monitorear sistema"
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"
```

---

## 🔧 Configuración Avanzada

### Configuración de Túnel SSH

```bash
# putty_tunnel.sh - Configuración de túnel SSH
#!/bin/bash

# Configuración de túnel
LOCAL_PORT="8080"                  # Puerto local para túnel
REMOTE_HOST="internal-server"      # Servidor interno
REMOTE_PORT="80"                   # Puerto remoto
SSH_HOST="gateway.example.com"     # Servidor SSH gateway

# RESULTADO ESPERADO: Variables de túnel definidas

# Función para crear túnel local
create_local_tunnel() {
    echo "🔗 Creando túnel local $LOCAL_PORT -> $REMOTE_HOST:$REMOTE_PORT"
    
    # Comando para crear túnel con PuTTY
    putty -ssh -L $LOCAL_PORT:$REMOTE_HOST:$REMOTE_PORT $SSH_HOST
    
    # RESULTADO ESPERADO: Túnel local creado exitosamente
    echo "✅ Túnel local creado en puerto $LOCAL_PORT"
}

# Función para crear túnel dinámico
create_dynamic_tunnel() {
    echo "🌐 Creando túnel dinámico SOCKS en puerto $LOCAL_PORT"
    
    # Comando para túnel SOCKS
    putty -ssh -D $LOCAL_PORT $SSH_HOST
    
    # RESULTADO ESPERADO: Túnel SOCKS creado exitosamente
    echo "✅ Túnel SOCKS creado en puerto $LOCAL_PORT"
}

# Función para verificar túnel
verify_tunnel() {
    echo "🔍 Verificando túnel en puerto $LOCAL_PORT"
    
    # Verificar si el puerto está en uso
    if netstat -tuln | grep ":$LOCAL_PORT " > /dev/null; then
        echo "✅ Túnel activo en puerto $LOCAL_PORT"
        
        # Probar conectividad
        if curl -s http://localhost:$LOCAL_PORT > /dev/null; then
            echo "✅ Túnel funcionando correctamente"
            return 0
        else
            echo "❌ Túnel no responde correctamente"
            return 1
        fi
    else
        echo "❌ Túnel no está activo"
        return 1
    fi
}

# Función para cerrar túnel
close_tunnel() {
    echo "🔒 Cerrando túnel en puerto $LOCAL_PORT"
    
    # Encontrar y cerrar proceso del túnel
    local tunnel_pid=$(netstat -tuln | grep ":$LOCAL_PORT " | awk '{print $7}' | cut -d'/' -f1)
    
    if [ -n "$tunnel_pid" ]; then
        kill $tunnel_pid
        echo "✅ Túnel cerrado (PID: $tunnel_pid)"
    else
        echo "ℹ️  No se encontró túnel activo"
    fi
}

# Función principal
main() {
    case "$1" in
        "local")
            create_local_tunnel
            ;;
        "dynamic")
            create_dynamic_tunnel
            ;;
        "verify")
            verify_tunnel
            ;;
        "close")
            close_tunnel
            ;;
        *)
            echo "Uso: $0 {local|dynamic|verify|close}"
            echo "  local   - Crear túnel local"
            echo "  dynamic - Crear túnel SOCKS"
            echo "  verify  - Verificar túnel"
            echo "  close   - Cerrar túnel"
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"
```

---

## 📊 Troubleshooting

### Diagnóstico de Problemas Comunes

```bash
# putty_troubleshoot.sh - Diagnóstico de problemas PuTTY
#!/bin/bash

# Función para diagnosticar conectividad
diagnose_connectivity() {
    echo "🔍 Diagnóstico de conectividad"
    
    # Verificar DNS
    echo "1. Verificando resolución DNS..."
    if nslookup $HOSTNAME > /dev/null 2>&1; then
        echo "   ✅ DNS funciona correctamente"
    else
        echo "   ❌ Problema con DNS"
    fi
    
    # Verificar ping
    echo "2. Verificando conectividad de red..."
    if ping -c 3 $HOSTNAME > /dev/null 2>&1; then
        echo "   ✅ Host alcanzable"
    else
        echo "   ❌ Host no alcanzable"
    fi
    
    # Verificar puerto SSH
    echo "3. Verificando puerto SSH..."
    if nc -z $HOSTNAME $PORT 2>/dev/null; then
        echo "   ✅ Puerto SSH abierto"
    else
        echo "   ❌ Puerto SSH cerrado"
    fi
}

# Función para diagnosticar autenticación
diagnose_authentication() {
    echo "🔐 Diagnóstico de autenticación"
    
    # Verificar archivo de clave
    if [ -f "$KEY_FILE" ]; then
        echo "   ✅ Archivo de clave existe"
        
        # Verificar permisos
        local perms=$(stat -c %a "$KEY_FILE")
        if [ "$perms" = "600" ]; then
            echo "   ✅ Permisos correctos (600)"
        else
            echo "   ❌ Permisos incorrectos ($perms), debería ser 600"
        fi
    else
        echo "   ❌ Archivo de clave no existe"
    fi
    
    # Verificar formato de clave
    if ssh-keygen -l -f "$KEY_FILE" > /dev/null 2>&1; then
        echo "   ✅ Formato de clave válido"
    else
        echo "   ❌ Formato de clave inválido"
    fi
}

# Función para diagnosticar configuración PuTTY
diagnose_putty_config() {
    echo "⚙️ Diagnóstico de configuración PuTTY"
    
    # Verificar registro de Windows
    if reg query "HKCU\Software\SimonTatham\PuTTY\Sessions\$HOSTNAME" > /dev/null 2>&1; then
        echo "   ✅ Configuración de sesión encontrada"
        
        # Verificar configuración específica
        local hostname_reg=$(reg query "HKCU\Software\SimonTatham\PuTTY\Sessions\$HOSTNAME" /v HostName 2>/dev/null | grep REG_SZ)
        if [ -n "$hostname_reg" ]; then
            echo "   ✅ Hostname configurado correctamente"
        else
            echo "   ❌ Hostname no configurado"
        fi
    else
        echo "   ❌ Configuración de sesión no encontrada"
    fi
}

# Función para generar reporte
generate_report() {
    local report_file="putty_diagnostic_report.txt"
    
    echo "📋 Generando reporte de diagnóstico..."
    
    {
        echo "=== Reporte de Diagnóstico PuTTY ==="
        echo "Fecha: $(date)"
        echo "Hostname: $HOSTNAME"
        echo "Puerto: $PORT"
        echo "Usuario: $USERNAME"
        echo ""
        
        echo "--- Conectividad ---"
        diagnose_connectivity
        
        echo ""
        echo "--- Autenticación ---"
        diagnose_authentication
        
        echo ""
        echo "--- Configuración PuTTY ---"
        diagnose_putty_config
        
    } > "$report_file"
    
    echo "✅ Reporte generado: $report_file"
}

# Función principal
main() {
    case "$1" in
        "connectivity")
            diagnose_connectivity
            ;;
        "auth")
            diagnose_authentication
            ;;
        "config")
            diagnose_putty_config
            ;;
        "full")
            generate_report
            ;;
        *)
            echo "Uso: $0 {connectivity|auth|config|full}"
            echo "  connectivity - Diagnóstico de conectividad"
            echo "  auth         - Diagnóstico de autenticación"
            echo "  config       - Diagnóstico de configuración"
            echo "  full         - Reporte completo"
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"
```

---

## 📈 Predicciones de Resultados

### Resultados Esperados por Funcionalidad

| Funcionalidad | Resultado Esperado | Indicadores de Éxito |
|---------------|-------------------|---------------------|
| **Configuración Básica** | Sesión PuTTY configurada | Archivo .reg creado, registro actualizado |
| **Conexión SSH** | Conexión establecida | Prompt de login, comandos ejecutados |
| **Transferencia de Archivos** | Archivos transferidos | Archivos en destino, sin errores |
| **Túneles SSH** | Túnel activo | Puerto local escuchando, conectividad |
| **Automatización** | Scripts ejecutados | Comandos completados, logs generados |
| **Troubleshooting** | Problemas identificados | Reporte generado, soluciones aplicadas |

### Métricas de Rendimiento

```bash
# putty_metrics.sh - Métricas de rendimiento PuTTY
#!/bin/bash

# Función para medir tiempo de conexión
measure_connection_time() {
    local start_time=$(date +%s.%N)
    
    # Intentar conexión
    timeout 30 putty -ssh $HOSTNAME -l $USERNAME -i $KEY_FILE -batch
    
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc)
    
    echo "⏱️  Tiempo de conexión: ${duration}s"
}

# Función para medir throughput de transferencia
measure_transfer_speed() {
    local test_file="test_100mb.dat"
    local start_time=$(date +%s.%N)
    
    # Crear archivo de prueba
    dd if=/dev/zero of="$test_file" bs=1M count=100 2>/dev/null
    
    # Transferir archivo
    pscp -i $KEY_FILE "$test_file" "$USERNAME@$HOSTNAME:/tmp/"
    
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc)
    local speed=$(echo "scale=2; 100 / $duration" | bc)
    
    echo "📊 Velocidad de transferencia: ${speed} MB/s"
    
    # Limpiar archivo de prueba
    rm -f "$test_file"
}

# Función para generar métricas
generate_metrics() {
    echo "📈 Generando métricas de rendimiento..."
    
    echo "--- Métricas de Conexión ---"
    measure_connection_time
    
    echo ""
    echo "--- Métricas de Transferencia ---"
    measure_transfer_speed
    
    echo ""
    echo "--- Métricas de Sistema ---"
    echo "Memoria utilizada: $(ps aux | grep putty | awk '{sum+=$6} END {print sum/1024 " MB"}')"
    echo "Procesos PuTTY activos: $(ps aux | grep putty | grep -v grep | wc -l)"
}

# Ejecutar métricas
generate_metrics
```

---

## 🎯 Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es PuTTY y para qué se usa?**
   - Cliente SSH/Telnet para Windows, conexión remota segura

2. **¿Cuáles son los componentes principales de PuTTY?**
   - putty.exe, pscp.exe, plink.exe, pageant.exe

3. **¿Cómo configurar una sesión SSH en PuTTY?**
   - Hostname, puerto, tipo de conexión, autenticación

### Preguntas Intermedias

4. **¿Cómo crear túneles SSH con PuTTY?**
   - Túneles locales, dinámicos, configuración de puertos

5. **¿Cómo automatizar conexiones PuTTY?**
   - Scripts, plink, configuración de sesiones

6. **¿Cómo transferir archivos con PuTTY?**
   - pscp, configuración de claves, rutas

### Preguntas Avanzadas

7. **¿Cómo configurar autenticación por clave pública?**
   - Generación de claves, pageant, permisos

8. **¿Cómo diagnosticar problemas de conexión?**
   - Logs, configuración de red, autenticación

9. **¿Cómo optimizar el rendimiento de PuTTY?**
   - Compresión, algoritmos de cifrado, configuración de terminal

---

**¡Dominar PuTTY te hará un experto en conexiones SSH! 🚀** 