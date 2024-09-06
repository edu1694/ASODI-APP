import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Importa el Tab Navigator
import { Ionicons } from '@expo/vector-icons'; // Para los íconos
import PesoPresionChart from './components/PesoPresionChart';
import Home from './components/Home';
import Contacto from './Contacto';

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
          } else if (route.name === 'Contáctanos') {
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
      <Tab.Screen name="Contáctanos" component={Contacto} />
    </Tab.Navigator>
  );
}

export default HomeTabs;
