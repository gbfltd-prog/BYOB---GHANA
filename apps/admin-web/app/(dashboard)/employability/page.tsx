"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";

interface Score {
  id: string;
  agentId: string;
  weightedScore: number;
  certificateUrl?: string;
}

export default function EmployabilityPage() {
  const { data, isLoading } = useQuery<Score[]>({
    queryKey: ["scores"],
    queryFn: async () => {
      const { data } = await api.get("/scores/leaderboard");
      return data;
    },
  });

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Employability Leaderboard</h2>
      {isLoading ? (
        <p>Loading scores...</p>
      ) : (
        <div className="grid gap-3">
          {data?.map((score) => (
            <article key={score.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold">Agent {score.agentId.slice(0, 6)}</p>
                <p className="text-sm text-gray-500">Score: {score.weightedScore.toFixed(2)}</p>
              </div>
              {score.certificateUrl && (
                <a href={score.certificateUrl} className="text-blue-500 text-sm" target="_blank" rel="noreferrer">
                  View Certificate
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
