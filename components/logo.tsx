import Image from 'next/image';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: showText ? 'h-7 w-28' : 'h-7 w-16',
    md: showText ? 'h-9 w-36' : 'h-9 w-20',
    lg: showText ? 'h-14 w-56' : 'h-14 w-32',
  };

  return (
    <div className={cn('relative', sizes[size], className)}>
      <Image
        src="/brand/jobez-logo.png"
        alt="JobEZ"
        fill
        priority={size !== 'sm'}
        sizes={size === 'lg' ? '224px' : size === 'md' ? '144px' : '112px'}
        className={cn('object-contain', showText ? 'object-left' : 'object-left')}
      />
    </div>
  );
}
