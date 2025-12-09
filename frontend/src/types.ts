export type Provider = 'openai' | 'google' | 'groq' | 'fireworks';

export interface PipelineConfig {
  provider: Provider;
  model: string;
  tempMt: number;
  tempPlain: number;
  tempQe: number;
}

export interface TranslationResult {
  translation: string;
  plain: string;
  qeScore: number | null;
  isMedical: boolean | null;
}
