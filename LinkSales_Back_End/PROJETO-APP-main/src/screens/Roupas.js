import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

const lojas = [
  {
    id: '1',
    nome: 'Nordeste Modas',
    endereco: 'Feira da sulanca',
    foto: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    nome: 'Via Sonho',
    endereco: 'Fábrica da moda',
    foto: 'https://images.unsplash.com/photo-1520975918108-b5cc2c77f79d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    nome: 'Renner',
    endereco: 'Shopping Caruaru',
    foto: 'https://amanha.com.br/images/p/14285/Fachada-de-uma-das-lojas-da-Renner.jpg',
  },
];

export default function RoupasScreen() {
  const irParaPerfilLoja = (loja) => {
    alert(`Abrir perfil da loja: ${loja.nome}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lojas de Roupas</Text>
      <FlatList
        data={lojas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.loja} onPress={() => irParaPerfilLoja(item)} activeOpacity={0.7}>
            <Image
              source={{ uri: item.foto }}
              style={styles.foto}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.endereco}>{item.endereco}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  lista: {
    paddingHorizontal: 16,
  },
  loja: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    alignItems: 'center',
  },
  foto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    backgroundColor: '#ddd',
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  endereco: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
