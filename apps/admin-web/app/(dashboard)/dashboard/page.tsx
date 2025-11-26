"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data;
    },
  });

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Live Orders</h2>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th>ID</th>
              <th>Customer</th>
              <th>Total (₵)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((order) => (
              <tr key={order.id} className="border-t">
                <td>{order.id.slice(0, 6)}</td>
                <td>{order.customerName}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
