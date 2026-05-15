import { NextResponse } from 'next/server';
import { getOpenAPISpec } from '@/lib/openapi-spec';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getOpenAPISpec());
}
