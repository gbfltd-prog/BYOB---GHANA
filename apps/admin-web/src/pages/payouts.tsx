import { useEffect, useState } from 'react';
import axios from 'axios';

interface Payout {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function Payouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // For demo: token from localStorage
    const t = localStorage.getItem('token') || '';
    setToken(t);
    load(t);
  }, []);

  async function load(t: string) {
    try {
      const res = await axios.get('http://localhost:3005/api/wallet/payouts', { headers: { Authorization: `Bearer ${t}` } });
      setPayouts(res.data);
    } catch {}
  }

  async function approve(id: string) {
    await axios.post(`http://localhost:3005/api/wallet/payouts/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
    await load(token);
  }

  async function reject(id: string) {
    await axios.post(`http://localhost:3005/api/wallet/payouts/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
    await load(token);
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Payout Approvals</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Amount</th><th>Status</th><th>Created</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {payouts.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>₵{Number(p.amount).toFixed(2)}</td>
              <td>{p.status}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => approve(p.id)} disabled={p.status !== 'PENDING'}>Approve</button>
                <button onClick={() => reject(p.id)} disabled={p.status !== 'PENDING'}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
