import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export function EducationalIntro() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="glass gradient-border mb-8">
            <CardHeader
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        HCAILT Demo Overview: Multilingual Healthcare Assistance for Irish Holidaymakers in Spain
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                </CardTitle>
                {!isExpanded && (
                    <div className="mt-3 flex items-center gap-2 animate-pulse">
                        <p className="text-sm text-muted-foreground font-medium">
                            👆 Click to expand and read important instructions about how this system works
                        </p>
                    </div>
                )}
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-4 text-sm leading-relaxed animate-slide-up">
                    <p>
                        This demo showcases how AI-powered language technologies can support real-world communication needs in healthcare settings, using a Human-Centered AI for Language Technology (HCAILT) approach, based on the paper "Human-Centered AI Language Technology: An Empathetic Design Framework for Reliable, Safe and Trustworthy Multilingual Communication".
                    </p>

                    <p>
                        Imagine an Irish holidaymaker in Spain needing medical attention. Language barriers can become a serious issue in such high-stakes situations. Our system demonstrates how different AI components, each guided by HCAILT principles (reliability, safety, trust), can work together to enhance communication between patient and healthcare provider.
                    </p>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-base flex items-center gap-2">
                            🧠 How it works:
                        </h4>

                        <div className="space-y-2 pl-4">
                            <div>
                                <strong>1. Domain-Constrained Machine Translation</strong>
                                <p className="text-muted-foreground">
                                    First, a secure, medical-domain-restricted Machine Translation (MT) system translates messages between Spanish and English, ensuring terminology accuracy and avoiding mistranslations common in general-purpose MT tools.
                                </p>
                            </div>

                            <div>
                                <strong>2. Quality Estimation (QE)</strong>
                                <p className="text-muted-foreground">
                                    The quality estimation score aims to provide a tentative indication of how likely it is that the translated output is correct. It is only based on probabilities and is by no means an accurate measure of quality. If you are dealing with a communication scenario that requires high accuracy, it is strongly recommended to ask a qualified linguist to assess and revise the output.
                                </p>
                                <p className="text-muted-foreground mt-2">
                                    Generally, you can interpret the scores in the following ways:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                    <li>✅ <strong>&gt;80%</strong> - probably good quality overall</li>
                                    <li>⚠️ <strong>60-80%</strong> - probably fair quality, but there may be some serious inaccuracies</li>
                                    <li>❌ <strong>&lt;60%</strong> - probably a number of pretty serious inaccuracies</li>
                                </ul>
                                <p className="text-muted-foreground mt-2 italic">
                                    Remember! If the communication scenario requires high accuracy, ask a qualified linguist to assist.
                                </p>
                            </div>

                            <div>
                                <strong>3. Plain Language Generation</strong>
                                <p className="text-muted-foreground">
                                    Finally, the translated message is converted into Plain Language so that non-specialist users—like patients—can easily understand their medical instructions or consent forms.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-base flex items-center gap-2">
                            🛠️ Customise Your System
                        </h4>
                        <p className="text-muted-foreground">
                            You can choose different AI models for each step, including:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                            <li>OpenAI (e.g., GPT-4)</li>
                            <li>Google (e.g., Gemini)</li>
                            <li>Groq (e.g., LLaMA/LLM via Mixtral) – Some free usage available</li>
                        </ul>
                        <p className="text-muted-foreground mt-2">
                            You'll need to obtain the relevant API keys from each provider, and usage may incur charges depending on your plan.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-base flex items-center gap-2">
                            📄 Sample Files and Upload Options
                        </h4>
                        <p className="text-muted-foreground">
                            To illustrate how domain-restricted AI behaves, two sample files are provided:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                            <li>✅ <strong>Medical domain file:</strong> The system will process it successfully.</li>
                            <li>❌ <strong>Non-medical domain file:</strong> The system will flag it as out-of-scope and suggest seeking professional translation or expert advice.</li>
                        </ul>
                        <p className="text-muted-foreground mt-2">
                            Feel free to upload your own files in PDF, DOCX, or TXT (UTF-8) format and test the system.
                        </p>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
