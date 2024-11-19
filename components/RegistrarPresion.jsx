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

const RegistrarPresion = () => {
  const [presionDiastolica, setPresionDiastolica] = useState('');
  const [presionSistolica, setPresionSistolica] = useState('');
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState(new Date());
  const [presiones, setPresiones] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [usuarioRut, setUsuarioRut] = useState('');

  useEffect(() => {
    const obtenerRutUsuario = async () => {
      try {
        const rut = await AsyncStorage.getItem('usuarioRut');
        if (rut !== null) {
          setUsuarioRut(rut);
          obtenerPresiones(rut); // Obtener las presiones al cargar la página
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

  const registrarPresion = async () => {
    if (!presionDiastolica || !presionSistolica || !frecuenciaCardiaca || !fechaRegistro) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const nuevaPresion = {
      presion_diastolica: parseInt(presionDiastolica, 10),
      presion_sistolica: parseInt(presionSistolica, 10),
      frecuenciacardiaca: parseInt(frecuenciaCardiaca, 10),
      fecha_registro: fechaRegistro.toISOString().split('T')[0],
      usuario: usuarioRut,
    };

    try {
      const response = await fetch(`${baseUrl}/asodi/v1/presiones/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaPresion),
      });

      if (response.ok) {
        const presionGuardada = await response.json();
        setPresiones(prevPresiones => [...prevPresiones, presionGuardada]); // Añade la nueva presión a la lista
        Alert.alert('Éxito', 'Presión arterial registrada exitosamente');
      } else {
        Alert.alert('Error', 'No se pudo registrar la presión arterial');
      }
    } catch (error) {
      console.error('Error al registrar la presión arterial:', error);
    }

    // Limpiar los campos después de agregar la presión
    setPresionDiastolica('');
    setPresionSistolica('');
    setFrecuenciaCardiaca('');
    setFechaRegistro(new Date());
  };

  const obtenerPresiones = async (rut) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/presiones/${rut}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const presionesUsuario = await response.json();
        console.log('Presiones obtenidas:', presionesUsuario); // Verifica los datos obtenidos
        setPresiones(presionesUsuario);
      } else {
        Alert.alert('Error', 'No se pudo obtener los registros de presión arterial');
      }
    } catch (error) {
      console.error('Error al obtener los registros de presión arterial:', error);
    }
  };

  const eliminarPresion = async (id_presion) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/presiones/${usuarioRut}/${id_presion}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPresiones(presiones.filter(presion => presion.id_presion !== id_presion));
        Alert.alert('Éxito', 'Registro de presión eliminado exitosamente');
      } else {
        Alert.alert('Error', 'No se pudo eliminar el registro de presión');
      }
    } catch (error) {
      console.error('Error al eliminar el registro de presión', error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[tw`bg-white p-4 mb-3 rounded-lg flex-row justify-between items-center shadow`, { backgroundColor: '#e8f5e9' }]}>
        <View>
          <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Fecha: {item.fecha_registro}</Text>
          <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Presión Sistólica: {item.presion_sistolica} mmHg</Text>
          <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Presión Diastólica: {item.presion_diastolica} mmHg</Text>
          <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Frecuencia Cardiaca: {item.frecuenciacardiaca} bpm</Text>
        </View>
        <TouchableOpacity onPress={() => eliminarPresion(item.id_presion)}>
          <Icon name="trash-outline" size={24} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[tw`flex-1 p-4`, { backgroundColor: '#f0f4f8' }]}>
      <StatusBar barStyle='dark-content' />

      <View>
        <Text style={[tw`text-2xl font-bold text-center mb-5`, { color: '#388e3c' }]}>Registrar Presión Arterial</Text>

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
          placeholder="Presión Sistólica (mmHg)"
          keyboardType="numeric"
          onChangeText={setPresionSistolica}
          value={presionSistolica}
        />
        <TextInput
          style={[tw`bg-white p-4 mb-4 rounded-lg shadow`, { borderColor: '#388e3c' }]}
          placeholder="Presión Diastólica (mmHg)"
          keyboardType="numeric"
          onChangeText={setPresionDiastolica}
          value={presionDiastolica}
        />
        <TextInput
          style={[tw`bg-white p-4 mb-4 rounded-lg shadow`, { borderColor: '#388e3c' }]}
          placeholder="Frecuencia Cardiaca (bpm)"
          keyboardType="numeric"
          onChangeText={setFrecuenciaCardiaca}
          value={frecuenciaCardiaca}
        />

        <TouchableOpacity 
          style={[tw`bg-green-500 p-4 rounded-lg justify-center items-center`, { backgroundColor: '#388e3c' }]}
          onPress={registrarPresion}
        >
          <Text style={tw`text-white text-lg font-bold`}>Registrar Presión</Text>
        </TouchableOpacity>

        <Text style={[tw`text-xl font-bold text-center mt-8 mb-4`, { color: '#388e3c' }]}>Registros de Presión Arterial</Text>
      </View>

      <FlatList
        data={presiones}
        renderItem={renderItem}
        keyExtractor={item => item.id_presion.toString()}
        contentContainerStyle={tw`pt-4 pb-20`} // Ajustar padding
      />
    </SafeAreaView>
  );
};

export default RegistrarPresion;
