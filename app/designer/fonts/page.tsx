'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FontList } from '@/components/ui/font-list';
import { FontDetails } from '@/components/ui/font-details';
import { Font, FontConfig } from '@/lib/types';
import { nanoid } from 'nanoid';

export default function FontManagement() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [selectedFont, setSelectedFont] = useState<Font | undefined>();
  const [baseFont, setBaseFont] = useState<string>();

  useEffect(() => {
    fetchFonts();
  }, []);

  const fetchFonts = async () => {
    try {
      const response = await fetch('/api/fonts');
      const data: FontConfig = await response.json();
      setFonts(data.fonts);
      setBaseFont(data.baseFont);

      if (data.fonts.length === 0) {
        const newFont: Font = {
          id: nanoid(),
          name: 'Base Hebrew',
          type: 'base',
          letters: {},
        };
        await saveFonts([newFont], newFont.id);
        setFonts([newFont]);
        setSelectedFont(newFont);
        setBaseFont(newFont.id);
      }
    } catch (error) {
      console.error('Error fetching fonts:', error);
    }
  };

  const saveFonts = async (updatedFonts: Font[], updatedBaseFont?: string) => {
    try {
      await fetch('/api/fonts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fonts: updatedFonts,
          baseFont: updatedBaseFont || baseFont,
        }),
      });
    } catch (error) {
      console.error('Error saving fonts:', error);
    }
  };

  const handleAddFont = () => {
    const newFont: Font = {
      id: nanoid(),
      name: 'New Font',
      type: 'stylized',
      letters: {},
    };
    const updatedFonts = [...fonts, newFont];
    setFonts(updatedFonts);
    setSelectedFont(newFont);
    saveFonts(updatedFonts);
  };

  const handleDeleteFont = async (font: Font) => {
    if (font.id === baseFont) {
      alert('Cannot delete the base font');
      return;
    }
    
    const updatedFonts = fonts.filter((f) => f.id !== font.id);
    setFonts(updatedFonts);
    if (selectedFont?.id === font.id) {
      setSelectedFont(undefined);
    }
    await saveFonts(updatedFonts);
  };

  const handleUpdateFont = async (updatedFont: Font) => {
    const updatedFonts = fonts.map((f) =>
      f.id === updatedFont.id ? updatedFont : f
    );
    setFonts(updatedFonts);
    setSelectedFont(updatedFont);
    await saveFonts(updatedFonts);
  };

  const handleSetBaseFont = async (fontId: string) => {
    setBaseFont(fontId);
    await saveFonts(fonts, fontId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <FontList
          fonts={fonts}
          selectedFont={selectedFont}
          onSelectFont={setSelectedFont}
          onDeleteFont={handleDeleteFont}
          onAddFont={handleAddFont}
          baseFont={baseFont}
          onSetBaseFont={handleSetBaseFont}
        />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center p-4 border-b">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold ml-4">Font Management</h1>
          </div>
          {selectedFont ? (
            <FontDetails font={selectedFont} onUpdateFont={handleUpdateFont} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a font or create a new one to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}