/**
 * Pruebas Unitarias: Operaciones Básicas de MongoDB
 * 
 * Este archivo contiene pruebas unitarias para las operaciones básicas
 * de MongoDB usando MongoDB Memory Server para pruebas aisladas.
 * 
 * Autor: Guía MongoDB
 * Fecha: 2025-01-15
 */

const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MongoDBBasico = require('../ejemplos/01-basico');

describe('MongoDB Básico - Operaciones CRUD', () => {
    let mongoServer;
    let client;
    let mongoDB;
    
    beforeAll(async () => {
        // Iniciar servidor MongoDB en memoria
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        
        // Crear instancia de MongoDBBasico con URI de memoria
        mongoDB = new MongoDBBasico(uri);
        
        // Conectar a la base de datos de prueba
        await mongoDB.conectar();
    });
    
    afterAll(async () => {
        // Limpiar recursos
        await mongoDB.desconectar();
        await mongoServer.stop();
    });
    
    beforeEach(async () => {
        // Limpiar colección antes de cada prueba
        if (mongoDB.db) {
            await mongoDB.db.collection('usuarios').deleteMany({});
        }
    });
    
    describe('Conexión', () => {
        it('debería conectar exitosamente a MongoDB', async () => {
            const mongoTest = new MongoDBBasico(mongoServer.getUri());
            const conectado = await mongoTest.conectar();
            
            expect(conectado).toBe(true);
            expect(mongoTest.client).toBeDefined();
            expect(mongoTest.db).toBeDefined();
            
            await mongoTest.desconectar();
        });
        
        it('debería manejar errores de conexión', async () => {
            const mongoTest = new MongoDBBasico('mongodb://localhost:99999');
            const conectado = await mongoTest.conectar();
            
            expect(conectado).toBe(false);
        });
    });
    
    describe('Inserción de Documentos', () => {
        it('debería insertar un documento correctamente', async () => {
            const documento = {
                nombre: 'Test User',
                email: 'test@test.com',
                edad: 30
            };
            
            const id = await mongoDB.insertarDocumento('usuarios', documento);
            
            expect(id).toBeDefined();
            
            // Verificar que el documento se insertó
            const documentoInsertado = await mongoDB.db.collection('usuarios').findOne({ _id: id });
            expect(documentoInsertado.nombre).toBe('Test User');
            expect(documentoInsertado.email).toBe('test@test.com');
            expect(documentoInsertado.fechaCreacion).toBeDefined();
        });
        
        it('debería insertar múltiples documentos correctamente', async () => {
            const documentos = [
                { nombre: 'Usuario 1', email: 'user1@test.com' },
                { nombre: 'Usuario 2', email: 'user2@test.com' },
                { nombre: 'Usuario 3', email: 'user3@test.com' }
            ];
            
            const ids = await mongoDB.insertarMuchosDocumentos('usuarios', documentos);
            
            expect(ids).toBeDefined();
            expect(Object.keys(ids)).toHaveLength(3);
            
            // Verificar que todos los documentos se insertaron
            const total = await mongoDB.contarDocumentos('usuarios');
            expect(total).toBe(3);
        });
        
        it('debería validar entrada inválida para inserción', async () => {
            await expect(mongoDB.insertarDocumento('', {})).rejects.toThrow('Nombre de colección inválido');
            await expect(mongoDB.insertarDocumento('usuarios', null)).rejects.toThrow('Documento inválido');
        });
        
        it('debería validar array inválido para inserción múltiple', async () => {
            await expect(mongoDB.insertarMuchosDocumentos('usuarios', [])).rejects.toThrow('Array de documentos inválido');
            await expect(mongoDB.insertarMuchosDocumentos('usuarios', null)).rejects.toThrow('Array de documentos inválido');
        });
    });
    
    describe('Búsqueda de Documentos', () => {
        beforeEach(async () => {
            // Insertar datos de prueba
            await mongoDB.insertarMuchosDocumentos('usuarios', [
                { nombre: 'Juan', email: 'juan@test.com', edad: 30, ciudad: 'Madrid', activo: true },
                { nombre: 'María', email: 'maria@test.com', edad: 25, ciudad: 'Barcelona', activo: true },
                { nombre: 'Carlos', email: 'carlos@test.com', edad: 35, ciudad: 'Madrid', activo: false }
            ]);
        });
        
        it('debería buscar todos los documentos', async () => {
            const documentos = await mongoDB.buscarDocumentos('usuarios');
            
            expect(documentos).toHaveLength(3);
            expect(documentos[0].nombre).toBeDefined();
        });
        
        it('debería buscar documentos con filtro', async () => {
            const documentos = await mongoDB.buscarDocumentos('usuarios', { ciudad: 'Madrid' });
            
            expect(documentos).toHaveLength(2);
            documentos.forEach(doc => {
                expect(doc.ciudad).toBe('Madrid');
            });
        });
        
        it('debería buscar documentos con proyección', async () => {
            const documentos = await mongoDB.buscarDocumentos(
                'usuarios',
                {},
                { nombre: 1, email: 1, _id: 0 }
            );
            
            expect(documentos).toHaveLength(3);
            documentos.forEach(doc => {
                expect(doc.nombre).toBeDefined();
                expect(doc.email).toBeDefined();
                expect(doc._id).toBeUndefined();
            });
        });
        
        it('debería buscar documentos con opciones', async () => {
            const documentos = await mongoDB.buscarDocumentos(
                'usuarios',
                { activo: true },
                {},
                { sort: { edad: -1 }, limit: 2 }
            );
            
            expect(documentos).toHaveLength(2);
            expect(documentos[0].edad).toBeGreaterThanOrEqual(documentos[1].edad);
        });
        
        it('debería buscar un documento específico', async () => {
            const documento = await mongoDB.buscarUnDocumento('usuarios', { email: 'juan@test.com' });
            
            expect(documento).toBeDefined();
            expect(documento.nombre).toBe('Juan');
            expect(documento.email).toBe('juan@test.com');
        });
        
        it('debería retornar null para documento no encontrado', async () => {
            const documento = await mongoDB.buscarUnDocumento('usuarios', { email: 'inexistente@test.com' });
            
            expect(documento).toBeNull();
        });
    });
    
    describe('Actualización de Documentos', () => {
        let userId;
        
        beforeEach(async () => {
            // Insertar documento de prueba
            userId = await mongoDB.insertarDocumento('usuarios', {
                nombre: 'Test User',
                email: 'test@test.com',
                edad: 25
            });
        });
        
        it('debería actualizar un documento correctamente', async () => {
            const resultado = await mongoDB.actualizarDocumento(
                'usuarios',
                { _id: userId },
                { $set: { edad: 30 } }
            );
            
            expect(resultado.modifiedCount).toBe(1);
            
            // Verificar actualización
            const documento = await mongoDB.buscarUnDocumento('usuarios', { _id: userId });
            expect(documento.edad).toBe(30);
            expect(documento.fechaActualizacion).toBeDefined();
        });
        
        it('debería actualizar múltiples documentos', async () => {
            // Insertar más documentos
            await mongoDB.insertarMuchosDocumentos('usuarios', [
                { nombre: 'User 1', ciudad: 'Madrid' },
                { nombre: 'User 2', ciudad: 'Madrid' },
                { nombre: 'User 3', ciudad: 'Barcelona' }
            ]);
            
            const resultado = await mongoDB.actualizarMuchosDocumentos(
                'usuarios',
                { ciudad: 'Madrid' },
                { $set: { region: 'Centro' } }
            );
            
            expect(resultado.modifiedCount).toBe(2);
            
            // Verificar actualizaciones
            const documentosMadrid = await mongoDB.buscarDocumentos('usuarios', { ciudad: 'Madrid' });
            documentosMadrid.forEach(doc => {
                expect(doc.region).toBe('Centro');
            });
        });
        
        it('debería crear documento con upsert', async () => {
            const resultado = await mongoDB.actualizarDocumento(
                'usuarios',
                { email: 'nuevo@test.com' },
                { $set: { nombre: 'Nuevo Usuario', edad: 28 } },
                true
            );
            
            expect(resultado.upsertedCount).toBe(1);
            
            // Verificar que se creó el documento
            const documento = await mongoDB.buscarUnDocumento('usuarios', { email: 'nuevo@test.com' });
            expect(documento.nombre).toBe('Nuevo Usuario');
        });
    });
    
    describe('Eliminación de Documentos', () => {
        let userId;
        
        beforeEach(async () => {
            // Insertar documento de prueba
            userId = await mongoDB.insertarDocumento('usuarios', {
                nombre: 'Test User',
                email: 'test@test.com'
            });
        });
        
        it('debería eliminar un documento correctamente', async () => {
            const resultado = await mongoDB.eliminarDocumento('usuarios', { _id: userId });
            
            expect(resultado.deletedCount).toBe(1);
            
            // Verificar eliminación
            const documento = await mongoDB.buscarUnDocumento('usuarios', { _id: userId });
            expect(documento).toBeNull();
        });
        
        it('debería eliminar múltiples documentos', async () => {
            // Insertar más documentos
            await mongoDB.insertarMuchosDocumentos('usuarios', [
                { nombre: 'User 1', activo: false },
                { nombre: 'User 2', activo: false },
                { nombre: 'User 3', activo: true }
            ]);
            
            const resultado = await mongoDB.eliminarMuchosDocumentos('usuarios', { activo: false });
            
            expect(resultado.deletedCount).toBe(2);
            
            // Verificar que solo quedan usuarios activos
            const total = await mongoDB.contarDocumentos('usuarios');
            expect(total).toBe(1);
        });
        
        it('debería manejar eliminación de documento inexistente', async () => {
            const resultado = await mongoDB.eliminarDocumento('usuarios', { email: 'inexistente@test.com' });
            
            expect(resultado.deletedCount).toBe(0);
        });
    });
    
    describe('Conteo y Estadísticas', () => {
        beforeEach(async () => {
            // Insertar datos de prueba
            await mongoDB.insertarMuchosDocumentos('usuarios', [
                { nombre: 'User 1', activo: true, ciudad: 'Madrid' },
                { nombre: 'User 2', activo: true, ciudad: 'Barcelona' },
                { nombre: 'User 3', activo: false, ciudad: 'Madrid' },
                { nombre: 'User 4', activo: true, ciudad: 'Valencia' }
            ]);
        });
        
        it('debería contar todos los documentos', async () => {
            const total = await mongoDB.contarDocumentos('usuarios');
            expect(total).toBe(4);
        });
        
        it('debería contar documentos con filtro', async () => {
            const activos = await mongoDB.contarDocumentos('usuarios', { activo: true });
            expect(activos).toBe(3);
            
            const madrid = await mongoDB.contarDocumentos('usuarios', { ciudad: 'Madrid' });
            expect(madrid).toBe(2);
        });
        
        it('debería obtener estadísticas de la colección', async () => {
            const stats = await mongoDB.obtenerEstadisticas('usuarios');
            
            expect(stats.count).toBe(4);
            expect(stats.size).toBeGreaterThan(0);
            expect(stats.avgObjSize).toBeGreaterThan(0);
        });
    });
    
    describe('Integración', () => {
        it('debería realizar operación CRUD completa', async () => {
            // Create
            const userId = await mongoDB.insertarDocumento('usuarios', {
                nombre: 'Usuario Test',
                email: 'test@test.com',
                edad: 25
            });
            
            // Read
            const usuario = await mongoDB.buscarUnDocumento('usuarios', { _id: userId });
            expect(usuario.nombre).toBe('Usuario Test');
            
            // Update
            await mongoDB.actualizarDocumento(
                'usuarios',
                { _id: userId },
                { $set: { edad: 26 } }
            );
            
            const usuarioActualizado = await mongoDB.buscarUnDocumento('usuarios', { _id: userId });
            expect(usuarioActualizado.edad).toBe(26);
            
            // Delete
            await mongoDB.eliminarDocumento('usuarios', { _id: userId });
            
            const usuarioEliminado = await mongoDB.buscarUnDocumento('usuarios', { _id: userId });
            expect(usuarioEliminado).toBeNull();
        });
        
        it('debería manejar consultas complejas', async () => {
            // Insertar datos variados
            await mongoDB.insertarMuchosDocumentos('usuarios', [
                { nombre: 'Juan', edad: 30, ciudad: 'Madrid', activo: true, habilidades: ['JS', 'Node'] },
                { nombre: 'María', edad: 25, ciudad: 'Barcelona', activo: true, habilidades: ['Python'] },
                { nombre: 'Carlos', edad: 35, ciudad: 'Madrid', activo: false, habilidades: ['Java'] },
                { nombre: 'Ana', edad: 28, ciudad: 'Valencia', activo: true, habilidades: ['JS', 'React'] }
            ]);
            
            // Consulta compleja: usuarios activos de Madrid mayores de 25 años
            const usuariosComplejos = await mongoDB.buscarDocumentos(
                'usuarios',
                { 
                    activo: true, 
                    ciudad: 'Madrid', 
                    edad: { $gt: 25 } 
                },
                { nombre: 1, edad: 1, habilidades: 1, _id: 0 },
                { sort: { edad: -1 } }
            );
            
            expect(usuariosComplejos).toHaveLength(1);
            expect(usuariosComplejos[0].nombre).toBe('Juan');
            expect(usuariosComplejos[0].habilidades).toContain('JS');
        });
    });
    
    describe('Manejo de Errores', () => {
        it('debería manejar errores de base de datos', async () => {
            // Intentar operación en colección inexistente (esto no debería fallar)
            const documentos = await mongoDB.buscarDocumentos('coleccion_inexistente');
            expect(documentos).toHaveLength(0);
        });
        
        it('debería manejar filtros inválidos', async () => {
            // MongoDB debería manejar filtros inválidos graciosamente
            const documentos = await mongoDB.buscarDocumentos('usuarios', { $invalidOperator: 'value' });
            expect(Array.isArray(documentos)).toBe(true);
        });
    });
});

// Para ejecutar las pruebas:
// npm test __tests__/01-basico.test.js 