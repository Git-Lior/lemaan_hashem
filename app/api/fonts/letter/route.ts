import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const fontsDir = path.join(process.cwd(), 'public', 'fonts');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const fontId = formData.get('fontId') as string;
    const letter = formData.get('letter') as string;
    
    if (!file || !fontId || !letter) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${fontId}_${letter}.png`;
    const filePath = path.join(fontsDir, fileName);
    
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({
      success: true,
      imageUrl: `/fonts/${fileName}`,
    });
  } catch (error) {
    console.error('Error uploading letter:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload letter image',
    });
  }
}