import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import * as opentype from 'opentype.js';

const fontsDir = path.join(process.cwd(), 'public', 'fonts');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('font') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No font file provided' });
    }

    const fontId = nanoid();
    const fontBuffer = Buffer.from(await file.arrayBuffer());
    const fontPath = path.join(fontsDir, `${fontId}.ttf`);
    
    await fs.writeFile(fontPath, fontBuffer);
    
    // Load the font and extract glyphs
    const font = await opentype.parse(fontBuffer);
    const glyphs: { [key: string]: string } = {};
    
    // Hebrew letters Unicode range
    for (let i = 0x05D0; i <= 0x05EA; i++) {
      const char = String.fromCharCode(i);
      const glyph = font.charToGlyph(char);
      
      if (glyph && glyph.index !== 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scale = 50;
        
        canvas.width = glyph.advanceWidth * scale;
        canvas.height = (font.ascender - font.descender) * scale;
        
        ctx.scale(scale, -scale);
        ctx.translate(0, -font.ascender);
        
        const path = glyph.getPath(0, 0, font.unitsPerEm);
        path.draw(ctx);
        
        const imageData = canvas.toDataURL('image/png');
        const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
        
        const imagePath = path.join(fontsDir, `${fontId}_${char}.png`);
        await fs.writeFile(imagePath, base64Data, 'base64');
        
        glyphs[char] = `/fonts/${fontId}_${char}.png`;
      }
    }

    return NextResponse.json({
      success: true,
      fontId,
      glyphs,
    });
  } catch (error) {
    console.error('Error processing font:', error);
    return NextResponse.json({ success: false, error: 'Failed to process font file' });
  }
}