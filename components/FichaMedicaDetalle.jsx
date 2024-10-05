import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; 
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../lib/config';
import tw from 'tailwind-react-native-classnames';

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
          Alert.alert('Error', 'No se ha proporcionado un RUT válido.');
        }
      } catch (error) {
        console.error('Error al obtener el RUT del usuario:', error);
      }
    };
  
    obtenerRutUsuario();
  
    if (rut) {
      const fetchData = async () => {
        try {
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
        setEditable(false);
      } else {
        Alert.alert('Error', `Error al actualizar la ficha médica: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la ficha médica');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 p-5`}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <Text style={tw`text-2xl font-bold text-green-700`}>Ficha Médica</Text>
          <TouchableOpacity onPress={() => setEditable(!editable)}>
            <Icon name="pencil" size={24} color="#388e3c" />
          </TouchableOpacity>
        </View>

        {/* Campo de RUT con etiqueta */}
        <Text style={tw`text-lg mb-2 text-green-700`}>RUT</Text>
        <TextInput
          style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}
          value={rut}
          editable={false}
        />

        {/* Campo de Edad con etiqueta */}
        <Text style={tw`text-lg mb-2 text-green-700`}>Edad</Text>
        <TextInput
          style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}
          placeholder="Edad"
          keyboardType="numeric"
          onChangeText={setEdad}
          value={edad}
          editable={editable}
        />

        {/* Campo de Estatura con etiqueta */}
        <Text style={tw`text-lg mb-2 text-green-700`}>Estatura (m)</Text>
        <TextInput
          style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}
          placeholder="Estatura (m)"
          keyboardType="numeric"
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9.]/g, ''); 
            if (/^\d*\.?\d{0,2}$/.test(numericValue)) {
              setEstatura(numericValue);
            }
          }}
          value={estatura}
          editable={editable}
        />

        {/* Campo de Sexo con etiqueta */}
        <Text style={tw`text-lg mb-2 text-green-700`}>Sexo</Text>
        <View style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}>
          <Picker
            selectedValue={sexo}
            onValueChange={(itemValue) => setSexo(itemValue)}
            enabled={editable}
          >
            <Picker.Item label="Selecciona tu sexo" value="" />
            <Picker.Item label="Hombre" value="M" />
            <Picker.Item label="Mujer" value="F" />
          </Picker>
        </View>

        {/* Campo de Hospital Perteneciente con etiqueta */}
        <Text style={tw`text-lg mb-2 text-green-700`}>Hospital Perteneciente</Text>
        <TextInput
          style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}
          placeholder="Hospital Perteneciente"
          onChangeText={setHospital}
          value={hospital}
          editable={editable}
        />

        {/* Campos booleanos */}
        {[
          { label: 'Diabetes', value: diabetes, setValue: setDiabetes },
          { label: 'Hipertensión', value: hipertension, setValue: setHipertension },
          { label: 'Enfermedad del Corazón', value: enfermedadCorazon, setValue: setEnfermedadCorazon },
          { label: 'Accidente Vascular', value: accidenteVascular, setValue: setAccidenteVascular },
          { label: 'Trombosis', value: trombosis, setValue: setTrombosis },
          { label: 'Epilepsia', value: epilepsia, setValue: setEpilepsia },
          { label: 'Alergias', value: alergias, setValue: setAlergias },
        ].map((field, index) => (
          <View key={index} style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg text-green-700`}>{field.label}</Text>
            <Switch
              value={field.value}
              onValueChange={field.setValue}
              disabled={!editable}
            />
          </View>
        ))}

        {/* Campo de Número de Contacto con etiqueta */}
        <Text style={tw`text-lg mb-2 text-green-700`}>Número de Contacto</Text>
        <TextInput
          style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}
          placeholder="Número de Contacto"
          keyboardType="numeric"
          onChangeText={setNumeroContacto}
          value={numeroContacto}
          editable={editable}
        />

        {editable && (
          <TouchableOpacity 
            style={[tw`bg-green-500 p-4 rounded-full`, { backgroundColor: '#388e3c' }]} 
            onPress={handleUpdateFicha}
          >
            <Text style={tw`text-white text-lg font-bold`}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FichaMedicaDetalle;
