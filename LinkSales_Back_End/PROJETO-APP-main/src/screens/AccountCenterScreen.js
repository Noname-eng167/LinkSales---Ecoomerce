import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Ionicons } from '@expo/vector-icons';

export default function AccountCenterScreen({ navigation }) {
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    birthDate: '',
    cpf: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const fetchUserData = async () => {
    try {
      // Simulação de fetch
      const fetchedData = {
        name: 'João',
        surname: 'Silva',
        email: 'joao.silva@email.com',
        password: 'lucas',
        birthDate: '01/01/1990',
        cpf: '123.456.789-00',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvv: '',
      };
      setUserData(fetchedData);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar seus dados.');
    }
  };

  const saveData = async () => {
    try {
      // Simulação de save
      // await api.post('/user/update', userData);
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar os dados.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Central de Conta</Text>

      <Field label="Nome" value={userData.name} onChange={(v) => handleChange('name', v)} placeholder="Nome" />
      <Field label="Sobrenome" value={userData.surname} onChange={(v) => handleChange('surname', v)} placeholder="Sobrenome" />
      <Field
        label="E-mail"
        value={userData.email}
        onChange={(v) => handleChange('email', v)}
        placeholder="email@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha do app</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          secureTextEntry={!showPassword}
          value={userData.password}
          onChangeText={(v) => handleChange('password', v)}
          autoCapitalize="none"
          placeholder="Senha"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#888" />
        </TouchableOpacity>
      </View>

      <FieldMask
        label="Data de nascimento"
        type="datetime"
        options={{ format: 'DD/MM/YYYY' }}
        value={userData.birthDate}
        onChange={(v) => handleChange('birthDate', v)}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
      />

      <FieldMask
        label="CPF"
        type="cpf"
        value={userData.cpf}
        onChange={(v) => handleChange('cpf', v)}
        placeholder="000.000.000-00"
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Adicionar Cartão de Crédito</Text>

      <FieldMask
        label="Número do cartão"
        type="credit-card"
        value={userData.cardNumber}
        onChange={(v) => handleChange('cardNumber', v)}
        placeholder="0000 0000 0000 0000"
        keyboardType="numeric"
      />

      <Field label="Nome no cartão" value={userData.cardName} onChange={(v) => handleChange('cardName', v)} placeholder="Nome impresso no cartão" />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <FieldMask
            label="Validade (MM/AA)"
            type="custom"
            options={{ mask: '99/99' }}
            value={userData.cardExpiry}
            onChange={(v) => handleChange('cardExpiry', v)}
            placeholder="MM/AA"
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Field
            label="CVV"
            value={userData.cardCvv}
            onChange={(v) => handleChange('cardCvv', v)}
            placeholder="CVV"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveData}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType, autoCapitalize, maxLength, secureTextEntry }) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'sentences'}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

function FieldMask({ label, type, options, value, onChange, placeholder, keyboardType }) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInputMask
        type={type}
        options={options}
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 25,
    color: '#1B71BD',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#1B71BD',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
