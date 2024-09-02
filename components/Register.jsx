import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons'; // Importar ícono
import { useNavigation } from '@react-navigation/native';
import CONFIG from '../lib/config';

// Función para formatear el RUT
const formatRut = (rut) => {
  // Eliminar caracteres no numéricos
  const cleaned = rut.replace(/[^\dKk]/g, '');
  // Si el RUT está vacío, devolver vacío
  if (cleaned === '') return '';
  // Extraer el dígito verificador
  const dv = cleaned.slice(-1).toUpperCase();
  // Extraer el número
  const number = cleaned.slice(0, -1);
  // Formatear el número en el formato XX.XXX.XXX
  const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedNumber}-${dv}`;
};

const Register = () => {
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null); // Comenzar con null
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const manejarRegistro = async () => {
    // Validar que todos los campos estén completos
    if (!rut || !nombre || !apellido || !correo || !password || !confirmPassword || !fechaNacimiento) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Estructura de los datos a enviar
    const nuevoUsuario = {
      rut: formatRut(rut), // Mantén el formato con puntos y guiones
      nombre,
      apellido,
      fecha_nacimiento: fechaNacimiento.toISOString().split('T')[0], // Convertir la fecha a formato YYYY-MM-DD
      correo,
      password,
    };

    const baseUrl = Platform.OS === 'web'
      ? CONFIG.apiBaseUrl.web
      : Platform.OS === 'android'
        ? CONFIG.apiBaseUrl.android
        : CONFIG.apiBaseUrl.ios;

    try {
      // Enviar datos a la API con una solicitud POST
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario), // Convertir el objeto a JSON
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      Alert.alert('Éxito', 'Usuario registrado con éxito');
      navigation.navigate('Login'); // Navegar al login después del registro
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error', 'No se pudo registrar el usuario');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaNacimiento;
    setShowDatePicker(false); // Ocultar el picker una vez que se selecciona la fecha
    setFechaNacimiento(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Registrar Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="RUT"
          value={formatRut(rut)}
          onChangeText={text => setRut(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
        
        {/* Selector de fecha con ícono de calendario */}
        <View style={styles.dateInputContainer}>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {fechaNacimiento ? fechaNacimiento.toLocaleDateString('es-ES') : 'DD-MM-AAAA'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Mostrar el DateTimePicker si está activado */}
        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento || new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Correo"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerButton} onPress={manejarRegistro}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
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
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dateInput: {
    flex: 1,
    justifyContent: 'center',
    height: 50,
  },
  dateText: {
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Register;
