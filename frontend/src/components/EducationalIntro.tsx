import { Info, X, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';

export function EducationalIntro() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
            // Add ESC key listener
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setIsExpanded(false);
            };
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEsc);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isExpanded]);

    // Trigger Card (Collapsed State)
    const triggerCard = (
        <Card
            className="glass gradient-border mb-8 cursor-pointer hover:bg-muted/30 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => setIsExpanded(true)}
        >
            <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <span className="font-bold text-lg leading-tight block">
                                HCAILT Demo Overview
                            </span>
                            <span className="text-xs text-muted-foreground font-normal block uppercase tracking-wider">
                                Click to read documentation
                            </span>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
        </Card>
    );

    // Modal Content (Expanded State)
    const modalContent = (
        <div
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-700"
            onClick={() => setIsExpanded(false)} // Close on backdrop click
        >
            <div
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-[0.96] slide-in-from-bottom-4 duration-700 ease-in-out scrollbar-hide"
                onClick={(e) => e.stopPropagation()} // Prevent close on content click
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-6 top-6 z-50 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground backdrop-blur-sm border border-transparent shadow-sm transition-all duration-300"
                    onClick={() => setIsExpanded(false)}
                >
                    <X className="w-5 h-5" />
                </Button>

                <Card className="glass gradient-border shadow-2xl border-primary/20 overflow-hidden">
                    <CardHeader className="border-b pb-8 pt-10 px-8 md:px-12 bg-gradient-to-br from-muted/50 via-muted/20 to-transparent">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-display font-bold tracking-tight text-balance">
                                HCAILT Demo Overview
                            </h2>
                        </div>
                        <p className="text-muted-foreground text-xl md:pl-16">
                            Multilingual Healthcare Assistance for Irish Holidaymakers in Spain
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-10 text-lg leading-relaxed p-8 md:p-12">
                        {/* Introduction Grid */}
                        <div className="grid md:grid-cols-2 gap-10 items-start">
                            <div className="space-y-6">
                                <p className="font-medium text-foreground/90">
                                    This demo showcases how AI-powered language technologies can support real-world communication needs in healthcare settings, using a <span className="text-primary font-bold">Human-Centered AI (HCAILT)</span> approach.
                                </p>
                                <p className="text-muted-foreground text-base">
                                    Based on the paper <em>"Human-Centered AI Language Technology: An Empathetic Design Framework for Reliable, Safe and Trustworthy Multilingual Communication"</em>.
                                </p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
                                <p className="italic text-base text-muted-foreground leading-loose">
                                    "Imagine an Irish holidaymaker in Spain needing medical attention. Language barriers can become a serious issue in such high-stakes situations."
                                </p>
                            </div>
                        </div>

                        {/* How it works Section */}
                        <div className="space-y-8">
                            <h4 className="font-bold text-2xl flex items-center gap-3">
                                <span>🧠</span> How it works
                            </h4>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-4 p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">1</div>
                                    <strong className="block text-xl">Domain-Constrained MT</strong>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Secure, medical-domain-restricted Machine Translation (MT) ensures terminology accuracy and avoids generic mistranslations.
                                    </p>
                                </div>

                                <div className="space-y-4 p-6 rounded-2xl bg-card border border-border/40 hover:border-accent/40 hover:shadow-md transition-all duration-300 group">
                                    <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">2</div>
                                    <strong className="block text-xl">Quality Estimation (QE)</strong>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Provides a probability score for translation accuracy.
                                    </p>
                                    <ul className="text-xs space-y-2 pt-3 text-muted-foreground border-t border-border/50 mt-2">
                                        <li className="flex items-center gap-2"><span className="text-emerald-500 text-base">✅</span> <strong>&gt;80%</strong>: Good quality</li>
                                        <li className="flex items-center gap-2"><span className="text-amber-500 text-base">⚠️</span> <strong>60-80%</strong>: Fair quality</li>
                                        <li className="flex items-center gap-2"><span className="text-red-500 text-base">❌</span> <strong>&lt;60%</strong>: Potential errors</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 p-6 rounded-2xl bg-card border border-border/40 hover:border-secondary/40 hover:shadow-md transition-all duration-300 group">
                                    <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">3</div>
                                    <strong className="block text-xl">Plain Language</strong>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Converts complex medical text into simple language for non-specialist understanding (patients).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10 pt-6 border-t border-border/50">
                            <div className="space-y-5">
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                    🛠️ System Customisation
                                </h4>
                                <ul className="space-y-4 text-sm text-foreground/80">
                                    <li className="space-y-1.5 p-3 rounded-xl bg-card border border-border/50">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            OpenAI
                                        </div>
                                        <div className="pl-4 flex flex-wrap gap-2">
                                            <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border/50">GPT-5.1</span>
                                            <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border/50">GPT-5 Mini</span>
                                        </div>
                                    </li>
                                    <li className="space-y-1.5 p-3 rounded-xl bg-card border border-border/50">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            Google
                                        </div>
                                        <div className="pl-4 flex flex-wrap gap-2">
                                            <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border/50">Gemini 2.5 Flash</span>
                                            <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border/50">Flash-Lite</span>
                                        </div>
                                    </li>
                                    <li className="space-y-1.5 p-3 rounded-xl bg-card border border-border/50">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            Groq
                                        </div>
                                        <div className="pl-4">
                                            <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border/50">GPT-OSS-120B</span>
                                        </div>
                                    </li>
                                    <li className="space-y-1.5 p-3 rounded-xl bg-card border border-border/50">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            Fireworks
                                        </div>
                                        <div className="pl-4">
                                            <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border/50">Deepseek V3.1</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-5">
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                        🌡️ Temperature Settings
                                    </h4>
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            The <strong className="text-foreground">Temperature</strong> controls the "creativity" or randomness of the AI model.
                                        </p>
                                        <ul className="grid grid-cols-2 gap-3 pt-2">
                                            <li className="space-y-1 p-2 rounded-lg bg-background/50 border border-border/30">
                                                <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">Low (0.1 - 0.3)</div>
                                                <div className="text-xs text-foreground/80 font-medium">Deterministic</div>
                                                <div className="text-[10px] text-muted-foreground leading-tight">Best for precision tasks like medical translation.</div>
                                            </li>
                                            <li className="space-y-1 p-2 rounded-lg bg-background/50 border border-border/30">
                                                <div className="text-xs font-bold text-orange-500 uppercase tracking-wider">High (0.7 - 1.0)</div>
                                                <div className="text-xs text-foreground/80 font-medium">Creative</div>
                                                <div className="text-[10px] text-muted-foreground leading-tight">Better for simplified explanations or fluid text.</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                        📄 Sample Files
                                    </h4>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-3 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                                            <span><strong>Medical domain:</strong> Processed successfully.</span>
                                        </li>
                                        <li className="flex items-start gap-3 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                                            <span className="mt-0.5 text-red-600 dark:text-red-400 font-bold">✕</span>
                                            <span><strong>Non-medical domain:</strong> Flagged.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <>
            {triggerCard}
            {mounted && isExpanded && createPortal(modalContent, document.body)}
        </>
    );
}
