import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import baseUrl from '../lib/config';
import tw from 'tailwind-react-native-classnames';

const RegistrarPeso = () => {
  const [peso, setPeso] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState(new Date());
  const [pesos, setPesos] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [usuarioRut, setUsuarioRut] = useState('');

  useEffect(() => {
    const obtenerRutUsuario = async () => {
      try {
        const rut = await AsyncStorage.getItem('usuarioRut');
        if (rut !== null) {
          setUsuarioRut(rut);
          obtenerPesos(rut); // Obtener los pesos al cargar la página
        }
      } catch (error) {
        console.error('Error al obtener el RUT del usuario:', error);
      }
    };

    obtenerRutUsuario();
  }, []);

  const onChangeFecha = (event, selectedDate) => {
    if (selectedDate) {
      setFechaRegistro(selectedDate);
    }
    setShowDatePicker(false);
  };

  const registrarPeso = async () => {
    if (!peso || !fechaRegistro) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const nuevoPeso = {
      peso: parseInt(peso, 10),
      fecha_registro: fechaRegistro.toISOString().split('T')[0],
      usuario: usuarioRut,
    };

    try {
      const response = await fetch(`${baseUrl}/asodi/v1/pesos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPeso),
      });

      if (response.ok) {
        const pesoGuardado = await response.json();
        setPesos([...pesos, pesoGuardado]);
        Alert.alert('Éxito', 'Peso registrado exitosamente');
      } else {
        Alert.alert('Error', 'No se pudo registrar el peso');
      }
    } catch (error) {
      console.error('Error al registrar el peso:', error);
    }

    setPeso('');
    setFechaRegistro(new Date());
  };

  const obtenerPesos = async (rut) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/pesos/${rut}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const pesosUsuario = await response.json();
        setPesos(pesosUsuario);
      } else {
        Alert.alert('Error', 'No se pudo obtener los registros de peso');
      }
    } catch (error) {
      console.error('Error al obtener los registros de peso:', error);
    }
  };

  const eliminarPeso = async (id_peso) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/pesos/${usuarioRut}/${id_peso}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPesos(pesos.filter(peso => peso.id_peso !== id_peso));
        Alert.alert('Éxito', 'Registro de peso eliminado exitosamente');
      } else {
        Alert.alert('Error', 'No se pudo eliminar el registro de peso');
      }
    } catch (error) {
      console.error('Error al eliminar el registro de peso:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[tw`bg-white p-4 mb-3 rounded-lg flex-row justify-between items-center shadow`, { backgroundColor: '#e8f5e9' }]}>
      <View>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Fecha: {item.fecha_registro}</Text>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Peso: {item.peso} kg</Text>
      </View>
      <TouchableOpacity onPress={() => eliminarPeso(item.id_peso)}>
        <Icon name="trash-outline" size={24} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  );

  const validarEntradaPeso = (text) => {
    const textFiltrado = text.replace(/[^0-9]/g, '');
    setPeso(textFiltrado);
  };

  return (
    <SafeAreaView style={[tw`flex-1 p-4`, { backgroundColor: '#f0f4f8' }]}>
      <StatusBar barStyle='dark-content' />

      <View>
        <Text style={[tw`text-2xl font-bold text-center mb-5`, { color: '#388e3c' }]}>Registrar Peso</Text>

        <TouchableOpacity 
          style={[tw`flex-row items-center justify-between mb-4 p-3 bg-white rounded-lg shadow`, { borderColor: '#388e3c' }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[tw`text-lg`, { color: '#388e3c' }]}>
            {fechaRegistro ? fechaRegistro.toLocaleDateString('es-ES') : 'DD-MM-AAAA'}
          </Text>
          <Icon name="calendar-outline" size={24} color="gray" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={fechaRegistro}
            mode="date"
            display="default"
            onChange={onChangeFecha}
            locale="es-ES"
          />
        )}

        <TextInput
          style={[tw`bg-white p-4 mb-4 rounded-lg shadow`, { borderColor: '#388e3c' }]}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          onChangeText={validarEntradaPeso}
          value={peso}
        />

        <TouchableOpacity 
          style={[tw`bg-green-500 p-4 rounded-lg justify-center items-center`, { backgroundColor: '#388e3c' }]}
          onPress={registrarPeso}
        >
          <Text style={tw`text-white text-lg font-bold`}>Registrar Peso</Text>
        </TouchableOpacity>

        <Text style={[tw`text-xl font-bold text-center mt-8 mb-4`, { color: '#388e3c' }]}>Registros de Peso</Text>
      </View>

      <FlatList
        data={pesos}
        renderItem={renderItem}
        keyExtractor={item => item.id_peso.toString()}
        contentContainerStyle={tw`pt-4 pb-20`}
      />
    </SafeAreaView>
  );
};

export default RegistrarPeso;
