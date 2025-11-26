import Link from "next/link";

export default function HomePage() {
  const cards = [
    { title: "Orders", description: "Monitor order pipeline across Ghana", href: "/dashboard" },
    { title: "Wallet & Payouts", description: "Approve MoMo withdrawals", href: "/payouts" },
    { title: "Employability", description: "Track competency distribution", href: "/employability" },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.title} href={card.href} className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
          <p className="text-sm text-gray-600">{card.description}</p>
        </Link>
      ))}
    </section>
  );
}
