# 📖 CAPÍTULOS 21-29: CONCEPTOS AVANZADOS DE REACT NATIVE
## Análisis Completo y Detallado

---

## 🎯 CAPÍTULO 21: MAPAS Y UBICACIÓN

### **Objetivos:**
- ✅ **React Native Maps** y geolocalización
- ✅ **GPS** y servicios de ubicación
- ✅ **Marcadores** y overlays en mapas
- ✅ **Tracking** de ubicación en tiempo real
- ✅ **Permisos** de ubicación
- ✅ **APIs** de mapas nativas

### **Conceptos Clave:**
```javascript
// 🎯 React Native Maps
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// 🎯 Geolocalización
import Geolocation from '@react-native-community/geolocation';

// 🎯 Permisos
import { request, PERMISSIONS } from 'react-native-permissions';
```

### **Ejemplo de Implementación:**
```tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

export default function MapScreen() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => Alert.alert('Error', error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            ...location,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={location} title="Mi ubicación" />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
```

---

## 🎯 CAPÍTULO 22: CÁMARA Y MEDIA

### **Objetivos:**
- ✅ **React Native Camera** y acceso a cámara
- ✅ **Image Picker** para selección de imágenes
- ✅ **Video recording** y reproducción
- ✅ **Permisos** de cámara y galería
- ✅ **Procesamiento** de imágenes
- ✅ **Almacenamiento** de media

### **Conceptos Clave:**
```javascript
// 🎯 React Native Camera
import { RNCamera } from 'react-native-camera';

// 🎯 Image Picker
import ImagePicker from 'react-native-image-picker';

// 🎯 Permisos
import { request, PERMISSIONS } from 'react-native-permissions';
```

### **Ejemplo de Implementación:**
```tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';

export default function CameraScreen() {
  const [image, setImage] = useState(null);

  const takePicture = async (camera) => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    setImage(data.uri);
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 0.5 },
      (response) => {
        if (response.uri) {
          setImage(response.uri);
        }
      }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.back}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        {({ camera }) => (
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => takePicture(camera)}>
              <Text>Take Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <Text>Pick from Gallery</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          </View>
        )}
      </RNCamera>
    </View>
  );
}
```

---

## 🎯 CAPÍTULO 23: NOTIFICACIONES PUSH

### **Objetivos:**
- ✅ **React Native Push Notification** y configuración
- ✅ **Firebase Cloud Messaging** (FCM)
- ✅ **Notificaciones locales** y remotas
- ✅ **Handling** de notificaciones
- ✅ **Badge counts** y sonidos
- ✅ **Scheduling** de notificaciones

### **Conceptos Clave:**
```javascript
// 🎯 Push Notifications
import PushNotification from 'react-native-push-notification';

// 🎯 Firebase Messaging
import messaging from '@react-native-firebase/messaging';

// 🎯 Permisos
import { request, PERMISSIONS } from 'react-native-permissions';
```

### **Ejemplo de Implementación:**
```tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

export default function NotificationScreen() {
  useEffect(() => {
    // Configurar notificaciones
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Configurar Firebase
    messaging()
      .getToken()
      .then(token => {
        console.log('FCM Token:', token);
      });

    messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);
    });
  }, []);

  const scheduleNotification = () => {
    PushNotification.localNotificationSchedule({
      message: "Notificación programada",
      date: new Date(Date.now() + 10 * 1000), // 10 segundos
    });
  };

  return (
    <View>
      <Text>Notification Screen</Text>
    </View>
  );
}
```

---

## 🎯 CAPÍTULO 24: ALMACENAMIENTO LOCAL

### **Objetivos:**
- ✅ **AsyncStorage** para datos simples
- ✅ **SQLite** para bases de datos locales
- ✅ **Realm** para bases de datos NoSQL
- ✅ **File System** para archivos
- ✅ **Keychain** para datos sensibles
- ✅ **Caching** y persistencia

### **Conceptos Clave:**
```javascript
// 🎯 AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🎯 SQLite
import SQLite from 'react-native-sqlite-storage';

// 🎯 File System
import RNFS from 'react-native-fs';
```

### **Ejemplo de Implementación:**
```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StorageScreen() {
  const [data, setData] = useState('');
  const [savedData, setSavedData] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('userData', data);
      alert('Data saved successfully!');
      loadData();
    } catch (error) {
      alert('Error saving data');
    }
  };

  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        setSavedData(value);
      }
    } catch (error) {
      alert('Error loading data');
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setSavedData('');
      alert('Data cleared!');
    } catch (error) {
      alert('Error clearing data');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={data}
        onChangeText={setData}
        placeholder="Enter data to save"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TouchableOpacity onPress={saveData} style={{ backgroundColor: 'blue', padding: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Save Data</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearData} style={{ backgroundColor: 'red', padding: 10, marginTop: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Clear Data</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20 }}>Saved Data: {savedData}</Text>
    </View>
  );
}
```

