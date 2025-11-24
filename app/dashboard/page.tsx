import React from 'react';
import { db } from '@/db';
import { leads, type Lead } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Card from '@/components/Card';
import { Inbox, AlertTriangle } from 'lucide-react';

// Forçar renderização dinâmica para sempre buscar dados novos
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Tipagem explícita para evitar 'implicit any' ou 'never[]'
  let allLeads: Lead[] = [];
  let dbError: string | null = null;

  try {
    allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch (error: any) {
    console.error("Database Error:", error);
    // Detectar erro específico de tabela inexistente
    if (error?.message?.includes('does not exist') || error?.code === '42P01') {
      dbError = 'table_not_found';
    } else {
      dbError = 'generic';
    }
  }

  if (dbError === 'table_not_found') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-200 p-8 text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-800">Tabela não encontrada</h3>
        <p className="text-red-600 mt-2 max-w-md">
          O banco de dados foi conectado, mas as tabelas ainda não foram criadas.
        </p>
        <div className="mt-6 bg-white p-4 rounded border border-red-200 text-left overflow-x-auto max-w-full">
          <p className="text-sm font-mono text-slate-600 mb-2">Rode este comando no seu terminal local:</p>
          <code className="block bg-slate-900 text-green-400 p-3 rounded text-sm">npm run db:push</code>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meus Leads</h1>
          <p className="text-slate-500 mt-2">
            Gerencie e entre em contato com seus potenciais clientes.
          </p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-bold text-brand-600">{allLeads.length}</span>
          <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Total Importado</p>
        </div>
      </div>

      {allLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <div className="bg-slate-100 p-4 rounded-full mb-4">
            <Inbox className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Nenhum lead encontrado</h3>
          <p className="text-slate-500 mt-2 max-w-md text-center">
            Você ainda não importou nenhum lead. Vá para a página inicial para fazer upload do seu CSV.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allLeads.map((lead) => (
            <React.Fragment key={lead.id}>
              <Card lead={lead} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}