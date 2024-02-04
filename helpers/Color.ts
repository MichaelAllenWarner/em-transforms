// All colors taken from the Tailwind color palette https://tailwindcss.com/docs/customizing-colors

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

export enum ColorDark {
  /** For boost-velocity */
  V = 'white',
  /** For unprimed electric field */
  E = '#818cf8',
  /** For primed electric field */
  EPrime = '#3b82f6',
  /** For unprimed magnetic field */
  B = '#ef4444',
  /** For primed magnetic field */
  BPrime = '#f87171',
  /** For unprimed Poynting vector */
  S = '#16a34a',
  /** For primed Poynting vector */
  SPrime = '#22c55e',
  /** For unprimed particle-velocity */
  U = '#ca8a04',
  /** For primed particle-velocity */
  UPrime = '#eab308',
  /** For unprimed Lorentz force */
  F = '#d946ef',
  /** For primed Lorentz force */
  FPrime = '#f0abfc',
  /** For unprimed particle-acceleration */
  A = '#94a3b8',
  /** For primed particle-acceleration */
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
