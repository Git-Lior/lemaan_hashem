import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Font } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface FontListProps {
  fonts: Font[];
  selectedFont?: Font;
  onSelectFont: (font: Font) => void;
  onDeleteFont: (font: Font) => void;
  onAddFont: () => void;
  baseFont?: string;
  onSetBaseFont: (fontId: string) => void;
}

export function FontList({
  fonts,
  selectedFont,
  onSelectFont,
  onDeleteFont,
  onAddFont,
  baseFont,
  onSetBaseFont,
}: FontListProps) {
  return (
    <div className="w-64 border-r bg-muted/10 p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Fonts</h2>
        <Button onClick={onAddFont} size="sm">Add Font</Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {fonts.map((font) => (
            <div
              key={font.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                selectedFont?.id === font.id ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
              onClick={() => onSelectFont(font)}
            >
              <div className="flex-1">
                <div className="font-medium">{font.name}</div>
                {font.culture && (
                  <div className="text-sm text-muted-foreground">{font.culture}</div>
                )}
                {baseFont === font.id && (
                  <div className="text-sm text-primary">Base Font</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFont(font);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}