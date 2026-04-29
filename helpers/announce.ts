export const ANNOUNCER_ID = 'aria-announcer';

let tick = 0;
const CLEAR_AFTER_MS = 10_000;

let latestAnnouncementId = 0;
let pendingSetId: ReturnType<typeof setTimeout> | null = null;
let pendingClearId: ReturnType<typeof setTimeout> | null = null;

const announce = (message: string) => {
  if (typeof window === 'undefined') return;

  const announcer = document.getElementById(ANNOUNCER_ID);
  if (!announcer) {
    console.warn('No aria-announcer found');
    return;
  }

  latestAnnouncementId += 1;
  const announcementId = latestAnnouncementId;

  if (pendingSetId) {
    clearTimeout(pendingSetId);
    pendingSetId = null;
  }
  if (pendingClearId) {
    clearTimeout(pendingClearId);
    pendingClearId = null;
  }

  announcer.textContent = '';
  pendingSetId = setTimeout(() => {
    if (latestAnnouncementId !== announcementId) return;
    announcer.textContent = message + '\u200B'.repeat(tick++ % 2);
  }, 50);

  pendingClearId = setTimeout(() => {
    if (latestAnnouncementId !== announcementId) return;
    announcer.textContent = '';
  }, CLEAR_AFTER_MS);
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
