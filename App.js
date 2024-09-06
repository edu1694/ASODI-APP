import React, { useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import CustomDrawerContent from './lib/CustomDrawerContent'; 

// Importa tus componentes
import Login from './components/Login'; 
import Register from './components/Register';
import RecPassword from './components/RecPassword';
import Home from './components/Home'; 
import FichaMedica from './components/FichaMedica';
import PesoPresionChart from './components/PesoPresionChart';
import RegistrarPresion from './components/RegistrarPresion';
import RegistrarPeso from './components/RegistrarPeso';
import FichaMedicaDetalle from './components/FichaMedicaDetalle';
import Contacto from './components/Contacto';
import RegistrarCitaMedica from './components/RegistrarCitaMedica';

// Declaraciones de navegadores
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator para "Resumen", "Principal", y "Panel Informativo"
function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Principal" // Selecciona "Principal" por defecto
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
  
          if (route.name === 'Resumen') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Principal') {
            iconName = focused ? 'home' : 'home-outline'; // Corregido a 'home' y 'home-outline'
          } else if (route.name === 'Contáctanos') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }
  
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Oculta el header en las pestañas
      })}
    >
      <Tab.Screen name="Resumen" component={PesoPresionChart} />
      <Tab.Screen name="Principal" component={Home} />
      <Tab.Screen name="Contáctanos" component={Contacto} />
    </Tab.Navigator>
  );
}

// Stack Navigator para las pantallas de autenticación
function AuthStackNavigator({ onLogin }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        options={{ headerShown: false }}
      >
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="RecPassword" 
        component={RecPassword} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="FichaMedica" 
        options={{ headerShown: false }}
      >
        {(props) => <FichaMedica {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Drawer Navigator que contiene la pantalla Home (con Tabs) y otras pantallas
function MainDrawerNavigator({ onLogout }) {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
      screenOptions={{ headerShown: true, headerTitle: 'Asodi' }} // Cambiamos el título del Top Bar aquí
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeTabs} 
        options={{
          drawerLabel: 'Inicio', 
          drawerItemStyle: { display: 'none' }  // Esto hará que no sea visible en el menú lateral
        }}
      />

      <Drawer.Screen 
        name="FichaMedicaDetalle" 
        component={FichaMedicaDetalle} 
        options={{ drawerLabel: 'Ficha' }} // Aquí mantiene el nombre en el menú lateral
      />
      <Drawer.Screen 
        name="RegistrarCitaMedica" 
        component={RegistrarCitaMedica} 
        options={{ drawerLabel: 'Registrar Cita Medica' }} // Mantén el nombre en el menú lateral
      />
      <Drawer.Screen 
        name="RegistrarPresion" 
        component={RegistrarPresion} 
        options={{ drawerLabel: 'Registrar Presión' }} // Mantén el nombre en el menú lateral
      />
      <Drawer.Screen 
        name="RegistrarPeso" 
        component={RegistrarPeso} 
        options={{ drawerLabel: 'Registrar Peso' }} // Mantén el nombre en el menú lateral
      />
    </Drawer.Navigator>
  );
}





// Componente principal que integra ambos navegadores
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manejo del estado de autenticación

  const handleLogin = () => {
    setIsAuthenticated(true); // Cambia el estado a autenticado después de iniciar sesión
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Cambia el estado a no autenticado después de cerrar sesión
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // Si el usuario está autenticado, muestra el DrawerNavigator con Tabs en Home
        <MainDrawerNavigator onLogout={handleLogout} />
      ) : (
        // Si el usuario no está autenticado, muestra el StackNavigator (Login, Register, RecPassword)
        <AuthStackNavigator onLogin={handleLogin} />
      )}
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
