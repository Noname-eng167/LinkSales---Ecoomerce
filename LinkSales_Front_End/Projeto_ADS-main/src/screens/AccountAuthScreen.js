import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function AccountAuthScreen({ navigation }) {
  const [biometrySupported, setBiometrySupported] = useState(false);
  const [biometryEnrolled, setBiometryEnrolled] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const savedAppPassword = 'minhasenha123';

  useEffect(() => {
    (async () => {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      setBiometrySupported(hardware);
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometryEnrolled(enrolled);

      if (hardware && enrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Autentique-se para acessar a Central de Conta',
          fallbackLabel: 'Usar senha do celular',
        });
        if (result.success) {
          navigation.replace('AccountCenter');
        }
      }
    })();
  }, []);

  const handlePasswordSubmit = () => {
    if (passwordInput === savedAppPassword) {
      navigation.replace('AccountCenter');
    } else {
      Alert.alert('Senha incorreta', 'Por favor, tente novamente.');
      setPasswordInput('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Autenticação Necessária</Text>

      {(!biometrySupported || !biometryEnrolled) && (
        <Text style={styles.infoText}>
          Seu dispositivo não suporta biometria ou nenhuma biometria está cadastrada.
          Por favor, informe a senha do app para continuar.
        </Text>
      )}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry={!showPasswordInput}
          value={passwordInput}
          onChangeText={setPasswordInput}
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          onPress={() => setShowPasswordInput(!showPasswordInput)}
          style={styles.eyeButton}
          activeOpacity={0.7}
        >
          <Text style={styles.eyeIcon}>{showPasswordInput ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, !passwordInput && styles.submitButtonDisabled]}
        onPress={handlePasswordSubmit}
        disabled={!passwordInput}
      >
        <Text style={styles.submitButtonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1B71BD',
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 22,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 28,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    height: 48,
  },
  eyeButton: {
    paddingLeft: 14,
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 20,
    color: '#888',
  },
  submitButton: {
    backgroundColor: '#1B71BD',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#1B71BD',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  submitButtonDisabled: {
    backgroundColor: '#a3c0e9',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
