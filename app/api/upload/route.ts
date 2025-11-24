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

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Dados inválidos. Esperado um array de leads.' },
        { status: 400 }
      );
    }

    if (body.length === 0) {
      return NextResponse.json(
        { error: 'A lista está vazia.' },
        { status: 400 }
      );
    }

    // Validação simples e normalização
    const leadsToInsert = body.map((item) => {
      // Tenta encontrar o telefone em várias chaves comuns
      const rawPhone = item.phone || item.telefone || item.celular || item.Phone || '';
      const cleanPhone = String(rawPhone).replace(/\D/g, ''); // Remove tudo que não for número

      return {
        name: String(item.name || item.Nome || item.Name || 'Desconhecido').trim(),
        username: String(item.username || item.Username || item.usuario || item['User Name'] || '').replace('@', '').trim(),
        phone: cleanPhone,
        bio: String(item.bio || item.Bio || '').trim().substring(0, 500), // Limita tamanho da bio
        origin: String(item.origin || item.origem || 'Upload CSV').trim(),
      };
    }).filter(l => l.phone.length >= 8 && l.username.length > 0); 
    // Filtra apenas leads que tenham um telefone minimamente válido e um username

    if (leadsToInsert.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum lead válido encontrado. Verifique se o CSV possui colunas de telefone e usuário.' },
        { status: 400 }
      );
    }

    // Inserção em massa (Limitando a 1000 por vez se necessário futuramente, mas Drizzle lida bem com batches razoáveis)
    const result = await db.insert(leads).values(leadsToInsert).returning();

    return NextResponse.json({ 
      success: true, 
      count: result.length,
      message: `${result.length} leads importados com sucesso!` 
    });

  } catch (error) {
    console.error('Erro ao salvar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor ao processar leads. Verifique a conexão com o banco.' },
      { status: 500 }
    );
  }
}