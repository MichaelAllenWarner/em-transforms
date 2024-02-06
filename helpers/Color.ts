/*
  All colors taken from the Tailwind color palette https://tailwindcss.com/docs/customizing-colors

  We use their explicit values (rather than the TW class-names) because the Three.js canvas
  components that need the colors don't work with classes, and instead need to be fed
  actual color-values.
*/

export enum Color {
  /** black */
  V = 'black',
  /** indigo-600 */
  E = '#4f46e5',
  /** blue-800 */
  EPrime = '#1e40af',
  /** red-600 */
  B = '#dc2626',
  /** red-800 */
  BPrime = '#991b1b',
  /** green-700 */
  S = '#15803d',
  /** green-900 */
  SPrime = '#14532d',
  /** yellow-700 */
  U = '#a16207',
  /** yellow-900 */
  UPrime = '#713f12',
  /** fuchsia-600 */
  F = '#c026d3',
  /** fuchsia-800 */
  FPrime = '#86198f',
  /** slate-500 */
  A = '#64748b',
  /** slate-700 */
  APrime = '#334155',
}

export enum ColorDark {
  /** white */
  V = 'white',
  /** indigo-400 */
  E = '#818cf8',
  /** blue-500 */
  EPrime = '#3b82f6',
  /** red-500 */
  B = '#ef4444',
  /** red-400 */
  BPrime = '#f87171',
  /** green-600 */
  S = '#16a34a',
  /** green-500 */
  SPrime = '#22c55e',
  /** yellow-600 */
  U = '#ca8a04',
  /** yellow-500 */
  UPrime = '#eab308',
  /** fucshia-500 */
  F = '#d946ef',
  /** fucshia-300 */
  FPrime = '#f0abfc',
  /** slate-400 */
  A = '#94a3b8',
  /** slate-300 */
  APrime = '#cbd5e1',
}

export const textColor: { [C in Color]: `text-[${C}]` } = /* tw */ {
  [Color.V]: 'text-[black]',
  [Color.E]: 'text-[#4f46e5]',
  [Color.EPrime]: 'text-[#1e40af]',
  [Color.B]: 'text-[#dc2626]',
  [Color.BPrime]: 'text-[#991b1b]',
  [Color.S]: 'text-[#15803d]',
  [Color.SPrime]: 'text-[#14532d]',
  [Color.U]: 'text-[#a16207]',
  [Color.UPrime]: 'text-[#713f12]',
  [Color.F]: 'text-[#c026d3]',
  [Color.FPrime]: 'text-[#86198f]',
  [Color.A]: 'text-[#64748b]',
  [Color.APrime]: 'text-[#334155]',
};

export const textColorDark: { [C in ColorDark]: `dark:text-[${C}]` } =
  /* tw */ {
    [ColorDark.V]: 'dark:text-[white]',
    [ColorDark.E]: 'dark:text-[#818cf8]',
    [ColorDark.EPrime]: 'dark:text-[#3b82f6]',
    [ColorDark.B]: 'dark:text-[#ef4444]',
    [ColorDark.BPrime]: 'dark:text-[#f87171]',
    [ColorDark.S]: 'dark:text-[#16a34a]',
    [ColorDark.SPrime]: 'dark:text-[#22c55e]',
    [ColorDark.U]: 'dark:text-[#ca8a04]',
    [ColorDark.UPrime]: 'dark:text-[#eab308]',
    [ColorDark.F]: 'dark:text-[#d946ef]',
    [ColorDark.FPrime]: 'dark:text-[#f0abfc]',
    [ColorDark.A]: 'dark:text-[#94a3b8]',
    [ColorDark.APrime]: 'dark:text-[#cbd5e1]',
  };
