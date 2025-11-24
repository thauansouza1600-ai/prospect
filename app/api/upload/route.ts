import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';

// Interface para tipar os dados recebidos (pode ser flexível devido ao CSV variado)
interface RawLead {
  name?: string;
  Nome?: string;
  Name?: string;
  username?: string;
  Username?: string;
  usuario?: string;
  'User Name'?: string;
  phone?: string | number;
  telefone?: string | number;
  celular?: string | number;
  Phone?: string;
  bio?: string;
  Bio?: string;
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

    // Limite de segurança para Serverless Functions (evitar timeout em listas gigantes)
    if (body.length > 2000) {
       return NextResponse.json(
        { error: 'A lista é muito grande. Por favor, envie no máximo 2000 contatos por vez.' },
        { status: 413 }
      );
    }

    // Validação simples e normalização
    const leadsToInsert = body.map((item) => {
      // Tenta encontrar o telefone em várias chaves comuns
      const rawPhone = item.phone || item.telefone || item.celular || item.Phone || '';
      // Remove tudo que não for número
      const cleanPhone = String(rawPhone).replace(/\D/g, ''); 

      // Normaliza o username (remove @ e espaços)
      const rawUsername = item.username || item.Username || item.usuario || item['User Name'] || '';
      const cleanUsername = String(rawUsername).replace('@', '').trim();

      return {
        name: String(item.name || item.Nome || item.Name || cleanUsername || 'Desconhecido').trim(),
        username: cleanUsername,
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

    // Inserção no banco
    const result = await db.insert(leads).values(leadsToInsert).returning();

    return NextResponse.json({ 
      success: true, 
      count: result.length,
      message: `${result.length} leads importados com sucesso!` 
    });

  } catch (error) {
    console.error('Erro ao salvar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor ao processar leads. Verifique se a tabela existe ou se os dados estão corretos.' },
      { status: 500 }
    );
  }
}