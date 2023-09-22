/*
  This module creates the hotkey character-combinations used in the app,
  and does so in a way that helps ensure that they don't "interfere"
  with each other. The idea is that each one should be unique (obvious),
  but also that no two should have parts that "overlap" (e.g., if one
  is `u+-`, we don't want another to be just `u`; and just to be safe,
  if possible we don't want any "modifier" keys to be used as "base" keys,
  though that part I think isn't strictly necessary).
*/

/** The single-key hotkeys (to be used without modifiers). */
const oneKeyHotkeys = {
  resetCamera: 'k', // because 'c' is taken ('k' for hard 'c'-sound)
  toggleComps: 'c',
  toggleS: 's',
  toggleU: 'w', // not 'u' to avoid conflict w/ 'u+' hotkeys ('w' for double-'u')
  toggleF: 'f',
  toggleA: 'a',
  toggleV: 'h', // not 'v' to avoid conflict w/ 'v+' hotkeys ('h' for 'hide')
  toggleEandB: 'd', // 'd' b/c it isn't used yet, I guess!
} as const;

const keys = {
  // 'base' keys
  oneKeys: Object.values(oneKeyHotkeys),
  cartesianBaseKeys: ['e', 'b'],
  sphericalBaseKeys: ['v', 'u'],
  particleBaseKeys: ['q', 'm'],

  // 'modifier' keys
  cartesianComponentKeys: ['x', 'y', 'z'],
  sphericalComponentKeys: ['r', 'p', 't'],
  upDownKeys: ['ArrowUp', 'ArrowDown'],
  resetKey: '0',
  flipKey: '-',
} as const;

/** All keys to be used in hot-keys. */
const allKeys = Object.values(keys).flat();

/*
  Make sure they're all unique. Note: we're grouping 'modifier' and 'base'
  keys together here, which may actually be stricter than is necessary.
  If more hotkeys have to be added and this becomes inconvenient, can
  try decoupling their uniqueness-checks (just be sure to test in several
  browsers in that case).
*/
if (new Set(allKeys).size !== allKeys.length) {
  const dupes = Array.from(
    new Set(allKeys.filter((e, i) => i !== allKeys.lastIndexOf(e)))
  );
  throw Error(
    `All keys for hotkeys must be unique, but they are not. Duplicates in \`allKeys\`: ${dupes}`
  );
}

const vectorCompHotkeys: {
  [Vector in
    | (typeof keys.cartesianBaseKeys)[number]
    | (typeof keys.sphericalBaseKeys)[number]]: {
    [Component in Vector extends (typeof keys.cartesianBaseKeys)[number]
      ? (typeof keys.cartesianComponentKeys)[number]
      : (typeof keys.sphericalComponentKeys)[number]]: {
      [Direction in (typeof keys.upDownKeys)[number]]: `${Vector}+${Component}+${Direction}`;
    };
  };
} = {
  e: {
    x: {
      ArrowUp: 'e+x+ArrowUp',
      ArrowDown: 'e+x+ArrowDown',
    },
    y: {
      ArrowUp: 'e+y+ArrowUp',
      ArrowDown: 'e+y+ArrowDown',
    },
    z: {
      ArrowUp: 'e+z+ArrowUp',
      ArrowDown: 'e+z+ArrowDown',
    },
  },
  b: {
    x: {
      ArrowUp: 'b+x+ArrowUp',
      ArrowDown: 'b+x+ArrowDown',
    },
    y: {
      ArrowUp: 'b+y+ArrowUp',
      ArrowDown: 'b+y+ArrowDown',
    },
    z: {
      ArrowUp: 'b+z+ArrowUp',
      ArrowDown: 'b+z+ArrowDown',
    },
  },
  v: {
    r: {
      ArrowUp: 'v+r+ArrowUp',
      ArrowDown: 'v+r+ArrowDown',
    },
    p: {
      ArrowUp: 'v+p+ArrowUp',
      ArrowDown: 'v+p+ArrowDown',
    },
    t: {
      ArrowUp: 'v+t+ArrowUp',
      ArrowDown: 'v+t+ArrowDown',
    },
  },
  u: {
    r: {
      ArrowUp: 'u+r+ArrowUp',
      ArrowDown: 'u+r+ArrowDown',
    },
    p: {
      ArrowUp: 'u+p+ArrowUp',
      ArrowDown: 'u+p+ArrowDown',
    },
    t: {
      ArrowUp: 'u+t+ArrowUp',
      ArrowDown: 'u+t+ArrowDown',
    },
  },
};

const vectorResetHotkeys: {
  [Vector in (typeof keys.sphericalBaseKeys)[number]]: `${Vector}+${typeof keys.resetKey}`;
} = {
  v: 'v+0',
  u: 'u+0',
};

const vectorFlipHotkeys: {
  [Vector in (typeof keys.sphericalBaseKeys)[number]]: `${Vector}+${typeof keys.flipKey}`;
} = {
  v: 'v+-',
  u: 'u+-',
};

const particleHotkeys: {
  [Quantity in (typeof keys.particleBaseKeys)[number]]: {
    [Direction in (typeof keys.upDownKeys)[number]]: `${Quantity}+${Direction}`;
  };
} = {
  q: {
    ArrowUp: 'q+ArrowUp',
    ArrowDown: 'q+ArrowDown',
  },
  m: {
    ArrowUp: 'm+ArrowUp',
    ArrowDown: 'm+ArrowDown',
  },
};

export const hotkeys = {
  oneKey: oneKeyHotkeys,
  vectorComp: vectorCompHotkeys,
  vectorReset: vectorResetHotkeys,
  vectorFlip: vectorFlipHotkeys,
  particle: particleHotkeys,
};
