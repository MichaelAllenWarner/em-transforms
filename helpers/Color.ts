export enum Color {
  /** For boost-velocity */
  V = 'black',
  /** For unprimed electric field */
  E = '#4f46e5',
  /** For primed electric field */
  EPrime = '#1e40af',
  /** For unprimed magnetic field */
  B = '#dc2626',
  /** For primed magnetic field */
  BPrime = '#991b1b',
  /** For unprimed Poynting vector */
  S = '#15803d',
  /** For primed Poynting vector */
  SPrime = '#14532d',
  /** For unprimed particle-velocity */
  U = '#a16207',
  /** For primed particle-velocity */
  UPrime = '#713f12',
  /** For unprimed Lorentz force */
  F = '#c026d3',
  /** For primed Lorentz force */
  FPrime = '#86198f',
  /** For unprimed particle-acceleration */
  A = '#64748b',
  /** For primed particle-acceleration */
  APrime = '#334155',
}

export const textColor: { [C in Color]: `text-[${C}]` } = /* tw */ {
  black: 'text-[black]',
  '#4f46e5': 'text-[#4f46e5]',
  '#1e40af': 'text-[#1e40af]',
  '#dc2626': 'text-[#dc2626]',
  '#991b1b': 'text-[#991b1b]',
  '#15803d': 'text-[#15803d]',
  '#14532d': 'text-[#14532d]',
  '#a16207': 'text-[#a16207]',
  '#713f12': 'text-[#713f12]',
  '#c026d3': 'text-[#c026d3]',
  '#86198f': 'text-[#86198f]',
  '#64748b': 'text-[#64748b]',
  '#334155': 'text-[#334155]',
};
