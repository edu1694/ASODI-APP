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

const RegistrarPeso = () => {
  const [peso, setPeso] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState(new Date());
  const [pesos, setPesos] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [usuarioRut, setUsuarioRut] = useState('');
  const insets = useSafeAreaInsets();

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
      peso: parseInt(peso, 10),  // Convertimos a entero
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

    // Limpiar los campos después de agregar el peso
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
    <View style={styles.pesoItem}>
      <View style={styles.pesoInfo}>
        <Text style={styles.pesoText}>Fecha: {item.fecha_registro}</Text>
        <Text style={styles.pesoText}>Peso: {item.peso} kg</Text>
      </View>
      <TouchableOpacity onPress={() => eliminarPeso(item.id_peso)}>
        <Icon name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const validarEntradaPeso = (text) => {
    // Filtrar la entrada para que solo permita números enteros
    const textFiltrado = text.replace(/[^0-9]/g, '');
    setPeso(textFiltrado);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />

      <View>
        <Text style={styles.title}>Registrar Peso</Text>

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
          placeholder="Peso (kg)"
          keyboardType="numeric"
          onChangeText={validarEntradaPeso}  // Usamos la función de validación aquí
          value={peso}
        />

        <TouchableOpacity 
          style={styles.pesoButton} 
          onPress={registrarPeso}
        >
          <Text style={styles.pesoButtonText}>Registrar Peso</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Registros de Peso</Text>
      </View>

      <FlatList
        data={pesos}
        renderItem={renderItem}
        keyExtractor={item => item.id_peso.toString()}
        contentContainerStyle={styles.pesosContainer}
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
  pesoButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pesoButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pesosContainer: {
    marginTop: 10,
    paddingBottom: 20,
  },
  pesoItem: {
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
  pesoInfo: {
    flex: 1,
    marginRight: 10,
  },
  pesoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RegistrarPeso;
