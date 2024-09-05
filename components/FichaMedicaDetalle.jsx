import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; 
import Icon from 'react-native-vector-icons/Ionicons';
import CONFIG from '../lib/config';

const FichaMedicaDetalle = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { rut } = route.params;

  const [editable, setEditable] = useState(false); // Para alternar entre vista y edición
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
    // Aquí puedes cargar los datos de la ficha médica existente para el usuario con RUT.
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

        <TextInput
          style={styles.input}
          placeholder="Edad"
          keyboardType="numeric"
          onChangeText={setEdad}
          value={edad}
          editable={editable}
        />

        <TextInput
          style={styles.input}
          placeholder="Estatura (m)"
          keyboardType="numeric"
          onChangeText={setEstatura}
          value={estatura}
          editable={editable}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Sexo</Text>
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

        <TextInput
          style={styles.input}
          placeholder="Hospital Perteneciente"
          onChangeText={setHospital}
          value={hospital}
          editable={editable}
        />

        {/* Añade aquí los otros campos igual que en el formulario original */}
        
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
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
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
