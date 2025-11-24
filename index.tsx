import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';
import Header from './components/Header';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Home />
      </main>
      <footer className="py-6 text-center text-sm text-slate-400 border-t border-slate-200 mt-auto">
        <p>Visualização de Preview (O backend da Vercel não está ativo aqui)</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
