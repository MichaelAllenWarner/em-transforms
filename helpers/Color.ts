export enum Color {
  /** For unprimed electric field */
  E = 'blue',
  /** For unprimed magnetic field */
  B = 'crimson',
  /** For boost-velocity */
  V = 'saddlebrown',
  /** For primed electric field */
  EPrime = 'purple',
  /** For primed magnetic field */
  BPrime = 'mediumvioletred',
  /** For unprimed Poynting vector */
  S = 'green',
  /** For primed Poynting vector */
  SPrime = 'darkslategray',
}

export const textColor: { [C in Color]: `text-[${C}]` } = /* tw */ {
  blue: 'text-[blue]',
  crimson: 'text-[crimson]',
  saddlebrown: 'text-[saddlebrown]',
  purple: 'text-[purple]',
  mediumvioletred: 'text-[mediumvioletred]',
  green: 'text-[green]',
  darkslategray: 'text-[darkslategray]',
};
