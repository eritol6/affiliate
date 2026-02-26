import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "affiliate-picks-mvp",
    version: process.env.npm_package_version ?? "0.0.0",
    timestamp: new Date().toISOString(),
  });
}
