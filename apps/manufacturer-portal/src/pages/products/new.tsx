import { useState } from 'react';
import axios from 'axios';

export default function NewProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [commissionType, setCommissionType] = useState<'PERCENT' | 'FLAT'>('PERCENT');
  const [commissionValue, setCommissionValue] = useState(10);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const manufacturerId = typeof window !== 'undefined' ? localStorage.getItem('manufacturerId') || '' : '';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await axios.post('http://localhost:3002/api/products', {
      manufacturerId,
      title,
      description,
      price: Number(price),
      commission: { type: commissionType, value: Number(commissionValue) }
    }, { headers: { Authorization: `Bearer ${token}` } });
    alert('Created');
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>New Product</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /></div>
        <div><input placeholder="Price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} /></div>
        <div>
          <select value={commissionType} onChange={e => setCommissionType(e.target.value as any)}>
            <option value="PERCENT">Percent</option>
            <option value="FLAT">Flat</option>
          </select>
          <input placeholder="Value" type="number" value={commissionValue} onChange={e => setCommissionValue(Number(e.target.value))} />
        </div>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
