#!/usr/bin/env node

/**
 * Ejemplo Práctico: Operaciones Básicas en MongoDB
 * 
 * Este ejemplo demuestra las operaciones fundamentales de MongoDB:
 * - Conexión a la base de datos
 * - Operaciones CRUD (Create, Read, Update, Delete)
 * - Consultas con filtros y proyecciones
 * - Manejo de errores
 * 
 * Autor: Guía MongoDB
 * Fecha: 2025-01-15
 */

const { MongoClient } = require('mongodb');

// Configuración de logging
const log = (mensaje, tipo = 'INFO') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${tipo}] ${mensaje}`);
};

/**
 * Clase para manejar operaciones básicas de MongoDB
 */
class MongoDBBasico {
    constructor(uri = 'mongodb://localhost:27017') {
        this.uri = uri;
        this.client = null;
        this.db = null;
    }

    /**
     * Conectar a MongoDB
     * @returns {Promise<boolean>} - True si la conexión es exitosa
     */
    async conectar() {
        try {
            log('Conectando a MongoDB...', 'CONNECTION');
            
            // Crear cliente de MongoDB
            this.client = new MongoClient(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            // Establecer conexión
            await this.client.connect();
            
            // Obtener referencia a la base de datos
            this.db = this.client.db('ejemplo_basico');
            
            log('Conexión exitosa a MongoDB', 'SUCCESS');
            return true;
            
        } catch (error) {
            log(`Error al conectar: ${error.message}`, 'ERROR');
            return false;
        }
    }

    /**
     * Desconectar de MongoDB
     */
    async desconectar() {
        try {
            if (this.client) {
                await this.client.close();
                log('Desconexión exitosa de MongoDB', 'SUCCESS');
            }
        } catch (error) {
            log(`Error al desconectar: ${error.message}`, 'ERROR');
        }
    }

    /**
     * Insertar un documento
     * @param {string} coleccion - Nombre de la colección
     * @param {Object} documento - Documento a insertar
     * @returns {Promise<ObjectId>} - ID del documento insertado
     */
    async insertarDocumento(coleccion, documento) {
        try {
            log(`Insertando documento en colección: ${coleccion}`, 'OPERATION');
            
            // Validar entrada
            if (!coleccion || typeof coleccion !== 'string') {
                throw new Error('Nombre de colección inválido');
            }
            
            if (!documento || typeof documento !== 'object') {
                throw new Error('Documento inválido');
            }

            // Agregar timestamp si no existe
            if (!documento.fechaCreacion) {
                documento.fechaCreacion = new Date();
            }

            // Insertar documento
            const resultado = await this.db.collection(coleccion).insertOne(documento);
            
            log(`Documento insertado con ID: ${resultado.insertedId}`, 'SUCCESS');
            return resultado.insertedId;
            
        } catch (error) {
            log(`Error al insertar documento: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Insertar múltiples documentos
     * @param {string} coleccion - Nombre de la colección
     * @param {Array} documentos - Array de documentos a insertar
     * @returns {Promise<Array>} - IDs de los documentos insertados
     */
    async insertarMuchosDocumentos(coleccion, documentos) {
        try {
            log(`Insertando ${documentos.length} documentos en colección: ${coleccion}`, 'OPERATION');
            
            // Validar entrada
            if (!Array.isArray(documentos) || documentos.length === 0) {
                throw new Error('Array de documentos inválido');
            }

            // Agregar timestamp a cada documento
            const documentosConTimestamp = documentos.map(doc => ({
                ...doc,
                fechaCreacion: doc.fechaCreacion || new Date()
            }));

            // Insertar documentos
            const resultado = await this.db.collection(coleccion).insertMany(documentosConTimestamp);
            
            log(`${resultado.insertedCount} documentos insertados exitosamente`, 'SUCCESS');
            return resultado.insertedIds;
            
        } catch (error) {
            log(`Error al insertar documentos: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Buscar documentos
     * @param {string} coleccion - Nombre de la colección
     * @param {Object} filtro - Filtro de búsqueda
     * @param {Object} proyeccion - Campos a retornar
     * @param {Object} opciones - Opciones adicionales (sort, limit, skip)
     * @returns {Promise<Array>} - Documentos encontrados
     */
    async buscarDocumentos(coleccion, filtro = {}, proyeccion = {}, opciones = {}) {
        try {
            log(`Buscando documentos en colección: ${coleccion}`, 'OPERATION');
            
            // Construir cursor con opciones
            let cursor = this.db.collection(coleccion).find(filtro, proyeccion);
            
            // Aplicar opciones
            if (opciones.sort) {
                cursor = cursor.sort(opciones.sort);
            }
            
            if (opciones.limit) {
                cursor = cursor.limit(opciones.limit);
            }
            
            if (opciones.skip) {
                cursor = cursor.skip(opciones.skip);
            }

            // Ejecutar consulta
            const documentos = await cursor.toArray();
            
            log(`${documentos.length} documentos encontrados`, 'SUCCESS');
            return documentos;
            
        } catch (error) {
            log(`Error al buscar documentos: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Buscar un documento específico
     * @param {string} coleccion - Nombre de la colección
     * @param {Object} filtro - Filtro de búsqueda
     * @param {Object} proyeccion - Campos a retornar
     * @returns {Promise<Object>} - Documento encontrado o null
     */
    async buscarUnDocumento(coleccion, filtro = {}, proyeccion = {}) {
        try {
            log(`Buscando un documento en colección: ${coleccion}`, 'OPERATION');
            
            const documento = await this.db.collection(coleccion).findOne(filtro, proyeccion);
            
            if (documento) {
                log('Documento encontrado', 'SUCCESS');
            } else {
                log('Documento no encontrado', 'WARNING');
            }
            
            return documento;
            
        } catch (error) {
            log(`Error al buscar documento: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Actualizar un documento
     * @param {string} coleccion - Nombre de la colección
     * @param {Object} filtro - Filtro para encontrar el documento
     * @param {Object} actualizacion - Datos a actualizar
     * @param {boolean} upsert - Crear si no existe
     * @returns {Promise<Object>} - Resultado de la actualización
     */
    async actualizarDocumento(coleccion, filtro, actualizacion, upsert = false) {
        try {
            log(`Actualizando documento en colección: ${coleccion}`, 'OPERATION');
            
            // Agregar timestamp de actualización
            const actualizacionConTimestamp = {
                ...actualizacion,
                $set: {
                    ...actualizacion.$set,
                    fechaActualizacion: new Date()
                }
            };

            const resultado = await this.db.collection(coleccion).updateOne(
                filtro,
                actualizacionConTimestamp,
                { upsert }
            );
            
            log(`Documentos modificados: ${resultado.modifiedCount}`, 'SUCCESS');
            return resultado;
            
        } catch (error) {
            log(`Error al actualizar documento: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Actualizar múltiples documentos
     * @param {string} coleccion - Nombre de la colección
     * @param {Object} filtro - Filtro para encontrar los documentos
     * @param {Object} actualizacion - Datos a actualizar
     * @returns {Promise<Object>} - Resultado de la actualización
     */
    async actualizarMuchosDocumentos(coleccion, filtro, actualizacion) {
        try {
            log(`Actualizando múltiples documentos en colección: ${coleccion}`, 'OPERATION');
            
            // Agregar timestamp de actualización
            const actualizacionConTimestamp = {
                ...actualizacion,
                $set: {
                    ...actualizacion.$set,
                    fechaActualizacion: new Date()
                }
            };

            const resultado = await this.db.collection(coleccion).updateMany(
                filtro,
                actualizacionConTimestamp
            );
            
            log(`Documentos modificados: ${resultado.modifiedCount}`, 'SUCCESS');
            return resultado;
            
        } catch (error) {
            log(`Error al actualizar documentos: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Eliminar un documento
     * @param {string} coleccion - Nombre de la colección
     * @param {Object} filtro - Filtro para encontrar el documento
     * @returns {Promise<Object>} - Resultado de la eliminación
     */
    async eliminarDocumento(coleccion, filtro) {
        try {
            log(`Eliminando documento de colección: ${coleccion}`, 'OPERATION');
            
            const resultado = await this.db.collection(coleccion).deleteOne(filtro);
            
            log(`Documentos eliminados: ${resultado.deletedCount}`, 'SUCCESS');
            return resultado;
            
        } catch (error) {
            log(`Error al eliminar documento: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Eliminar múltiples documentos
     * @param {string} coleccion - Nombre de la colección
     * @param {Object} filtro - Filtro para encontrar los documentos
     * @returns {Promise<Object>} - Resultado de la eliminación
     */
    async eliminarMuchosDocumentos(coleccion, filtro) {
        try {
            log(`Eliminando múltiples documentos de colección: ${coleccion}`, 'OPERATION');
            
            const resultado = await this.db.collection(coleccion).deleteMany(filtro);
            
            log(`Documentos eliminados: ${resultado.deletedCount}`, 'SUCCESS');
            return resultado;
            
        } catch (error) {
            log(`Error al eliminar documentos: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Contar documentos
     * @param {string} coleccion - Nombre de la colección
     * @param {Object} filtro - Filtro opcional
     * @returns {Promise<number>} - Número de documentos
     */
    async contarDocumentos(coleccion, filtro = {}) {
        try {
            log(`Contando documentos en colección: ${coleccion}`, 'OPERATION');
            
            const cantidad = await this.db.collection(coleccion).countDocuments(filtro);
            
            log(`Total de documentos: ${cantidad}`, 'SUCCESS');
            return cantidad;
            
        } catch (error) {
            log(`Error al contar documentos: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * Obtener estadísticas de la colección
     * @param {string} coleccion - Nombre de la colección
     * @returns {Promise<Object>} - Estadísticas de la colección
     */
    async obtenerEstadisticas(coleccion) {
        try {
            log(`Obteniendo estadísticas de colección: ${coleccion}`, 'OPERATION');
            
            const stats = await this.db.collection(coleccion).stats();
            
            log('Estadísticas obtenidas exitosamente', 'SUCCESS');
            return stats;
            
        } catch (error) {
            log(`Error al obtener estadísticas: ${error.message}`, 'ERROR');
            throw error;
        }
    }
}

/**
 * Función principal para demostrar las operaciones básicas
 */
async function ejecutarEjemplos() {
    log('=== INICIANDO EJEMPLOS BÁSICOS DE MONGODB ===', 'HEADER');
    
    const mongoDB = new MongoDBBasico();
    
    try {
        // Conectar a MongoDB
        const conectado = await mongoDB.conectar();
        if (!conectado) {
            log('No se pudo conectar a MongoDB. Saliendo...', 'ERROR');
            return;
        }

        // Ejemplo 1: Insertar documentos de usuarios
        log('\n--- Ejemplo 1: Insertar documentos de usuarios ---', 'SECTION');
        
        const usuarios = [
            {
                nombre: 'Juan Pérez',
                email: 'juan@ejemplo.com',
                edad: 30,
                ciudad: 'Madrid',
                activo: true,
                habilidades: ['JavaScript', 'Node.js', 'MongoDB']
            },
            {
                nombre: 'María García',
                email: 'maria@ejemplo.com',
                edad: 25,
                ciudad: 'Barcelona',
                activo: true,
                habilidades: ['Python', 'Django', 'PostgreSQL']
            },
            {
                nombre: 'Carlos López',
                email: 'carlos@ejemplo.com',
                edad: 35,
                ciudad: 'Madrid',
                activo: false,
                habilidades: ['Java', 'Spring', 'MySQL']
            }
        ];

        await mongoDB.insertarMuchosDocumentos('usuarios', usuarios);

        // Ejemplo 2: Buscar usuarios
        log('\n--- Ejemplo 2: Buscar usuarios ---', 'SECTION');
        
        // Buscar todos los usuarios
        const todosUsuarios = await mongoDB.buscarDocumentos('usuarios');
        log(`Encontrados ${todosUsuarios.length} usuarios`);

        // Buscar usuarios de Madrid
        const usuariosMadrid = await mongoDB.buscarDocumentos(
            'usuarios',
            { ciudad: 'Madrid' },
            { nombre: 1, email: 1, _id: 0 }
        );
        log(`Encontrados ${usuariosMadrid.length} usuarios en Madrid`);

        // Buscar usuarios activos mayores de 25 años
        const usuariosActivos = await mongoDB.buscarDocumentos(
            'usuarios',
            { activo: true, edad: { $gt: 25 } },
            { nombre: 1, edad: 1, _id: 0 },
            { sort: { edad: -1 } }
        );
        log(`Encontrados ${usuariosActivos.length} usuarios activos mayores de 25 años`);

        // Ejemplo 3: Actualizar documentos
        log('\n--- Ejemplo 3: Actualizar documentos ---', 'SECTION');
        
        // Actualizar edad de Juan
        await mongoDB.actualizarDocumento(
            'usuarios',
            { email: 'juan@ejemplo.com' },
            { $set: { edad: 31 } }
        );

        // Agregar habilidad a María
        await mongoDB.actualizarDocumento(
            'usuarios',
            { email: 'maria@ejemplo.com' },
            { $push: { habilidades: 'MongoDB' } }
        );

        // Ejemplo 4: Buscar documento específico
        log('\n--- Ejemplo 4: Buscar documento específico ---', 'SECTION');
        
        const juan = await mongoDB.buscarUnDocumento(
            'usuarios',
            { email: 'juan@ejemplo.com' }
        );
        
        if (juan) {
            log(`Usuario encontrado: ${juan.nombre}, Edad: ${juan.edad}`);
        }

        // Ejemplo 5: Contar documentos
        log('\n--- Ejemplo 5: Contar documentos ---', 'SECTION');
        
        const totalUsuarios = await mongoDB.contarDocumentos('usuarios');
        const usuariosActivosCount = await mongoDB.contarDocumentos('usuarios', { activo: true });
        const usuariosMadridCount = await mongoDB.contarDocumentos('usuarios', { ciudad: 'Madrid' });
        
        log(`Total usuarios: ${totalUsuarios}`);
        log(`Usuarios activos: ${usuariosActivosCount}`);
        log(`Usuarios en Madrid: ${usuariosMadridCount}`);

        // Ejemplo 6: Obtener estadísticas
        log('\n--- Ejemplo 6: Obtener estadísticas ---', 'SECTION');
        
        const stats = await mongoDB.obtenerEstadisticas('usuarios');
        log(`Tamaño de colección: ${stats.size} bytes`);
        log(`Número de documentos: ${stats.count}`);
        log(`Tamaño promedio por documento: ${Math.round(stats.avgObjSize)} bytes`);

        // Ejemplo 7: Eliminar documento
        log('\n--- Ejemplo 7: Eliminar documento ---', 'SECTION');
        
        await mongoDB.eliminarDocumento('usuarios', { email: 'carlos@ejemplo.com' });
        log('Usuario Carlos eliminado');

        // Verificar eliminación
        const totalDespuesEliminacion = await mongoDB.contarDocumentos('usuarios');
        log(`Total usuarios después de eliminación: ${totalDespuesEliminacion}`);

    } catch (error) {
        log(`Error en ejemplos: ${error.message}`, 'ERROR');
    } finally {
        // Desconectar de MongoDB
        await mongoDB.desconectar();
        log('\n=== EJEMPLOS COMPLETADOS ===', 'HEADER');
    }
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

// Exportar clase para uso en otros módulos
module.exports = MongoDBBasico; 