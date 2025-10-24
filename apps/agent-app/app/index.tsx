import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>BYOB Agent</Text>
      <Link href="/login">Login</Link>
      <Link href="/feed">Feed</Link>
      <Link href="/wallet">Wallet</Link>
      <Link href="/chat">Chat</Link>
    </View>
  );
}
