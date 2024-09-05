import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mi App</Text>
      </View>

      {/* Lista de los ítems del drawer */}
      <DrawerItemList {...props} />

      {/* Botón personalizado para cerrar sesión */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => {
            // Llama la función de cierre de sesión que se pasa como prop
            props.onLogout(); 
          }}
        >
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default CustomDrawerContent;
