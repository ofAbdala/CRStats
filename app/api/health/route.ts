import { NextResponse } from 'next/server';
import { baseURL } from '@/lib/supercell';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    baseURL: baseURL(),
    USE_PROXY: process.env.USE_PROXY,
    hasToken: !!process.env.SUPERCELL_TOKEN
  });
}