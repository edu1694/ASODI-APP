import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Contáctanos</Text>

        <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
          <Icon name="call-outline" size={24} color="#000000" />
          <Text style={styles.contactButtonText}>Llámanos</Text>
          <Text style={styles.contactButtonSubtext}>Entérate de las últimas noticias de ASODI que tiene para ti.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={handleMessage}>
          <Icon name="chatbubble-outline" size={24} color="#000000" />
          <Text style={styles.contactButtonText}>Envíanos un mensaje</Text>
          <Text style={styles.contactButtonSubtext}>Es importante mantener registro de tus síntomas para tu doctor.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
          <Icon name="mail-outline" size={24} color="#000000" />
          <Text style={styles.contactButtonText}>Envíanos un correo</Text>
          <Text style={styles.contactButtonSubtext}>Dirección: Rancagua 0226, Providencia, Región Metropolitana</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={handleWebsite}>
          <Icon name="globe-outline" size={24} color="#000000" />
          <Text style={styles.contactButtonText}>Visita nuestro sitio web</Text>
          <Text style={styles.contactButtonSubtext}>Si tienes alguna duda, visita nuestro sitio web: https://asodi.cl</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={handleVisit}>
          <Icon name="location-outline" size={24} color="#000000" />
          <Text style={styles.contactButtonText}>Visítanos</Text>
          <Text style={styles.contactButtonSubtext}>Dirección: Rancagua 0226, Providencia, Región Metropolitana</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Síguenos en nuestras redes sociales</Text>

        <View style={styles.socialMediaIcons}>
            <TouchableOpacity onPress={() => handleSocialMedia('https://www.facebook.com/people/ASODI/100062871145302/?locale=gl_ES')}>
                <Icon name="logo-facebook" size={30} color="#000000" style={styles.socialIcon} />
            </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMedia('https://www.instagram.com/asodichile/?hl=es-la')}>
            <Icon name="logo-instagram" size={30} color="#000000" style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMedia('https://x.com/asodichile?lang=es&mx=2')}>
            <Icon name="logo-twitter" size={30} color="#000000" style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMedia('https://www.youtube.com/@ASODIChile')}>
            <Icon name="logo-youtube" size={30} color="#000000" style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMedia('https://cl.linkedin.com/company/asodi-chile')}>
            <Icon name="logo-linkedin" size={30} color="#000000" style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#fff', // Verde más claro
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
  },
  contactButtonSubtext: {
    fontSize: 14,
    color: '#000000', // Texto más claro
    textAlign: 'center',
    marginTop: 5,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#',
    marginTop: 20,
    marginBottom: 10,
  },
  socialMediaIcons: {
    flexDirection: 'row',
    color: '000000',
    justifyContent: 'center',
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default Contacto;