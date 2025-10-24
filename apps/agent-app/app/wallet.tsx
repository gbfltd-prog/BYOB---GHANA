import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

export default function Wallet() {
  const [balance, setBalance] = useState<number>(0);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:3005/api/wallet/me', { headers: { Authorization: 'Bearer <token>' } });
        setBalance(Number(res.data.balance));
      } catch {}
    })();
  }, []);
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 18 }}>Wallet Balance: ₵{balance.toFixed(2)}</Text>
    </View>
  );
}
