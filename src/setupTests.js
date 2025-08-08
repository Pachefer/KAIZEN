// Configuración global para las pruebas
import '@testing-library/jest-dom';

// Asegurar que las funciones globales de Vitest estén disponibles
import { expect } from 'vitest';

// Inicializar DOM manualmente si no está disponible
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Configurar expect globalmente si no está disponible
if (typeof global !== 'undefined' && !global.expect) {
  global.expect = expect;
}
