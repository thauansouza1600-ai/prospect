"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile: File) => {
    if (uploadedFile.type === "text/csv" || uploadedFile.type === "application/json" || uploadedFile.name.endsWith('.csv') || uploadedFile.name.endsWith('.json')) {
      setFile(uploadedFile);
      setStatus(null);
    } else {
      setStatus({ type: 'error', message: 'Por favor, envie apenas arquivos CSV ou JSON.' });
    }
  };

  const processFile = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);

    try {
      let dataToUpload: any[] = [];

      if (file.name.endsWith('.csv')) {
        await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              dataToUpload = results.data;
              resolve(true);
            },
            error: (err) => reject(err),
          });
        });
      } else if (file.name.endsWith('.json')) {
        const text = await file.text();
        dataToUpload = JSON.parse(text);
      }

      // Send to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpload),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Falha no upload');

      setStatus({ type: 'success', message: result.message });
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Erro ao processar arquivo' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Importar Leads</h1>
        <p className="text-slate-600 text-lg">
          Faça upload da sua lista de prospecção (CSV ou JSON) para começar.
        </p>
      </div>

      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-10 transition-all text-center
          ${isDragging 
            ? 'border-brand-500 bg-brand-50' 
            : 'border-slate-300 hover:border-slate-400 bg-white'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv,.json"
          onChange={handleFileChange}
          disabled={loading}
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${file ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
            {file ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-slate-900">
              {file ? file.name : 'Arraste seu arquivo aqui'}
            </h3>
            {!file && (
              <p className="text-slate-500">
                Ou <label htmlFor="file-upload" className="text-brand-600 hover:text-brand-700 cursor-pointer font-medium">clique para selecionar</label>
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2">Suporta .CSV e .JSON</p>
          </div>

          {file && !loading && !status?.type && (
            <button
              onClick={processFile}
              className="mt-4 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-brand-500/20"
            >
              Processar e Salvar
            </button>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-brand-600 mt-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processando leads...</span>
            </div>
          )}
        </div>
      </div>

      {status && (
        <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <div>
            <h4 className="font-semibold">{status.type === 'success' ? 'Sucesso!' : 'Erro'}</h4>
            <p className="text-sm">{status.message}</p>
          </div>
        </div>
      )}

      <div className="mt-12 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="font-medium text-slate-900 mb-3">Estrutura esperada do arquivo:</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100">
              <tr>
                <th className="px-4 py-2">name</th>
                <th className="px-4 py-2">username</th>
                <th className="px-4 py-2">phone</th>
                <th className="px-4 py-2">bio</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b border-slate-100">
                <td className="px-4 py-2">João Silva</td>
                <td className="px-4 py-2">joaosilva</td>
                <td className="px-4 py-2">11999999999</td>
                <td className="px-4 py-2">CEO da Empresa X...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}