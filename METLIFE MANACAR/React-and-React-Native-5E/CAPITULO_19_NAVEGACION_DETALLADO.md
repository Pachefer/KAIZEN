# 📖 CAPÍTULO 19: NAVEGACIÓN EN REACT NATIVE
## Análisis Completo y Detallado

---

## 🎯 OBJETIVOS DEL CAPÍTULO

Al completar este capítulo, comprenderás:
- ✅ **React Navigation** y sus tipos principales
- ✅ **Stack Navigator** para navegación jerárquica
- ✅ **Tab Navigator** para navegación por pestañas
- ✅ **Drawer Navigator** para menú lateral
- ✅ **Route Parameters** y paso de datos
- ✅ **Navigation Props** y métodos de navegación
- ✅ **TypeScript** con React Navigation
- ✅ **Patrones de navegación** móvil

---

## 🔍 CONCEPTO FUNDAMENTAL: ¿QUÉ ES REACT NAVIGATION?

### **Definición:**
React Navigation es una biblioteca que proporciona **navegación entre pantallas** en aplicaciones React Native. Maneja la navegación, el historial y las transiciones entre pantallas.

### **Tipos de Navegadores:**
```javascript
// 🎯 Stack Navigator - Navegación jerárquica
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 🎯 Tab Navigator - Navegación por pestañas
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 🎯 Drawer Navigator - Menú lateral
import { createDrawerNavigator } from '@react-navigation/drawer';
```

---

## 💻 ANÁLISIS DEL CÓDIGO: NAVEGACIÓN BÁSICA

### **Archivo: `router.ts`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Definición de tipos TypeScript para las rutas
export type RootStackParamList = {
  Home: undefined;    // Pantalla Home sin parámetros
  Settings: undefined; // Pantalla Settings sin parámetros
};
```

### **Archivo: `App.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de React y React Navigation
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Settings from "./Settings";
import { RootStackParamList } from "./router";

// 🎯 Creación del navegador Stack con tipos TypeScript
const Stack = createNativeStackNavigator<RootStackParamList>();

