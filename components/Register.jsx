import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import baseUrl from '../lib/config';

const formatRut = (rut) => {
  const cleaned = rut.replace(/[^\dKk]/g, '');
  if (cleaned === '') return '';
  const dv = cleaned.slice(-1).toUpperCase();
  const number = cleaned.slice(0, -1);
  const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedNumber}-${dv}`;
};

const Register = () => {
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null); 
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigation = useNavigation();

  const manejarRegistro = async () => {
    if (!rut || !nombre || !apellido || !correo || !password || !confirmPassword || !fechaNacimiento) {
      setShowErrorModal(true); // Mostrar modal de error si faltan datos
      return;
    }
    if (password !== confirmPassword) {
      setShowErrorModal(true); // Mostrar modal de error si las contraseñas no coinciden
      return;
    }

    const nuevoUsuario = {
      rut: formatRut(rut),
      nombre,
      apellido,
      fecha_nacimiento: fechaNacimiento.toISOString().split('T')[0], 
      correo,
      password,
    };

    try {
      const response = await fetch(`${baseUrl}/asodi/v1/usuarios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error en el registro:', error);
      setShowErrorModal(true); // Mostrar modal de error si ocurre un problema
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaNacimiento;
    setShowDatePicker(false);
    setFechaNacimiento(currentDate);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-5`}>
        <Text style={tw`text-3xl font-bold text-center text-green-700 mb-8`}>Registrar Usuario</Text>

        <TextInput
          style={tw`h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white`}
          placeholder="RUT"
          value={formatRut(rut)}
          onChangeText={text => setRut(text)}
        />
        <TextInput
          style={tw`h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white`}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={tw`h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white`}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
        
        {/* Selector de fecha con ícono de calendario */}
        <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-4 mb-4 bg-white`}>
          <TouchableOpacity 
            style={tw`flex-1 justify-center h-12`}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={tw`text-gray-700`}>
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
          style={tw`h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white`}
          placeholder="Correo"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={tw`h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white`}
          placeholder="Contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={tw`h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white`}
          placeholder="Confirmar Contraseña"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity 
          style={tw`bg-green-700 rounded-full h-12 justify-center items-center mb-6`}
          onPress={manejarRegistro}
        >
          <Text style={tw`text-white text-lg font-bold`}>Registrar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de error */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-lg p-8 w-3/4 shadow-lg`}>
            <Text style={tw`text-lg font-bold text-red-600 mb-4`}>Error</Text>
            <Text style={tw`text-gray-700 mb-6 text-center`}>
              Por favor, completa todos los campos correctamente o asegúrate de que las contraseñas coincidan.
            </Text>
            <TouchableOpacity
              style={tw`bg-red-600 rounded-lg py-2 px-4`}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={tw`text-white text-center font-bold`}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Register;
