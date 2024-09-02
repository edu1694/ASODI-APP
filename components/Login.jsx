import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Text,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import { SafeAreaView } from 'react-native-safe-area-context'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
import CONFIG from '../lib/config';


const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation(); // Obtén la instancia de navegación

  const manejarLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña');
      return;
    }
  
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
  
        // Redirigir al componente Home después del inicio de sesión
        navigation.navigate('Home');
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
    <SafeAreaView style={styles.container}>
      <StatusBar style='light'/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Inicio de Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          keyboardType="email-address"
          onChangeText={setCorreo}
          value={correo}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? 'eye' : 'eye-off'} 
              size={20} 
              color="grey" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={manejarLogin}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('RecPassword')}>
            <Text style={styles.footerLink}>¿Has olvidado tu contraseña?</Text>
          </TouchableOpacity>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Crea cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  passwordInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#000',
  },
  footerLink: {
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

export default Login;
