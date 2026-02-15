'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

interface FloatingSupportButtonProps {
  supportUrl: string;
}

export function FloatingSupportButton({ supportUrl }: FloatingSupportButtonProps) {
  return (
    <Link
      href={supportUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center justify-center space-x-2 rounded-full bg-accent-red p-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-accent-red"
      aria-label="Ủng hộ"
    >
      <Heart className="h-6 w-6" />
      <span className="font-semibold">Ủng hộ</span>
    </Link>
  );
}
