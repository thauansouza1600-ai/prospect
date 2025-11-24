import { MessageCircle, User, AtSign, AlignLeft } from 'lucide-react';
import type { Lead } from '@/db/schema';

interface CardProps {
  lead: Lead;
}

export default function Card({ lead }: CardProps) {
  // 1. Limpar telefone (manter apenas números)
  const cleanPhone = lead.phone.replace(/\D/g, '');

  // 2. Construir a mensagem dinâmica
  const rawMessage = `Olá ${lead.name}! Vi o perfil @${lead.username} e gostei muito do conteúdo. Tenho algumas ideias rápidas que podem ajudar seu negócio a crescer. Posso te enviar?`;

  // 3. Encode URI
  const encodedMessage = encodeURIComponent(rawMessage);

  // 4. URL Final
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
              {lead.name}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <AtSign className="w-3 h-3" />
              {lead.username}
            </p>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
            {lead.origin || 'Instagram'}
          </span>
        </div>

        {lead.bio && (
          <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg flex gap-2 items-start">
            <AlignLeft className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="line-clamp-3 italic">"{lead.bio}"</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm hover:shadow-green-200"
        >
          <MessageCircle className="w-5 h-5" />
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  );
}