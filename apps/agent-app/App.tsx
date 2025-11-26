import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, FlatList, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

const products = [
  { id: '1', title: 'Organic Shea Butter', price: 120 },
  { id: '2', title: 'Kente Inspired Sneakers', price: 420 },
];

function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    navigation.replace('Products', { token: 'demo-token' });
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Welcome Agent</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ProductsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Chat', { product: item })}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
            <Text>₵{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function ChatScreen({ route }: any) {
  const { product } = route.params;
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={styles.card}>
        <Text style={{ fontWeight: '600' }}>Chat about {product.title}</Text>
        <Text style={{ marginTop: 8, color: '#64748b' }}>WebSocket chat coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

function WalletScreen() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={styles.card}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>Wallet Balance</Text>
        <Text style={{ fontSize: 32, marginTop: 12 }}>₵1,245.90</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 12,
    padding: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
