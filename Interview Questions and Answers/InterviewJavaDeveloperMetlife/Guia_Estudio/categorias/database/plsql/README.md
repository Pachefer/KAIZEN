# 🗃️ PL/SQL - Programación Avanzada en Oracle

## 📋 Índice

1. [Fundamentos de PL/SQL](#fundamentos-de-plsql)
2. [Procedimientos y Funciones](#procedimientos-y-funciones)
3. [Cursores y Manejo de Datos](#cursores-y-manejo-de-datos)
4. [Manejo de Excepciones](#manejo-de-excepciones)
5. [Triggers y Paquetes](#triggers-y-paquetes)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de PL/SQL

### Estructura Básica

```sql
-- Bloque PL/SQL básico con declaraciones y lógica
DECLARE
    -- Sección de declaraciones
    v_username VARCHAR2(50) := 'admin'; -- Variable para almacenar username
    v_email VARCHAR2(100); -- Variable para almacenar email
    v_count NUMBER := 0; -- Variable contador inicializada en 0
    v_enabled BOOLEAN := TRUE; -- Variable booleana para estado habilitado
    
    -- Constantes
    c_max_users CONSTANT NUMBER := 1000; -- Constante para máximo de usuarios
    c_default_role CONSTANT VARCHAR2(20) := 'USER'; -- Constante para rol por defecto
    
    -- Tipos personalizados
    TYPE t_user_record IS RECORD ( -- Define tipo de registro para usuario
        id NUMBER, -- Campo ID del usuario
        username VARCHAR2(50), -- Campo username
        email VARCHAR2(100), -- Campo email
        enabled BOOLEAN -- Campo estado habilitado
    );
    
    v_user t_user_record; -- Variable de tipo registro personalizado
    
BEGIN
    -- Sección de ejecución
    DBMS_OUTPUT.PUT_LINE('Iniciando proceso de usuarios...'); -- Imprime mensaje de inicio
    
    -- Asignación de valores
    v_email := v_username || '@company.com'; -- Concatena username con dominio
    v_count := v_count + 1; -- Incrementa contador
    
    -- Estructura condicional
    IF v_count <= c_max_users THEN -- Verifica si no se excede el máximo
        DBMS_OUTPUT.PUT_LINE('Usuario ' || v_username || ' procesado correctamente'); -- Imprime mensaje de éxito
    ELSE
        DBMS_OUTPUT.PUT_LINE('Error: Se excedió el límite de usuarios'); -- Imprime mensaje de error
    END IF;
    
    -- Estructura de bucle
    FOR i IN 1..5 LOOP -- Bucle FOR de 1 a 5
        DBMS_OUTPUT.PUT_LINE('Iteración: ' || i); -- Imprime número de iteración
    END LOOP;
    
    -- RESULTADO ESPERADO: Mensajes de proceso y iteraciones impresos en consola
    
EXCEPTION
    -- Sección de manejo de excepciones
    WHEN OTHERS THEN -- Captura cualquier excepción no manejada
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM); -- Imprime mensaje de error
        ROLLBACK; -- Revierte transacciones pendientes
        
        -- RESULTADO ESPERADO: Error capturado y transacción revertida si hay excepción
        
END;
/
```

### Variables y Tipos de Datos

```sql
-- Ejemplos de diferentes tipos de datos en PL/SQL
DECLARE
    -- Tipos de datos básicos
    v_number NUMBER(10,2) := 1234.56; -- Número con precisión y escala
    v_varchar VARCHAR2(100) := 'Texto de ejemplo'; -- Cadena de caracteres variable
    v_char CHAR(10) := 'Fijo'; -- Cadena de caracteres de longitud fija
    v_date DATE := SYSDATE; -- Fecha actual del sistema
    v_timestamp TIMESTAMP := SYSTIMESTAMP; -- Timestamp con precisión
    
    -- Tipos de datos avanzados
    v_clob CLOB := 'Texto muy largo...'; -- Objeto de caracteres grandes
    v_blob BLOB; -- Objeto binario grande
    v_bfile BFILE; -- Referencia a archivo binario externo
    
    -- Tipos de datos compuestos
    v_array SYS.ODCIVARCHAR2LIST; -- Array de cadenas
    v_table TABLE OF VARCHAR2(50); -- Tabla de cadenas
    
    -- Tipos de datos de referencia
    v_refcursor SYS_REFCURSOR; -- Cursor de referencia
    
BEGIN
    -- Operaciones con diferentes tipos
    v_number := v_number * 2; -- Multiplica número por 2
    v_varchar := UPPER(v_varchar); -- Convierte a mayúsculas
    v_date := v_date + 1; -- Añade un día a la fecha
    
    -- Imprime valores
    DBMS_OUTPUT.PUT_LINE('Número: ' || v_number); -- Imprime número
    DBMS_OUTPUT.PUT_LINE('Texto: ' || v_varchar); -- Imprime texto
    DBMS_OUTPUT.PUT_LINE('Fecha: ' || TO_CHAR(v_date, 'DD/MM/YYYY')); -- Imprime fecha formateada
    
    -- RESULTADO ESPERADO: Valores procesados e impresos en consola
    
END;
/
```

---

## 🔄 Procedimientos y Funciones

### Procedimiento con Parámetros

```sql
-- Procedimiento para crear usuario con validaciones
CREATE OR REPLACE PROCEDURE create_user(
    p_username IN VARCHAR2, -- Parámetro de entrada para username
    p_email IN VARCHAR2, -- Parámetro de entrada para email
    p_password IN VARCHAR2, -- Parámetro de entrada para password
    p_user_id OUT NUMBER, -- Parámetro de salida para ID generado
    p_status OUT VARCHAR2 -- Parámetro de salida para estado
) AS
    -- Variables locales
    v_count NUMBER := 0; -- Contador para verificar duplicados
    v_sequence_id NUMBER; -- Variable para ID de secuencia
    
BEGIN
    -- Validación de parámetros de entrada
    IF p_username IS NULL OR LENGTH(p_username) < 3 THEN -- Verifica username válido
        p_status := 'ERROR: Username debe tener al menos 3 caracteres'; -- Establece mensaje de error
        RETURN; -- Sale del procedimiento
    END IF;
    
    IF p_email IS NULL OR INSTR(p_email, '@') = 0 THEN -- Verifica email válido
        p_status := 'ERROR: Email debe contener @'; -- Establece mensaje de error
        RETURN; -- Sale del procedimiento
    END IF;
    
    -- Verificar si el username ya existe
    SELECT COUNT(*) INTO v_count -- Cuenta usuarios con mismo username
    FROM users 
    WHERE username = p_username; -- Filtra por username
    
    IF v_count > 0 THEN -- Si ya existe el username
        p_status := 'ERROR: Username ya existe'; -- Establece mensaje de error
        RETURN; -- Sale del procedimiento
    END IF;
    
    -- Verificar si el email ya existe
    SELECT COUNT(*) INTO v_count -- Cuenta usuarios con mismo email
    FROM users 
    WHERE email = p_email; -- Filtra por email
    
    IF v_count > 0 THEN -- Si ya existe el email
        p_status := 'ERROR: Email ya existe'; -- Establece mensaje de error
        RETURN; -- Sale del procedimiento
    END IF;
    
    -- Obtener siguiente ID de la secuencia
    SELECT user_seq.NEXTVAL INTO v_sequence_id -- Obtiene siguiente valor de secuencia
    FROM dual; -- Tabla dual para consultas simples
    
    -- Insertar nuevo usuario
    INSERT INTO users (id, username, email, password, enabled, created_at) -- Inserta en tabla users
    VALUES (v_sequence_id, p_username, p_email, p_password, 1, SYSDATE); -- Valores a insertar
    
    -- Confirmar transacción
    COMMIT; -- Confirma la transacción
    
    -- Establecer valores de salida
    p_user_id := v_sequence_id; -- Asigna ID generado al parámetro de salida
    p_status := 'SUCCESS: Usuario creado correctamente'; -- Establece mensaje de éxito
    
    -- RESULTADO ESPERADO: Usuario creado con ID único y mensaje de confirmación
    
EXCEPTION
    -- Manejo de excepciones específicas
    WHEN DUP_VAL_ON_INDEX THEN -- Excepción por valor duplicado en índice único
        ROLLBACK; -- Revierte transacción
        p_status := 'ERROR: Usuario duplicado'; -- Establece mensaje de error
        
    WHEN OTHERS THEN -- Cualquier otra excepción
        ROLLBACK; -- Revierte transacción
        p_status := 'ERROR: ' || SQLERRM; -- Establece mensaje de error con detalles
        
        -- RESULTADO ESPERADO: Error manejado y transacción revertida si hay excepción
        
END create_user;
/

-- Ejemplo de uso del procedimiento
DECLARE
    v_user_id NUMBER; -- Variable para ID de usuario
    v_status VARCHAR2(200); -- Variable para estado
    
BEGIN
    -- Llamar al procedimiento
    create_user('nuevo_usuario', 'nuevo@email.com', 'password123', v_user_id, v_status); -- Ejecuta procedimiento
    
    -- Imprimir resultados
    DBMS_OUTPUT.PUT_LINE('Status: ' || v_status); -- Imprime estado
    IF v_user_id IS NOT NULL THEN -- Si se generó ID
        DBMS_OUTPUT.PUT_LINE('User ID: ' || v_user_id); -- Imprime ID de usuario
    END IF;
    
    -- RESULTADO ESPERADO: Usuario creado o mensaje de error según validaciones
    
END;
/
```

### Función con Retorno

```sql
-- Función para calcular estadísticas de usuarios
CREATE OR REPLACE FUNCTION get_user_statistics(
    p_enabled_only IN BOOLEAN DEFAULT FALSE -- Parámetro para filtrar solo usuarios habilitados
) RETURN SYS_REFCURSOR AS -- Retorna cursor de referencia
    v_cursor SYS_REFCURSOR; -- Variable cursor
    v_sql VARCHAR2(1000); -- Variable para SQL dinámico
    
BEGIN
    -- Construir SQL dinámico según parámetro
    IF p_enabled_only THEN -- Si solo usuarios habilitados
        v_sql := 'SELECT COUNT(*) as total_users, ' ||
                 'AVG(CASE WHEN enabled = 1 THEN 1 ELSE 0 END) as activation_rate, ' ||
                 'MAX(created_at) as last_created ' ||
                 'FROM users WHERE enabled = 1'; -- SQL para usuarios habilitados
    ELSE
        v_sql := 'SELECT COUNT(*) as total_users, ' ||
                 'AVG(CASE WHEN enabled = 1 THEN 1 ELSE 0 END) as activation_rate, ' ||
                 'MAX(created_at) as last_created ' ||
                 'FROM users'; -- SQL para todos los usuarios
    END IF;
    
    -- Abrir cursor con SQL dinámico
    OPEN v_cursor FOR v_sql; -- Abre cursor con SQL construido
    
    -- Retornar cursor
    RETURN v_cursor; -- Retorna cursor con resultados
    
    -- RESULTADO ESPERADO: Cursor con estadísticas de usuarios según filtro
    
EXCEPTION
    -- Manejo de excepciones
    WHEN OTHERS THEN -- Cualquier excepción
        IF v_cursor%ISOPEN THEN -- Si el cursor está abierto
            CLOSE v_cursor; -- Cierra cursor
        END IF;
        RAISE; -- Re-lanza la excepción
        
        -- RESULTADO ESPERADO: Cursor cerrado y excepción re-lanzada si hay error
        
END get_user_statistics;
/

-- Ejemplo de uso de la función
DECLARE
    v_cursor SYS_REFCURSOR; -- Variable para cursor
    v_total_users NUMBER; -- Variable para total de usuarios
    v_activation_rate NUMBER; -- Variable para tasa de activación
    v_last_created DATE; -- Variable para última creación
    
BEGIN
    -- Obtener estadísticas de todos los usuarios
    v_cursor := get_user_statistics(FALSE); -- Llama función sin filtro
    
    -- Procesar resultados del cursor
    FETCH v_cursor INTO v_total_users, v_activation_rate, v_last_created; -- Obtiene primera fila
    CLOSE v_cursor; -- Cierra cursor
    
    -- Imprimir resultados
    DBMS_OUTPUT.PUT_LINE('Total Users: ' || v_total_users); -- Imprime total
    DBMS_OUTPUT.PUT_LINE('Activation Rate: ' || ROUND(v_activation_rate * 100, 2) || '%'); -- Imprime tasa
    DBMS_OUTPUT.PUT_LINE('Last Created: ' || TO_CHAR(v_last_created, 'DD/MM/YYYY')); -- Imprime fecha
    
    -- RESULTADO ESPERADO: Estadísticas calculadas e impresas en consola
    
END;
/
```

---

## 🔍 Cursores y Manejo de Datos

### Cursores Explícitos

```sql
-- Procedimiento con cursor explícito para procesar usuarios
CREATE OR REPLACE PROCEDURE process_users_by_role(
    p_role_name IN VARCHAR2 -- Parámetro para nombre de rol
) AS
    -- Declaración de cursor explícito
    CURSOR c_users IS -- Define cursor para usuarios
        SELECT u.id, u.username, u.email, u.enabled, u.created_at -- Selecciona campos
        FROM users u -- Tabla usuarios
        INNER JOIN user_roles ur ON u.id = ur.user_id -- Join con roles
        INNER JOIN roles r ON ur.role_id = r.id -- Join con tabla roles
        WHERE r.name = p_role_name -- Filtra por nombre de rol
        ORDER BY u.created_at DESC; -- Ordena por fecha de creación descendente
    
    -- Variables para almacenar datos del cursor
    v_user_record c_users%ROWTYPE; -- Variable de tipo registro del cursor
    v_processed_count NUMBER := 0; -- Contador de usuarios procesados
    v_enabled_count NUMBER := 0; -- Contador de usuarios habilitados
    
BEGIN
    -- Abrir cursor
    OPEN c_users; -- Abre el cursor
    
    -- Procesar cada fila del cursor
    LOOP
        -- Obtener siguiente fila
        FETCH c_users INTO v_user_record; -- Obtiene fila del cursor
        
        -- Verificar si hay más filas
        EXIT WHEN c_users%NOTFOUND; -- Sale del bucle si no hay más filas
        
        -- Procesar usuario
        v_processed_count := v_processed_count + 1; -- Incrementa contador procesados
        
        -- Verificar si usuario está habilitado
        IF v_user_record.enabled = 1 THEN -- Si usuario está habilitado
            v_enabled_count := v_enabled_count + 1; -- Incrementa contador habilitados
            
            -- Imprimir información del usuario
            DBMS_OUTPUT.PUT_LINE('Usuario ' || v_processed_count || ': ' || 
                                v_user_record.username || ' (' || v_user_record.email || ')'); -- Imprime información
        ELSE
            -- Imprimir usuario deshabilitado
            DBMS_OUTPUT.PUT_LINE('Usuario ' || v_processed_count || ': ' || 
                                v_user_record.username || ' - DESHABILITADO'); -- Imprime usuario deshabilitado
        END IF;
        
    END LOOP;
    
    -- Cerrar cursor
    CLOSE c_users; -- Cierra el cursor
    
    -- Imprimir resumen
    DBMS_OUTPUT.PUT_LINE('--- RESUMEN ---'); -- Imprime header de resumen
    DBMS_OUTPUT.PUT_LINE('Total procesados: ' || v_processed_count); -- Imprime total
    DBMS_OUTPUT.PUT_LINE('Habilitados: ' || v_enabled_count); -- Imprime habilitados
    DBMS_OUTPUT.PUT_LINE('Deshabilitados: ' || (v_processed_count - v_enabled_count)); -- Imprime deshabilitados
    
    -- RESULTADO ESPERADO: Usuarios procesados e información de resumen impresa
    
EXCEPTION
    -- Manejo de excepciones
    WHEN OTHERS THEN -- Cualquier excepción
        -- Cerrar cursor si está abierto
        IF c_users%ISOPEN THEN -- Si el cursor está abierto
            CLOSE c_users; -- Cierra cursor
        END IF;
        
        -- Imprimir error
        DBMS_OUTPUT.PUT_LINE('Error procesando usuarios: ' || SQLERRM); -- Imprime error
        RAISE; -- Re-lanza la excepción
        
        -- RESULTADO ESPERADO: Cursor cerrado y error manejado si hay excepción
        
END process_users_by_role;
/

-- Ejemplo de uso del procedimiento
BEGIN
    -- Procesar usuarios con rol 'ADMIN'
    process_users_by_role('ADMIN'); -- Ejecuta procedimiento para rol ADMIN
    
    -- RESULTADO ESPERADO: Usuarios con rol ADMIN procesados e información mostrada
    
END;
/
```

### Cursores con Parámetros

```sql
-- Procedimiento con cursor con parámetros
CREATE OR REPLACE PROCEDURE update_user_status(
    p_enabled_status IN NUMBER, -- Parámetro para estado habilitado
    p_created_after IN DATE -- Parámetro para fecha de creación
) AS
    -- Declaración de cursor con parámetros
    CURSOR c_users_to_update(p_status NUMBER, p_date DATE) IS -- Cursor con parámetros
        SELECT id, username, email -- Selecciona campos
        FROM users -- Tabla usuarios
        WHERE enabled != p_status -- Usuarios con estado diferente al especificado
        AND created_at >= p_date -- Creados después de la fecha especificada
        ORDER BY created_at; -- Ordena por fecha de creación
    
    -- Variables
    v_updated_count NUMBER := 0; -- Contador de usuarios actualizados
    v_user_record c_users_to_update%ROWTYPE; -- Variable de tipo registro
    
BEGIN
    -- Procesar usuarios con cursor
    FOR v_user_record IN c_users_to_update(p_enabled_status, p_created_after) LOOP -- Bucle FOR con cursor
        -- Actualizar estado del usuario
        UPDATE users -- Actualiza tabla users
        SET enabled = p_enabled_status, -- Establece nuevo estado
            updated_at = SYSDATE -- Actualiza fecha de modificación
        WHERE id = v_user_record.id; -- Filtra por ID del usuario
        
        -- Incrementar contador
        v_updated_count := v_updated_count + 1; -- Incrementa contador
        
        -- Imprimir información de actualización
        DBMS_OUTPUT.PUT_LINE('Actualizado: ' || v_user_record.username || 
                            ' (' || v_user_record.email || ')'); -- Imprime información de actualización
        
    END LOOP;
    
    -- Confirmar transacción
    COMMIT; -- Confirma transacción
    
    -- Imprimir resumen
    DBMS_OUTPUT.PUT_LINE('Total usuarios actualizados: ' || v_updated_count); -- Imprime total actualizados
    
    -- RESULTADO ESPERADO: Usuarios actualizados y resumen impreso
    
EXCEPTION
    -- Manejo de excepciones
    WHEN OTHERS THEN -- Cualquier excepción
        ROLLBACK; -- Revierte transacción
        DBMS_OUTPUT.PUT_LINE('Error actualizando usuarios: ' || SQLERRM); -- Imprime error
        RAISE; -- Re-lanza la excepción
        
        -- RESULTADO ESPERADO: Transacción revertida y error manejado si hay excepción
        
END update_user_status;
/

-- Ejemplo de uso
BEGIN
    -- Habilitar usuarios creados en los últimos 30 días
    update_user_status(1, SYSDATE - 30); -- Ejecuta procedimiento para habilitar usuarios recientes
    
    -- RESULTADO ESPERADO: Usuarios recientes habilitados
    
END;
/
```

---

## ⚠️ Manejo de Excepciones

### Excepciones Personalizadas

```sql
-- Paquete con excepciones personalizadas
CREATE OR REPLACE PACKAGE user_exceptions AS
    -- Excepciones personalizadas
    e_invalid_username EXCEPTION; -- Excepción para username inválido
    e_invalid_email EXCEPTION; -- Excepción para email inválido
    e_user_not_found EXCEPTION; -- Excepción para usuario no encontrado
    e_duplicate_user EXCEPTION; -- Excepción para usuario duplicado
    
    -- Constantes para códigos de error
    c_invalid_username_code CONSTANT NUMBER := -20001; -- Código para username inválido
    c_invalid_email_code CONSTANT NUMBER := -20002; -- Código para email inválido
    c_user_not_found_code CONSTANT NUMBER := -20003; -- Código para usuario no encontrado
    c_duplicate_user_code CONSTANT NUMBER := -20004; -- Código para usuario duplicado
    
    -- Procedimiento para validar username
    PROCEDURE validate_username(p_username IN VARCHAR2); -- Valida username
    
    -- Procedimiento para validar email
    PROCEDURE validate_email(p_email IN VARCHAR2); -- Valida email
    
END user_exceptions;
/

-- Cuerpo del paquete
CREATE OR REPLACE PACKAGE BODY user_exceptions AS
    
    -- Implementación de validación de username
    PROCEDURE validate_username(p_username IN VARCHAR2) AS
    BEGIN
        -- Validar que username no sea nulo
        IF p_username IS NULL THEN -- Si username es nulo
            RAISE_APPLICATION_ERROR(c_invalid_username_code, 'Username no puede ser nulo'); -- Lanza excepción
        END IF;
        
        -- Validar longitud mínima
        IF LENGTH(p_username) < 3 THEN -- Si username es muy corto
            RAISE_APPLICATION_ERROR(c_invalid_username_code, 'Username debe tener al menos 3 caracteres'); -- Lanza excepción
        END IF;
        
        -- Validar caracteres permitidos
        IF REGEXP_LIKE(p_username, '[^a-zA-Z0-9_]') THEN -- Si contiene caracteres no permitidos
            RAISE_APPLICATION_ERROR(c_invalid_username_code, 'Username solo puede contener letras, números y guiones bajos'); -- Lanza excepción
        END IF;
        
        -- RESULTADO ESPERADO: Username validado o excepción lanzada
        
    END validate_username;
    
    -- Implementación de validación de email
    PROCEDURE validate_email(p_email IN VARCHAR2) AS
    BEGIN
        -- Validar que email no sea nulo
        IF p_email IS NULL THEN -- Si email es nulo
            RAISE_APPLICATION_ERROR(c_invalid_email_code, 'Email no puede ser nulo'); -- Lanza excepción
        END IF;
        
        -- Validar formato de email
        IF NOT REGEXP_LIKE(p_email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN -- Si formato no es válido
            RAISE_APPLICATION_ERROR(c_invalid_email_code, 'Formato de email inválido'); -- Lanza excepción
        END IF;
        
        -- RESULTADO ESPERADO: Email validado o excepción lanzada
        
    END validate_email;
    
END user_exceptions;
/

-- Procedimiento que usa las excepciones personalizadas
CREATE OR REPLACE PROCEDURE create_user_with_validation(
    p_username IN VARCHAR2, -- Parámetro username
    p_email IN VARCHAR2, -- Parámetro email
    p_password IN VARCHAR2 -- Parámetro password
) AS
    v_user_id NUMBER; -- Variable para ID de usuario
    v_count NUMBER; -- Variable contador
    
BEGIN
    -- Validar parámetros usando el paquete
    user_exceptions.validate_username(p_username); -- Valida username
    user_exceptions.validate_email(p_email); -- Valida email
    
    -- Verificar si username ya existe
    SELECT COUNT(*) INTO v_count -- Cuenta usuarios con mismo username
    FROM users 
    WHERE username = p_username; -- Filtra por username
    
    IF v_count > 0 THEN -- Si ya existe
        RAISE user_exceptions.e_duplicate_user; -- Lanza excepción personalizada
    END IF;
    
    -- Verificar si email ya existe
    SELECT COUNT(*) INTO v_count -- Cuenta usuarios con mismo email
    FROM users 
    WHERE email = p_email; -- Filtra por email
    
    IF v_count > 0 THEN -- Si ya existe
        RAISE user_exceptions.e_duplicate_user; -- Lanza excepción personalizada
    END IF;
    
    -- Insertar usuario
    INSERT INTO users (id, username, email, password, enabled, created_at) -- Inserta en tabla users
    VALUES (user_seq.NEXTVAL, p_username, p_email, p_password, 1, SYSDATE) -- Valores a insertar
    RETURNING id INTO v_user_id; -- Retorna ID generado
    
    -- Confirmar transacción
    COMMIT; -- Confirma transacción
    
    -- Imprimir éxito
    DBMS_OUTPUT.PUT_LINE('Usuario creado exitosamente con ID: ' || v_user_id); -- Imprime mensaje de éxito
    
    -- RESULTADO ESPERADO: Usuario creado con validaciones completas
    
EXCEPTION
    -- Manejo de excepciones específicas
    WHEN user_exceptions.e_duplicate_user THEN -- Excepción de usuario duplicado
        ROLLBACK; -- Revierte transacción
        DBMS_OUTPUT.PUT_LINE('Error: Usuario o email ya existe'); -- Imprime mensaje de error
        
    WHEN OTHERS THEN -- Cualquier otra excepción
        ROLLBACK; -- Revierte transacción
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM); -- Imprime error
        RAISE; -- Re-lanza la excepción
        
        -- RESULTADO ESPERADO: Error manejado y transacción revertida si hay excepción
        
END create_user_with_validation;
/

-- Ejemplo de uso con manejo de excepciones
DECLARE
    v_username VARCHAR2(50) := 'test_user'; -- Username de prueba
    v_email VARCHAR2(100) := 'test@example.com'; -- Email de prueba
    v_password VARCHAR2(100) := 'password123'; -- Password de prueba
    
BEGIN
    -- Intentar crear usuario
    create_user_with_validation(v_username, v_email, v_password); -- Ejecuta procedimiento
    
    -- RESULTADO ESPERADO: Usuario creado o error manejado según validaciones
    
EXCEPTION
    -- Manejo de excepciones de aplicación
    WHEN OTHERS THEN -- Cualquier excepción
        DBMS_OUTPUT.PUT_LINE('Error en aplicación: ' || SQLERRM); -- Imprime error de aplicación
        
        -- RESULTADO ESPERADO: Error de aplicación manejado
        
END;
/
```

---

## 🔧 Triggers y Paquetes

### Trigger de Auditoría

```sql
-- Trigger para auditoría de cambios en usuarios
CREATE OR REPLACE TRIGGER tr_users_audit
AFTER INSERT OR UPDATE OR DELETE ON users -- Se ejecuta después de INSERT, UPDATE o DELETE
FOR EACH ROW -- Para cada fila afectada
DECLARE
    v_operation VARCHAR2(10); -- Variable para tipo de operación
    v_user_id NUMBER; -- Variable para ID de usuario
    v_old_username VARCHAR2(50); -- Variable para username anterior
    v_new_username VARCHAR2(50); -- Variable para username nuevo
    
BEGIN
    -- Determinar tipo de operación
    CASE
        WHEN INSERTING THEN -- Si es inserción
            v_operation := 'INSERT'; -- Establece operación como INSERT
            v_user_id := :NEW.id; -- Obtiene ID del nuevo registro
            v_new_username := :NEW.username; -- Obtiene username del nuevo registro
            
        WHEN UPDATING THEN -- Si es actualización
            v_operation := 'UPDATE'; -- Establece operación como UPDATE
            v_user_id := :NEW.id; -- Obtiene ID del registro
            v_old_username := :OLD.username; -- Obtiene username anterior
            v_new_username := :NEW.username; -- Obtiene username nuevo
            
        WHEN DELETING THEN -- Si es eliminación
            v_operation := 'DELETE'; -- Establece operación como DELETE
            v_user_id := :OLD.id; -- Obtiene ID del registro eliminado
            v_old_username := :OLD.username; -- Obtiene username del registro eliminado
            
    END CASE;
    
    -- Insertar registro de auditoría
    INSERT INTO user_audit_log ( -- Inserta en tabla de auditoría
        id, -- Campo ID
        user_id, -- Campo ID de usuario
        operation, -- Campo operación
        old_username, -- Campo username anterior
        new_username, -- Campo username nuevo
        changed_by, -- Campo usuario que realizó el cambio
        changed_at -- Campo fecha de cambio
    ) VALUES (
        audit_seq.NEXTVAL, -- ID de secuencia
        v_user_id, -- ID de usuario
        v_operation, -- Tipo de operación
        v_old_username, -- Username anterior
        v_new_username, -- Username nuevo
        USER, -- Usuario de base de datos
        SYSDATE -- Fecha actual
    );
    
    -- RESULTADO ESPERADO: Registro de auditoría creado para cada operación
    
EXCEPTION
    -- Manejo de excepciones en trigger
    WHEN OTHERS THEN -- Cualquier excepción
        -- Log del error (en producción se usaría un sistema de logging)
        DBMS_OUTPUT.PUT_LINE('Error en trigger de auditoría: ' || SQLERRM); -- Imprime error
        
        -- RESULTADO ESPERADO: Error manejado sin afectar la operación principal
        
END tr_users_audit;
/

-- Paquete para gestión de usuarios
CREATE OR REPLACE PACKAGE user_management AS
    -- Tipos de datos
    TYPE t_user_array IS TABLE OF VARCHAR2(50) INDEX BY BINARY_INTEGER; -- Array de usernames
    
    -- Procedimientos
    PROCEDURE bulk_create_users(p_usernames IN t_user_array, p_domain IN VARCHAR2); -- Crear múltiples usuarios
    PROCEDURE deactivate_inactive_users(p_days_inactive IN NUMBER); -- Desactivar usuarios inactivos
    FUNCTION get_user_count(p_enabled_only IN BOOLEAN DEFAULT TRUE) RETURN NUMBER; -- Contar usuarios
    
    -- Variables públicas
    g_max_users CONSTANT NUMBER := 10000; -- Constante para máximo de usuarios
    g_default_role CONSTANT VARCHAR2(20) := 'USER'; -- Constante para rol por defecto
    
END user_management;
/

-- Cuerpo del paquete
CREATE OR REPLACE PACKAGE BODY user_management AS
    
    -- Implementación de creación masiva de usuarios
    PROCEDURE bulk_create_users(p_usernames IN t_user_array, p_domain IN VARCHAR2) AS
        v_username VARCHAR2(50); -- Variable para username
        v_email VARCHAR2(100); -- Variable para email
        v_created_count NUMBER := 0; -- Contador de usuarios creados
        v_error_count NUMBER := 0; -- Contador de errores
        
    BEGIN
        -- Procesar cada username del array
        FOR i IN p_usernames.FIRST..p_usernames.LAST LOOP -- Bucle por el array
            v_username := p_usernames(i); -- Obtiene username del array
            v_email := v_username || '@' || p_domain; -- Construye email
            
            BEGIN
                -- Crear usuario individual
                create_user_with_validation(v_username, v_email, 'default_password'); -- Crea usuario
                v_created_count := v_created_count + 1; -- Incrementa contador de creados
                
            EXCEPTION
                -- Manejo de errores individuales
                WHEN OTHERS THEN -- Cualquier excepción
                    v_error_count := v_error_count + 1; -- Incrementa contador de errores
                    DBMS_OUTPUT.PUT_LINE('Error creando usuario ' || v_username || ': ' || SQLERRM); -- Imprime error
                    
            END;
            
        END LOOP;
        
        -- Imprimir resumen
        DBMS_OUTPUT.PUT_LINE('Usuarios creados: ' || v_created_count); -- Imprime creados
        DBMS_OUTPUT.PUT_LINE('Errores: ' || v_error_count); -- Imprime errores
        
        -- RESULTADO ESPERADO: Usuarios creados masivamente con resumen de resultados
        
    END bulk_create_users;
    
    -- Implementación de desactivación de usuarios inactivos
    PROCEDURE deactivate_inactive_users(p_days_inactive IN NUMBER) AS
        v_updated_count NUMBER; -- Contador de usuarios actualizados
        
    BEGIN
        -- Actualizar usuarios inactivos
        UPDATE users -- Actualiza tabla users
        SET enabled = 0, -- Deshabilita usuarios
            updated_at = SYSDATE -- Actualiza fecha de modificación
        WHERE enabled = 1 -- Solo usuarios habilitados
        AND last_login_at < SYSDATE - p_days_inactive; -- Inactivos por días especificados
        
        -- Obtener número de filas actualizadas
        v_updated_count := SQL%ROWCOUNT; -- Obtiene número de filas afectadas
        
        -- Confirmar transacción
        COMMIT; -- Confirma transacción
        
        -- Imprimir resultado
        DBMS_OUTPUT.PUT_LINE('Usuarios desactivados: ' || v_updated_count); -- Imprime resultado
        
        -- RESULTADO ESPERADO: Usuarios inactivos desactivados
        
    EXCEPTION
        -- Manejo de excepciones
        WHEN OTHERS THEN -- Cualquier excepción
            ROLLBACK; -- Revierte transacción
            DBMS_OUTPUT.PUT_LINE('Error desactivando usuarios: ' || SQLERRM); -- Imprime error
            RAISE; -- Re-lanza la excepción
            
            -- RESULTADO ESPERADO: Transacción revertida y error manejado si hay excepción
            
    END deactivate_inactive_users;
    
    -- Implementación de conteo de usuarios
    FUNCTION get_user_count(p_enabled_only IN BOOLEAN DEFAULT TRUE) RETURN NUMBER AS
        v_count NUMBER; -- Variable para conteo
        
    BEGIN
        -- Contar usuarios según filtro
        IF p_enabled_only THEN -- Si solo usuarios habilitados
            SELECT COUNT(*) INTO v_count -- Cuenta usuarios habilitados
            FROM users 
            WHERE enabled = 1; -- Filtra por habilitados
        ELSE
            SELECT COUNT(*) INTO v_count -- Cuenta todos los usuarios
            FROM users; -- Sin filtro
        END IF;
        
        -- Retornar conteo
        RETURN v_count; -- Retorna número de usuarios
        
        -- RESULTADO ESPERADO: Número de usuarios según filtro especificado
        
    END get_user_count;
    
END user_management;
/

-- Ejemplo de uso del paquete
DECLARE
    v_usernames user_management.t_user_array; -- Array de usernames
    v_user_count NUMBER; -- Variable para conteo de usuarios
    
BEGIN
    -- Llenar array con usernames
    v_usernames(1) := 'user1'; -- Asigna primer username
    v_usernames(2) := 'user2'; -- Asigna segundo username
    v_usernames(3) := 'user3'; -- Asigna tercer username
    
    -- Crear usuarios masivamente
    user_management.bulk_create_users(v_usernames, 'company.com'); -- Crea usuarios masivamente
    
    -- Obtener conteo de usuarios habilitados
    v_user_count := user_management.get_user_count(TRUE); -- Obtiene conteo
    DBMS_OUTPUT.PUT_LINE('Total usuarios habilitados: ' || v_user_count); -- Imprime conteo
    
    -- Desactivar usuarios inactivos por 90 días
    user_management.deactivate_inactive_users(90); -- Desactiva usuarios inactivos
    
    -- RESULTADO ESPERADO: Usuarios creados, contados y desactivados según criterios
    
END;
/
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es PL/SQL y cuáles son sus características principales?**
   - Lenguaje procedural para Oracle, integrado con SQL, manejo de excepciones, cursores

2. **¿Cuál es la diferencia entre PL/SQL y SQL?**
   - PL/SQL: procedural, lógica de negocio, SQL: declarativo, consultas de datos

3. **¿Qué son los bloques PL/SQL?**
   - Estructura básica con DECLARE, BEGIN, EXCEPTION, END

### Preguntas Intermedias

4. **¿Cómo manejar excepciones en PL/SQL?**
   - WHEN OTHERS, excepciones personalizadas, RAISE_APPLICATION_ERROR

5. **¿Qué son los cursores en PL/SQL?**
   - Punteros a conjuntos de resultados, explícitos e implícitos, FOR loops

6. **¿Cómo crear procedimientos y funciones?**
   - CREATE PROCEDURE/FUNCTION, parámetros IN/OUT, retorno de valores

### Preguntas Avanzadas

7. **¿Cómo optimizar código PL/SQL?**
   - Bulk operations, cursores eficientes, índices, análisis de performance

8. **¿Qué son los triggers y paquetes?**
   - Triggers: eventos automáticos, paquetes: organización de código, encapsulación

9. **¿Cómo implementar transacciones en PL/SQL?**
   - COMMIT, ROLLBACK, SAVEPOINT, control de concurrencia

---

## 📚 Recursos Adicionales

- [PL/SQL Documentation](https://docs.oracle.com/en/database/oracle/oracle-database/19/lnpls/)
- [PL/SQL Best Practices](https://docs.oracle.com/en/database/oracle/oracle-database/19/lnpls/plsql-best-practices.html)
- [Oracle PL/SQL Reference](https://docs.oracle.com/en/database/oracle/oracle-database/19/lnpls/plsql-language-fundamentals.html)
- [PL/SQL Performance Tuning](https://docs.oracle.com/en/database/oracle/oracle-database/19/tgdba/performance-tuning.html)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de PL/SQL! 🚀** 