# 🚀 Guía Completa de React - Entrevistas y Dominio

## 🎯 Introducción a React

**React** es una biblioteca de JavaScript para construir interfaces de usuario interactivas. Desarrollada por Facebook, es fundamental para el desarrollo frontend moderno.

### 🌟 **¿Por qué React?**

- **Componentes reutilizables** - Arquitectura modular y mantenible
- **Virtual DOM** - Performance optimizada
- **Ecosistema masivo** - Herramientas y librerías abundantes
- **Comunidad activa** - Soporte y recursos constantes
- **Demanda laboral alta** - Desarrolladores muy solicitados

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Qué es el Virtual DOM en React?**

**Respuesta Completa:**

El **Virtual DOM** es una representación en memoria del DOM real. React usa el Virtual DOM para optimizar las actualizaciones de la interfaz.

**¿Cómo funciona?**

1. **Renderizado inicial**: React crea el Virtual DOM
2. **Cambios de estado**: Se crea un nuevo Virtual DOM
3. **Comparación (Diffing)**: React compara ambos Virtual DOMs
4. **Actualización eficiente**: Solo se actualizan los elementos que cambiaron

```jsx
// Ejemplo de Virtual DOM
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Contador: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}

// Virtual DOM (simplificado):
// {
//   type: 'div',
//   props: {
//     children: [
//       { type: 'h1', props: { children: 'Contador: 0' } },
//       { type: 'button', props: { onClick: fn, children: 'Incrementar' } }
//     ]
//   }
// }
```

**Simulador del Virtual DOM:**

