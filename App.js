import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Login from './components/Login'; // Asegúrate de importar correctamente tus componentes
import Register from './components/Register';
import RecPassword from './components/RecPassword';
import Home from './components/Home'; // Importa el componente Home
import FichaMedica from './components/FichaMedica';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
        />
        <Stack.Screen 
          name="Register" 
          component={Register} 
        />
        <Stack.Screen 
          name="RecPassword" 
          component={RecPassword} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="FichaMedica" 
          component={FichaMedica} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style='light' />
    </NavigationContainer>
  );
}