// 🎯 Componente principal de la aplicación
export default function App() {
  return (
    // 🏗️ Contenedor de navegación que envuelve toda la app
    <NavigationContainer>
      {/* 🧭 Navegador Stack que maneja las pantallas */}
      <Stack.Navigator>
        {/* 📱 Pantalla Home - pantalla inicial */}
        <Stack.Screen name="Home" component={Home} />
        
        {/* ⚙️ Pantalla Settings - pantalla secundaria */}
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### **Archivo: `Home.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de React y React Native
import React from "react";
import { View, Text, Button, StatusBar } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./router";

// 🎯 Definición de tipos para las props de navegación
type Props = NativeStackScreenProps<RootStackParamList>;

// 🎯 Componente Home que recibe props de navegación
export default function Home({ navigation }: Props) {
  return (
    // 🏗️ Contenedor principal con estilos
    <View style={styles.container}>
      {/* 📱 Configuración de la barra de estado */}
      <StatusBar barStyle="dark-content" />
      
      {/* 📝 Título de la pantalla */}
      <Text>Home Screen</Text>
      
      {/* 🔘 Botón para navegar a Settings */}
      <Button
        title="Settings"
        onPress={() => navigation.navigate("Settings")}
      />
    </View>
  );
}
```

### **Archivo: `Settings.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de React y React Native
import React from "react";
import { View, Text, Button } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./router";

// 🎯 Definición de tipos para las props de navegación
type Props = NativeStackScreenProps<RootStackParamList>;

// 🎯 Componente Settings que recibe props de navegación
export default function Settings({ navigation }: Props) {
  return (
    // 🏗️ Contenedor principal con estilos
    <View style={styles.container}>
      {/* 📝 Título de la pantalla */}
      <Text>Settings Screen</Text>
      
      {/* 🔘 Botón para regresar a Home */}
      <Button
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}
```

---

## 🔍 DESGLOSE DETALLADO

### **Análisis de React Navigation:**

#### **Componentes Principales:**
```tsx
// 🎯 NavigationContainer - Contenedor principal
<NavigationContainer>
  {/* Toda la navegación debe estar dentro de este contenedor */}
</NavigationContainer>

// 🎯 Stack.Navigator - Navegador de pila
<Stack.Navigator>
  <Stack.Screen name="ScreenName" component={ScreenComponent} />
</Stack.Navigator>

// 🎯 Stack.Screen - Definición de pantalla
<Stack.Screen 
  name="Home"           // Nombre de la ruta
  component={Home}      // Componente a renderizar
  options={{ title: "Home" }} // Opciones de la pantalla
/>
```

#### **Métodos de Navegación:**
```tsx
// 🎯 Navegar a una pantalla
navigation.navigate('ScreenName');

// 🎯 Navegar con parámetros
navigation.navigate('ScreenName', { id: 123, title: 'Hello' });

// 🎯 Regresar a la pantalla anterior
navigation.goBack();

// 🎯 Regresar a la raíz
navigation.popToTop();

// 🎯 Reemplazar la pantalla actual
navigation.replace('ScreenName');

// 🎯 Navegar y resetear el stack
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

---

## 🧪 PRUEBAS UNITARIAS

### **Test 1: Verificación de Navegación**
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';

// Mock de React Navigation
const mockNavigation = {
  navigate: vi.fn(),
  goBack: vi.fn(),
  canGoBack: vi.fn(),
};

describe('Home Screen Navigation', () => {
  it('debe navegar a Settings cuando se presiona el botón', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Home navigation={mockNavigation as any} route={{} as any} />
      </NavigationContainer>
    );
    
    const settingsButton = getByText('Settings');
    fireEvent.press(settingsButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('debe mostrar el título de la pantalla', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Home navigation={mockNavigation as any} route={{} as any} />
      </NavigationContainer>
    );
    
    expect(getByText('Home Screen')).toBeTruthy();
  });
});
```

### **Test 2: Verificación de App Component**
```typescript
import { render } from '@testing-library/react-native';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('debe renderizar NavigationContainer', () => {
    const { getByTestId } = render(<App />);
    
    // Verificar que el NavigationContainer está presente
    expect(getByTestId('navigation-container')).toBeTruthy();
  });

  it('debe configurar las rutas correctamente', () => {
    const { getByText } = render(<App />);
    
    // Verificar que las pantallas están configuradas
    expect(getByText('Home Screen')).toBeTruthy();
  });
});
```

### **Test 3: Verificación de Settings Screen**
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';
import { NavigationContainer } from '@react-navigation/native';
import Settings from './Settings';

const mockNavigation = {
  goBack: vi.fn(),
};

describe('Settings Screen', () => {
  it('debe regresar cuando se presiona el botón Go back', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Settings navigation={mockNavigation as any} route={{} as any} />
      </NavigationContainer>
    );
    
    const goBackButton = getByText('Go back');
    fireEvent.press(goBackButton);
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('debe mostrar el título de Settings', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Settings navigation={mockNavigation as any} route={{} as any} />
      </NavigationContainer>
    );
    
    expect(getByText('Settings Screen')).toBeTruthy();
  });
});
```

---

## 📊 PREDICCIÓN DE RESULTADOS

### **Resultado Esperado en Dispositivo Móvil:**
```jsx
// Flujo de navegación esperado:
// 1. App inicia en pantalla Home
// 2. Usuario ve "Home Screen" y botón "Settings"
// 3. Al presionar "Settings" navega a pantalla Settings
// 4. En Settings ve "Settings Screen" y botón "Go back"
// 5. Al presionar "Go back" regresa a Home
```

### **Comportamiento de la Aplicación:**
1. **Inicio**: Pantalla Home con botón Settings
2. **Navegación**: Transición suave a Settings
3. **Regreso**: Botón Go back regresa a Home
4. **Historial**: Mantiene historial de navegación

---

## 🔧 VARIACIONES Y EJERCICIOS

