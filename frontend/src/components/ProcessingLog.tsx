import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, Sparkles, Brain, Languages, FileCheck, Zap } from 'lucide-react';

interface LogEntry {
  id: string;
  message: string;
  status: 'pending' | 'running' | 'success' | 'error';
  timestamp: Date;
  icon?: React.ReactNode;
  details?: string;
}

interface ProcessingLogProps {
  currentStep: string;
  isProcessing: boolean;
}

export function ProcessingLog({ currentStep, isProcessing }: ProcessingLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [funFacts] = useState([
    "AI models can process medical terminology across 100+ languages!",
    "Machine translation quality has improved 60% in the last 5 years.",
    "Medical translation requires understanding of complex anatomical terms.",
    "Plain language simplification makes healthcare accessible to everyone.",
    "Quality estimation uses advanced neural networks to score accuracy.",
    "LLMs can understand context better than traditional translation systems.",
    "Temperature settings control creativity vs. precision in AI outputs.",
    "Healthcare AI helps break language barriers in emergency situations.",
  ]);
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setLogs([]);
      return;
    }

    const stepMap: Record<string, { message: string; icon: React.ReactNode; details: string }> = {
      'starting': {
        message: 'Initializing Translation Pipeline',
        icon: <Zap className="w-4 h-4" />,
        details: 'Setting up AI models and preparing processing environment...'
      },
      'domain-check': {
        message: 'Domain Classification',
        icon: <Brain className="w-4 h-4" />,
        details: 'Analyzing text to determine if it belongs to medical domain using NLP techniques...'
      },
      'translating': {
        message: 'Medical Translation',
        icon: <Languages className="w-4 h-4" />,
        details: 'Translating Spanish medical text to English while preserving technical accuracy...'
      },
      'simplifying': {
        message: 'Plain Language Generation',
        icon: <FileCheck className="w-4 h-4" />,
        details: 'Converting technical medical jargon into accessible, easy-to-understand language...'
      },
      'quality-check': {
        message: 'Quality Estimation',
        icon: <Sparkles className="w-4 h-4" />,
        details: 'Evaluating translation accuracy, fluency, and medical terminology preservation...'
      },
      'complete': {
        message: 'Processing Complete!',
        icon: <CheckCircle2 className="w-4 h-4" />,
        details: 'All pipeline steps finished successfully. Results are ready for review.'
      },
    };

    const stepInfo = stepMap[currentStep];
    if (!stepInfo) return;

    const newLog: LogEntry = {
      id: `${currentStep}-${Date.now()}`,
      message: stepInfo.message,
      status: currentStep === 'complete' ? 'success' : 'running',
      timestamp: new Date(),
      icon: stepInfo.icon,
      details: stepInfo.details,
    };

    setLogs((prev) => {
      // Mark previous running steps as success
      const updated = prev.map(log =>
        log.status === 'running' ? { ...log, status: 'success' as const } : log
      );
      return [...updated, newLog];
    });
  }, [currentStep, isProcessing]);

  useEffect(() => {
    if (!isProcessing) return;
    
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isProcessing, funFacts.length]);

  if (!isProcessing && logs.length === 0) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Processing Log Card */}
      <div className="glass gradient-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <h3 className="text-lg font-bold">Processing Pipeline</h3>
        </div>

        {/* Log Entries */}
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 mt-0.5">
                {log.status === 'running' && (
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping">
                      <div className="w-5 h-5 rounded-full bg-primary/40" />
                    </div>
                    <Loader2 className="relative w-5 h-5 animate-spin text-primary" />
                  </div>
                )}
                {log.status === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                {log.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {log.icon && <span className="text-muted-foreground">{log.icon}</span>}
                    <span className="font-semibold">{log.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {log.details && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {log.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500"
            style={{
              width: `${(logs.filter(l => l.status === 'success').length / 5) * 100}%`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Step Counter */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {logs.filter(l => l.status === 'success').length + 1} of 5
          </span>
          <span className="font-semibold text-primary">
            {Math.round((logs.filter(l => l.status === 'success').length / 5) * 100)}% Complete
          </span>
        </div>
      </div>

      {/* Fun Facts Card */}
      <div className="glass rounded-xl p-6 border border-accent/20 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-bold text-sm text-accent">💡 Did you know?</h4>
            <p
              key={currentFact}
              className="text-sm text-muted-foreground animate-fade-in leading-relaxed"
            >
              {funFacts[currentFact]}
            </p>
          </div>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Estimated time: 30-60 seconds</span>
      </div>
    </div>
  );
}
