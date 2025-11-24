# ProspectoFlow - Semi-Auto Prospecção

## Configuração Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env.local` na raiz e adicione a URL do seu banco de dados Postgres (se estiver rodando localmente ou conectado ao Vercel via Vercel CLI):
   ```
   POSTGRES_URL="postgres://..."
   POSTGRES_PRISMA_URL="postgres://..."
   POSTGRES_URL_NON_POOLING="postgres://..."
   POSTGRES_USER="..."
   POSTGRES_HOST="..."
   POSTGRES_PASSWORD="..."
   POSTGRES_DATABASE="..."
   ```

3. Suba o esquema do banco de dados:
   ```bash
   npm run db:push
   ```

4. Rode o projeto:
   ```bash
   npm run dev
   ```

## Deploy na Vercel (Passo a Passo)

1. Faça push deste código para um repositório GitHub.
2. Crie um novo projeto na Vercel e importe este repositório.
3. Nas configurações do projeto na Vercel, vá para a aba **Storage**.
4. Clique em **Connect Store** e selecione **Postgres** (Create New).
5. Aceite as configurações padrão. A Vercel irá preencher automaticamente as variáveis de ambiente (`POSTGRES_URL`, etc).
6. Após o deploy (ou localmente usando `vercel env pull`), rode o comando para criar as tabelas no banco de produção:
   
   Você pode rodar isso localmente conectando ao banco da Vercel:
   ```bash
   npm run db:push
   ```
   *(Certifique-se de que seu .env.local tem as credenciais do banco da Vercel)*

7. Seu app está pronto! Acesse a URL fornecida pela Vercel.

## Estrutura de Arquivos CSV

O arquivo CSV deve ter as seguintes colunas (header):
- `name` (ou Nome)
- `username` (ou Username)
- `phone` (ou Telefone) - Formato: 5511999999999 ou 11999999999
- `bio` (Opcional)
- `origin` (Opcional)
