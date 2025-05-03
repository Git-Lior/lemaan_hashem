'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExhibitionData, Font, AnimationConfig } from '@/lib/types';

export default function Exhibition() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>();
  const [formData, setFormData] = useState<ExhibitionData>({
    surname: '',
    culture: '',
    originalSurname: '',
  });
  const [ctrlCount, setCtrlCount] = useState(0);
  const [lastCtrlPress, setLastCtrlPress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchFonts();
    fetchAnimationConfig();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        const now = Date.now();
        if (now - lastCtrlPress < 1000) {
          setCtrlCount(prev => prev + 1);
        } else {
          setCtrlCount(1);
        }
        setLastCtrlPress(now);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastCtrlPress]);

  useEffect(() => {
    if (ctrlCount === 3) {
      window.location.href = '/';
    }
  }, [ctrlCount]);

  const fetchFonts = async () => {
    try {
      const response = await fetch('/api/fonts');
      const data = await response.json();
      setFonts(data.fonts);
    } catch (error) {
      console.error('Error fetching fonts:', error);
    }
  };

  const fetchAnimationConfig = async () => {
    try {
      const response = await fetch('/api/animation');
      const data = await response.json();
      setAnimationConfig(data);
    } catch (error) {
      console.error('Error fetching animation config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnimating(true);
    // Animation logic will be implemented here
    setTimeout(() => {
      setIsAnimating(false);
      setFormData({ surname: '', culture: '', originalSurname: '' });
    }, 5000);
  };

  const cultures = Array.from(new Set(fonts
    .filter(f => f.type === 'stylized' && f.culture)
    .map(f => f.culture as string)));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Hebraization of Surnames
          </h1>
          
          <div className="prose prose-lg mx-auto mb-8">
            <p className="text-muted-foreground text-center">
              Explore the cultural history of surname changes in Israel through this interactive experience.
            </p>
          </div>

          {!isAnimating ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Current Surname
                </label>
                <Input
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Cultural Origin
                </label>
                <Select
                  value={formData.culture}
                  onValueChange={(value) => setFormData({ ...formData, culture: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your cultural origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {cultures.map((culture) => (
                      <SelectItem key={culture} value={culture}>
                        {culture}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Original Surname (Optional)
                </label>
                <Input
                  value={formData.originalSurname}
                  onChange={(e) => setFormData({ ...formData, originalSurname: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Start Animation
              </Button>
            </form>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg mb-4">Animating surname transformation...</p>
              {/* Animation canvas will be implemented here */}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}