import { FontLoader } from 'three-stdlib'
import fontJSON from './helvetiker_regular.typeface.json'

// @ts-ignore
export const font = new FontLoader().parse(fontJSON)
