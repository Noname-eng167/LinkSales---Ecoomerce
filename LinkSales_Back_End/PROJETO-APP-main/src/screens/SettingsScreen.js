import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('EditProfileName')}
      >
        <Text style={styles.optionText}>Editar Nome do Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('Archived')}
      >
        <Text style={styles.optionText}>Arquivados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Text style={styles.optionText}>Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('AccountAuth')}
      >
        <Text style={styles.optionText}>Central de Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  option: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 16,
    color: '#111',
  },
});
