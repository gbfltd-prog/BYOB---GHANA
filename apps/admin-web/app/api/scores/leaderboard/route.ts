import { NextResponse } from "next/server";
import { endpoints, serviceHeaders } from "../../_utils";

export async function GET() {
  const response = await fetch(endpoints.scores, {
    headers: serviceHeaders(),
  });
  const data = await response.json();
  return NextResponse.json(data);
}
