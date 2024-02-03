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

export const textColor: { [C in Color]: `text-[${C}] dark:text-white` } =
  /* tw */ {
    [Color.V]: 'text-[black] dark:text-white',
    [Color.E]: 'text-[#4f46e5] dark:text-white',
    [Color.EPrime]: 'text-[#1e40af] dark:text-white',
    [Color.B]: 'text-[#dc2626] dark:text-white',
    [Color.BPrime]: 'text-[#991b1b] dark:text-white',
    [Color.S]: 'text-[#15803d] dark:text-white',
    [Color.SPrime]: 'text-[#14532d] dark:text-white',
    [Color.U]: 'text-[#a16207] dark:text-white',
    [Color.UPrime]: 'text-[#713f12] dark:text-white',
    [Color.F]: 'text-[#c026d3] dark:text-white',
    [Color.FPrime]: 'text-[#86198f] dark:text-white',
    [Color.A]: 'text-[#64748b] dark:text-white',
    [Color.APrime]: 'text-[#334155] dark:text-white',
  };
