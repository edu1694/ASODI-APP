import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; 
import Icon from 'react-native-vector-icons/Ionicons';
import baseUrl from '../lib/config';
import tw from 'tailwind-react-native-classnames';

const CustomCheckbox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={[tw`h-6 w-6 border-2 rounded flex items-center justify-center`, value ? tw`bg-green-500` : tw`bg-white border-gray-400`]}
    >
      {value && <Icon name="checkmark" size={20} color="white" />}
    </TouchableOpacity>
  );
};

const FichaMedica = (props) => {
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

    const edadParsed = parseInt(edad);
    const estaturaParsed = parseFloat(estatura);
    const numeroContactoParsed = parseInt(numeroContacto);

    if (isNaN(edadParsed) || isNaN(estaturaParsed) || isNaN(numeroContactoParsed)) {
      Alert.alert('Error', 'Por favor, ingresa valores válidos en los campos numéricos.');
      return;
    }
    
    const fichaData = {
      edad: edadParsed,
      estatura: estaturaParsed,
      sexo,
      hospital_perteneciente: hospital,
      diabetes,
      hipertension,
      enfermedad_corazon: enfermedadCorazon,
      accidente_vascular: accidenteVascular,
      trombosis,
      epilepsia,
      alergias,
      numero_contacto: numeroContactoParsed,
      usuario: rut 
    };

    try {
      const response = await fetch(`${baseUrl}/asodi/v1/fichas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fichaData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Ficha médica guardada exitosamente.');
        props.onLogin();
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
    <SafeAreaView style={tw`flex-1 p-5`}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>
        <Text style={tw`text-2xl font-bold text-green-700 text-center mb-5`}>Ficha Médica</Text>

        <TextInput
          style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}
          placeholder="Edad"
          keyboardType="numeric"
          onChangeText={setEdad}
          value={edad}
        />
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
        />
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg mb-2 text-green-700`}>Sexo</Text>
          <View style={[tw`border bg-white p-2 rounded-lg`, { borderColor: '#388e3c' }]}>
            <Picker
              selectedValue={sexo}
              onValueChange={(itemValue) => setSexo(itemValue)}
            >
              <Picker.Item label="Selecciona tu sexo" value="" />
              <Picker.Item label="Hombre" value="M" />
              <Picker.Item label="Mujer" value="F" />
            </Picker>
          </View>
        </View>

        <TextInput
          style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}
          placeholder="Hospital Perteneciente"
          onChangeText={setHospital}
          value={hospital}
        />

        {[
          { label: 'Diabetes', value: diabetes, onChange: setDiabetes },
          { label: 'Hipertensión', value: hipertension, onChange: setHipertension },
          { label: 'Enfermedad del corazón', value: enfermedadCorazon, onChange: setEnfermedadCorazon },
          { label: 'Accidente vascular', value: accidenteVascular, onChange: setAccidenteVascular },
          { label: 'Trombosis', value: trombosis, onChange: setTrombosis },
          { label: 'Epilepsia', value: epilepsia, onChange: setEpilepsia },
          { label: 'Alergias', value: alergias, onChange: setAlergias }
        ].map((item, index) => (
          <View key={index} style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg text-green-700`}>{`¿Tienes ${item.label}?`}</Text>
            <CustomCheckbox value={item.value} onValueChange={item.onChange} />
          </View>
        ))}

        <TextInput
          style={[tw`border bg-white p-4 mb-4 rounded-lg`, { borderColor: '#388e3c' }]}
          placeholder="Número de Contacto"
          keyboardType="numeric"
          onChangeText={setNumeroContacto}
          value={numeroContacto}
        />

        <TouchableOpacity style={[tw`bg-green-500 p-4 rounded-full`, { backgroundColor: '#388e3c' }]} onPress={handleSaveFicha}>
          <Text style={tw`text-white text-lg font-bold text-center`}>Guardar Ficha Médica</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FichaMedica;
