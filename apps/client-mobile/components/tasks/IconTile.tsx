import React from 'react';
import { Center } from '@/components/ui/center';

interface IconTileProps {
  tone?: 'sage' | 'orange' | 'taupe';
  children: React.ReactNode;
}

export function IconTile({ tone = 'sage', children }: IconTileProps) {
  const getBgClass = (tone: 'sage' | 'orange' | 'taupe') => {
    switch (tone) {
      case 'orange':
        return 'bg-bg-clay-orange-10';
      case 'taupe':
        return 'bg-gray-200';
      default:
        return 'bg-status-success-bg';
    }
  };

  return (
    <Center className={`w-10 h-10 rounded-lg ${getBgClass(tone)}`}>
      {children}
    </Center>
  );
}

export default IconTile;