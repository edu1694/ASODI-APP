import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Login from './components/Login'; // Asegúrate de ajustar la ruta si es necesario
import Register from './components/Register'; // Asegúrate de ajustar la ruta si es necesario
import RecPassword from './components/RecPassword'; // Asegúrate de ajustar la ruta si es necesario

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="RecPassword" component={RecPassword} />
      </Stack.Navigator>
      <StatusBar style='light' />
    </NavigationContainer>
  );
}
