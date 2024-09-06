
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Importa el Tab Navigator
import { Ionicons } from '@expo/vector-icons'; // Para los íconos
import PesoPresionChart from './components/PesoPresionChart';
import Home from './components/Home';
import Contacto from './Contacto';
import React, { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tab } from 'react-native-paper'; // O el componente Tab de react-navigation
import { useFocusEffect } from '@react-navigation/native';


function PesoPresionChart() {
  useFocusEffect(
    useCallback(() => {
      // Lógica para actualizar los datos o realizar alguna acción
      console.log("La pestaña Resumen está en foco. Actualizando datos...");
      // Aquí puedes hacer una llamada a tu API o actualizar el estado
    }, [])
  );

  return (
    // Tu componente de resumen aquí
    <View>
      {/* El contenido de la pestaña Resumen */}
    </View>
  );
}

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
