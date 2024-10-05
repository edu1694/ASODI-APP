import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import baseUrl from '../lib/config';
import tw from 'tailwind-react-native-classnames';

const Anuncios = () => {
  const [anuncios, setAnuncios] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchAnuncios();
    }, [])
  );

  const fetchAnuncios = async () => {
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
      setAnuncios(data);
    } catch (error) {
      console.error('Error al obtener los anuncios:', error);
    }
  };

  const renderAnuncio = ({ item }) => (
    <View style={tw`bg-gray-100 p-4 rounded-lg shadow mb-4`}>
      <Text style={tw`text-lg font-bold text-green-700`}>{item.titulo}</Text>
      <Text style={tw`text-base text-gray-600 mt-2`}>{item.descripcion}</Text>
      <Text style={tw`text-sm text-gray-500 mt-2`}>
        Este anuncio está disponible desde {item.fecha_inicio} hasta {item.fecha_termino}
      </Text>
    </View>
  );

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      <FlatList
        data={anuncios}
        keyExtractor={(item) => item.id_anuncio.toString()}
        renderItem={renderAnuncio}
        contentContainerStyle={tw`pb-20`}
      />
    </View>
  );
};

export default Anuncios;
