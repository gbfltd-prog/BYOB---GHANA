import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>BYOB Manufacturer Portal</h1>
      <ul>
        <li><Link href="/products">My Products</Link></li>
        <li><Link href="/products/new">Add Product</Link></li>
      </ul>
    </main>
  );
}
