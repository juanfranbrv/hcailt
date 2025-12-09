import { FC } from 'react';

export const FloatingOrbs: FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
    </div>
  );
};

export const NeuralNetwork: FC = () => {
  return (
    <svg
      className="absolute top-0 right-0 w-1/3 h-1/3 opacity-10 pointer-events-none"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nodes */}
      <circle cx="80" cy="100" r="8" className="fill-primary animate-pulse" />
      <circle cx="200" cy="80" r="6" className="fill-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
      <circle cx="320" cy="120" r="7" className="fill-secondary animate-pulse" style={{ animationDelay: '1s' }} />
      <circle cx="100" cy="220" r="6" className="fill-primary animate-pulse" style={{ animationDelay: '1.5s' }} />
      <circle cx="250" cy="200" r="8" className="fill-accent animate-pulse" style={{ animationDelay: '2s' }} />
      <circle cx="180" cy="300" r="7" className="fill-secondary animate-pulse" style={{ animationDelay: '2.5s' }} />

      {/* Connections */}
      <line x1="80" y1="100" x2="200" y2="80" className="stroke-primary/30" strokeWidth="1" />
      <line x1="200" y1="80" x2="320" y2="120" className="stroke-accent/30" strokeWidth="1" />
      <line x1="80" y1="100" x2="100" y2="220" className="stroke-primary/30" strokeWidth="1" />
      <line x1="200" y1="80" x2="250" y2="200" className="stroke-accent/30" strokeWidth="1" />
      <line x1="320" y1="120" x2="250" y2="200" className="stroke-secondary/30" strokeWidth="1" />
      <line x1="100" y1="220" x2="180" y2="300" className="stroke-primary/30" strokeWidth="1" />
      <line x1="250" y1="200" x2="180" y2="300" className="stroke-accent/30" strokeWidth="1" />
    </svg>
  );
};

export const Sparkles: FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`inline-block ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z"
        className="fill-primary"
      />
      <path
        d="M20 4L20.5 6.5L23 7L20.5 7.5L20 10L19.5 7.5L17 7L19.5 6.5L20 4Z"
        className="fill-accent"
      />
    </svg>
  );
};

export const PipelineFlow: FC = () => {
  return (
    <svg
      className="w-full h-20 opacity-20"
      viewBox="0 0 800 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <path
        d="M0 40 Q 200 20, 400 40 T 800 40"
        stroke="url(#flowGradient)"
        strokeWidth="2"
        fill="none"
        className="animate-pulse"
      />

      {/* Animated dots along the path */}
      <circle r="4" fill="hsl(var(--primary))">
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          path="M0 40 Q 200 20, 400 40 T 800 40"
        />
      </circle>
      <circle r="4" fill="hsl(var(--accent))">
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          path="M0 40 Q 200 20, 400 40 T 800 40"
          begin="1.3s"
        />
      </circle>
      <circle r="4" fill="hsl(var(--secondary))">
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          path="M0 40 Q 200 20, 400 40 T 800 40"
          begin="2.6s"
        />
      </circle>
    </svg>
  );
};

export const GridPattern: FC = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.02]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};
