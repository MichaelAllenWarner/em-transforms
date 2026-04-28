let tick = 0;
const announce = (message: string) => {
  if (typeof window === 'undefined') return;

  const announcer = document.getElementById('aria-announcer');
  if (!announcer) {
    console.warn('No aria-announcer found');
    return;
  }

  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message + '\u200B'.repeat(tick++ % 2);
  }, 50);
};

export const announceVFlip = () => {
  announce('Boost velocity flipped');
};

export const announceVReset = () => {
  announce('Boost velocity reset');
};

export const announceUFlip = () => {
  announce('Particle velocity flipped');
};

export const announceUReset = () => {
  announce('Particle velocity reset');
};

export const announceCameraReset = () => {
  announce('Camera reset');
};
