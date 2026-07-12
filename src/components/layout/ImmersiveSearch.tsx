"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores/search-store';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types/product';

export function ImmersiveSearch() {
  const { isOpen, close } = useSearchStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    close();
  }, [close]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
      if (e.key === 'Enter' && selectedIndex !== -1) {
        router.push(`/products/${results[selectedIndex].slug}`);
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, results, router, handleClose]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?query=${query}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const result = await response.json();
        setResults(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={handleClose}>
      <div className="w-full max-w-2xl mx-auto mt-20 bg-background dark:bg-rich-black rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center p-4 border-b border-muted-foreground/20">
          <Search className="text-muted-foreground mr-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full bg-transparent text-foreground placeholder-foreground/50 focus:outline-none"
          />
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X />
          </button>
        </div>
        <div className="p-4">
          {isLoading && <div className="text-muted-foreground font-sans">Searching...</div>}
          {!isLoading && results.length === 0 && query.length > 1 && (
            <div className="text-muted-foreground font-sans">No results found for "{query}"</div>
          )}
          <ul className="space-y-2">
            {results.map((product, index) => (
              <li
                key={product.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${selectedIndex === index ? 'bg-white/10' : 'hover:bg-white/5'}`}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  router.push(`/products/${product.slug}`);
                  handleClose();
                }}
              >
                <div className="flex items-center">
                  <Image
                    src={product.images.main}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md mr-4"
                  />
                  <div>
                    <div className="text-foreground font-bold font-heading">{product.name}</div>
                    <div className="text-muted-gold/80 font-sans text-xs uppercase tracking-wide">{product.category}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
