import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleNavigateToHome = () => {
    // Redirigir manualmente a la pestaña "Principal" de Home
    navigation.navigate('Home', { screen: 'Principal' });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mi App</Text>
      </View>

      {/* Aquí reemplazamos el texto de "Inicio" con un botón personalizado */}
      <TouchableOpacity style={styles.navButton} onPress={handleNavigateToHome}>
        <Icon name="home-outline" size={20} color="#000" />
        <Text style={styles.navButtonText}>Inicio</Text>
      </TouchableOpacity>

      {/* Lista de los ítems del drawer */}
      <DrawerItemList {...props} />

      {/* Botón personalizado para cerrar sesión */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => props.onLogout()}
      >
        <Icon name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
  },
  navButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
