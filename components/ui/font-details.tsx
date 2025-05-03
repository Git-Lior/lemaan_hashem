import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Font } from '@/lib/types';
import { Upload } from 'lucide-react';

interface FontDetailsProps {
  font: Font;
  onUpdateFont: (font: Font) => void;
}

const HEBREW_LETTERS = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו',
  'ז', 'ח', 'ט', 'י', 'כ', 'ל',
  'מ', 'נ', 'ס', 'ע', 'פ', 'צ',
  'ק', 'ר', 'ש', 'ת', 'ך', 'ם',
  'ן', 'ף', 'ץ'
];

export function FontDetails({ font, onUpdateFont }: FontDetailsProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (name: string) => {
    onUpdateFont({ ...font, name });
  };

  const handleCultureChange = (culture: string) => {
    onUpdateFont({ ...font, culture });
  };

  const handleLetterUpload = async (letter: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('fontId', font.id);
    formData.append('letter', letter);

    try {
      const response = await fetch('/api/fonts/letter', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        onUpdateFont({
          ...font,
          letters: {
            ...font.letters,
            [letter]: {
              imageUrl: data.imageUrl,
              cuts: [],
            },
          },
        });
      }
    } catch (error) {
      console.error('Error uploading letter:', error);
    }
  };

  const handleFontUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('font', file);

    try {
      const response = await fetch('/api/fonts/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        onUpdateFont({
          ...font,
          letters: Object.fromEntries(
            Object.entries(data.glyphs).map(([letter, url]) => [
              letter,
              { imageUrl: url as string, cuts: [] },
            ])
          ),
        });
      }
    } catch (error) {
      console.error('Error uploading font:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Font Name</Label>
          <Input
            id="name"
            value={font.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        {font.type === 'stylized' && (
          <div>
            <Label htmlFor="culture">Culture</Label>
            <Input
              id="culture"
              value={font.culture || ''}
              onChange={(e) => handleCultureChange(e.target.value)}
              placeholder="e.g., Arabic, Polish, etc."
            />
          </div>
        )}

        <div>
          <Label>Font File</Label>
          <div className="mt-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".ttf,.otf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFontUpload(file);
              }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Font File'}
            </Button>
          </div>
        </div>

        <div>
          <Label>Letters</Label>
          <div className="grid grid-cols-9 gap-4 mt-2">
            {HEBREW_LETTERS.map((letter) => (
              <div
                key={letter}
                className="aspect-square border rounded-lg flex items-center justify-center relative group cursor-pointer"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleLetterUpload(letter, file);
                  };
                  input.click();
                }}
              >
                {font.letters[letter]?.imageUrl ? (
                  <img
                    src={font.letters[letter].imageUrl}
                    alt={letter}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-2xl">{letter}</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}