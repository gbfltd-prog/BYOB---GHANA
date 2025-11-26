import { NextRequest, NextResponse } from "next/server";
import { endpoints, serviceHeaders } from "../../../_utils";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const response = await fetch(`${endpoints.payouts}/${params.id}`, {
    method: "PATCH",
    headers: serviceHeaders(),
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
