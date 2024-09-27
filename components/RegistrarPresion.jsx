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
    <View style={styles.presionItem}>
      <View style={styles.presionInfo}>
        <Text style={styles.presionText}>Fecha: {item.fecha_registro}</Text>
        <Text style={styles.presionText}>Presión Sistólica: {item.presion_sistolica} mmHg</Text>
        <Text style={styles.presionText}>Presión Diastólica: {item.presion_diastolica} mmHg</Text>
        <Text style={styles.presionText}>Frecuencia Cardiaca: {item.frecuenciacardiaca} bpm</Text>
      </View>
      <TouchableOpacity onPress={() => eliminarPresionMedica(item.id_presion)}>
        <Icon name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />
      
      <View>
        <Text style={styles.title}>Registrar Presión Arterial</Text>

        <View style={styles.dateInputContainer}>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => {
              Keyboard.dismiss(); // Cerrar el teclado antes de mostrar el DatePicker
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>
              {fechaRegistro ? fechaRegistro.toLocaleDateString('es-ES') : 'DD-MM-AAAA'}
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
            value={fechaRegistro}
            mode="date"
            display="default"
            onChange={onChangeFecha}
            locale="es-ES"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Presión Sistólica (mmHg)"
          keyboardType="numeric"
          onChangeText={text => setPresionSistolica(text)}
          value={presionSistolica}
        />
        <TextInput
          style={styles.input}
          placeholder="Presión Diastólica (mmHg)"
          keyboardType="numeric"
          onChangeText={text => setPresionDiastolica(text)}
          value={presionDiastolica}
        />
        <TextInput
          style={styles.input}
          placeholder="Frecuencia Cardiaca (bpm)"
          keyboardType="numeric"
          onChangeText={text => setFrecuenciaCardiaca(text)}
          value={frecuenciaCardiaca}
        />

        <TouchableOpacity 
          style={styles.presionButton} 
          onPress={crearPresion}
        >
          <Text style={styles.presionButtonText}>Registrar Presión</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Registros de Presión Arterial</Text>
      </View>

      <FlatList
        data={presiones}
        renderItem={renderItem}
        keyExtractor={item => item.id_presion.toString()}
        contentContainerStyle={styles.presionesContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f2f2f2',
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
    justifyContent: 'center',
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
    fontSize: 16,
  },
  presionButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  presionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  presionesContainer: {
    marginTop: 10,
    paddingBottom: 20,
  },
  presionItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  presionInfo: {
    flex: 1,
    marginRight: 10,
  },
  presionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RegistrarPresion;
