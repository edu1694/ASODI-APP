import React, { useCallback } from 'react';
import { View } from 'react-native'; // Asegúrate de importar View
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Importa el Tab Navigator
import { Ionicons } from '@expo/vector-icons'; // Para los íconos
import PesoPresionChartComponent from './components/PesoPresionChart'; // Asegúrate de que este sea tu componente real
import Home from './components/Home';
import Contacto from './components/Contacto';
import { useFocusEffect } from '@react-navigation/native';

// Componente PesoPresionChart
function PesoPresionChart() {
  useFocusEffect(
    useCallback(() => {
      console.log("La pestaña Resumen está en foco. Actualizando datos...");
      // Aquí puedes hacer una llamada a tu API o actualizar el estado
    }, [])
  );

  return (
    <View>
      {/* El contenido de la pestaña Resumen aquí */}
    </View>
  );
}

// Navegador de pestañas
const Tab = createBottomTabNavigator();

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

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Resumen" component={PesoPresionChart} />
      <Tab.Screen name="Principal" component={Home} />
      <Tab.Screen name="Contáctanos" component={Contacto} />
    </Tab.Navigator>
  );
}

export default HomeTabs;
