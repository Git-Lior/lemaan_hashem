'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimationConfig } from '@/lib/types';

export default function AnimationSettings() {
  const [config, setConfig] = useState<AnimationConfig>({
    speed: 1000,
    percentReplaced: 50,
    blocksPerLetter: 4,
    transitionEffect: 'fade'
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/animation');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching animation config:', error);
    }
  };

  const saveConfig = async (updatedConfig: AnimationConfig) => {
    try {
      await fetch('/api/animation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });
    } catch (error) {
      console.error('Error saving animation config:', error);
    }
  };

  const handleChange = (key: keyof AnimationConfig, value: any) => {
    const updatedConfig = { ...config, [key]: value };
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4">Animation Settings</h1>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground mb-6">
            Configure the animation parameters for the exhibition display.
          </p>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Animation Speed</h2>
              <p className="text-sm text-muted-foreground">
                Control how fast each block transitions (in milliseconds)
              </p>
              <Slider
                value={[config.speed]}
                min={100}
                max={2000}
                step={100}
                onValueChange={([value]) => handleChange('speed', value)}
              />
              <span className="text-sm">{config.speed}ms</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Percent Replaced</h2>
              <p className="text-sm text-muted-foreground">
                Percentage of blocks to replace in each letter
              </p>
              <Slider
                value={[config.percentReplaced]}
                min={10}
                max={90}
                step={10}
                onValueChange={([value]) => handleChange('percentReplaced', value)}
              />
              <span className="text-sm">{config.percentReplaced}%</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Blocks per Letter</h2>
              <p className="text-sm text-muted-foreground">
                Number of blocks each letter is divided into
              </p>
              <Slider
                value={[config.blocksPerLetter]}
                min={2}
                max={8}
                step={1}
                onValueChange={([value]) => handleChange('blocksPerLetter', value)}
              />
              <span className="text-sm">{config.blocksPerLetter} blocks</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Transition Effect</h2>
              <p className="text-sm text-muted-foreground">
                Visual effect for block transitions
              </p>
              <Select
                value={config.transitionEffect}
                onValueChange={(value) => handleChange('transitionEffect', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}