import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  StyleSheet, 
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

const RegistrarCitaMedica = () => {
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [nombreMedico, setNombreMedico] = useState('');
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [citas, setCitas] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [usuarioRut, setUsuarioRut] = useState('');
  const insets = useSafeAreaInsets();

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
      usuario: usuarioRut,  // Usamos el RUT guardado
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
    <View style={styles.citaItem}>
      <View style={styles.citaInfo}>
        <Text style={styles.citaText}>Fecha: {item.fecha}</Text>
        <Text style={styles.citaText}>Hora: {item.hora}</Text>
        <Text style={styles.citaText}>Médico: {item.nombre_medico}</Text>
        <Text style={styles.citaText}>Motivo: {item.motivo_consulta}</Text>
      </View>
      <TouchableOpacity onPress={() => eliminarCitaMedica(item.id_cita_medica)}>
        <Icon name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light'/>

      <View>
        <View style={styles.dateInputContainer}>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => {
              Keyboard.dismiss(); // Cerrar el teclado antes de mostrar el DatePicker
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>
              {fecha ? fecha.toLocaleDateString('es-ES') : 'DD-MM-AAAA'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Keyboard.dismiss();
            setShowDatePicker(true);
          }}>
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

        <View style={styles.dateInputContainer}>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => {
              Keyboard.dismiss();
              setShowTimePicker(true);
            }}
          >
            <Text style={styles.dateText}>
              {hora ? hora.toLocaleTimeString('es-ES') : 'HH:MM:SS'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Keyboard.dismiss();
            setShowTimePicker(true);
          }}>
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
          style={styles.input}
          placeholder="Nombre del Médico"
          onChangeText={text => setNombreMedico(text)}
          value={nombreMedico}
        />
        <TextInput
          style={styles.input}
          placeholder="Motivo de la Consulta"
          onChangeText={text => setMotivoConsulta(text)}
          value={motivoConsulta}
        />

        <TouchableOpacity 
          style={styles.citaButton} 
          onPress={crearCitaMedica}
        >
          <Text style={styles.citaButtonText}>Crear Cita Médica</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Citas Médicas Registradas</Text>
      </View>

      <FlatList
        data={citas}
        renderItem={renderItem}
        keyExtractor={item => item.id_cita_medica.toString()}
        contentContainerStyle={styles.citasContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#fff',
  },
  dateInput: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
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
  citaButton: {
    backgroundColor: '#32CD32',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  citaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  citasContainer: {
    marginTop: 20,
  },
  citaItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  citaInfo: {
    flex: 1,
  },
  citaText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RegistrarCitaMedica;
