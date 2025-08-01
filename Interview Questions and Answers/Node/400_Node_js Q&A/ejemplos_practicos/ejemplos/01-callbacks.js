#!/usr/bin/env node

/**
 * Ejemplo Práctico: Callbacks en Node.js
 * 
 * Este ejemplo demuestra cómo usar callbacks para manejar operaciones asíncronas
 * en Node.js, incluyendo manejo de errores y patrones comunes.
 * 
 * Autor: Guía Node.js
 * Fecha: 2025-01-15
 */

const fs = require('fs');
const path = require('path');

// Configuración de logging
const log = (mensaje, tipo = 'INFO') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${tipo}] ${mensaje}`);
};

/**
 * Función que usa callback para leer un archivo
 * @param {string} nombreArchivo - Nombre del archivo a leer
 * @param {Function} callback - Función callback(error, data)
 */
function leerArchivo(nombreArchivo, callback) {
    log(`Iniciando lectura del archivo: ${nombreArchivo}`);
    
    // Validación de entrada
    if (!nombreArchivo || typeof nombreArchivo !== 'string') {
        const error = new Error('Nombre de archivo inválido');
        log(`Error de validación: ${error.message}`, 'ERROR');
        return callback(error, null);
    }
    
    // Verificar si el archivo existe
    if (!fs.existsSync(nombreArchivo)) {
        const error = new Error(`Archivo no encontrado: ${nombreArchivo}`);
        log(`Error de archivo: ${error.message}`, 'ERROR');
        return callback(error, null);
    }
    
    // Leer archivo de forma asíncrona
    fs.readFile(nombreArchivo, 'utf8', (error, datos) => {
        if (error) {
            // Si hay error, lo pasamos al callback
            log(`Error al leer archivo: ${error.message}`, 'ERROR');
            callback(error, null);
        } else {
            // Si no hay error, pasamos null como error y los datos
            log(`Archivo leído exitosamente: ${nombreArchivo}`, 'SUCCESS');
            callback(null, datos);
        }
    });
}

/**
 * Función que usa callback para escribir un archivo
 * @param {string} nombreArchivo - Nombre del archivo a escribir
 * @param {string} contenido - Contenido a escribir
 * @param {Function} callback - Función callback(error)
 */
function escribirArchivo(nombreArchivo, contenido, callback) {
    log(`Iniciando escritura del archivo: ${nombreArchivo}`);
    
    // Validación de entrada
    if (!nombreArchivo || typeof nombreArchivo !== 'string') {
        const error = new Error('Nombre de archivo inválido');
        log(`Error de validación: ${error.message}`, 'ERROR');
        return callback(error);
    }
    
    if (contenido === undefined || contenido === null) {
        const error = new Error('Contenido inválido');
        log(`Error de validación: ${error.message}`, 'ERROR');
        return callback(error);
    }
    
    // Escribir archivo de forma asíncrona
    fs.writeFile(nombreArchivo, contenido, 'utf8', (error) => {
        if (error) {
            log(`Error al escribir archivo: ${error.message}`, 'ERROR');
            callback(error);
        } else {
            log(`Archivo escrito exitosamente: ${nombreArchivo}`, 'SUCCESS');
            callback(null);
        }
    });
}

/**
 * Función que procesa múltiples archivos usando callbacks
 * @param {Array} archivos - Lista de archivos a procesar
 * @param {Function} callback - Función callback(error, resultados)
 */
function procesarArchivos(archivos, callback) {
    log(`Iniciando procesamiento de ${archivos.length} archivos`);
    
    if (!Array.isArray(archivos) || archivos.length === 0) {
        const error = new Error('Lista de archivos inválida');
        log(`Error de validación: ${error.message}`, 'ERROR');
        return callback(error, null);
    }
    
    const resultados = [];
    let archivosProcesados = 0;
    let errorOcurrido = false;
    
    archivos.forEach((archivo, index) => {
        leerArchivo(archivo, (error, contenido) => {
            archivosProcesados++;
            
            if (error && !errorOcurrido) {
                errorOcurrido = true;
                log(`Error procesando archivo ${archivo}: ${error.message}`, 'ERROR');
                callback(error, null);
                return;
            }
            
            if (!error) {
                resultados[index] = {
                    archivo,
                    contenido: contenido.substring(0, 100) + '...', // Limitar contenido
                    tamaño: contenido.length
                };
                log(`Archivo procesado: ${archivo} (${contenido.length} caracteres)`, 'SUCCESS');
            }
            
            // Verificar si todos los archivos han sido procesados
            if (archivosProcesados === archivos.length && !errorOcurrido) {
                log(`Procesamiento completado: ${resultados.length} archivos`, 'SUCCESS');
                callback(null, resultados);
            }
        });
    });
}

/**
 * Función que demuestra el patrón de callback con timeout
 * @param {Function} operacion - Función a ejecutar
 * @param {number} timeout - Tiempo máximo en milisegundos
 * @param {Function} callback - Función callback(error, resultado)
 */
function ejecutarConTimeout(operacion, timeout, callback) {
    log(`Ejecutando operación con timeout de ${timeout}ms`);
    
    let completado = false;
    
    // Timer para timeout
    const timer = setTimeout(() => {
        if (!completado) {
            completado = true;
            const error = new Error(`Operación expiró después de ${timeout}ms`);
            log(`Timeout: ${error.message}`, 'ERROR');
            callback(error, null);
        }
    }, timeout);
    
    // Ejecutar operación
    operacion((error, resultado) => {
        if (!completado) {
            completado = true;
            clearTimeout(timer);
            
            if (error) {
                log(`Error en operación: ${error.message}`, 'ERROR');
                callback(error, null);
            } else {
                log(`Operación completada exitosamente`, 'SUCCESS');
                callback(null, resultado);
            }
        }
    });
}

// Función principal para demostrar los ejemplos
function ejecutarEjemplos() {
    log('=== INICIANDO EJEMPLOS DE CALLBACKS ===', 'HEADER');
    
    // Crear archivo de prueba
    const archivoPrueba = 'archivo_prueba.txt';
    const contenidoPrueba = 'Este es un archivo de prueba para demostrar callbacks en Node.js.\n' +
                           'Contiene múltiples líneas para mostrar el procesamiento.\n' +
                           'Los callbacks son fundamentales para operaciones asíncronas.';
    
    // Ejemplo 1: Escribir archivo
    log('\n--- Ejemplo 1: Escribir archivo ---', 'SECTION');
    escribirArchivo(archivoPrueba, contenidoPrueba, (error) => {
        if (error) {
            log(`Error al escribir archivo: ${error.message}`, 'ERROR');
        } else {
            log('Archivo escrito correctamente', 'SUCCESS');
            
            // Ejemplo 2: Leer archivo
            log('\n--- Ejemplo 2: Leer archivo ---', 'SECTION');
            leerArchivo(archivoPrueba, (error, contenido) => {
                if (error) {
                    log(`Error al leer archivo: ${error.message}`, 'ERROR');
                } else {
                    log(`Contenido leído: ${contenido.length} caracteres`, 'SUCCESS');
                    
                    // Ejemplo 3: Procesar múltiples archivos
                    log('\n--- Ejemplo 3: Procesar múltiples archivos ---', 'SECTION');
                    const archivos = [archivoPrueba, 'package.json'];
                    procesarArchivos(archivos, (error, resultados) => {
                        if (error) {
                            log(`Error procesando archivos: ${error.message}`, 'ERROR');
                        } else {
                            log(`Archivos procesados: ${resultados.length}`, 'SUCCESS');
                            resultados.forEach(resultado => {
                                log(`- ${resultado.archivo}: ${resultado.tamaño} caracteres`, 'INFO');
                            });
                        }
                        
                        // Ejemplo 4: Timeout
                        log('\n--- Ejemplo 4: Operación con timeout ---', 'SECTION');
                        ejecutarConTimeout((callback) => {
                            // Simular operación lenta
                            setTimeout(() => {
                                callback(null, 'Operación completada');
                            }, 2000);
                        }, 3000, (error, resultado) => {
                            if (error) {
                                log(`Error con timeout: ${error.message}`, 'ERROR');
                            } else {
                                log(`Resultado: ${resultado}`, 'SUCCESS');
                            }
                            
                            // Limpiar archivo de prueba
                            log('\n--- Limpieza ---', 'SECTION');
                            fs.unlink(archivoPrueba, (error) => {
                                if (error) {
                                    log(`Error al eliminar archivo: ${error.message}`, 'ERROR');
                                } else {
                                    log('Archivo de prueba eliminado', 'SUCCESS');
                                }
                                
                                log('\n=== EJEMPLOS COMPLETADOS ===', 'HEADER');
                            });
                        });
                    });
                }
            });
        }
    });
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    log(`Error no capturado: ${error.message}`, 'FATAL');
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`Promesa rechazada no manejada: ${reason}`, 'FATAL');
    process.exit(1);
});

// Ejecutar ejemplos si este archivo se ejecuta directamente
if (require.main === module) {
    ejecutarEjemplos();
}

// Exportar funciones para uso en otros módulos
module.exports = {
    leerArchivo,
    escribirArchivo,
    procesarArchivos,
    ejecutarConTimeout
}; 