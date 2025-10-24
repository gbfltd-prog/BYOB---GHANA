import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>BYOB Admin</h1>
      <ul>
        <li><Link href="/payouts">Payout Approvals</Link></li>
      </ul>
    </main>
  );
}
