import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import CONFIG from '../lib/config';

const CustomCheckbox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={[styles.checkbox, value && styles.checkboxChecked]}
    >
      {value && <Icon name="checkmark" size={20} color="white" />}
    </TouchableOpacity>
  );
};

const FichaMedica = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { rut } = route.params; 

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

  const handleSaveFicha = async () => {
    if (!edad || !estatura || !sexo || !hospital || !numeroContacto) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }
  
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
      const response = await fetch(`${baseUrl}/asodi/v1/usuarios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fichaData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Éxito', 'Ficha médica guardada exitosamente.');
        navigation.navigate('Home', { rut });
      } else {
        console.error('Error al guardar la ficha médica:', data);
        Alert.alert('Error', `Error al guardar la ficha médica: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo guardar la ficha médica');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Ficha Médica</Text>

        <TextInput
          style={styles.input}
          placeholder="Edad"
          keyboardType="numeric"
          onChangeText={setEdad}
          value={edad}
        />

        <TextInput
          style={styles.input}
          placeholder="Estatura (m)"
          keyboardType="numeric"
          onChangeText={setEstatura}
          value={estatura}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Sexo</Text>
          <Picker
            selectedValue={sexo}
            style={styles.picker}
            onValueChange={(itemValue) => setSexo(itemValue)}
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
        />

        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>¿Tienes diabetes?</Text>
          <CustomCheckbox value={diabetes} onValueChange={setDiabetes} />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>¿Tienes hipertensión?</Text>
          <CustomCheckbox value={hipertension} onValueChange={setHipertension} />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>¿Tienes enfermedad del corazón?</Text>
          <CustomCheckbox value={enfermedadCorazon} onValueChange={setEnfermedadCorazon} />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>¿Has tenido un accidente vascular?</Text>
          <CustomCheckbox value={accidenteVascular} onValueChange={setAccidenteVascular} />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>¿Tienes trombosis?</Text>
          <CustomCheckbox value={trombosis} onValueChange={setTrombosis} />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>¿Tienes epilepsia?</Text>
          <CustomCheckbox value={epilepsia} onValueChange={setEpilepsia} />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>¿Tienes alergias?</Text>
          <CustomCheckbox value={alergias} onValueChange={setAlergias} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Número de Contacto"
          keyboardType="numeric"
          onChangeText={setNumeroContacto}
          value={numeroContacto}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveFicha}>
          <Text style={styles.saveButtonText}>Guardar Ficha Médica</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1E90FF',
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

export default FichaMedica;