---

## 🎯 CAPÍTULO 25: AUTENTICACIÓN Y SEGURIDAD

### **Objetivos:**
- ✅ **Firebase Auth** y autenticación
- ✅ **JWT** y tokens de autenticación
- ✅ **Biometric authentication** (Touch ID, Face ID)
- ✅ **OAuth** y login social
- ✅ **Keychain** para tokens seguros
- ✅ **Encryption** de datos sensibles

### **Conceptos Clave:**
```javascript
// 🎯 Firebase Auth
import auth from '@react-native-firebase/auth';

// 🎯 Biometric Auth
import ReactNativeBiometrics from 'react-native-biometrics';

// 🎯 Keychain
import Keychain from 'react-native-keychain';
```

### **Ejemplo de Implementación:**
```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import ReactNativeBiometrics from 'react-native-biometrics';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const signIn = async () => {
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      setUser(response.user);
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const signUp = async () => {
    try {
      const response = await auth().createUserWithEmailAndPassword(email, password);
      setUser(response.user);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
      Alert.alert('Success', 'Signed out successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const biometricAuth = async () => {
    const { available, biometryType } = await ReactNativeBiometrics.isSensorAvailable();
    
    if (available) {
      const { success } = await ReactNativeBiometrics.simplePrompt({
        promptMessage: 'Confirm biometric authentication',
      });
      
      if (success) {
        Alert.alert('Success', 'Biometric authentication successful!');
      }
    } else {
      Alert.alert('Error', 'Biometric authentication not available');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {!user ? (
        <>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TouchableOpacity onPress={signIn} style={{ backgroundColor: 'blue', padding: 10, marginBottom: 10 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signUp} style={{ backgroundColor: 'green', padding: 10, marginBottom: 10 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={biometricAuth} style={{ backgroundColor: 'purple', padding: 10 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Biometric Auth</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>Welcome, {user.email}!</Text>
          <TouchableOpacity onPress={signOut} style={{ backgroundColor: 'red', padding: 10, marginTop: 10 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
```

---

## 🎯 CAPÍTULO 26: NETWORKING Y APIs

### **Objetivos:**
- ✅ **Fetch API** y HTTP requests
- ✅ **Axios** para requests HTTP
- ✅ **WebSocket** para comunicación en tiempo real
- ✅ **GraphQL** con Apollo Client
- ✅ **Offline support** y caching
- ✅ **Error handling** y retry logic

### **Conceptos Clave:**
```javascript
// 🎯 Fetch API
const response = await fetch('https://api.example.com/data');

// 🎯 Axios
import axios from 'axios';

// 🎯 WebSocket
import { WebSocket } from 'react-native-websocket';

// 🎯 Apollo Client
import { ApolloClient, InMemoryCache } from '@apollo/client';
```

### **Ejemplo de Implementación:**
```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function APIScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: 'New Post',
        body: 'This is a new post',
        userId: 1,
      });
      setData(prev => [response.data, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
        <TouchableOpacity onPress={fetchData} style={{ backgroundColor: 'blue', padding: 10, marginTop: 10 }}>
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={createPost} style={{ backgroundColor: 'green', padding: 10, margin: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Create New Post</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

---

## 🎯 CAPÍTULO 27: TESTING EN REACT NATIVE

### **Objetivos:**
- ✅ **Jest** y configuración de testing
- ✅ **React Native Testing Library** para testing de componentes
- ✅ **Detox** para testing end-to-end
- ✅ **Unit testing** de funciones y hooks
- ✅ **Integration testing** de componentes
- ✅ **Mocking** de APIs y servicios

### **Conceptos Clave:**
```javascript
// 🎯 Jest
import { describe, it, expect } from '@jest/globals';

// 🎯 React Native Testing Library
import { render, fireEvent } from '@testing-library/react-native';

// 🎯 Detox
import { by, element, expect } from 'detox';
```

### **Ejemplo de Implementación:**
```tsx
// Componente a testear
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <View>
      <Text testID="count">{count}</Text>
      <TouchableOpacity testID="increment" onPress={() => setCount(count + 1)}>
        <Text>Increment</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="decrement" onPress={() => setCount(count - 1)}>
        <Text>Decrement</Text>
      </TouchableOpacity>
    </View>
  );
}

// Test unitario
import { render, fireEvent } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import Counter from './Counter';

