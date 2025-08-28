export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    USE_PROXY: process.env.USE_PROXY,
    hasToken: !!process.env.SUPERCELL_TOKEN,
  });
}