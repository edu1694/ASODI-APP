import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Switch } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; 
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../lib/config';

const FichaMedicaDetalle = () => {
  const route = useRoute();
  const [rut, setRut] = useState(route.params?.rut || ''); // Mostrar pero no editable

  const [editable, setEditable] = useState(false);
  const [edad, setEdad] = useState('');
  const [estatura, setEstatura] = useState('');
  const [sexo, setSexo] = useState('');
  const [hospital, setHospital] = useState('');
  const [diabetes, setDiabetes] = useState(false);
  const [hipertension, setHipertension] = useState(false);
  const [enfermedadCorazon, setEnfermedadCorazon] = useState(false);
  const [accidenteVascular, setAccidenteVascular] = useState(false);
  const [trombosis, setTrombosis] = useState(false);
  const [epilepsia, setEpilepsia] = useState(false);
  const [alergias, setAlergias] = useState(false);
  const [numeroContacto, setNumeroContacto] = useState('');

  useEffect(() => {
    const obtenerRutUsuario = async () => {
      try {
        const storedRut = await AsyncStorage.getItem('usuarioRut');
        if (storedRut) {
          setRut(storedRut); // Establece el RUT en el estado
        } else {
          Alert.alert('Error', 'No se ha proporcionado un RUT válido.'); // Solo muestra la alerta si no hay un RUT
        }
      } catch (error) {
        console.error('Error al obtener el RUT del usuario:', error);
      }
    };
  
    obtenerRutUsuario();
  
    // Solo procede si el rut está disponible
    if (rut) {
      const fetchData = async () => {
        try {
          const baseUrl = Platform.OS === 'web'
            ? CONFIG.apiBaseUrl.web
            : Platform.OS === 'android'
              ? CONFIG.apiBaseUrl.android
              : CONFIG.apiBaseUrl.ios;
  
          const response = await fetch(`${baseUrl}/asodi/v1/fichas/${rut}/`);
          const data = await response.json();
          if (response.ok) {
            setEdad(data.edad.toString());
            setEstatura(data.estatura.toString());
            setSexo(data.sexo);
            setHospital(data.hospital_perteneciente);
            setDiabetes(data.diabetes);
            setHipertension(data.hipertension);
            setEnfermedadCorazon(data.enfermedad_corazon);
            setAccidenteVascular(data.accidente_vascular);
            setTrombosis(data.trombosis);
            setEpilepsia(data.epilepsia);
            setAlergias(data.alergias);
            setNumeroContacto(data.numero_contacto.toString());
          } else {
            Alert.alert('Error', 'No se pudo cargar la ficha médica.');
          }
        } catch (error) {
          Alert.alert('Error', 'No se pudo cargar la ficha médica.');
        }
      };
  
      fetchData();
    }
  }, [rut]);
  
  const handleUpdateFicha = async () => {
    const baseUrl = Platform.OS === 'web'
      ? CONFIG.apiBaseUrl.web
      : Platform.OS === 'android'
        ? CONFIG.apiBaseUrl.android
        : CONFIG.apiBaseUrl.ios;

    const fichaData = {
      edad: parseInt(edad),
      estatura: parseFloat(estatura),
      sexo,
      hospital_perteneciente: hospital,
      diabetes,
      hipertension,
      enfermedad_corazon: enfermedadCorazon,
      accidente_vascular: accidenteVascular,
      trombosis,
      epilepsia,
      alergias,
      numero_contacto: parseInt(numeroContacto),
      usuario: rut
    };

    try {
      const response = await fetch(`${baseUrl}/asodi/v1/fichas/${rut}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fichaData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Ficha médica actualizada exitosamente.');
        setEditable(false); // Salir del modo de edición
      } else {
        Alert.alert('Error', `Error al actualizar la ficha médica: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la ficha médica');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Ficha Médica</Text>
          <TouchableOpacity onPress={() => setEditable(!editable)}>
            <Icon name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Campo de RUT con etiqueta */}
        <Text style={styles.label}>RUT</Text>
        <TextInput
          style={styles.input}
          value={rut}
          editable={false}
        />

        {/* Campo de Edad con etiqueta */}
        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Edad"
          keyboardType="numeric"
          onChangeText={setEdad}
          value={edad}
          editable={editable}
        />

        {/* Campo de Estatura con etiqueta */}
        <Text style={styles.label}>Estatura (m)</Text>
        <TextInput
          style={styles.input}
          placeholder="Estatura (m)"
          keyboardType="numeric"
          onChangeText={setEstatura}
          value={estatura}
          editable={editable}
        />

        {/* Campo de Sexo con etiqueta */}
        <Text style={styles.label}>Sexo</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sexo}
            style={styles.picker}
            onValueChange={(itemValue) => setSexo(itemValue)}
            enabled={editable}
          >
            <Picker.Item label="Selecciona tu sexo" value="" />
            <Picker.Item label="Hombre" value="M" />
            <Picker.Item label="Mujer" value="F" />
          </Picker>
        </View>

        {/* Campo de Hospital Perteneciente con etiqueta */}
        <Text style={styles.label}>Hospital Perteneciente</Text>
        <TextInput
          style={styles.input}
          placeholder="Hospital Perteneciente"
          onChangeText={setHospital}
          value={hospital}
          editable={editable}
        />

        {/* Campos booleanos */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Diabetes</Text>
          <Switch
            value={diabetes}
            onValueChange={setDiabetes}
            disabled={!editable}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Hipertensión</Text>
          <Switch
            value={hipertension}
            onValueChange={setHipertension}
            disabled={!editable}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Enfermedad del Corazón</Text>
          <Switch
            value={enfermedadCorazon}
            onValueChange={setEnfermedadCorazon}
            disabled={!editable}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Accidente Vascular</Text>
          <Switch
            value={accidenteVascular}
            onValueChange={setAccidenteVascular}
            disabled={!editable}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Trombosis</Text>
          <Switch
            value={trombosis}
            onValueChange={setTrombosis}
            disabled={!editable}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Epilepsia</Text>
          <Switch
            value={epilepsia}
            onValueChange={setEpilepsia}
            disabled={!editable}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Alergias</Text>
          <Switch
            value={alergias}
            onValueChange={setAlergias}
            disabled={!editable}
          />
        </View>

        {/* Campo de Número de Contacto con etiqueta */}
        <Text style={styles.label}>Número de Contacto</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de Contacto"
          keyboardType="numeric"
          onChangeText={setNumeroContacto}
          value={numeroContacto}
          editable={editable}
        />

        {editable && (
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateFicha}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FichaMedicaDetalle;
