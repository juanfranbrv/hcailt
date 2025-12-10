# HCAILT - Healthcare AI Language Translation

**Multilingual Healthcare Assistance for Irish**

A web application that demonstrates AI-powered medical document translation with quality estimation. It processes Spanish medical documents and produces simplified English versions suitable for patients, while maintaining medical accuracy.

---

## 🎯 Overview

This project implements a **4-step translation pipeline**:

1. **Domain Check** - Verifies the input text is medical-related
2. **Translation** - Translates Spanish medical text to technical English
3. **Simplification** - Converts technical English to patient-friendly language
4. **Quality Estimation (QE)** - Scores the simplified output (0-100%)

Each step uses LLM-based processing with configurable providers and models.

---

## 🏗️ Architecture

```
hcailt/
├── frontend/         # React + Vite (UI)
│   ├── src/
│   │   ├── App.tsx           # Main application
│   │   ├── store/            # Zustand state management
│   │   ├── services/api.ts   # API client
│   │   └── components/       # UI components
│   └── package.json
│
├── backend/          # Vercel Serverless Functions
│   ├── api/
│   │   ├── _shared.ts        # Shared utilities & LLM calls
│   │   ├── domain-check.ts   # Medical domain verification
│   │   ├── translate.ts      # Translation endpoint
│   │   ├── plain.ts          # Simplification endpoint
│   │   └── qe.ts             # Quality estimation endpoint
│   ├── .env                  # API keys (not committed)
│   └── package.json
│
└── README.md
```

### Deployment

- **Frontend**: Vercel project `hcailt` (Root: `frontend`)
- **Backend**: Vercel project `hcailt-backend` (Root: `backend`)
- **Repository**: `https://github.com/juanfranbrv/hcailt_react`

---

## 🤖 Providers & Models

| Provider | Available Models | Default |
|----------|------------------|---------|
| **OpenAI** | `gpt-5.1`, `gpt-5-mini` | `gpt-5.1` |
| **Google** | `gemini-2.5-flash`, `gemini-flash-lite-latest` | `gemini-2.5-flash` |
| **Groq** | `openai/gpt-oss-120b` | — |
| **Fireworks** | `deepseek-v3p1-terminus` | — |

---

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm
- Vercel CLI (`npm install -g vercel`)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/juanfranbrv/hcailt_react.git
   cd hcailt_react
   ```

2. **Configure environment variables**
   
   Create `backend/.env`:
   ```env
   OPENAI_API_KEY=your-openai-key
   GOOGLE_API_KEY=your-google-key
   GROQ_API_KEY=your-groq-key
   FIREWORKS_API_KEY=your-fireworks-key
   ALLOWED_ORIGIN=http://localhost:5173
   ```

3. **Install dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
vercel dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## 🚀 Deployment

### Pushing Changes to GitHub

```bash
git add .
git commit -m "your commit message"
git push
```

### Manual Deploy to Vercel

**Frontend:**
```bash
cd frontend
vercel --prod
```

**Backend:**
```bash
vercel link --project hcailt-backend --yes
vercel --prod
```

Note: The backend requires linking to the correct Vercel project first.

---

## 📡 API Reference

All endpoints accept `POST` requests with JSON body.

### Common Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `provider` | string | `openai`, `google`, `groq`, or `fireworks` |
| `model` | string | Model identifier |
| `temperature` | number | 0.0 - 1.0 (creativity level) |

### Endpoints

#### `POST /api/domain-check`
Verifies if input text is medical-related.

```json
{
  "provider": "openai",
  "model": "gpt-5.1",
  "temperature": 0.3,
  "text": "El paciente presenta dolor abdominal..."
}
```

#### `POST /api/translate`
Translates Spanish medical text to English.

```json
{
  "provider": "openai",
  "model": "gpt-5.1",
  "temperature": 0.3,
  "text": "El paciente presenta dolor abdominal..."
}
```

#### `POST /api/plain`
Simplifies technical English to patient-friendly language.

```json
{
  "provider": "openai",
  "model": "gpt-5.1",
  "temperature": 0.7,
  "text": "The patient presents with acute abdominal pain..."
}
```

#### `POST /api/qe`
Evaluates translation quality (0-100%).

```json
{
  "provider": "openai",
  "model": "gpt-5.1",
  "temperature": 0.2,
  "originalText": "Spanish original...",
  "translatedText": "Technical English...",
  "simplifiedText": "Simplified English..."
}
```

---

## 🔬 Quality Estimation Criteria

The QE system evaluates translations using three weighted criteria:

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Accuracy** | 50% | Medical facts, diagnoses, dosages preserved correctly |
| **Clarity** | 30% | Simple, understandable language for patients |
| **Completeness** | 20% | All essential information present |

---

## 📋 Temperature Settings

Default values for each pipeline step:

| Step | Temperature | Reasoning |
|------|-------------|-----------|
| Domain Check | 0.3 | Low creativity, factual |
| Translation | 0.3 | Accurate, deterministic |
| Simplification | 0.7 | More creative adaptation |
| Quality Estimation | 0.2 | Consistent scoring |

---

## 🔐 Environment Variables

### Backend (Vercel)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `GOOGLE_API_KEY` | Google AI API key |
| `GROQ_API_KEY` | Groq API key |
| `FIREWORKS_API_KEY` | Fireworks API key |
| `ALLOWED_ORIGIN` | CORS allowed origins |

---

## 📄 License

This project is for academic/research purposes as part of the HCAILT initiative.

---

## 👥 Contributors

- Juan Francisco Bravo

