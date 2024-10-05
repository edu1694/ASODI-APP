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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames'; // Importa Tailwind

const RegistrarPresion = () => {
  const [presionDiastolica, setPresionDiastolica] = useState('');
  const [presionSistolica, setPresionSistolica] = useState('');
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState(new Date());
  const [presiones, setPresiones] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [usuarioRut, setUsuarioRut] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const obtenerRutUsuario = async () => {
      try {
        const rut = await AsyncStorage.getItem('usuarioRut');
        if (rut !== null) {
          setUsuarioRut(rut);
          obtenerPresionesMedicas(rut); // Obtener presiones al cargar la página
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

  const crearPresion = async () => {
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
        setPresiones([...presiones, presionGuardada]);
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

  const obtenerPresionesMedicas = async (rut) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/presiones/${rut}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const presionesUsuario = await response.json();
        setPresiones(presionesUsuario);
      } else {
        Alert.alert('Error', 'No se pudo obtener las presiones médicas');
      }
    } catch (error) {
      console.error('Error al obtener las presiones médicas:', error);
    }
  };

  const eliminarPresionMedica = async (id_presion) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/presiones/${usuarioRut}/${id_presion}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPresiones(presiones.filter(presion => presion.id_presion !== id_presion));
        Alert.alert('Éxito', 'Presión arterial eliminada exitosamente');
      } else {
        Alert.alert('Error', 'No se pudo eliminar la presión arterial');
      }
    } catch (error) {
      console.error('Error al eliminar la presión arterial:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[tw`p-4 mb-4 rounded-lg`, { backgroundColor: '#e8f5e9' }]}>
      <View style={tw`flex-1`}>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Fecha: {item.fecha_registro}</Text>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Presión Sistólica: {item.presion_sistolica} mmHg</Text>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Presión Diastólica: {item.presion_diastolica} mmHg</Text>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Frecuencia Cardiaca: {item.frecuenciacardiaca} bpm</Text>
      </View>
      <TouchableOpacity onPress={() => eliminarPresionMedica(item.id_presion)}>
        <Icon name="trash-outline" size={24} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[tw`flex-1 px-4`, { backgroundColor: '#f0f4f8' }]}>
      <StatusBar barStyle="dark-content" />

      <View>
        <Text style={[tw`text-2xl font-bold text-center mb-4`, { color: '#388e3c' }]}>Registrar Presión Arterial</Text>

        <View style={[tw`flex-row items-center border bg-white rounded-lg p-2 mb-4`, { borderColor: '#388e3c' }]}>
          <TouchableOpacity 
            style={tw`flex-1`}
            onPress={() => {
              Keyboard.dismiss();
              setShowDatePicker(true);
            }}
          >
            <Text style={[tw`text-lg`, { color: '#388e3c' }]}>
              {fechaRegistro ? fechaRegistro.toLocaleDateString('es-ES') : 'DD-MM-AAAA'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

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
          style={[tw`border bg-white rounded-lg p-3 mb-4`, { borderColor: '#388e3c' }]}
          placeholder="Presión Sistólica (mmHg)"
          keyboardType="numeric"
          onChangeText={text => setPresionSistolica(text)}
          value={presionSistolica}
        />
        <TextInput
          style={[tw`border bg-white rounded-lg p-3 mb-4`, { borderColor: '#388e3c' }]}
          placeholder="Presión Diastólica (mmHg)"
          keyboardType="numeric"
          onChangeText={text => setPresionDiastolica(text)}
          value={presionDiastolica}
        />
        <TextInput
          style={[tw`border bg-white rounded-lg p-3 mb-4`, { borderColor: '#388e3c' }]}
          placeholder="Frecuencia Cardiaca (bpm)"
          keyboardType="numeric"
          onChangeText={text => setFrecuenciaCardiaca(text)}
          value={frecuenciaCardiaca}
        />

        <TouchableOpacity 
          style={[tw`rounded-full h-12 flex items-center justify-center mt-4`, { backgroundColor: '#388e3c' }]}
          onPress={crearPresion}
        >
          <Text style={tw`text-white text-lg font-bold`}>Registrar Presión</Text>
        </TouchableOpacity>

        <Text style={[tw`text-xl font-bold text-center my-6`, { color: '#388e3c' }]}>Registros de Presión Arterial</Text>
      </View>

      <FlatList
        data={presiones}
        renderItem={renderItem}
        keyExtractor={item => item.id_presion.toString()}
        contentContainerStyle={tw`pb-6`}
      />
    </SafeAreaView>
  );
};

export default RegistrarPresion;