```javascript
// virtual-dom-simulator.js
class VirtualDOMSimulator {
  constructor() {
    this.currentVDOM = null;
    this.previousVDOM = null;
    this.updateCount = 0;
  }
  
  // Crear elemento Virtual DOM
  createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.flat()
      }
    };
  }
  
  // Crear ejemplo de componente
  createCounterComponent(count) {
    return this.createElement(
      'div',
      { className: 'counter' },
      this.createElement('h1', null, `Contador: ${count}`),
      this.createElement(
        'button',
        { 
          onClick: () => this.handleClick(),
          className: 'btn'
        },
        'Incrementar'
      )
    );
  }
  
  // Simular click
  handleClick() {
    this.updateCount++;
    this.updateComponent();
  }
  
  // Actualizar componente
  updateComponent() {
    console.log(`\n🔄 Actualización #${this.updateCount}`);
    
    // Guardar VDOM anterior
    this.previousVDOM = this.currentVDOM;
    
    // Crear nuevo VDOM
    this.currentVDOM = this.createCounterComponent(this.updateCount);
    
    // Comparar VDOMs
    this.compareVDOMs();
    
    // Aplicar cambios
    this.applyChanges();
  }
  
  // Comparar VDOMs
  compareVDOMs() {
    if (!this.previousVDOM) {
      console.log('📝 Primera renderización - creando DOM completo');
      return;
    }
    
    console.log('🔍 Comparando Virtual DOMs...');
    
    const changes = this.findDifferences(this.previousVDOM, this.currentVDOM);
    
    if (changes.length === 0) {
      console.log('✅ No hay cambios - no se actualiza el DOM real');
    } else {
      console.log(`📊 Cambios detectados: ${changes.length}`);
      changes.forEach((change, index) => {
        console.log(`   ${index + 1}. ${change.description}`);
      });
    }
  }
  
  // Encontrar diferencias
  findDifferences(oldVDOM, newVDOM) {
    const changes = [];
    
    if (oldVDOM.type !== newVDOM.type) {
      changes.push({
        type: 'REPLACE',
        description: `Reemplazar ${oldVDOM.type} por ${newVDOM.type}`,
        old: oldVDOM,
        new: newVDOM
      });
      return changes;
    }
    
    // Comparar props
    const oldProps = oldVDOM.props || {};
    const newProps = newVDOM.props || {};
    
    Object.keys(newProps).forEach(key => {
      if (key === 'children') return; // Los children se comparan por separado
      
      if (oldProps[key] !== newProps[key]) {
        changes.push({
          type: 'UPDATE_PROP',
          description: `Actualizar prop ${key}: ${oldProps[key]} → ${newProps[key]}`,
          prop: key,
          oldValue: oldProps[key],
          newValue: newProps[key]
        });
      }
    });
    
    // Comparar children
    const oldChildren = oldVDOM.props?.children || [];
    const newChildren = newVDOM.props?.children || [];
    
    if (oldChildren.length !== newChildren.length) {
      changes.push({
        type: 'CHILDREN_COUNT',
        description: `Cambio en número de children: ${oldChildren.length} → ${newChildren.length}`,
        old: oldChildren.length,
        new: newChildren.length
      });
    } else {
      // Comparar children individuales
      oldChildren.forEach((oldChild, index) => {
        const newChild = newChildren[index];
        if (oldChild !== newChild) {
          changes.push({
            type: 'CHILD_UPDATE',
            description: `Actualizar child ${index}: ${oldChild} → ${newChild}`,
            index,
            old: oldChild,
            new: newChild
          });
        }
      });
    }
    
    return changes;
  }
  
  // Aplicar cambios
  applyChanges() {
    console.log('⚡ Aplicando cambios al DOM real...');
    
    // Simular tiempo de aplicación
    const applyTime = Math.random() * 10 + 5;
    
    setTimeout(() => {
      console.log(`✅ Cambios aplicados en ${applyTime.toFixed(2)}ms`);
      console.log('🎯 DOM real actualizado eficientemente');
      
      // Mostrar estadísticas
      this.showStatistics();
    }, applyTime);
  }
  
  // Mostrar estadísticas
  showStatistics() {
    console.log('\n📊 ESTADÍSTICAS DEL VIRTUAL DOM:');
    console.log(`   🔄 Actualizaciones: ${this.updateCount}`);
    console.log(`   📝 Elementos en VDOM: ${this.countElements(this.currentVDOM)}`);
    console.log(`   ⚡ Tiempo promedio de actualización: ${this.calculateAverageTime()}ms`);
    
    const efficiency = this.calculateEfficiency();
    console.log(`   🎯 Eficiencia: ${efficiency}%`);
  }
  
  // Contar elementos en VDOM
  countElements(vdom) {
    if (!vdom) return 0;
    
    let count = 1; // El elemento actual
    
    if (vdom.props?.children) {
      vdom.props.children.forEach(child => {
        if (typeof child === 'object') {
          count += this.countElements(child);
        }
      });
    }
    
    return count;
  }
  
  // Calcular tiempo promedio
  calculateAverageTime() {
    // Simulación simple
    return (Math.random() * 5 + 3).toFixed(2);
  }
  
  // Calcular eficiencia
  calculateEfficiency() {
    // Simulación: eficiencia basada en número de actualizaciones
    if (this.updateCount === 0) return 100;
    
    const baseEfficiency = 95;
    const efficiencyLoss = Math.min(this.updateCount * 0.5, 10);
    
    return Math.max(baseEfficiency - efficiencyLoss, 80);
  }
  
  // Iniciar simulación
  startSimulation() {
    console.log('🚀 SIMULADOR DEL VIRTUAL DOM EN REACT\n');
    
    // Crear VDOM inicial
    this.currentVDOM = this.createCounterComponent(0);
    
    console.log('📝 VDOM inicial creado:');
    console.log(JSON.stringify(this.currentVDOM, null, 2));
    
    console.log('\n🔄 Simulando actualizaciones...');
    
    // Simular múltiples actualizaciones
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.handleClick();
      }, i * 1000);
    }
    
    // Mostrar resumen final
    setTimeout(() => {
      console.log('\n🎉 Simulación completada');
      this.showFinalSummary();
    }, 6000);
  }
  
  // Mostrar resumen final
  showFinalSummary() {
    console.log('\n📋 RESUMEN FINAL:');
    console.log('=' .repeat(40));
    
    console.log('🌟 BENEFICIOS DEL VIRTUAL DOM:');
    console.log('   ✅ Actualizaciones eficientes');
    console.log('   ✅ Solo se modifican elementos que cambiaron');
    console.log('   ✅ Mejor performance que manipulación directa del DOM');
    console.log('   ✅ Abstracción del DOM real');
    
    console.log('\n💡 CASOS DE USO:');
    console.log('   📱 Aplicaciones con actualizaciones frecuentes');
    console.log('   🎮 Interfaces interactivas complejas');
    console.log('   📊 Dashboards en tiempo real');
    console.log('   🔄 Formularios dinámicos');
  }
}

// Ejecutar simulador
const vdomSimulator = new VirtualDOMSimulator();
vdomSimulator.startSimulation();
```

---

### 🔴 **PREGUNTA 2: ¿Cuál es la diferencia entre estado y props en React?**

**Respuesta Completa:**

**Props (Properties):**
- Datos pasados de componente padre a hijo
- Inmutables (no se pueden modificar)
- Flujo unidireccional de datos
- Se usan para configuración y datos estáticos

**Estado (State):**
- Datos internos del componente
- Mutables (se pueden modificar)
- Controla el comportamiento del componente
- Se actualiza con `setState` o hooks

```jsx
// Ejemplo de Props vs State
function UserProfile({ name, email, isAdmin }) { // Props
  const [isOnline, setIsOnline] = useState(false); // State
  const [lastSeen, setLastSeen] = useState(null);
  
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline); // Modificar state
    setLastSeen(new Date());
  };
  
  return (
    <div>
      <h2>{name}</h2> {/* Usar props */}
      <p>{email}</p>
      <span>Admin: {isAdmin ? 'Sí' : 'No'}</span>
      
      <button onClick={toggleOnlineStatus}>
        {isOnline ? 'En línea' : 'Desconectado'}
      </button>
      
      {lastSeen && (
        <p>Última vez: {lastSeen.toLocaleString()}</p>
      )}
    </div>
  );
}

