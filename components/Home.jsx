import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  ScrollView 
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';
import { SafeAreaView } from 'react-native-safe-area-context'; // Asegúrate de importar correctamente SafeAreaView
import baseUrl from '../lib/config';

const Home = () => {
  const [usuarioRut, setUsuarioRut] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [ultimoAnuncio, setUltimoAnuncio] = useState(null);
  const navigation = useNavigation();

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useFocusEffect(
    useCallback(() => {
      const obtenerDatos = async () => {
        try {
          const rut = await AsyncStorage.getItem('usuarioRut');
          if (rut !== null) {
            setUsuarioRut(rut);
            await obtenerDatosUsuario(rut);
            await obtenerUltimoAnuncio(); 
          }
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
      obtenerDatos();
    }, [])
  );

  const obtenerDatosUsuario = async (rut) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/usuarios/${rut}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const data = await response.json();
      setNombreUsuario(capitalizeFirstLetter(data.nombre));
      setApellidoUsuario(capitalizeFirstLetter(data.apellido));
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  const obtenerUltimoAnuncio = async () => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/anuncios/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los anuncios');
      }

      const data = await response.json();
      
      if (data.length > 0) {
        const sortedAnuncios = data.sort((a, b) => b.id_anuncio - a.id_anuncio);
        const ultimoAnuncio = sortedAnuncios[0];
        setUltimoAnuncio(ultimoAnuncio);
      } else {
        setUltimoAnuncio(null);
      }
    } catch (error) {
      console.error('Error al obtener el último anuncio:', error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <ScrollView contentContainerStyle={tw`p-5`}>
        <View style={tw`items-center mb-5`}>
          <Text style={tw`text-3xl font-bold text-green-700`}>¡Bienvenido!</Text>
          <Text style={tw`text-xl text-gray-700 mt-2`}>{nombreUsuario} {apellidoUsuario}</Text>
        </View>

        <View style={tw`bg-white p-5 rounded-lg shadow-lg`}>
          <Text style={tw`text-lg text-gray-600 text-center mb-3`}>
            Nos alegra que estés aquí. Explora las funcionalidades de la app y descubre cómo podemos ayudarte a gestionar mejor tu salud.
          </Text>

          {ultimoAnuncio ? (
            <View style={tw`mt-5`}>
              <Text style={tw`text-2xl font-bold text-green-700 text-center mb-2`}>
                {ultimoAnuncio.titulo}
              </Text>
              <Text style={tw`text-base text-gray-700 text-center mb-4`}>
                {ultimoAnuncio.descripcion}
              </Text>

              {ultimoAnuncio.imagen && (
                <Image
                  source={{ uri: `${baseUrl}${ultimoAnuncio.imagen}` }}
                  style={tw`w-48 h-48 rounded-lg mx-auto mb-4`} // Ajuste del tamaño de la imagen (más pequeño)
                  resizeMode="cover"
                />
              )}

              <Text style={tw`text-sm text-gray-600 text-center mb-2`}>
                Este anuncio está disponible desde {ultimoAnuncio.fecha_inicio} hasta {ultimoAnuncio.fecha_termino}
              </Text>
            </View>
          ) : (
            <Text style={tw`text-center text-gray-500 mt-5`}>
              No hay anuncios disponibles
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
