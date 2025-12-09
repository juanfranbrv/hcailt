# HCAILT - Healthcare AI Language Translation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Vercel%20Serverless-black?logo=vercel)](https://vercel.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

> **HCAILT** (Healthcare AI Language Translation) es una aplicación web para traducir y simplificar textos médicos del español al inglés utilizando modelos de lenguaje de última generación (LLMs).

**Sitio en vivo:** [hcailt.awordz.com](https://hcailt.awordz.com)

---

## 📋 Índice

- [¿Qué es HCAILT?](#qué-es-hcailt)
- [Características Principales](#características-principales)
- [Cómo Funciona Técnicamente](#cómo-funciona-técnicamente)
  - [Arquitectura](#arquitectura)
  - [Flujo de Procesamiento](#flujo-de-procesamiento)
  - [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Deployment](#deployment)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Proveedores LLM](#proveedores-llm)
- [Contribuir](#contribuir)

---

## ¿Qué es HCAILT?

HCAILT es una herramienta de investigación para facilitar la traducción automática de contenido médico en español a inglés, seguido de una simplificación del lenguaje técnico para hacerlo accesible al público general.

### Problema que resuelve

Los documentos médicos contienen terminología compleja que dificulta su comprensión para pacientes y personas sin formación médica. HCAILT aborda este desafío mediante un pipeline de 4 fases:

1. **Domain Check**: Identifica si el texto es de naturaleza médica
2. **Translation**: Traduce del español al inglés preservando precisión médica
3. **Plain Language**: Convierte lenguaje técnico en lenguaje sencillo
4. **Quality Estimation**: Evalúa la calidad de traducción y simplificación (0-100%)

---

## Características Principales

### ✨ Funcionalidades Core

- **Multi-proveedor LLM**: Soporte para OpenAI, Google Gemini, Groq y Fireworks AI
- **Pipeline completo**: Domain-check → Translation → Plain Language → Quality Estimation
- **Carga de archivos**: TXT, PDF y DOCX (hasta 20MB)
- **Control granular**: Temperatura configurable independiente para cada fase
- **Textos de muestra**: Ejemplos médicos y no médicos precargados

### 🎨 Diseño "Clinical Futurism"

- **UI moderna**: Shadcn/UI + Tailwind CSS con diseño distintivo
- **Tipografía premium**: Sora (display) + Figtree (body)
- **Animaciones fluidas**: Efectos de entrada, transiciones suaves, visualización de pipeline
- **Elementos decorativos**: Orbes flotantes, redes neuronales SVG, patrones geométricos
- **Temas**: Modo claro, oscuro y alto contraste
- **Responsive**: Optimizado para desktop, tablet y mobile

---

## Cómo Funciona Técnicamente

### Arquitectura

HCAILT utiliza una **arquitectura cliente-servidor** con frontend en React y backend en funciones serverless:

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                      │
│  • UI: Shadcn/UI + Tailwind CSS                        │
│  • State: Zustand                                       │
│  • Build: Vite + TypeScript                            │
│  • Deploy: Hostinger (static hosting)                  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS / Axios
                   ▼
┌─────────────────────────────────────────────────────────┐
│          BACKEND API (Vercel Serverless)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  /api/domain-check  →  Detecta dominio médico   │  │
│  │  /api/translate     →  Español → Inglés         │  │
│  │  /api/plain         →  Técnico → Simple         │  │
│  │  /api/qe            →  Quality Score (0-100%)   │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│              _shared.ts                                 │
│         (LLM Orchestration Layer)                       │
└──────────────────┬──────────────────────────────────────┘
                   │
     ┌─────────────┼─────────────┬────────────┐
     │             │             │            │
     ▼             ▼             ▼            ▼
┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐
│ OpenAI  │  │  Google  │  │  Groq  │  │Fireworks │
│   API   │  │  Gemini  │  │   API  │  │   AI     │
└─────────┘  └──────────┘  └────────┘  └──────────┘
```

### Componentes Principales

#### 1. Frontend (React + Vite + TypeScript)

**Responsabilidades:**
- Renderizar la interfaz de usuario
- Gestionar estado global (Zustand)
- Parsear archivos (TXT/PDF/DOCX)
- Comunicarse con el backend vía HTTP
- Aplicar temas y animaciones

**Tecnologías clave:**
- **React 18**: Framework UI reactivo
- **TypeScript**: Tipado estático
- **Vite**: Build ultra-rápido con HMR
- **Shadcn/UI**: Componentes accesibles basados en Radix UI
- **Tailwind CSS**: Utility-first CSS con configuración custom
- **Axios**: Cliente HTTP
- **Zustand**: State management ligero
- **PDF.js**: Parsing de PDFs
- **Mammoth.js**: Parsing de DOCX

#### 2. Backend (Vercel Serverless Functions)

**Responsabilidades:**
- Orquestar llamadas a proveedores LLM
- Gestionar API keys de forma segura
- Validar requests con Zod schemas
- Manejar CORS
- Normalizar respuestas de diferentes LLMs

**Estructura:**

```typescript
// _shared.ts - Lógica común
export async function callChatLLM(params: {
  provider: 'openai' | 'google' | 'groq' | 'fireworks';
  model: string;
  temperature: number;
  systemPrompt: string;
  userPrompt: string;
}) {
  // Enruta a la API correcta según el proveedor
  // Maneja autenticación
  // Normaliza respuesta
}

// domain-check.ts
export default async function handler(req, res) {
  const { text, provider, model, temperature } = req.body;
  const prompt = "Analiza si este texto es del dominio médico...";
  const response = await callChatLLM({...});
  res.json({ isMedical: parseBoolean(response) });
}

// Similares: translate.ts, plain.ts, qe.ts
```

### Flujo de Procesamiento

**Secuencia completa de una traducción:**

```
Usuario sube texto "Diagnóstico: hipertensión arterial..."
    ↓
┌─────────────────────────────────────────────┐
│ 1. DOMAIN CHECK                             │
│    Frontend → POST /api/domain-check        │
│    Backend → LLM: "¿Es médico?"             │
│    LLM → "Sí" (isMedical: true)             │
│    ✓ Continúa al paso 2                     │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ 2. TRANSLATION                              │
│    Frontend → POST /api/translate           │
│    Backend → LLM: "Traduce ESP→ENG"         │
│    LLM → "Diagnosis: arterial hypertension"│
│    ✓ Continúa al paso 3                     │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ 3. PLAIN LANGUAGE                           │
│    Frontend → POST /api/plain               │
│    Backend → LLM: "Simplifica lenguaje"     │
│    LLM → "Diagnosis: high blood pressure"  │
│    ✓ Continúa al paso 4                     │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ 4. QUALITY ESTIMATION                       │
│    Frontend → POST /api/qe                  │
│    Backend → LLM: "Evalúa calidad"          │
│    LLM → Score: 92%                        │
│    ✓ Muestra resultados                     │
└─────────────────────────────────────────────┘
    ↓
Frontend muestra:
  • Traducción técnica
  • Traducción simple
  • Score de calidad
  • Indicador de dominio médico
```

### Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Shadcn/UI, Tailwind CSS, Zustand |
| **Backend** | Node.js, TypeScript, Vercel Functions, Zod |
| **LLM SDKs** | OpenAI SDK, Google GenAI, Groq SDK, Fetch API (Fireworks) |
| **File Parsing** | PDF.js, Mammoth.js |
| **HTTP Client** | Axios |
| **Deployment** | Vercel (backend), Hostinger (frontend), FTP Deploy |
| **Dev Tools** | ESLint, Git, Vercel CLI |

---

## Instalación

### Prerrequisitos

- Node.js ≥ 18
- npm ≥ 9
- API keys de al menos un proveedor LLM

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/hcailt.git
cd hcailt
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Crear .env con tus API keys
cat > .env << EOF
GOOGLE_API_KEY=tu_clave_google
GROQ_API_KEY=tu_clave_groq
FIREWORKS_API_KEY=tu_clave_fireworks
OPENAI_API_KEY=tu_clave_openai
ALLOWED_ORIGIN=http://localhost:5173,https://tu-dominio.com
EOF
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install

# Crear .env
echo "VITE_API_BASE_URL=http://localhost:3000" > .env
```

### 4. Ejecutar en Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
vercel dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Abre http://localhost:5173

---

## Deployment

### Backend → Vercel

```bash
cd backend
vercel --prod --yes
```

Configura variables de entorno en Vercel Dashboard (Settings → Environment Variables).

### Frontend → Hostinger

**Automático:**
```bash
cd frontend

# Configurar .env.ftp con credenciales
npm run deploy:hostinger
```

**Manual:**
```bash
npm run build
# Subir contenido de dist/ vía FTP
```

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para más detalles.

---

## Estructura del Proyecto

```
hcailt/                      # Monorepo
├── frontend/                # React App
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── ui/        # Shadcn/UI
│   │   │   └── DecorativeElements.tsx
│   │   ├── services/      # API client
│   │   ├── store/         # Zustand state
│   │   ├── utils/         # File parsers
│   │   ├── App.tsx
│   │   └── styles.css
│   ├── public/
│   ├── deploy-hostinger.js
│   └── package.json
│
├── backend/                # Vercel Serverless API
│   ├── api/
│   │   ├── _shared.ts     # LLM orchestration
│   │   ├── domain-check.ts
│   │   ├── translate.ts
│   │   ├── plain.ts
│   │   └── qe.ts
│   └── package.json
│
├── legacy-streamlit/       # Original Streamlit version
│
├── DEPLOYMENT.md
├── DOCS.md
└── README.md
```

---

## Proveedores LLM

| Proveedor | Modelos | Obtener API Key |
|-----------|---------|-----------------|
| **OpenAI** | gpt-4.1-mini, gpt-4.1 | [platform.openai.com](https://platform.openai.com/api-keys) |
| **Google** | gemini-2.5-pro, gemini-2.5-flash | [ai.google.dev](https://ai.google.dev/) |
| **Groq** | openai/gpt-oss-120b, qwen/qwen3-32b | [console.groq.com](https://console.groq.com) |
| **Fireworks** | kimi-k2-thinking, deepseek-v3p1-terminus | [fireworks.ai](https://fireworks.ai/) |

---

## Contribuir

Contribuciones bienvenidas:

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/MiFeature`)
3. Commit (`git commit -m 'Agrega MiFeature'`)
4. Push (`git push origin feature/MiFeature`)
5. Abre un Pull Request

---

## Licencia

MIT License - Ver [LICENSE](./LICENSE) para detalles.

---

## Referencias

**Artículo científico:** [HCAILT: A Machine Translation Approach for the Clinical Domain](https://tu-paper-url.com)

**Demo:** [hcailt.awordz.com](https://hcailt.awordz.com)

---

🚀 **Desarrollado con Claude Code**
