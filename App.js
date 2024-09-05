import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Para el Tab Navigator
import { Ionicons } from '@expo/vector-icons'; // Para los íconos
import { StatusBar } from 'expo-status-bar';

// Importa tus componentes
import Login from './components/Login';
import Register from './components/Register';
import RecPassword from './components/RecPassword';
import Home from './components/Home';
import PesoPresionChart from './components/PesoPresionChart';
import RegistrarPresion from './components/RegistrarPresion';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); // Crea el Tab Navigator

// Función que define el Tab Navigator con las secciones "Resumen", "Principal" y "Panel Informativo"
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Resumen') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Principal') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Panel informativo') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          // Devuelve el ícono adecuado basado en la pestaña activa
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // No mostrar el header dentro de las pestañas
      })}
    >
      <Tab.Screen name="Resumen" component={PesoPresionChart} />
      <Tab.Screen name="Principal" component={Home} />
      <Tab.Screen name="Panel informativo" component={RegistrarPresion} />
    </Tab.Navigator>
  );
}

// Función principal que define el Stack Navigator, incluyendo el Tab Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="RecPassword" component={RecPassword} />
        <Stack.Screen 
          name="Home" 
          component={HomeTabs} // Asegúrate de que este es el Tab Navigator
          options={{ headerShown: false }}
        />
        {/* Añadir otras pantallas aquí */}
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
