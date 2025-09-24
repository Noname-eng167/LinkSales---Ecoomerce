import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditProfileName() {
  const [name, setName] = useState('');

 const handleSave = async () => {
   if (!user) return;

   try {
     await api.put(`/usuarios/${user.id}`, { nome: name }, {
       headers: { Authorization: `Bearer ${user.token}` },
     });

     const novoUsuario = { ...user, nome: name };
     await AsyncStorage.setItem('user', JSON.stringify(novoUsuario));
     Alert.alert('Sucesso', 'Nome atualizado!');
   } catch (error) {
     console.error('Erro ao salvar nome:', error);
     Alert.alert('Erro', 'Não foi possível atualizar o nome.');
   }
 };


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Novo Nome do Perfil:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 6,
  },
});
