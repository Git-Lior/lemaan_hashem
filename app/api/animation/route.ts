import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AnimationConfig } from '@/lib/types';

const configPath = path.join(process.cwd(), 'public', 'animation', 'config.json');
const configDir = path.join(process.cwd(), 'public', 'animation');

async function ensureDirectories() {
  try {
    await fs.mkdir(configDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

async function getConfig(): Promise<AnimationConfig> {
  try {
    await ensureDirectories();
    const configExists = await fs.stat(configPath).catch(() => false);
    
    if (!configExists) {
      const initialConfig: AnimationConfig = {
        speed: 1000,
        percentReplaced: 50,
        blocksPerLetter: 4,
        transitionEffect: 'fade'
      };
      await fs.writeFile(configPath, JSON.stringify(initialConfig, null, 2));
      return initialConfig;
    }
    
    const configData = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error reading config:', error);
    return {
      speed: 1000,
      percentReplaced: 50,
      blocksPerLetter: 4,
      transitionEffect: 'fade'
    };
  }
}

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const config = await req.json();
  
  try {
    await ensureDirectories();
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ success: false, error: 'Failed to save configuration' });
  }
}