// Uso del componente
<UserProfile 
  name="Juan Pérez" 
  email="juan@example.com" 
  isAdmin={true} 
/>
```

**Simulador de Props vs State:**

```javascript
// props-vs-state-simulator.js
class PropsVsStateSimulator {
  constructor() {
    this.components = new Map();
    this.updateCount = 0;
  }
  
  // Crear componente con props y state
  createComponent(name, initialProps) {
    const component = {
      name,
      props: { ...initialProps },
      state: {
        renderCount: 0,
        lastUpdate: new Date(),
        internalData: Math.random()
      },
      children: [],
      parent: null
    };
    
    this.components.set(name, component);
    return component;
  }
  
  // Simular paso de props
  passProps(fromComponent, toComponent, newProps) {
    console.log(`\n📤 Pasando props de ${fromComponent} a ${toComponent}:`);
    
    const component = this.components.get(toComponent);
    if (!component) return;
    
    // Simular actualización de props
    const oldProps = { ...component.props };
    component.props = { ...component.props, ...newProps };
    
    console.log('   📝 Props anteriores:', oldProps);
    console.log('   📝 Props nuevas:', component.props);
    
    // Verificar inmutabilidad
    console.log('   🔒 Props son inmutables - se crea nueva referencia');
    console.log(`   📊 Referencia anterior: ${oldProps === component.props ? 'Misma' : 'Diferente'}`);
    
    // Trigger re-render
    this.triggerReRender(toComponent, 'props');
  }
  
  // Simular cambio de state
  updateState(componentName, newState) {
    console.log(`\n🔄 Actualizando state de ${componentName}:`);
    
    const component = this.components.get(componentName);
    if (!component) return;
    
    const oldState = { ...component.state };
    component.state = { ...component.state, ...newState };
    
    console.log('   📝 State anterior:', oldState);
    console.log('   📝 State nuevo:', component.state);
    
    // Verificar mutabilidad
    console.log('   🔓 State es mutable - se puede modificar directamente');
    console.log(`   📊 Referencia anterior: ${oldState === component.state ? 'Misma' : 'Diferente'}`);
    
    // Trigger re-render
    this.triggerReRender(componentName, 'state');
  }
  
  // Trigger re-render
  triggerReRender(componentName, triggerType) {
    const component = this.components.get(componentName);
    if (!component) return;
    
    component.state.renderCount++;
    component.state.lastUpdate = new Date();
    
    console.log(`   🎯 Re-render #${component.state.renderCount} (triggered by ${triggerType})`);
    
    // Simular tiempo de render
    const renderTime = Math.random() * 20 + 10;
    
    setTimeout(() => {
      console.log(`   ✅ Render completado en ${renderTime.toFixed(2)}ms`);
      this.updateCount++;
      
      // Mostrar estadísticas del componente
      this.showComponentStats(componentName);
    }, renderTime);
  }
  
  // Mostrar estadísticas del componente
  showComponentStats(componentName) {
    const component = this.components.get(componentName);
    if (!component) return;
    
    console.log(`\n📊 Estadísticas de ${componentName}:`);
    console.log(`   🔄 Re-renders: ${component.state.renderCount}`);
    console.log(`   ⏰ Última actualización: ${component.state.lastUpdate.toLocaleTimeString()}`);
    console.log(`   📝 Props actuales: ${Object.keys(component.props).length} props`);
    console.log(`   🎯 State actual: ${Object.keys(component.state).length} valores`);
  }
  
