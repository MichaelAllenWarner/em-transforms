import { FontLoader } from 'three-stdlib';
import fontJSON from './roboto_regular.typeface.json';

// @ts-ignore
export const font = new FontLoader().parse(fontJSON);
