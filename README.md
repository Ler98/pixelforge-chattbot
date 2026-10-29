# PixelForge – AI-chatbot

## Projektbeskrivning

PixelForge är en e-handelsplattform för teknikprodukter. Projektet går ut på att utveckla en AI-driven chatbot som hjälper kunder att hitta produkter och få svar på frågor om butikens villkor och support.

Chatboten använder en språkmodell för att besvara frågor utifrån butikens supportdokument och produktinformation. Den använder RAG (Retrieval-Augmented Generation) för att hämta relevant information från dokument och tools för att söka efter produkter och deras uppgifter, exempelvis pris, kategori och lagerstatus. Chatboten ska även kunna hantera följdfrågor med hjälp av konversationshistorik.

## Tekniker

- React och Vite – frontend
- Node.js och Express – backend
- LangChain.js – integration med språkmodell och AI-funktioner
- Ollama – körning av språkmodell lokalt
- Supabase – lagring och sökning av dokument för RAG

## Installation och start

Projektet består av en separat frontend och backend. Båda behöver installeras och startas.

### Förutsättningar

Installera följande innan du startar projektet:

- [Node.js](https://nodejs.org/)
- [Ollama](https://ollama.com/)
- Ett konfigurerat Supabase-projekt

### 1. Installera backend

Öppna en terminal i projektets rotmapp och kör:

```bash
cd pixelforge-backend
npm install
```

### 2. Installera frontend

Öppna en **ny terminal** i projektets rotmapp och kör:

```bash
cd pixelforge-frontend
npm install
```

### 3. Konfigurera miljövariabler

Skapa en `.env`-fil i den mapp där backend förväntar sig den. Fyll i de miljövariabler som krävs för anslutningen till Supabase och eventuell annan konfiguration.

```
SUPABASE_URL=https://ditt-projekt.supabase.co
SUPABASE_KEY=din-supabase-nyckel
OLLAMA_LLM=namnet-pa-din-chattmodell
OLLAMA_EMBEDDING_MODEL=namnet-pa-din-embeddingmodell
PORT=din-valda-port
```

### 4. Starta projektet

Starta backend i terminalen som står i `pixelforge-backend`:

```bash
npm run dev
```

Starta frontend i den andra terminalen som står i `pixelforge-frontend`:

```bash
npm run dev
```

Öppna sedan den lokala adress som Vite visar i terminalen.

### 5. Supabase

Suport-documenten ska ligga uppe på SupaBase. För att få upp dem på databasen:

```
npm run seed
```