  // Demostrar flujo de datos
  demonstrateDataFlow() {
    console.log('🔄 DEMOSTRANDO FLUJO DE DATOS EN REACT\n');
    
    // Crear jerarquía de componentes
    const parent = this.createComponent('Parent', { theme: 'dark', language: 'es' });
    const child1 = this.createComponent('Child1', { name: 'Hijo 1', age: 10 });
    const child2 = this.createComponent('Child2', { name: 'Hijo 2', age: 15 });
    
    // Establecer relaciones
    parent.children = [child1, child2];
    child1.parent = parent;
    child2.parent = parent;
    
    console.log('🏗️  Jerarquía de componentes creada:');
    console.log('   Parent');
    console.log('   ├── Child1');
    console.log('   └── Child2');
    
    // Simular flujo de datos
    console.log('\n📤 FLUJO DE PROPS (Padre → Hijos):');
    
    setTimeout(() => {
      this.passProps('Parent', 'Child1', { theme: 'light', isActive: true });
    }, 1000);
    
    setTimeout(() => {
      this.passProps('Parent', 'Child2', { theme: 'dark', isActive: false });
    }, 2000);
    
    // Simular cambios de state
    console.log('\n🔄 CAMBIOS DE STATE (Internos):');
    
    setTimeout(() => {
      this.updateState('Child1', { isOnline: true, lastActivity: new Date() });
    }, 3000);
    
    setTimeout(() => {
      this.updateState('Child2', { isOnline: false, lastActivity: new Date() });
    }, 4000);
    
    // Simular cambio en parent que afecta a hijos
    setTimeout(() => {
      console.log('\n🌊 CAMBIO EN PARENT AFECTA A HIJOS:');
      this.passProps('Parent', 'Child1', { theme: 'blue' });
      this.passProps('Parent', 'Child2', { theme: 'blue' });
    }, 5000);
    
    // Mostrar resumen final
    setTimeout(() => {
      this.showFinalSummary();
    }, 7000);
  }
  
  // Mostrar resumen final
  showFinalSummary() {
    console.log('\n🎉 RESUMEN FINAL DEL FLUJO DE DATOS');
    console.log('=' .repeat(50));
    
    console.log('\n📊 PROPS (Inmutables):');
    console.log('   ✅ Se pasan de padre a hijo');
    console.log('   ✅ No se pueden modificar en el hijo');
    console.log('   ✅ Trigger re-render cuando cambian');
    console.log('   ✅ Flujo unidireccional de datos');
    
    console.log('\n🔄 STATE (Mutable):');
    console.log('   ✅ Es interno del componente');
    console.log('   ✅ Se puede modificar con setState');
    console.log('   ✅ Trigger re-render cuando cambia');
    console.log('   ✅ Controla comportamiento del componente');
    
    console.log('\n💡 MEJORES PRÁCTICAS:');
    console.log('   🎯 Usa props para configuración y datos estáticos');
    console.log('   🎯 Usa state para datos que cambian internamente');
    console.log('   🎯 Mantén el state lo más cerca posible de donde se usa');
    console.log('   🎯 Evita prop drilling - considera Context o Redux');
    
    console.log(`\n📈 Total de actualizaciones simuladas: ${this.updateCount}`);
  }
  
  // Iniciar simulación
  startSimulation() {
    console.log('🚀 SIMULADOR DE PROPS VS STATE EN REACT\n');
    
    this.demonstrateDataFlow();
  }
}

// Ejecutar simulador
const propsStateSimulator = new PropsVsStateSimulator();
propsStateSimulator.startSimulation();
```

---

### 🔴 **PREGUNTA 3: ¿Qué son los hooks en React y cómo funcionan?**

**Respuesta Completa:**

Los **hooks** son funciones que permiten usar estado y otras características de React en componentes funcionales. Fueron introducidos en React 16.8.

**Hooks Principales:**

1. **useState** - Manejar estado local
2. **useEffect** - Efectos secundarios
3. **useContext** - Consumir contexto
4. **useReducer** - Estado complejo
5. **useCallback** - Memoización de funciones
6. **useMemo** - Memoización de valores

```jsx
// Ejemplo de hooks
import React, { useState, useEffect, useCallback, useMemo } from 'react';

