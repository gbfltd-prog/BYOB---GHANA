"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";

interface Payout {
  id: string;
  walletId: string;
  amount: number;
  status: string;
  requiresSuper: boolean;
}

export default function PayoutsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<Payout[]>({
    queryKey: ["payouts"],
    queryFn: async () => {
      const { data } = await api.get("/wallet/payouts/all");
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/wallet/payouts/${id}`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payouts"] }),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Payout Requests</h2>
      {isLoading ? (
        <p>Loading payouts...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((payout) => (
                <tr key={payout.id} className="border-t">
                  <td>{payout.id.slice(0, 6)}</td>
                  <td>₵{payout.amount}</td>
                  <td>{payout.status}</td>
                  <td>
                    <button
                      className="text-sm text-green-600 mr-2"
                      onClick={() => mutation.mutate({ id: payout.id, status: "APPROVED" })}
                    >
                      Approve
                    </button>
                    <button
                      className="text-sm text-red-600"
                      onClick={() => mutation.mutate({ id: payout.id, status: "REJECTED" })}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
