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

const RegistrarCitaMedica = () => {
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [nombreMedico, setNombreMedico] = useState('');
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [citas, setCitas] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [usuarioRut, setUsuarioRut] = useState('');

  useEffect(() => {
    const obtenerRutUsuario = async () => {
      try {
        const rut = await AsyncStorage.getItem('usuarioRut');
        if (rut !== null) {
          setUsuarioRut(rut);
          obtenerCitasMedicas(rut); // Obtener citas al cargar la página
        }
      } catch (error) {
        console.error('Error al obtener el RUT del usuario:', error);
      }
    };

    obtenerRutUsuario();
  }, []);

  const onChangeFecha = (event, selectedDate) => {
    if (selectedDate) {
      setFecha(selectedDate);
    }
    setShowDatePicker(false);
  };

  const onChangeHora = (event, selectedTime) => {
    if (selectedTime) {
      setHora(selectedTime);
    }
    setShowTimePicker(false);
  };

  const crearCitaMedica = async () => {
    if (!fecha || !hora || !nombreMedico || !motivoConsulta) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const citaMedica = {
      id_cita_medica: citas.length + 1,
      fecha: fecha.toISOString().split('T')[0],
      hora: hora.toTimeString().split(' ')[0],
      nombre_medico: nombreMedico,
      motivo_consulta: motivoConsulta,
      usuario: usuarioRut,
    };

    try {
      const response = await fetch(`${baseUrl}/asodi/v1/citas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(citaMedica),
      });

      if (response.ok) {
        const nuevaCita = await response.json();
        setCitas([...citas, nuevaCita]);
        Alert.alert('Éxito', 'Cita médica creada exitosamente');
      } else {
        Alert.alert('Error', 'No se pudo crear la cita médica');
      }
    } catch (error) {
      console.error('Error al crear la cita médica:', error);
    }

    // Limpiar los campos después de agregar la cita
    setNombreMedico('');
    setMotivoConsulta('');
  };

  const obtenerCitasMedicas = async (rut) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/citas/${rut}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const citasUsuario = await response.json();
        setCitas(citasUsuario);
      } else {
        Alert.alert('Error', 'No se pudo obtener las citas médicas');
      }
    } catch (error) {
      console.error('Error al obtener las citas médicas:', error);
    }
  };

  const eliminarCitaMedica = async (id_cita_medica) => {
    try {
      const rut = await AsyncStorage.getItem('usuarioRut')
      const response = await fetch(`${baseUrl}/asodi/v1/citas/${rut}/${id_cita_medica}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCitas(citas.filter(cita => cita.id_cita_medica !== id_cita_medica));
        Alert.alert('Éxito', 'Cita médica eliminada exitosamente');
      } else {
        Alert.alert('Error', 'No se pudo eliminar la cita médica');
      }
    } catch (error) {
      console.error('Error al eliminar la cita médica:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[tw`p-4 mb-3 rounded-lg flex-row justify-between items-center shadow`, { backgroundColor: '#e8f5e9' }]}>
      <View>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Fecha: {item.fecha}</Text>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Hora: {item.hora}</Text>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Médico: {item.nombre_medico}</Text>
        <Text style={[tw`text-lg`, { color: '#388e3c' }]}>Motivo: {item.motivo_consulta}</Text>
      </View>
      <TouchableOpacity onPress={() => eliminarCitaMedica(item.id_cita_medica)}>
        <Icon name="trash-outline" size={24} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[tw`flex-1 px-4`, { backgroundColor: '#f0f4f8' }]}>
      <StatusBar barStyle='dark-content' />

      <View>
        <Text style={[tw`text-2xl font-bold text-center mb-5`, { color: '#388e3c' }]}>Registrar Cita Medica</Text>
        <View style={[tw`flex-row items-center border bg-white rounded-lg p-3 mb-4`, { borderColor: '#388e3c' }]}>
          <TouchableOpacity 
            style={tw`flex-1`}
            onPress={() => {
              Keyboard.dismiss(); 
              setShowDatePicker(true);
            }}
          >
            <Text style={[tw`text-lg`, { color: '#388e3c' }]}>
              {fecha ? fecha.toLocaleDateString('es-ES') : 'DD-MM-AAAA'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display="default"
            onChange={onChangeFecha}
            locale="es-ES"
          />
        )}

        <View style={[tw`flex-row items-center border bg-white rounded-lg p-3 mb-4`, { borderColor: '#388e3c' }]}>
          <TouchableOpacity 
            style={tw`flex-1`}
            onPress={() => {
              Keyboard.dismiss();
              setShowTimePicker(true);
            }}
          >
            <Text style={[tw`text-lg`, { color: '#388e3c' }]}>
              {hora ? hora.toLocaleTimeString('es-ES') : 'HH:MM:SS'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Icon name="time-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={hora}
            mode="time"
            display="default"
            onChange={onChangeHora}
            locale="es-ES"
          />
        )}

        <TextInput
          style={[tw`bg-white p-4 mb-4 rounded-lg shadow`, { borderColor: '#388e3c' }]}
          placeholder="Nombre del Médico"
          onChangeText={text => setNombreMedico(text)}
          value={nombreMedico}
        />
        <TextInput
          style={[tw`bg-white p-4 mb-4 rounded-lg shadow`, { borderColor: '#388e3c' }]}
          placeholder="Motivo de la Consulta"
          onChangeText={text => setMotivoConsulta(text)}
          value={motivoConsulta}
        />

        <TouchableOpacity 
          style={[tw`bg-green-500 p-4 rounded-lg justify-center items-center`, { backgroundColor: '#388e3c' }]}
          onPress={crearCitaMedica}
        >
          <Text style={tw`text-white text-lg font-bold`}>Crear Cita Médica</Text>
        </TouchableOpacity>

        <Text style={[tw`text-xl font-bold text-center mt-8 mb-4`, { color: '#388e3c' }]}>Citas Médicas Registradas</Text>
      </View>

      <FlatList
        data={citas}
        renderItem={renderItem}
        keyExtractor={item => item.id_cita_medica.toString()}
        contentContainerStyle={tw`pt-4 pb-20`}
      />
    </SafeAreaView>
  );
};

export default RegistrarCitaMedica;
