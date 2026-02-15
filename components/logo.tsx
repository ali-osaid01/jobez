import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Logo Icon */}
      <div className="relative group">
        <svg
          className={cn(sizes[size], 'transition-transform group-hover:scale-110')}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Briefcase base with gradient */}
          <defs>
            <linearGradient id="briefcase-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E63B8" />
              <stop offset="100%" stopColor="#4A7EC2" />
            </linearGradient>
            <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A7EC2" />
              <stop offset="100%" stopColor="#6B96CC" />
            </linearGradient>
          </defs>
          
          {/* Main briefcase shape */}
          <rect x="20" y="35" width="60" height="45" rx="6" fill="url(#briefcase-gradient)" />
          <rect x="25" y="40" width="50" height="10" fill="white" fillOpacity="0.2" />
          
          {/* Handle */}
          <path 
            d="M 35 35 Q 35 25 50 25 Q 65 25 65 35" 
            stroke="url(#briefcase-gradient)" 
            strokeWidth="5" 
            fill="none"
            strokeLinecap="round"
          />
          
          {/* AI Sparkle accent */}
          <g transform="translate(65, 25)">
            <path 
              d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" 
              fill="url(#ai-gradient)"
              className="animate-pulse"
            />
          </g>
          
          {/* Small sparkles */}
          <circle cx="30" cy="50" r="2" fill="white" fillOpacity="0.8" />
          <circle cx="70" cy="65" r="2" fill="white" fillOpacity="0.8" />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={cn(
          textSizes[size],
          'font-heading font-bold bg-gradient-to-r from-[#1E63B8] via-[#4A7EC2] to-[#1E63B8] bg-clip-text text-transparent'
        )}>
          JobEZ
        </span>
      )}
    </div>
  );
}
