import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import CONFIG from './lib/config'; // Importar configuración
import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  StyleSheet, 
  Text,
  ScrollView,
  Platform
} from 'react-native';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const manejarLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña');
      return;
    }

    // Configurar la URL base según la plataforma
    const baseUrl = Platform.OS === 'web'
      ? CONFIG.apiBaseUrl.web
      : Platform.OS === 'android'
        ? CONFIG.apiBaseUrl.android
        : CONFIG.apiBaseUrl.ios;

    try {
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const usuarios = await response.json();

      const usuarioEncontrado = usuarios.find(user =>
        user.correo === correo && user.password === password
      );

      if (usuarioEncontrado) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        console.log('Inicio de sesión exitoso:', usuarioEncontrado);
      } else {
        Alert.alert('Error', 'Usuario no encontrado o contraseña incorrecta');
        console.log('Error de inicio de sesión: Usuario no encontrado o contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error de conexión con el servidor:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='light'/>
      <ScrollView>
        <Text style={styles.title}>Inicio de Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          keyboardType="email-address"
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={setPassword}
        />

        <Button title="Iniciar Sesión" onPress={manejarLogin} color="#1E90FF" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default Login;
