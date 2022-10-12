import * as path from 'path';
import crypto from 'crypto';

export function parseFilename(filename: string): [string, string] {
  const file = path.parse(filename);
  const random = crypto.randomBytes(16).toString('hex');
  const name = `${file.name}-${random}${file.ext}`;
  return [name, file.ext];
}

export const imageSizeMapping = {
  large: 2048,
  medium: 1024,
  small: 512,
} as const;

export type ImageSize = keyof typeof imageSizeMapping;