describe('Counter', () => {
  it('should increment count when increment button is pressed', () => {
    const { getByTestId } = render(<Counter />);
    
    const countElement = getByTestId('count');
    const incrementButton = getByTestId('increment');
    
    expect(countElement).toHaveTextContent('0');
    
    fireEvent.press(incrementButton);
    
    expect(countElement).toHaveTextContent('1');
  });

  it('should decrement count when decrement button is pressed', () => {
    const { getByTestId } = render(<Counter />);
    
    const countElement = getByTestId('count');
    const decrementButton = getByTestId('decrement');
    
    expect(countElement).toHaveTextContent('0');
    
    fireEvent.press(decrementButton);
    
    expect(countElement).toHaveTextContent('-1');
  });
});
```

---

## 🎯 CAPÍTULO 28: DESPLIEGUE Y DISTRIBUCIÓN

### **Objetivos:**
- ✅ **App Store Connect** para iOS
- ✅ **Google Play Console** para Android
- ✅ **Code signing** y certificados
- ✅ **Build configuration** y optimización
- ✅ **CI/CD** pipelines
- ✅ **Beta testing** y TestFlight

### **Conceptos Clave:**
```javascript
// 🎯 App Store Connect
// Configuración en Xcode y App Store Connect

// 🎯 Google Play Console
// Configuración en Android Studio y Google Play Console

// 🎯 Fastlane
import { fastlane } from 'react-native-fastlane';

// 🎯 Code Push
import codePush from 'react-native-code-push';
```

### **Ejemplo de Implementación:**
```tsx
// Configuración de Code Push
import codePush from 'react-native-code-push';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: {
    title: 'Update available',
    mandatoryUpdateMessage: 'A mandatory update is available.',
    mandatoryContinueButtonLabel: 'Update',
    optionalUpdateMessage: 'An optional update is available.',
    optionalIgnoreButtonLabel: 'Later',
    optionalInstallButtonLabel: 'Update',
  },
};

export default codePush(codePushOptions)(App);

// Configuración de Fastlane
// fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Deploy to App Store"
  lane :deploy do
    build_app(
      scheme: "MyApp",
      export_method: "app-store",
      export_options: {
        provisioningProfiles: {
          "com.example.myapp" => "MyApp_AppStore"
        }
      }
    )
    upload_to_app_store
  end
end
```

---

## 🎯 CAPÍTULO 29: OPTIMIZACIÓN Y RENDIMIENTO

### **Objetivos:**
- ✅ **Performance profiling** con Flipper
- ✅ **Memory leaks** y debugging
- ✅ **Bundle optimization** y code splitting
- ✅ **Image optimization** y caching
- ✅ **Network optimization** y caching
- ✅ **Battery optimization** y background tasks

### **Conceptos Clave:**
```javascript
// 🎯 Performance Monitor
import { PerformanceObserver } from 'react-native-performance';

// 🎯 Memory Profiler
import { MemoryProfiler } from 'react-native-memory-profiler';

// 🎯 Image Caching
import FastImage from 'react-native-fast-image';

// 🎯 Network Caching
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
```

### **Ejemplo de Implementación:**
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function OptimizedImageList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['images'],
    queryFn: () => fetch('https://api.example.com/images').then(res => res.json()),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data.map(image => (
        <FastImage
          key={image.id}
          source={{ uri: image.url }}
          style={{ width: 200, height: 200 }}
          resizeMode={FastImage.resizeMode.contain}
        />
      ))}
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OptimizedImageList />
    </QueryClientProvider>
  );
}
```

---

## 📝 RESUMEN GENERAL DE CAPÍTULOS 21-29

### **Conceptos Clave Aprendidos:**
1. **Mapas y Ubicación** - Geolocalización y servicios de mapas
2. **Cámara y Media** - Acceso a cámara y procesamiento de imágenes
3. **Notificaciones Push** - Configuración y manejo de notificaciones
4. **Almacenamiento Local** - Persistencia de datos en dispositivos
5. **Autenticación y Seguridad** - Sistemas de autenticación seguros
6. **Networking y APIs** - Comunicación con servicios externos
7. **Testing** - Pruebas unitarias y end-to-end
8. **Despliegue** - Distribución en App Store y Google Play
9. **Optimización** - Mejora de rendimiento y experiencia de usuario

### **Habilidades Desarrolladas:**
- ✅ Implementar funcionalidades nativas avanzadas
- ✅ Manejar autenticación y seguridad
- ✅ Optimizar rendimiento de aplicaciones
- ✅ Implementar testing completo
- ✅ Desplegar aplicaciones a producción
- ✅ Manejar datos y networking eficientemente

### **Próximos Pasos:**
Con estos capítulos completados, tienes un conocimiento completo de React Native y estás listo para desarrollar aplicaciones móviles profesionales y robustas.

---

*¡Felicitaciones! Has completado el análisis detallado de todos los capítulos del libro "React and React Native, 5ª Edición". Ahora tienes un conocimiento completo y profundo de React y React Native, desde conceptos básicos hasta técnicas avanzadas de desarrollo móvil.* 