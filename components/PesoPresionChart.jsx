import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  Dimensions,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; 
import { useFocusEffect } from '@react-navigation/native'; // Importa el hook useFocusEffect
import CONFIG from '../lib/config';

const screenWidth = Dimensions.get('window').width;

const PesoPresionChart = () => {
  const [presiones, setPresiones] = useState([]);
  const [filteredDataPresion, setFilteredDataPresion] = useState([]);
  const [selectedMonthPresion, setSelectedMonthPresion] = useState(new Date().getMonth() + 1);
  const [selectedYearPresion, setSelectedYearPresion] = useState(new Date().getFullYear());
  const [pesos, setPesos] = useState([]);
  const [filteredDataPeso, setFilteredDataPeso] = useState([]);
  const [selectedMonthPeso, setSelectedMonthPeso] = useState(new Date().getMonth() + 1);
  const [selectedYearPeso, setSelectedYearPeso] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear(); 
  const [usuarioRut, setUsuarioRut] = useState('');
  const baseUrl = Platform.OS === 'web'
    ? CONFIG.apiBaseUrl.web
    : Platform.OS === 'android'
      ? CONFIG.apiBaseUrl.android
      : CONFIG.apiBaseUrl.ios;

  // Hook para obtener datos cuando la pestaña de Resumen está en foco
  useFocusEffect(
    useCallback(() => {
      const obtenerRutUsuario = async () => {
        try {
          const rut = await AsyncStorage.getItem('usuarioRut');
          if (rut !== null) {
            setUsuarioRut(rut);
            obtenerDatosPeso(rut);
            obtenerDatosPresion(rut);
          }
        } catch (error) {
          console.error('Error al obtener el RUT del usuario:', error);
        }
      };

      obtenerRutUsuario();
    }, [])
  );

  const obtenerDatosPeso = async (rut) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/pesos/${rut}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const pesosUsuario = await response.json();
        if (Array.isArray(pesosUsuario)) {
          setPesos(pesosUsuario);
          filtrarDatosPeso(pesosUsuario, selectedMonthPeso, selectedYearPeso);
        } else {
          console.error('Datos de peso no válidos:', pesosUsuario);
        }
      } else {
        Alert.alert('Error', 'No se pudo obtener los registros de peso');
      }
    } catch (error) {
      console.error('Error al obtener los registros de peso:', error);
    }
  };

  const obtenerDatosPresion = async (rut) => {
    try {
      const response = await fetch(`${baseUrl}/asodi/v1/presiones/${rut}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const presionesUsuario = await response.json();
        if (Array.isArray(presionesUsuario)) {
          setPresiones(presionesUsuario);
          filtrarDatosPresion(presionesUsuario, selectedMonthPresion, selectedYearPresion);
        } else {
          console.error('Datos de presión no válidos:', presionesUsuario);
        }
      } else {
        Alert.alert('Error', 'No se pudo obtener los registros de presión');
      }
    } catch (error) {
      console.error('Error al obtener los registros de presión:', error);
    }
  };

  const filtrarDatosPeso = (pesos, month, year) => {
    const datosFiltrados = pesos.filter(peso => {
      if (!peso || !peso.fecha_registro) return false; 
      const fecha = moment(peso.fecha_registro);
      return fecha.month() + 1 === month && fecha.year() === year;
    });
    setFilteredDataPeso(datosFiltrados);
  };

  const filtrarDatosPresion = (presiones, month, year) => {
    const datosFiltrados = presiones.filter(presion => {
      if (!presion || !presion.fecha_registro) return false; 
      const fecha = moment(presion.fecha_registro);
      return fecha.month() + 1 === month && fecha.year() === year;
    });
    setFilteredDataPresion(datosFiltrados);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Mi presión histórica</Text>
          <View style={styles.row}>
            <Picker
              selectedValue={selectedMonthPresion}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setSelectedMonthPresion(itemValue);
                filtrarDatosPresion(presiones, itemValue, selectedYearPresion);
              }}>
              {moment.months().map((month, index) => (
                <Picker.Item label={month} value={index + 1} key={index} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedYearPresion}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setSelectedYearPresion(itemValue);
                filtrarDatosPresion(presiones, selectedMonthPresion, itemValue);
              }}>
              {Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i).map(year => (
                <Picker.Item label={year.toString()} value={year} key={year} />
              ))}
            </Picker>
          </View>
          {filteredDataPresion.length > 0 ? (
            <BarChart
              data={{
                labels: filteredDataPresion.map(data => moment(data.fecha_registro).format('DD/MM')),
                datasets: [
                  {
                    data: filteredDataPresion.map(data => data.presion_sistolica || 0),
                    color: () => `#0A0A0A`,
                  },
                  {
                    data: filteredDataPresion.map(data => data.presion_diastolica || 0),
                    color: () => `#3A3A3A`,
                  }
                ],
              }}
              width={screenWidth * 0.9}
              height={220}
              fromZero={true}
              showBarTops={false}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#f5f5f5',
                backgroundGradientTo: '#e0e0e0',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  stroke: "#ccc",
                  strokeDasharray: "0",
                },
                barPercentage: 0.5,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                alignSelf: 'center',
              }}
            />
          ) : (
            <Text style={styles.noDataText}>No hay datos de presión disponibles.</Text>
          )}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.title}>Mi peso histórico</Text>
          <View style={styles.row}>
            <Picker
              selectedValue={selectedMonthPeso}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setSelectedMonthPeso(itemValue);
                filtrarDatosPeso(pesos, itemValue, selectedYearPeso);
              }}>
              {moment.months().map((month, index) => (
                <Picker.Item label={month} value={index + 1} key={index} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedYearPeso}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setSelectedYearPeso(itemValue);
                filtrarDatosPeso(pesos, selectedMonthPeso, itemValue);
              }}>
              {Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i).map(year => (
                <Picker.Item label={year.toString()} value={year} key={year} />
              ))}
            </Picker>
          </View>
          {filteredDataPeso.length > 0 ? (
            <BarChart
              data={{
                labels: filteredDataPeso.map(data => moment(data.fecha_registro).format('DD/MM')),
                datasets: [
                  {
                    data: filteredDataPeso.map(data => data.peso || 0),
                    color: () => `#1A1A1A`,
                  }
                ],
              }}
              width={screenWidth * 0.9}
              height={220}
              fromZero={true}
              showBarTops={false}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#f5f5f5',
                backgroundGradientTo: '#e0e0e0',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  stroke: "#ccc",
                  strokeDasharray: "0",
                },
                barPercentage: 0.5,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                alignSelf: 'center',
              }}
            />
          ) : (
            <Text style={styles.noDataText}>No hay datos de peso disponibles.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingBottom: 100, // Para evitar que el último gráfico quede debajo del footer
  },
  chartContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});

export default PesoPresionChart;
