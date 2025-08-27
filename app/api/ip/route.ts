import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Tenta obter o IP através de diferentes serviços
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://httpbin.org/ip',
      'https://api.myip.com'
    ];

    const results = [];
    
    for (const service of ipServices) {
      try {
        const response = await fetch(service, { 
          headers: { 'User-Agent': 'ClashRoyale-App/1.0' },
          cache: 'no-store'
        });
        const data = await response.json();
        results.push({
          service,
          ip: data.ip || data.origin || 'N/A',
          success: true
        });
      } catch (error) {
        results.push({
          service,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      results,
      recommendation: "Use o IP que aparece consistentemente nos serviços acima para configurar no Supercell Developer Portal"
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}