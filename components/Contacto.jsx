import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'tailwind-react-native-classnames';

const Contacto = () => {
  const handleCall = () => {
    Linking.openURL('tel:+56223634100'); // Aquí puedes agregar el número real
  };

  const handleMessage = () => {
    Linking.openURL('sms:+56223634101'); // Aquí puedes agregar el número real
  };

  const handleEmail = () => {
    Linking.openURL('mailto:recepcion@asodi.cl'); // Aquí puedes agregar el correo real
  };

  const handleWebsite = () => {
    Linking.openURL('https://asodi.cl'); // Aquí puedes agregar el enlace real
  };

  const handleVisit = () => {
    Linking.openURL('geo:0,0?q=Rancagua 0226, Providencia, Región Metropolitana'); // Dirección física
  };

  const handleSocialMedia = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "No se pudo abrir la aplicación.");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-center p-4`}>
        <Text style={tw`text-2xl font-bold text-center text-green-700 mb-6`}>Contáctanos</Text>

        {/* Botón para llamar */}
        <TouchableOpacity style={tw`bg-green-600 p-4 rounded-lg mb-4`} onPress={handleCall}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon name="call-outline" size={24} color="#FFFFFF" />
            <Text style={tw`text-white font-bold text-lg ml-2`}>Llámanos</Text>
          </View>
          <Text style={tw`text-white text-center mt-2`}>
            Entérate de las últimas noticias de ASODI.
          </Text>
        </TouchableOpacity>

        {/* Botón para enviar mensaje */}
        <TouchableOpacity style={tw`bg-green-600 p-4 rounded-lg mb-4`} onPress={handleMessage}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon name="chatbubble-outline" size={24} color="#FFFFFF" />
            <Text style={tw`text-white font-bold text-lg ml-2`}>Envíanos un mensaje</Text>
          </View>
          <Text style={tw`text-white text-center mt-2`}>
            Es importante mantener registro de tus síntomas para tu doctor.
          </Text>
        </TouchableOpacity>

        {/* Botón para enviar correo */}
        <TouchableOpacity style={tw`bg-green-600 p-4 rounded-lg mb-4`} onPress={handleEmail}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon name="mail-outline" size={24} color="#FFFFFF" />
            <Text style={tw`text-white font-bold text-lg ml-2`}>Envíanos un correo</Text>
          </View>
          <Text style={tw`text-white text-center mt-2`}>
            Dirección: Rancagua 0226, Providencia, Región Metropolitana.
          </Text>
        </TouchableOpacity>

        {/* Botón para visitar sitio web */}
        <TouchableOpacity style={tw`bg-green-600 p-4 rounded-lg mb-4`} onPress={handleWebsite}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon name="globe-outline" size={24} color="#FFFFFF" />
            <Text style={tw`text-white font-bold text-lg ml-2`}>Visita nuestro sitio web</Text>
          </View>
          <Text style={tw`text-white text-center mt-2`}>
            Si tienes alguna duda, visita nuestro sitio web: https://asodi.cl.
          </Text>
        </TouchableOpacity>

        {/* Botón para dirección física */}
        <TouchableOpacity style={tw`bg-green-600 p-4 rounded-lg mb-4`} onPress={handleVisit}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon name="location-outline" size={24} color="#FFFFFF" />
            <Text style={tw`text-white font-bold text-lg ml-2`}>Visítanos</Text>
          </View>
          <Text style={tw`text-white text-center mt-2`}>
            Dirección: Rancagua 0226, Providencia, Región Metropolitana.
          </Text>
        </TouchableOpacity>

        {/* Redes Sociales */}
        <Text style={tw`text-green-700 text-lg font-bold text-center mb-4`}>
          Síguenos en nuestras redes sociales
        </Text>

        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity onPress={() => handleSocialMedia('https://www.facebook.com/people/ASODI/100062871145302/?locale=gl_ES')}>
            <Icon name="logo-facebook" size={30} color="#1B74E4" style={tw`mx-2`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMedia('https://www.instagram.com/asodichile/?hl=es-la')}>
            <Icon name="logo-instagram" size={30} color="#C13584" style={tw`mx-2`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMedia('https://x.com/asodichile?lang=es&mx=2')}>
            <Icon name="logo-twitter" size={30} color="#1DA1F2" style={tw`mx-2`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMedia('https://www.youtube.com/@ASODIChile')}>
            <Icon name="logo-youtube" size={30} color="#FF0000" style={tw`mx-2`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMedia('https://cl.linkedin.com/company/asodi-chile')}>
            <Icon name="logo-linkedin" size={30} color="#0077B5" style={tw`mx-2`} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contacto;