### **Ejercicio 1: Navegación con Parámetros**
```tsx
// 🎯 Router con parámetros
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string; name: string };
  Settings: undefined;
};

// 🎯 Pantalla que recibe parámetros
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function Profile({ route, navigation }: ProfileProps) {
  const { userId, name } = route.params;
  
  return (
    <View style={styles.container}>
      <Text>Profile of {name}</Text>
      <Text>User ID: {userId}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

// 🎯 Navegación con parámetros
<Button 
  title="View Profile" 
  onPress={() => navigation.navigate('Profile', { 
    userId: '123', 
    name: 'John Doe' 
  })} 
/>
```

### **Ejercicio 2: Tab Navigation**
```tsx
// 🎯 Tab Navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

### **Ejercicio 3: Navegación Anidada**
```tsx
// 🎯 Navegación anidada (Stack dentro de Tab)
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="HomeDetail" component={HomeDetail} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={Profile} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

---

## ⚠️ PUNTOS IMPORTANTES

### **Tipos de Navegadores:**
```typescript
// 🎯 Stack Navigator - Para navegación jerárquica
// Ideal para: Flujos de autenticación, detalles de productos

// 🎯 Tab Navigator - Para navegación por pestañas
// Ideal para: Apps con secciones principales

// 🎯 Drawer Navigator - Para menú lateral
// Ideal para: Apps con muchas opciones de navegación

// 🎯 Material Top Tabs - Para pestañas horizontales
// Ideal para: Contenido relacionado en la misma pantalla
```

### **Consideraciones de Rendimiento:**
```typescript
// 🎯 Optimizaciones recomendadas:
// - Usar lazy loading para pantallas
// - Implementar preloading de datos
// - Optimizar transiciones
// - Manejar estados de carga
// - Implementar deep linking
```

---

## 🎯 MEJORES PRÁCTICAS

### **✅ Hacer:**
```tsx
// ✅ Usar TypeScript para tipos de navegación
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

// ✅ Configurar opciones de pantalla
<Stack.Screen 
  name="Home" 
  component={Home}
  options={{
    title: 'Home',
    headerShown: true,
    headerBackTitle: 'Back',
  }}
/>

// ✅ Manejar estados de navegación
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    // Pantalla enfocada
  });

  return unsubscribe;
}, [navigation]);

// ✅ Implementar deep linking
<NavigationContainer linking={linking}>
  {/* Navegación */}
</NavigationContainer>
```

### **❌ Evitar:**
```tsx
// ❌ Navegación sin tipos TypeScript
navigation.navigate('ScreenName'); // Sin tipos

// ❌ No manejar estados de navegación
// Siempre limpiar listeners y estados

// ❌ Navegación compleja sin planificación
// Planificar la estructura de navegación

// ❌ No implementar deep linking
// Implementar deep linking para mejor UX
```

---

## 📝 RESUMEN DEL CAPÍTULO

### **Conceptos Clave Aprendidos:**
1. **React Navigation** proporciona navegación robusta en React Native
2. **Stack Navigator** maneja navegación jerárquica entre pantallas
3. **TypeScript** mejora la seguridad de tipos en navegación
4. **Navigation Props** proporcionan métodos de navegación
5. **Route Parameters** permiten pasar datos entre pantallas

### **Habilidades Desarrolladas:**
- ✅ Configurar React Navigation en aplicaciones
- ✅ Implementar Stack Navigator
- ✅ Usar TypeScript con navegación
- ✅ Manejar parámetros de ruta
- ✅ Implementar navegación anidada
- ✅ Configurar opciones de pantalla

### **Próximos Pasos:**
En el siguiente capítulo aprenderemos sobre **Estado Global en React Native**, implementando Context API y otros patrones de estado.

---

*¡Excelente! Has completado el análisis detallado del Capítulo 19. Ahora entiendes cómo implementar navegación robusta en aplicaciones React Native. Estás listo para continuar con más conceptos avanzados en el siguiente capítulo.* 