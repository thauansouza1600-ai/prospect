import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';

// Interface para tipar os dados recebidos (pode ser flexível devido ao CSV variado)
interface RawLead {
  name?: string;
  Nome?: string;
  username?: string;
  Username?: string;
  usuario?: string;
  phone?: string | number;
  telefone?: string | number;
  celular?: string | number;
  bio?: string;
  origin?: string;
  origem?: string;
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RawLead[];

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'Dados inválidos. Esperado um array de leads.' },
        { status: 400 }
      );
    }

    // Validação simples e mapeamento para garantir campos
    const leadsToInsert = body.map((item) => ({
      name: String(item.name || item.Nome || 'Desconhecido'),
      username: String(item.username || item.Username || item.usuario || ''),
      phone: String(item.phone || item.telefone || item.celular || ''),
      bio: String(item.bio || ''),
      origin: String(item.origin || item.origem || 'Upload CSV'),
    })).filter(l => l.phone && l.username && l.phone !== 'undefined' && l.username !== 'undefined');

    if (leadsToInsert.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum lead válido encontrado (necessário telefone e username).' },
        { status: 400 }
      );
    }

    // Inserção em massa
    const result = await db.insert(leads).values(leadsToInsert).returning();

    return NextResponse.json({ 
      success: true, 
      count: result.length,
      message: `${result.length} leads importados com sucesso!` 
    });

  } catch (error) {
    console.error('Erro ao salvar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor ao processar leads.' },
      { status: 500 }
    );
  }
}