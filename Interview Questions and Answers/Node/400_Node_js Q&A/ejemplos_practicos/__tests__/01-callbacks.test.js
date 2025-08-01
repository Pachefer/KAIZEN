/**
 * Pruebas Unitarias: Callbacks en Node.js
 * 
 * Este archivo contiene pruebas unitarias para las funciones de callbacks
 * demostrando diferentes escenarios y casos de error.
 * 
 * Autor: Guía Node.js
 * Fecha: 2025-01-15
 */

const fs = require('fs');
const path = require('path');
const {
    leerArchivo,
    escribirArchivo,
    procesarArchivos,
    ejecutarConTimeout
} = require('../ejemplos/01-callbacks');

// Mock de fs para pruebas
jest.mock('fs');

describe('Pruebas de Callbacks', () => {
    let mockConsoleLog;
    
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        jest.clearAllMocks();
        
        // Mock de console.log para capturar logs
        mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    
    afterEach(() => {
        // Restaurar console.log después de cada prueba
        mockConsoleLog.mockRestore();
    });
    
    describe('leerArchivo', () => {
        test('debería leer archivo exitosamente', (done) => {
            const contenidoEsperado = 'contenido del archivo';
            const nombreArchivo = 'test.txt';
            
            // Mock de fs.existsSync para retornar true
            fs.existsSync.mockReturnValue(true);
            
            // Mock de fs.readFile para simular lectura exitosa
            fs.readFile.mockImplementation((file, encoding, callback) => {
                callback(null, contenidoEsperado);
            });
            
            leerArchivo(nombreArchivo, (error, contenido) => {
                expect(error).toBeNull();
                expect(contenido).toBe(contenidoEsperado);
                expect(fs.readFile).toHaveBeenCalledWith(nombreArchivo, 'utf8', expect.any(Function));
                done();
            });
        });
        
        test('debería manejar error cuando archivo no existe', (done) => {
            const nombreArchivo = 'archivo_inexistente.txt';
            
            // Mock de fs.existsSync para retornar false
            fs.existsSync.mockReturnValue(false);
            
            leerArchivo(nombreArchivo, (error, contenido) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toContain('Archivo no encontrado');
                expect(contenido).toBeNull();
                done();
            });
        });
        
        test('debería manejar error de lectura de archivo', (done) => {
            const nombreArchivo = 'test.txt';
            const errorEsperado = new Error('Error de lectura');
            
            // Mock de fs.existsSync para retornar true
            fs.existsSync.mockReturnValue(true);
            
            // Mock de fs.readFile para simular error
            fs.readFile.mockImplementation((file, encoding, callback) => {
                callback(errorEsperado, null);
            });
            
            leerArchivo(nombreArchivo, (error, contenido) => {
                expect(error).toBe(errorEsperado);
                expect(contenido).toBeNull();
                done();
            });
        });
        
        test('debería validar nombre de archivo inválido', (done) => {
            leerArchivo(null, (error, contenido) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Nombre de archivo inválido');
                expect(contenido).toBeNull();
                done();
            });
        });
        
        test('debería validar nombre de archivo vacío', (done) => {
            leerArchivo('', (error, contenido) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Nombre de archivo inválido');
                expect(contenido).toBeNull();
                done();
            });
        });
    });
    
    describe('escribirArchivo', () => {
        test('debería escribir archivo exitosamente', (done) => {
            const nombreArchivo = 'test.txt';
            const contenido = 'contenido de prueba';
            
            // Mock de fs.writeFile para simular escritura exitosa
            fs.writeFile.mockImplementation((file, content, encoding, callback) => {
                callback(null);
            });
            
            escribirArchivo(nombreArchivo, contenido, (error) => {
                expect(error).toBeNull();
                expect(fs.writeFile).toHaveBeenCalledWith(nombreArchivo, contenido, 'utf8', expect.any(Function));
                done();
            });
        });
        
        test('debería manejar error de escritura', (done) => {
            const nombreArchivo = 'test.txt';
            const contenido = 'contenido de prueba';
            const errorEsperado = new Error('Error de escritura');
            
            // Mock de fs.writeFile para simular error
            fs.writeFile.mockImplementation((file, content, encoding, callback) => {
                callback(errorEsperado);
            });
            
            escribirArchivo(nombreArchivo, contenido, (error) => {
                expect(error).toBe(errorEsperado);
                done();
            });
        });
        
        test('debería validar nombre de archivo inválido', (done) => {
            escribirArchivo(null, 'contenido', (error) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Nombre de archivo inválido');
                done();
            });
        });
        
        test('debería validar contenido inválido', (done) => {
            escribirArchivo('test.txt', null, (error) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Contenido inválido');
                done();
            });
        });
    });
    
    describe('procesarArchivos', () => {
        test('debería procesar múltiples archivos exitosamente', (done) => {
            const archivos = ['archivo1.txt', 'archivo2.txt'];
            const contenidos = ['contenido1', 'contenido2'];
            
            // Mock de fs.existsSync para retornar true
            fs.existsSync.mockReturnValue(true);
            
            // Mock de fs.readFile para simular lecturas exitosas
            fs.readFile.mockImplementation((file, encoding, callback) => {
                const index = archivos.indexOf(file);
                callback(null, contenidos[index]);
            });
            
            procesarArchivos(archivos, (error, resultados) => {
                expect(error).toBeNull();
                expect(resultados).toHaveLength(2);
                expect(resultados[0].archivo).toBe('archivo1.txt');
                expect(resultados[0].tamaño).toBe(contenidos[0].length);
                expect(resultados[1].archivo).toBe('archivo2.txt');
                expect(resultados[1].tamaño).toBe(contenidos[1].length);
                done();
            });
        });
        
        test('debería manejar error en procesamiento de archivos', (done) => {
            const archivos = ['archivo1.txt', 'archivo2.txt'];
            const errorEsperado = new Error('Error de lectura');
            
            // Mock de fs.existsSync para retornar true
            fs.existsSync.mockReturnValue(true);
            
            // Mock de fs.readFile para simular error en el primer archivo
            fs.readFile.mockImplementation((file, encoding, callback) => {
                if (file === 'archivo1.txt') {
                    callback(errorEsperado, null);
                } else {
                    callback(null, 'contenido2');
                }
            });
            
            procesarArchivos(archivos, (error, resultados) => {
                expect(error).toBe(errorEsperado);
                expect(resultados).toBeNull();
                done();
            });
        });
        
        test('debería validar lista de archivos inválida', (done) => {
            procesarArchivos(null, (error, resultados) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Lista de archivos inválida');
                expect(resultados).toBeNull();
                done();
            });
        });
        
        test('debería validar lista de archivos vacía', (done) => {
            procesarArchivos([], (error, resultados) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Lista de archivos inválida');
                expect(resultados).toBeNull();
                done();
            });
        });
    });
    
    describe('ejecutarConTimeout', () => {
        test('debería ejecutar operación exitosamente', (done) => {
            const resultadoEsperado = 'operación completada';
            const operacion = (callback) => {
                setTimeout(() => {
                    callback(null, resultadoEsperado);
                }, 100);
            };
            
            ejecutarConTimeout(operacion, 1000, (error, resultado) => {
                expect(error).toBeNull();
                expect(resultado).toBe(resultadoEsperado);
                done();
            });
        });
        
        test('debería manejar timeout de operación', (done) => {
            const operacion = (callback) => {
                // Operación que nunca se completa
                setTimeout(() => {
                    callback(null, 'nunca se ejecuta');
                }, 5000);
            };
            
            ejecutarConTimeout(operacion, 100, (error, resultado) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toContain('Operación expiró');
                expect(resultado).toBeNull();
                done();
            });
        });
        
        test('debería manejar error en operación', (done) => {
            const errorEsperado = new Error('Error en operación');
            const operacion = (callback) => {
                setTimeout(() => {
                    callback(errorEsperado, null);
                }, 100);
            };
            
            ejecutarConTimeout(operacion, 1000, (error, resultado) => {
                expect(error).toBe(errorEsperado);
                expect(resultado).toBeNull();
                done();
            });
        });
        
        test('debería evitar múltiples callbacks', (done) => {
            let callbackCount = 0;
            const operacion = (callback) => {
                // Llamar callback múltiples veces
                setTimeout(() => {
                    callback(null, 'primer resultado');
                }, 100);
                
                setTimeout(() => {
                    callback(null, 'segundo resultado');
                }, 200);
            };
            
            ejecutarConTimeout(operacion, 1000, (error, resultado) => {
                callbackCount++;
                expect(callbackCount).toBe(1);
                expect(error).toBeNull();
                expect(resultado).toBe('primer resultado');
                
                // Esperar un poco más para asegurar que no se ejecuten más callbacks
                setTimeout(() => {
                    expect(callbackCount).toBe(1);
                    done();
                }, 200);
            });
        });
    });
    
    describe('Integración', () => {
        test('debería integrar lectura y escritura de archivos', (done) => {
            const nombreArchivo = 'test_integracion.txt';
            const contenido = 'contenido de integración';
            
            // Mock de fs.existsSync
            fs.existsSync.mockReturnValue(true);
            
            // Mock de fs.writeFile
            fs.writeFile.mockImplementation((file, content, encoding, callback) => {
                callback(null);
            });
            
            // Mock de fs.readFile
            fs.readFile.mockImplementation((file, encoding, callback) => {
                callback(null, contenido);
            });
            
            // Escribir archivo
            escribirArchivo(nombreArchivo, contenido, (error) => {
                expect(error).toBeNull();
                
                // Leer archivo
                leerArchivo(nombreArchivo, (error, contenidoLeido) => {
                    expect(error).toBeNull();
                    expect(contenidoLeido).toBe(contenido);
                    done();
                });
            });
        });
    });
}); 