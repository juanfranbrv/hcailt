import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Upload, Zap, FileText, Languages, Sparkles as SparklesIcon, CheckCircle2, XCircle, AlertCircle, Sun, Moon, Contrast, Copy, Rocket, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { FloatingOrbs, NeuralNetwork, Sparkles, PipelineFlow, GridPattern } from '@/components/DecorativeElements';
import { ProcessingLog } from '@/components/ProcessingLog';
import { SAMPLE_MEDICAL_TEXT_ES, SAMPLE_NON_MEDICAL_TEXT_ES } from './sampleTexts';
import { qualityEstimate, domainCheck, translate, simplify } from './services/api';
import { useAppStore, providerModels } from './store/useAppStore';
import type { InputMethod } from './store/useAppStore';
import type { Provider } from './types';
import { parseDocx, parsePdf, parseTxt } from './utils/fileParsers';
import { EducationalIntro } from './components/EducationalIntro';
import './styles.css';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const providerNames: Record<Provider, string> = {
  openai: 'OpenAI',
  google: 'Google',
  groq: 'Groq',
  fireworks: 'Fireworks',
};

function App() {
  const [themeName, setThemeName] = useState<'light' | 'dark' | 'contrast'>('light');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [translation, setTranslation] = useState('');
  const [plain, setPlain] = useState('');
  const [qeScore, setQeScore] = useState<number | null>(null);
  const [isMedical, setIsMedical] = useState<boolean | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const { provider, model, tempMt, tempPlain, tempQe, inputMethod, setProvider, setModel, setInputMethod, setTemps } =
    useAppStore();

  // DEBUG: Log version to verify deployment
  useState(() => {
    console.log('🚀 HCAILT Frontend Version: 2025-12-09 [Force Build Traced]');
    console.log('Available Models:', providerModels);
  });


  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setUploadMessage('File exceeds 20MB limit');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    try {
      setUploadMessage(`Reading ${file.name}...`);
      let text = '';
      if (ext === 'txt') text = await parseTxt(file);
      else if (ext === 'pdf') text = await parsePdf(file);
      else if (ext === 'docx') text = await parseDocx(file);
      else throw new Error(`Unsupported file type: ${ext}`);

      setInputText(text);
      setUploadMessage(`Loaded ${file.name}`);
      setTranslation('');
      setPlain('');
      setQeScore(null);
      setIsMedical(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to read file';
      setUploadMessage(msg);
    }

    e.target.value = '';
  };

  const handleInputMethodChange = (value: InputMethod) => {
    setInputMethod(value);
    setTranslation('');
    setPlain('');
    setQeScore(null);
    setIsMedical(null);
    setUploadMessage('');

    if (value === 'sample-medical') {
      setInputText(SAMPLE_MEDICAL_TEXT_ES.trim());
    } else if (value === 'sample-non-medical') {
      setInputText(SAMPLE_NON_MEDICAL_TEXT_ES.trim());
    } else {
      setInputText('');
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setUploadMessage('Copied to clipboard');
      setTimeout(() => setUploadMessage(''), 2000);
    } catch {
      setUploadMessage('Copy failed');
    }
  };

  const downloadTxt = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setUploadMessage(`Downloaded ${filename}`);
    setTimeout(() => setUploadMessage(''), 2000);
  };

  const resetProcess = () => {
    setInputText('');
    setTranslation('');
    setPlain('');
    setQeScore(null);
    setIsMedical(null);
    setUploadMessage('');
    setInputMethod('upload');
  };

  const runPipeline = async () => {
    if (!inputText.trim()) {
      setUploadMessage('Please provide a text (upload or sample)');
      return;
    }

    setLoading(true);
    setCurrentStep('starting');
    setTranslation('');
    setPlain('');
    setQeScore(null);
    setIsMedical(null);
    setUploadMessage('🚀 Starting translation pipeline...');

    try {
      const base = { provider, model };

      // Domain check
      setCurrentStep('domain-check');
      setUploadMessage('🔍 Step 1/4: Checking if text belongs to medical domain...');
      const domainRes = await domainCheck({
        text: inputText,
        ...base,
        temperature: tempMt,
      });
      setIsMedical(domainRes.isMedical);

      if (!domainRes.isMedical) {
        setTranslation('Text identified as non-medical. Translation not performed.');
        setUploadMessage('❌ Non-medical text detected. Pipeline stopped.');
        setCurrentStep('');
        return;
      }

      setUploadMessage('✅ Medical text confirmed. Proceeding with translation...');

      // Translation
      setCurrentStep('translating');
      setUploadMessage('🌐 Step 2/4: Translating medical text from Spanish to English...');
      const translationRes = await translate({
        text: inputText,
        ...base,
        temperature: tempMt,
      });
      setTranslation(translationRes.translation);

      if (!translationRes.translation) {
        throw new Error('Translation received was empty. The model might have failed to generate output after reasoning.');
      }

      setUploadMessage('✅ Translation completed successfully.');

      // Plain language
      setCurrentStep('simplifying');
      setUploadMessage('📝 Step 3/4: Simplifying translation into plain language...');
      const plainRes = await simplify({
        originalText: inputText,
        translatedText: translationRes.translation,
        ...base,
        temperature: tempPlain,
      });
      setPlain(plainRes.plainText);
      setUploadMessage('✅ Plain language version generated.');

      // Quality estimation
      setCurrentStep('quality-check');
      setUploadMessage('📊 Step 4/4: Estimating translation quality...');
      const qeRes = await qualityEstimate({
        originalText: inputText,
        translatedText: translationRes.translation,
        simplifiedText: plainRes.plainText,
        ...base,
        temperature: tempQe,
      });
      setQeScore(qeRes.score);
      setCurrentStep('complete');
      setUploadMessage('🎉 Processing complete! All steps finished successfully.');
    } catch (error: any) {
      const detail = error?.response?.data?.error || error?.message || 'Unexpected error';
      setUploadMessage(`❌ Error: ${detail}`);
      setCurrentStep('');
    } finally {
      setLoading(false);
      setTimeout(() => setCurrentStep(''), 1000);
    }
  };

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'contrast'> = ['light', 'dark', 'contrast'];
    const currentIndex = themes.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeName(themes[nextIndex]);
  };

  return (
    <div className={themeName}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <GridPattern />
        <FloatingOrbs />

        <div>
          {/* Hero Section */}
          <section className="relative z-10 container mx-auto px-6 pt-16 pb-12">
            <NeuralNetwork />
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-balance leading-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    HCAILT Demo Overview: Multilingual Healthcare Assistance for Irish Holidaymakers in Spain
                  </span>
                </h2>
                <Button onClick={cycleTheme} variant="outline" size="icon" className="rounded-full ml-4 flex-shrink-0">
                  {themeName === 'light' && <Sun className="w-4 h-4" />}
                  {themeName === 'dark' && <Moon className="w-4 h-4" />}
                  {themeName === 'contrast' && <Contrast className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                This demo showcases how AI-powered language technologies can support real-world communication needs in healthcare settings, using a Human-Centered AI for Language Technology (HCAILT) approach, based on the paper "Human-Centered AI Language Technology: An Empathetic Design Framework for Reliable, Safe and Trustworthy Multilingual Communication".
              </p>
            </div>
          </section>

          {/* Main Content */}
          <main className="relative z-10 container mx-auto px-6 pb-20">
            <EducationalIntro />
            <div className="grid lg:grid-cols-[320px,1fr] gap-8">
              {/* Sidebar - Settings */}
              <aside className="space-y-6 animate-slide-in">
                <Card className="glass gradient-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      LLM Configuration
                    </CardTitle>
                    <CardDescription>Select provider and model</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Select value={provider} onValueChange={(val) => setProvider(val as Provider)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(providerNames).map(([key, name]) => (
                            <SelectItem key={key} value={key}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {providerModels[provider].map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t border-border space-y-4">
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold mb-1">Temperature Settings</h3>
                        <p className="text-xs text-muted-foreground">
                          Higher values (0.5-1.0) = more creative. Lower values (0.0-0.3) = more deterministic.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Machine Translation</Label>
                          <Badge variant="default" className="text-xs">
                            {tempMt.toFixed(1)}
                          </Badge>
                        </div>
                        <Slider
                          value={[tempMt]}
                          onValueChange={([v]) => setTemps({ tempMt: v })}
                          min={0}
                          max={1}
                          step={0.1}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Plain Language</Label>
                          <Badge variant="secondary" className="text-xs">
                            {tempPlain.toFixed(1)}
                          </Badge>
                        </div>
                        <Slider
                          value={[tempPlain]}
                          onValueChange={([v]) => setTemps({ tempPlain: v })}
                          min={0}
                          max={1}
                          step={0.1}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Quality Estimation</Label>
                          <Badge variant="accent" className="text-xs">
                            {tempQe.toFixed(1)}
                          </Badge>
                        </div>
                        <Slider
                          value={[tempQe]}
                          onValueChange={([v]) => setTemps({ tempQe: v })}
                          min={0}
                          max={1}
                          step={0.1}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Main Content Area */}
              <div className="space-y-8 animate-slide-up">
                {/* Input Section - Hide when results are shown */}
                {!loading && !translation && isMedical === null && (
                  <Card className="glass gradient-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Input Source
                      </CardTitle>
                      <CardDescription>Upload a file or use sample text</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Input Method Selector */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={inputMethod === 'upload' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInputMethodChange('upload')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                        <Button
                          variant={inputMethod === 'sample-medical' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInputMethodChange('sample-medical')}
                        >
                          Medical Sample
                        </Button>
                        <Button
                          variant={inputMethod === 'sample-non-medical' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInputMethodChange('sample-non-medical')}
                        >
                          Non-Medical Sample
                        </Button>
                      </div>

                      {/* File Upload */}
                      {inputMethod === 'upload' && (
                        <div className="relative">
                          <input
                            type="file"
                            accept=".txt,.pdf,.docx"
                            onChange={handleFile}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-12 text-center transition-colors bg-muted/20">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-1">
                              Drop TXT, PDF, or DOCX file here
                            </p>
                            <p className="text-xs text-muted-foreground">Maximum size: 20MB</p>
                          </div>
                        </div>
                      )}

                      {/* Upload Message */}
                      {uploadMessage && (
                        <Badge variant="outline" className="w-full justify-center text-lg py-3 font-medium">
                          {uploadMessage}
                        </Badge>
                      )}

                      {/* Text Input */}
                      <div className="space-y-2">
                        <Label>Source Text (Spanish)</Label>
                        <Textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Enter or paste medical text in Spanish..."
                          className="min-h-[200px] font-mono text-sm resize-y"
                        />
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={runPipeline}
                        disabled={loading || !inputText.trim()}
                        size="lg"
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <SparklesIcon className="w-5 h-5 mr-2 animate-spin" />
                            Processing Pipeline...
                          </>
                        ) : (
                          <>
                            <Languages className="w-5 h-5 mr-2" />
                            Translate & Simplify
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Pipeline Flow Indicator */}
                {loading && (
                  <div className="animate-fade-in">
                    <ProcessingLog currentStep={currentStep} isProcessing={loading} />
                  </div>
                )}

                {/* Results Section */}
                {!loading && (translation || isMedical !== null) && (
                  <Card className="glass gradient-border animate-slide-up">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <CardTitle className="flex items-center gap-2">
                          <SparklesIcon className="w-5 h-5 text-primary" />
                          Comparative View
                        </CardTitle>

                        <div className="flex items-center gap-3">
                          {/* Domain Badge */}
                          {isMedical !== null && (
                            <Badge variant={isMedical ? 'success' : 'warning'} className="gap-1.5">
                              {isMedical ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Medical Domain
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  Non-Medical
                                </>
                              )}
                            </Badge>
                          )}

                          {/* Quality Score */}
                          {qeScore !== null && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                              {qeScore >= 80 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {qeScore >= 60 && qeScore < 80 && <AlertCircle className="w-4 h-4 text-amber-500" />}
                              {qeScore < 60 && <XCircle className="w-4 h-4 text-red-500" />}
                              <span className="text-sm font-semibold">{qeScore}%</span>
                              <span className="text-xs text-muted-foreground">Quality</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Three Column Comparative Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Column 1: Original Spanish */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-3 py-2 rounded-t-md border-b border-blue-500/20">
                            <Label className="text-sm font-bold text-blue-700 dark:text-blue-300">
                              🇪🇸 Original (Spanish)
                            </Label>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyText(inputText)}
                                disabled={!inputText}
                                title="Copy to clipboard"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadTxt(inputText, 'original-spanish.txt')}
                                disabled={!inputText}
                                title="Download as TXT"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="min-h-[400px] max-h-[600px] overflow-y-auto rounded-b-md border border-input bg-blue-50/50 dark:bg-blue-950/20 px-3 py-3 text-sm">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              {inputText}
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Technical Translation */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-purple-600/10 px-3 py-2 rounded-t-md border-b border-purple-500/20">
                            <Label className="text-sm font-bold text-purple-700 dark:text-purple-300">
                              🇬🇧 Technical Translation
                            </Label>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyText(translation)}
                                disabled={!translation}
                                title="Copy to clipboard"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadTxt(translation, 'technical-translation.txt')}
                                disabled={!translation}
                                title="Download as TXT"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="min-h-[400px] max-h-[600px] overflow-y-auto rounded-b-md border border-input bg-purple-50/50 dark:bg-purple-950/20 px-3 py-3 text-sm">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {translation || '*Processing...*'}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Plain Language */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 px-3 py-2 rounded-t-md border-b border-emerald-500/20">
                            <Label className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                              📝 Plain Language
                            </Label>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyText(plain)}
                                disabled={!plain}
                                title="Copy to clipboard"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadTxt(plain, 'plain-language.txt')}
                                disabled={!plain}
                                title="Download as TXT"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="min-h-[400px] max-h-[600px] overflow-y-auto rounded-b-md border border-input bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-3 text-sm">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {plain || '*Processing...*'}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reset Button - Only show when process is complete */}
                {!loading && translation && plain && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={resetProcess}
                      size="lg"
                      variant="outline"
                      className="gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Start New Process
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
            <div className="container mx-auto px-6">
              <p>HCAILT - Healthcare AI Language Translation</p>
              <p className="mt-1">Powered by multiple LLM providers</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;