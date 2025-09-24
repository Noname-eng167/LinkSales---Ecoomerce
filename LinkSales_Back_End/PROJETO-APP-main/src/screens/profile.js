import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Logo from '../assets/LINKSALES.png';
import axios from 'axios';

export default function Profile() {
  const navigation = useNavigation();

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState('');

  const [followers] = useState([
    { id: '1', name: 'Ana' },
    { id: '2', name: 'Bruno' },
    { id: '3', name: 'Carla' },
    { id: '4', name: 'Diego' },
    { id: '5', name: 'Elisa' },
  ]);
  const [following] = useState([
    { id: 'a', name: 'Fernanda' },
    { id: 'b', name: 'Gustavo' },
    { id: 'c', name: 'Helena' },
    { id: 'd', name: 'Igor' },
     { id:'e', name: 'Glauber' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);

useEffect(() => {
  const carregarUsuario = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setNomeUsuario(user.nome || user.nomeCompleto || 'Usuário');

        if (user.fotoPerfil) {
          console.log('URL da imagem carregada:', user.fotoPerfil);
          setImages([{ uri: user.fotoPerfil }]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  carregarUsuario();
}, []);


  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace('Login');
        },
        style: 'destructive',
      },
    ]);
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita acesso à galeria para selecionar imagens.');
      return false;
    }
    return true;
  };

const pickImage = async () => {
  console.log('Função pickImage chamada');
  const hasPermission = await requestPermission();
  if (!hasPermission) return;

  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log('Resultado:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImage = { uri: result.assets[0].uri };

      const uploadedUrl = await uploadFotoPerfil(newImage.uri);
      console.log('Imagem enviada com sucesso:', uploadedUrl);

      setImages([{ uri: uploadedUrl }]);
    }
  } catch (err) {
    console.error('Erro ao abrir ou enviar imagem:', err);
    Alert.alert('Erro', 'Falha ao abrir ou enviar imagem.');
  }
};



  const changeProfilePicture = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImages([{ uri: result.assets[0].uri }, ...images.slice(1)]);
    }
  };

  const removeImage = (index) => {
    Alert.alert('Remover imagem', 'Tem certeza que deseja remover esta imagem?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          const newImages = [...images];
          newImages.splice(index, 1);
          setImages(newImages);
        },
      },
    ]);
  };

  const openImage = (uri) => {
    setSelectedImage(uri);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const openListModal = (type) => {
    if (type === 'followers') {
      setModalTitle('Seguidores');
      setModalData(followers);
    } else if (type === 'following') {
      setModalTitle('Seguindo');
      setModalData(following);
    }
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.name}</Text>
    </View>
  );

const uploadFotoPerfil = async (uri) => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) throw new Error('Usuário não encontrado no AsyncStorage');

    const user = JSON.parse(userData);

    const formData = new FormData();
    formData.append('foto', {
      uri,
      name: 'perfil.jpg',
      type: 'image/jpeg',
    });

    const response = await api.post('/usuarios/foto-perfil', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user.token}`,
      },
    });

    const novaFoto = response.data?.fotoPerfil;

    if (!novaFoto) throw new Error('fotoPerfil ausente na resposta da API');


    const userAtualizado = {
      ...user,
      fotoPerfil: novaFoto,
    };

    await AsyncStorage.setItem('user', JSON.stringify(userAtualizado));

    const verificado = await AsyncStorage.getItem('user');
    console.log('User atualizado com foto:', JSON.parse(verificado));

    return novaFoto;
  } catch (err) {
    console.error('Erro ao fazer upload de foto:', err);
    Alert.alert('Erro', 'Falha ao enviar e salvar a imagem de perfil.');
    return null;
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={28} color="#1B71BD" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={changeProfilePicture} activeOpacity={0.8}>
          <Image
            source={images.length > 0 ? { uri: images[0].uri } : { uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <Text style={styles.username}>@{nomeUsuario}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{images.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <TouchableOpacity style={styles.statItem} onPress={() => openListModal('followers')}>
            <Text style={styles.statNumber}>{followers.length}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={() => openListModal('following')}>
            <Text style={styles.statNumber}>{following.length}</Text>
            <Text style={styles.statLabel}>Seguindo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Ionicons name="add-circle" size={28} color="#1B71BD" />
            <Text style={styles.actionText}>Adicionar Imagem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={28} color="red" />
            <Text style={[styles.actionText, { color: 'red' }]}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.galleryContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index.toString()}
              onPress={() => openImage(image.uri)}
              onLongPress={() => removeImage(index)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: image.uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close" size={36} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <FlatList
              data={modalData}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            />
            <TouchableOpacity
              style={styles.closeListButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeListButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  logo: { width: 100, height: 30 },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#1B71BD',
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B71BD',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0fb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1B71BD',
    fontWeight: '600',
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 25,
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 6,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1B71BD',
  },
  listItem: {
    paddingVertical: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  closeListButton: {
    marginTop: 15,
    backgroundColor: '#1B71BD',
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  closeListButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
