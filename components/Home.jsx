import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../lib/config';

const Home = () => {
  const [usuarioRut, setUsuarioRut] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');

  // Función para capitalizar la primera letra y poner las demás en minúsculas
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useFocusEffect(
    useCallback(() => {
      const obtenerRutUsuario = async () => {
        try {
          const rut = await AsyncStorage.getItem('usuarioRut');
          if (rut !== null) {
            setUsuarioRut(rut);
            await obtenerDatosUsuario(rut); // Llamar a la función para obtener los datos del usuario
          }
        } catch (error) {
          console.error('Error al obtener el RUT del usuario:', error);
        }
      };

      obtenerRutUsuario();
    }, [])
  );

  const obtenerDatosUsuario = async (rut) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/usuarios/${rut}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const data = await response.json();
      setNombreUsuario(capitalizeFirstLetter(data.nombre));  // Capitalizar el nombre
      setApellidoUsuario(capitalizeFirstLetter(data.apellido)); // Capitalizar el apellido
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.name}>{nombreUsuario} {apellidoUsuario}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.welcomeMessage}>
          Nos alegra que estés aquí. Explora las funcionalidades de la app y descubre cómo podemos ayudarte a gestionar mejor tu salud.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF', // Fondo blanco
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333', // Texto oscuro que resalte
  },
  name: {
    fontSize: 24,
    color: '#555', // Texto un poco más claro para resaltar el nombre
    marginTop: 10,
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
});

export default Home;