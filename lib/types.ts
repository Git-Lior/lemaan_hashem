export interface Font {
  id: string;
  name: string;
  type: 'base' | 'stylized';
  culture?: string;
  letters: {
    [key: string]: {
      imageUrl: string;
      cuts?: {
        x: number;
        y: number;
        width: number;
        height: number;
      }[];
    };
  };
}

export interface FontConfig {
  fonts: Font[];
  baseFont?: string;
}

export interface LetterUploadResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface FontUploadResponse {
  success: boolean;
  fontId?: string;
  error?: string;
}

export interface AnimationConfig {
  speed: number;
  percentReplaced: number;
  blocksPerLetter: number;
  transitionEffect: 'fade' | 'slide' | 'scale';
}

export interface ExhibitionData {
  surname: string;
  culture: string;
  originalSurname?: string;
  selectedFont?: string;
}