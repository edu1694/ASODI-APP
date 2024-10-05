import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
import { LinearGradient } from 'expo-linear-gradient';
import baseUrl from '../lib/config';

const Login = (props) => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Estado para el modal de error
  const navigation = useNavigation(); 

  const manejarLogin = async () => {
    if (!correo || !password) {
      setShowErrorModal(true); // Mostrar el modal si falta correo o contraseña
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/asodi/v1/usuarios/`, {
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
        await AsyncStorage.setItem('usuarioRut', usuarioEncontrado.rut);

        const fichaResponse = await fetch(`${baseUrl}/asodi/v1/fichas/${usuarioEncontrado.rut}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (fichaResponse.ok) {
          props.onLogin(); 
        } else {
          navigation.navigate('FichaMedica', { rut: usuarioEncontrado.rut });
        }
      } else {
        setShowErrorModal(true); // Mostrar el modal en caso de error en el inicio de sesión
      }
    } catch (error) {
      console.error('Error de conexión con el servidor:', error);
      setShowErrorModal(true); // Mostrar el modal si hay error de conexión
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo blanco para la parte superior */}
      <View style={styles.whiteBackground}>
        <Image 
          style={styles.logo} 
          source={require('../assets/images/logoasodi.png')} 
          resizeMode="contain"
        />
      </View>

      {/* Fondo verde para la parte inferior */}
      <LinearGradient
        colors={['#007f5f', '#006442']} // Verdes oscuros para el formulario
        style={styles.greenBackground}
      >
        {/* Formulario de Inicio de Sesión */}
        <View style={styles.formContainer}>
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
              style={styles.inputPassword}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
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

          <TouchableOpacity onPress={() => navigation.navigate('RecPassword')}>
            <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.noAccountText}>No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupText}>Crea cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Modal de error */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)} // Cerrar modal
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>Por favor, ingresa tu correo y contraseña correctamente.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowErrorModal(false)} // Cerrar modal al presionar el botón
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  whiteBackground: {
    width: '100%',
    height: 200, // Reducimos la altura de la parte blanca
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  greenBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  logo: {
    width: 300,
    height: 160,
  },
  formContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: 'center',
    marginTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007f5f',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#f7f7f7',
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  inputPassword: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loginButton: {
    backgroundColor: '#007f5f',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#007f5f',
    textAlign: 'center',
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noAccountText: {
    color: '#666666',
  },
  signupText: {
    color: '#007f5f',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007f5f',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007f5f',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
