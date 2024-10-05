import React from 'react'; 
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { useNavigation } from '@react-navigation/native'; 
import tw from 'tailwind-react-native-classnames'; 

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleNavigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Header */}
      <View style={tw`bg-green-700 p-5 items-center`}>
        <Text style={tw`text-white text-lg font-bold`}>MI ASODI APP</Text>
      </View>

      {/* Navegación al Home */}
      <TouchableOpacity style={tw`flex-row items-center p-3`} onPress={() => handleNavigateTo('Home')}>
        <Ionicons name="home-outline" size={20} color="#4B5563" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Inicio</Text>
      </TouchableOpacity>

      {/* Opción de "Ficha" */}
      <TouchableOpacity style={tw`flex-row items-center p-3`} onPress={() => handleNavigateTo('FichaMedicaDetalle')}>
        <Ionicons name="document-text-outline" size={20} color="#4B5563" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Ficha</Text>
      </TouchableOpacity>

      {/* Opción de "Registrar Cita Médica" */}
      <TouchableOpacity style={tw`flex-row items-center p-3`} onPress={() => handleNavigateTo('RegistrarCitaMedica')}>
        <Ionicons name="calendar-outline" size={20} color="#4B5563" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Registrar Cita Médica</Text>
      </TouchableOpacity>

      {/* Opción de "Registrar Presión" */}
      <TouchableOpacity style={tw`flex-row items-center p-3`} onPress={() => handleNavigateTo('RegistrarPresion')}>
        <Ionicons name="heart-outline" size={20} color="#4B5563" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Registrar Presión</Text>
      </TouchableOpacity>

      {/* Opción de "Registrar Peso" */}
      <TouchableOpacity style={tw`flex-row items-center p-3`} onPress={() => handleNavigateTo('RegistrarPeso')}>
        <Ionicons name="fitness-outline" size={20} color="#4B5563" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Registrar Peso</Text>
      </TouchableOpacity>

      {/* Opción de "Anuncios" */}
      <TouchableOpacity style={tw`flex-row items-center p-3`} onPress={() => handleNavigateTo('Anuncios')}>
        <Ionicons name="megaphone-outline" size={20} color="#4B5563" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Anuncios</Text>
      </TouchableOpacity>

      {/* Botón blanco para cerrar sesión con texto verde */}
      <TouchableOpacity 
        style={tw`bg-white rounded-lg p-2 mt-5 shadow-lg flex-row items-center`}
        onPress={() => props.onLogout()}
      >
        <View style={tw`bg-green-600 p-1.5 rounded-full`}>
          <Ionicons name="log-out-outline" size={18} color="white" />
        </View>
        <Text style={tw`ml-3 text-green-600 text-base font-semibold`}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