function UserDashboard({ userId }) {
  // useState - Estado local
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // useEffect - Efectos secundarios
  useEffect(() => {
    fetchUser(userId);
  }, [userId]); // Dependencias
  
  // useCallback - Memoización de función
  const handleUserUpdate = useCallback((newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  }, []); // Sin dependencias
  
  // useMemo - Memoización de valor
  const userStats = useMemo(() => {
    if (!user) return null;
    
    return {
      fullName: `${user.firstName} ${user.lastName}`,
      age: new Date().getFullYear() - user.birthYear,
      isAdult: new Date().getFullYear() - user.birthYear >= 18
    };
  }, [user]); // Depende de user
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Usuario no encontrado</div>;
  
  return (
    <div>
      <h1>{userStats.fullName}</h1>
      <p>Edad: {userStats.age}</p>
      <p>Adulto: {userStats.isAdult ? 'Sí' : 'No'}</p>
      <button onClick={() => handleUserUpdate({ isActive: !user.isActive })}>
        {user.isActive ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  );
}
```

**Simulador de Hooks:**

```javascript
// hooks-simulator.js
class HooksSimulator {
  constructor() {
    this.components = new Map();
    this.hookCalls = [];
    this.renderCount = 0;
  }
  
  // Simular useState
  useState(initialValue) {
    const componentId = this.getCurrentComponentId();
    const hookIndex = this.getHookIndex(componentId);
    
    if (!this.components.has(componentId)) {
      this.components.set(componentId, {
        state: [],
        effects: [],
        callbacks: [],
        memos: []
      });
    }
    
    const component = this.components.get(componentId);
    
    // Si es la primera vez, inicializar
    if (!component.state[hookIndex]) {
      component.state[hookIndex] = initialValue;
    }
    
    const currentValue = component.state[hookIndex];
    
    // Función setter
    const setValue = (newValue) => {
      const oldValue = component.state[hookIndex];
      component.state[hookIndex] = newValue;
      
      console.log(`   🔄 useState actualizado: ${oldValue} → ${newValue}`);
      
      // Trigger re-render
      this.triggerReRender(componentId);
    };
    
    this.hookCalls.push({
      type: 'useState',
      componentId,
      hookIndex,
      value: currentValue
    });
    
    return [currentValue, setValue];
  }
  
  // Simular useEffect
  useEffect(effect, dependencies) {
    const componentId = this.getCurrentComponentId();
    const hookIndex = this.getHookIndex(componentId);
    
    if (!this.components.has(componentId)) {
      this.components.set(componentId, {
        state: [],
        effects: [],
        callbacks: [],
        memos: []
      });
    }
    
    const component = this.components.get(componentId);
    
    // Verificar si las dependencias cambiaron
    const shouldRunEffect = this.shouldRunEffect(
      component.effects[hookIndex],
      dependencies
    );
    
    if (shouldRunEffect) {
      console.log(`   ⚡ useEffect ejecutándose (dependencias: [${dependencies?.join(', ') || 'ninguna'}])`);
      
      // Ejecutar efecto
      const cleanup = effect();
      
      // Guardar información del efecto
      component.effects[hookIndex] = {
        dependencies,
        cleanup,
        lastRun: Date.now()
      };
      
      this.hookCalls.push({
        type: 'useEffect',
        componentId,
        hookIndex,
        dependencies,
        executed: true
      });
    } else {
      console.log(`   ⏭️  useEffect omitido - dependencias no cambiaron`);
      
      this.hookCalls.push({
        type: 'useEffect',
        componentId,
        hookIndex,
        dependencies,
        executed: false
      });
    }
  }
  
  // Simular useCallback
  useCallback(callback, dependencies) {
    const componentId = this.getCurrentComponentId();
    const hookIndex = this.getHookIndex(componentId);
    
    if (!this.components.has(componentId)) {
      this.components.set(componentId, {
        state: [],
        effects: [],
        callbacks: [],
        memos: []
      });
    }
    
    const component = this.components.get(componentId);
    
    // Verificar si las dependencias cambiaron
    const shouldRecreateCallback = this.shouldRunEffect(
      component.callbacks[hookIndex],
      dependencies
    );
    
    if (shouldRecreateCallback) {
      console.log(`   🔄 useCallback recreando función (dependencias: [${dependencies?.join(', ') || 'ninguna'}])`);
      
      component.callbacks[hookIndex] = {
        callback,
        dependencies,
        lastCreated: Date.now()
      };
      
      this.hookCalls.push({
        type: 'useCallback',
        componentId,
        hookIndex,
        dependencies,
        recreated: true
      });
    } else {
      console.log(`   ✅ useCallback reutilizando función existente`);
      
      this.hookCalls.push({
        type: 'useCallback',
        componentId,
        hookIndex,
        dependencies,
        recreated: false
      });
    }
    
    return component.callbacks[hookIndex].callback;
  }
  
  // Simular useMemo
  useMemo(factory, dependencies) {
    const componentId = this.getCurrentComponentId();
    const hookIndex = this.getHookIndex(componentId);
    
    if (!this.components.has(componentId)) {
      this.components.set(componentId, {
        state: [],
        effects: [],
        callbacks: [],
        memos: []
      });
    }
    
    const component = this.components.get(componentId);
    
    // Verificar si las dependencias cambiaron
    const shouldRecalculate = this.shouldRunEffect(
      component.memos[hookIndex],
      dependencies
    );
    
    if (shouldRecalculate) {
      console.log(`   🧮 useMemo recalculando valor (dependencias: [${dependencies?.join(', ') || 'ninguna'}])`);
      
      const newValue = factory();
      
      component.memos[hookIndex] = {
        value: newValue,
        dependencies,
        lastCalculated: Date.now()
      };
      
      this.hookCalls.push({
        type: 'useMemo',
        componentId,
        hookIndex,
        dependencies,
        recalculated: true,
        value: newValue
      });
    } else {
      console.log(`   ✅ useMemo reutilizando valor calculado`);
      
      this.hookCalls.push({
        type: 'useMemo',
        componentId,
        hookIndex,
        dependencies,
        recalculated: false,
        value: component.memos[hookIndex].value
      });
    }
    
    return component.memos[hookIndex].value;
  }
  
  // Verificar si se debe ejecutar efecto
  shouldRunEffect(previousEffect, dependencies) {
    if (!previousEffect) return true;
    if (!dependencies) return true;
    
    const oldDeps = previousEffect.dependencies;
    if (!oldDeps) return true;
    
    if (dependencies.length !== oldDeps.length) return true;
    
    return dependencies.some((dep, index) => dep !== oldDeps[index]);
  }
  
  // Obtener ID del componente actual
  getCurrentComponentId() {
    return `Component_${this.renderCount}`;
  }
  
  // Obtener índice del hook
  getHookIndex(componentId) {
    const component = this.components.get(componentId);
    if (!component) return 0;
    
    return component.state.length + component.effects.length + 
           component.callbacks.length + component.memos.length;
  }
  
  // Trigger re-render
  triggerReRender(componentId) {
    console.log(`   🔄 Re-render de ${componentId}`);
    this.renderCount++;
  }
  
  // Demostrar hooks en acción
  demonstrateHooks() {
    console.log('🚀 DEMOSTRANDO HOOKS EN REACT\n');
    
    // Simular componente con múltiples hooks
    console.log('📝 Render #1 - Inicialización:');
    this.simulateComponentRender();
    
    console.log('\n📝 Render #2 - Cambio de estado:');
    this.simulateComponentRender();
    
    console.log('\n📝 Render #3 - Dependencias cambiaron:');
    this.simulateComponentRender();
    
    console.log('\n📝 Render #4 - Sin cambios:');
    this.simulateComponentRender();
    
    // Mostrar resumen
    setTimeout(() => {
      this.showHooksSummary();
    }, 1000);
  }
  
  // Simular render de componente
  simulateComponentRender() {
    const [count, setCount] = this.useState(0);
    const [name, setName] = this.useState('Usuario');
    
    this.useEffect(() => {
      console.log(`   📡 Efecto: Usuario ${name} tiene contador en ${count}`);
      return () => console.log(`   🧹 Cleanup del efecto`);
    }, [name, count]);
    
    const handleClick = this.useCallback(() => {
      setCount(count + 1);
    }, [count]);
    
    const expensiveValue = this.useMemo(() => {
      return `Valor calculado para ${name}: ${count * 2}`;
    }, [name, count]);
    
    console.log(`   📊 Estado actual: count=${count}, name=${name}`);
    console.log(`   🎯 Valor memoizado: ${expensiveValue}`);
    
    // Simular click
    if (count < 3) {
      setTimeout(() => {
        console.log(`   🖱️  Simulando click...`);
        handleClick();
      }, 100);
    }
  }
  
  // Mostrar resumen de hooks
  showHooksSummary() {
    console.log('\n🎉 RESUMEN DE HOOKS');
    console.log('=' .repeat(40));
    
    console.log('\n📊 Estadísticas de uso:');
    const hookTypes = this.hookCalls.reduce((acc, call) => {
      acc[call.type] = (acc[call.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(hookTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} llamadas`);
    });
    
    console.log('\n🌟 BENEFICIOS DE LOS HOOKS:');
    console.log('   ✅ Permiten usar estado en componentes funcionales');
    console.log('   ✅ Mejor reutilización de lógica');
    console.log('   ✅ Evitan problemas de this');
    console.log('   ✅ Más fácil de testear');
    
    console.log('\n💡 REGLAS DE LOS HOOKS:');
    console.log('   🚫 Solo llamar hooks en el nivel superior');
    console.log('   🚫 Solo llamar hooks en componentes React o custom hooks');
    console.log('   🔄 Los hooks se ejecutan en el mismo orden cada render');
    console.log('   📝 Las dependencias deben ser estables');
    
    console.log(`\n📈 Total de renders simulados: ${this.renderCount}`);
  }
  
  // Iniciar simulación
  startSimulation() {
    console.log('🚀 SIMULADOR DE HOOKS EN REACT\n');
    
    this.demonstrateHooks();
  }
}

// Ejecutar simulador
const hooksSimulator = new HooksSimulator();
hooksSimulator.startSimulation();
```

---

## 🧪 **SIMULADOR COMPLETO DE REACT**

### 🎯 **Simulador de Entrevista Técnica**

```javascript
// react-interview-simulator.js
class ReactInterviewSimulator {
  constructor() {
    this.questions = this.loadQuestions();
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = new Map();
    this.categories = {
      'Fundamentos': 0,
      'Componentes': 0,
      'Hooks': 0,
      'Estado': 0,
      'Performance': 0,
      'Patrones': 0
    };
  }
  
  // Cargar preguntas de entrevista
  loadQuestions() {
    return [
      {
        id: 1,
        category: 'Fundamentos',
        question: '¿Qué es el Virtual DOM en React?',
        code: `// Ejemplo de Virtual DOM
const element = React.createElement('div', {
  className: 'container'
}, 'Hello World');`,
        options: [
          'Una copia del DOM real en memoria',
          'Un framework de JavaScript',
          'Un patrón de diseño',
          'Una librería de CSS'
        ],
        correct: 0,
        explanation: 'El Virtual DOM es una representación en memoria del DOM real que React usa para optimizar las actualizaciones.',
        difficulty: 'Básico'
      },
      {
        id: 2,
        category: 'Componentes',
        question: '¿Cuál es la diferencia entre componente controlado y no controlado?',
        code: `// Componente controlado
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />

// Componente no controlado
<input ref={inputRef} defaultValue="initial" />`,
        options: [
          'No hay diferencia funcional',
          'Los controlados usan estado, los no controlados usan refs',
          'Los controlados son más rápidos',
          'Los no controlados son más seguros'
        ],
        correct: 1,
        explanation: 'Los componentes controlados usan estado de React, mientras que los no controlados usan refs para acceder directamente al DOM.',
        difficulty: 'Intermedio'
      },
      {
        id: 3,
        category: 'Hooks',
        question: '¿Cuándo se ejecuta useEffect con array de dependencias vacío?',
        code: `useEffect(() => {
  console.log('Effect ejecutado');
}, []);`,
        options: [
          'En cada render',
          'Solo en el primer render',
          'Nunca',
          'Solo cuando el componente se desmonta'
        ],
        correct: 1,
        explanation: 'useEffect con array vacío se ejecuta solo una vez, después del primer render del componente.',
        difficulty: 'Intermedio'
      },
      {
        id: 4,
        category: 'Estado',
        question: '¿Por qué no se debe mutar el estado directamente?',
        code: `// ❌ Incorrecto
this.state.count = 5;

// ✅ Correcto
this.setState({ count: 5 });`,
        options: [
          'Porque es más lento',
          'Porque React no detecta el cambio y no re-renderiza',
          'Porque causa errores de sintaxis',
          'Porque es una mala práctica de programación'
        ],
        correct: 1,
        explanation: 'React no detecta cambios directos en el estado, por lo que el componente no se re-renderiza. Siempre usa setState.',
        difficulty: 'Avanzado'
      },
      {
        id: 5,
        category: 'Performance',
        question: '¿Cuál es el propósito de React.memo?',
        code: `const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});`,
        options: [
          'Hacer el componente más rápido',
          'Prevenir re-renders innecesarios',
          'Mejorar la legibilidad del código',
          'Agregar funcionalidad al componente'
        ],
        correct: 1,
        explanation: 'React.memo previene re-renders del componente cuando las props no han cambiado, mejorando la performance.',
        difficulty: 'Intermedio'
      }
    ];
  }
  
  // Mostrar pregunta actual
  showCurrentQuestion() {
    const question = this.questions[this.currentQuestion];
    
    console.log(`\n📝 PREGUNTA ${this.currentQuestion + 1} de ${this.questions.length}`);
    console.log(`🏷️  Categoría: ${question.category}`);
    console.log(`📊 Dificultad: ${question.difficulty}`);
    console.log(`\n❓ ${question.question}`);
    
    if (question.code) {
      console.log('\n💻 Código:');
      console.log(question.code);
    }
    
    console.log('\n📋 Opciones:');
    question.options.forEach((option, index) => {
      console.log(`   ${index + 1}. ${option}`);
    });
    
    return question;
  }
  
  // Responder pregunta
  answerQuestion(answerIndex) {
    const question = this.questions[this.currentQuestion];
    const isCorrect = answerIndex === question.correct;
    
    this.answers.set(question.id, {
      answer: answerIndex,
      correct: isCorrect,
      explanation: question.explanation
    });
    
    if (isCorrect) {
      this.score++;
      this.categories[question.category]++;
      console.log('\n✅ ¡Respuesta correcta!');
    } else {
      console.log('\n❌ Respuesta incorrecta');
    }
    
    console.log(`\n📖 Explicación: ${question.explanation}`);
    
    return isCorrect;
  }
  
  // Calcular puntuación final
  calculateFinalScore() {
    const totalQuestions = this.questions.length;
    const percentage = (this.score / totalQuestions) * 100;
    
    let level = '';
    if (percentage >= 90) level = '🚀 Experto';
    else if (percentage >= 80) level = '⭐ Avanzado';
    else if (percentage >= 70) level = '✅ Intermedio';
    else if (percentage >= 60) level = '📚 Básico';
    else level = '🔴 Necesita mejorar';
    
    return {
      score: this.score,
      total: totalQuestions,
      percentage: percentage.toFixed(1),
      level: level
    };
  }
  
  // Generar reporte detallado
  generateDetailedReport() {
    const finalScore = this.calculateFinalScore();
    
    console.log('\n📊 REPORTE FINAL DE LA ENTREVISTA');
    console.log('=' .repeat(50));
    
    console.log(`\n🎯 Puntuación General:`);
    console.log(`   📈 Respuestas correctas: ${finalScore.score}/${finalScore.total}`);
    console.log(`   📊 Porcentaje: ${finalScore.percentage}%`);
    console.log(`   🏆 Nivel: ${finalScore.level}`);
    
    console.log(`\n📚 Análisis por Categoría:`);
    Object.entries(this.categories).forEach(([category, correct]) => {
      const totalInCategory = this.questions.filter(q => q.category === category).length;
      const percentage = totalInCategory > 0 ? (correct / totalInCategory * 100).toFixed(1) : 0;
      console.log(`   ${category}: ${correct}/${totalInCategory} (${percentage}%)`);
    });
    
    // Recomendaciones
    console.log(`\n💡 RECOMENDACIONES:`);
    
    if (finalScore.percentage < 70) {
      console.log(`   📖 Revisa los fundamentos de React`);
      console.log(`   🔄 Practica con componentes y hooks`);
      console.log(`   🧪 Construye proyectos pequeños para aplicar conceptos`);
    } else if (finalScore.percentage < 85) {
      console.log(`   🚀 Profundiza en conceptos avanzados`);
      console.log(`   📊 Mejora tu comprensión de performance y patrones`);
      console.log(`   🔒 Estudia testing y mejores prácticas`);
    } else {
      console.log(`   🎉 ¡Excelente! Estás listo para entrevistas técnicas`);
      console.log(`   🌟 Considera certificaciones y posiciones senior`);
      console.log(`   💼 Busca roles de arquitecto o tech lead`);
    }
  }
  
  // Ejecutar simulador completo
  async runSimulator() {
    console.log('🎯 SIMULADOR DE ENTREVISTA TÉCNICA - REACT');
    console.log('=' .repeat(60));
    console.log('\n📋 Instrucciones:');
    console.log('   • Lee cada pregunta cuidadosamente');
    console.log('   • Analiza el código si está presente');
    console.log('   • Selecciona la mejor respuesta');
    console.log('   • Revisa las explicaciones para aprender');
    console.log('\n🚀 ¡Comencemos!\n');
    
    // Simular respuestas automáticas para demostración
    for (let i = 0; i < this.questions.length; i++) {
      this.showCurrentQuestion();
      
      // Simular respuesta (en una entrevista real, el usuario respondería)
      const randomAnswer = Math.floor(Math.random() * 4);
      this.answerQuestion(randomAnswer);
      
      // Pausa entre preguntas
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (i < this.questions.length - 1) {
        console.log('\n⏭️  Siguiente pregunta...\n');
      }
    }
    
    // Mostrar reporte final
    this.generateDetailedReport();
  }
}

// Ejecutar simulador
const interviewSimulator = new ReactInterviewSimulator();
interviewSimulator.runSimulator();
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos**
   - JSX y Virtual DOM
   - Componentes y props
   - Estado y ciclo de vida

2. **Hooks Modernos**
   - useState, useEffect, useContext
   - useReducer, useCallback, useMemo
   - Custom hooks

3. **Patrones Avanzados**
   - Render props y HOCs
   - Context API
   - Error boundaries

4. **Performance**
   - React.memo
   - useMemo y useCallback
   - Code splitting

5. **Testing**
   - Jest y React Testing Library
   - Testing de hooks
   - Testing de componentes

### 🚀 **Proyectos Prácticos Recomendados:**

1. **Todo App con hooks**
2. **E-commerce con Context API**
3. **Dashboard con gráficos**
4. **Chat app en tiempo real**
5. **Portfolio personal**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de React! 🚀**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como desarrollador React! 🎯**
