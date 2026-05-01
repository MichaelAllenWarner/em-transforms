import { FontLoader, type Font } from 'three-stdlib';
import fontJSON from './roboto_regular.typeface.json';

export const font: Font = new FontLoader().parse(
  fontJSON as unknown as Parameters<FontLoader['parse']>[0],
);
