import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; 
import baseUrl from '../lib/config';

const RecPassword = () => {
  const [correo, setCorreo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleRecuperarPassword = async () => {
    if (!correo) {
      Alert.alert('Error', 'Por favor, ingresa tu correo');
      return;
    }

    setIsLoading(true); 
    try {
      const response = await fetch(`${baseUrl}/api/password_reset/`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: correo }), 
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Se ha enviado un enlace de recuperación a tu correo.');
        navigation.navigate('Login'); 
      } else {
        Alert.alert('Error', data.detail || 'No se pudo enviar la solicitud.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          onChangeText={setCorreo}
          value={correo}
        />

        <TouchableOpacity 
          style={styles.recuperarButton} 
          onPress={handleRecuperarPassword}
          disabled={isLoading}
        >
          <Text style={styles.recuperarButtonText}>
            {isLoading ? 'Enviando...' : 'Recuperar Contraseña'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Volver al Inicio de Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0FAF4', // Fondo claro en verde suave
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#046307', // Verde oscuro
  },
  input: {
    height: 50,
    borderColor: '#28A745', // Verde vibrante
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  recuperarButton: {
    backgroundColor: '#046307', // Verde oscuro
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recuperarButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerLink: {
    color: '#28A745', // Verde vibrante
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecPassword;
