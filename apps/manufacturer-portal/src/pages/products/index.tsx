import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Products() {
  const [list, setList] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:3002/api/products', { headers: { Authorization: `Bearer ${token}` } });
        setList(res.data);
      } catch {}
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h2>My Products</h2>
      <ul>
        {list.map(p => (
          <li key={p.id}>{p.title} - ₵{Number(p.price).toFixed(2)}</li>
        ))}
      </ul>
    </main>
  );
}
