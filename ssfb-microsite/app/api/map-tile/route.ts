import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const z = searchParams.get('z');
  const x = searchParams.get('x');
  const y = searchParams.get('y');
  const session = searchParams.get('session');
  const key = searchParams.get('key');

  if (!z || !x || !y || !session || !key) {
    return new NextResponse('Missing params', { status: 400 });
  }

  const tileUrl = `https://tile.googleapis.com/v1/2dtiles/${z}/${x}/${y}?session=${session}&key=${key}`;

  try {
    const res = await fetch(tileUrl);
    if (!res.ok) return new NextResponse('Tile fetch failed', { status: res.status });
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': res.headers.get('Content-Type') ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new NextResponse('Proxy error', { status: 500 });
  }
}
