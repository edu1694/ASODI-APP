import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; 
import CONFIG from '../lib/config';

const FichaMedica = () => {
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
  const navigation = useNavigation();

  const manejarFichaMedica = async () => {
    if (!edad || !estatura || !sexo || !hospital || !numeroContacto) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    const baseUrl = Platform.OS === 'web'
      ? CONFIG.apiBaseUrl.web
      : Platform.OS === 'android'
        ? CONFIG.apiBaseUrl.android
        : CONFIG.apiBaseUrl.ios;

    try {
      const response = await fetch(`${baseUrl}/fichas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la creación de la ficha médica');
      }

      Alert.alert('Éxito', 'Ficha médica creada exitosamente');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al crear la ficha médica:', error);
      Alert.alert('Error', 'No se pudo crear la ficha médica');
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
        <TextInput
          style={styles.input}
          placeholder="Sexo (M/F)"
          onChangeText={setSexo}
          value={sexo}
        />
        <TextInput
          style={styles.input}
          placeholder="Hospital Perteneciente"
          onChangeText={setHospital}
          value={hospital}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Contacto"
          keyboardType="numeric"
          onChangeText={setNumeroContacto}
          value={numeroContacto}
        />

        {/* Sección de Enfermedades */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Diabetes</Text>
          <TouchableOpacity onPress={() => setDiabetes(!diabetes)}>
            <Icon name={diabetes ? 'checkbox' : 'square-outline'} size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Hipertensión</Text>
          <TouchableOpacity onPress={() => setHipertension(!hipertension)}>
            <Icon name={hipertension ? 'checkbox' : 'square-outline'} size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Enfermedad del Corazón</Text>
          <TouchableOpacity onPress={() => setEnfermedadCorazon(!enfermedadCorazon)}>
            <Icon name={enfermedadCorazon ? 'checkbox' : 'square-outline'} size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Accidente Vascular</Text>
          <TouchableOpacity onPress={() => setAccidenteVascular(!accidenteVascular)}>
            <Icon name={accidenteVascular ? 'checkbox' : 'square-outline'} size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Trombosis</Text>
          <TouchableOpacity onPress={() => setTrombosis(!trombosis)}>
            <Icon name={trombosis ? 'checkbox' : 'square-outline'} size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Epilepsia</Text>
          <TouchableOpacity onPress={() => setEpilepsia(!epilepsia)}>
            <Icon name={epilepsia ? 'checkbox' : 'square-outline'} size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Alergias</Text>
          <TouchableOpacity onPress={() => setAlergias(!alergias)}>
            <Icon name={alergias ? 'checkbox' : 'square-outline'} size={24} color="grey" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={manejarFichaMedica}
        >
          <Text style={styles.submitButtonText}>Guardar Ficha Médica</Text>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FichaMedica;
