import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

export default function Feed() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:3002/api/products', { headers: { Authorization: 'Bearer <token>' } });
        setItems(res.data);
      } catch {}
    })();
  }, []);
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 18 }}>Products</Text>
      <FlatList data={items} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={{ paddingVertical: 8 }}>
          <Text>{item.title} - ₵{Number(item.price).toFixed(2)}</Text>
        </View>
      )} />
    </View>
  );
}
