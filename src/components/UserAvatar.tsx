'use client';

import { useState } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackColor?: string;
}

export function UserAvatar({
  src,
  name,
  size = 'md',
  className = '',
  fallbackColor,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitial = (str?: string | null) => {
    if (!str) return 'A';
    const trimmed = str.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : 'A';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
  };

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 32,
    xl: 44,
  };

  const showImage = Boolean(src) && !imageError;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border-2 border-primary/30 transition-transform ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: fallbackColor || 'rgba(var(--color-primary), 0.1)',
      }}
    >
      {showImage ? (
        <img
          src={src!}
          alt={name || 'Avatar'}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span className="font-extrabold text-primary select-none">
          {getInitial(name)}
        </span>
      ) : (
        <User size={iconSizes[size]} className="text-primary opacity-80" />
      )}
    </div>
  );
}
