import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('agent@byob.local');
  const [password, setPassword] = useState('x');

  async function onLogin() {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      Alert.alert('Logged in');
    } catch {
      Alert.alert('Login failed');
    }
  }

  return (
    <View style={{ padding: 24 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Login" onPress={onLogin} />
    </View>
  );
}
