import { RefObject, useCallback, useMemo, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { OrbitControls } from 'three-stdlib';
import useStore, { State } from '../store/store';
import { hotkeys } from '../helpers/hotkeys';
import {
  announceUFlip,
  announceUReset,
  announceVFlip,
  announceVReset,
  announceCameraReset,
  announceEFlip,
  announceBFlip,
  announceRotateX,
  announceRotateY,
  announceRotateZ,
} from '../helpers/announce';

const storeSelector = (state: State) => ({
  flipBoostVelocity: state.flipBoostVelocity,
  flipParticleVelocity: state.flipParticleVelocity,
  resetBoostVelocity: state.resetBoostVelocity,
  resetParticleVelocity: state.resetParticleVelocity,
  flipEField: state.flipEField,
  flipBField: state.flipBField,
  rotateFieldsX: state.rotateFieldsX,
  rotateFieldsY: state.rotateFieldsY,
  rotateFieldsZ: state.rotateFieldsZ,
});

const inputEvent = new Event('input', { bubbles: true });

/** Use like `useMemo(() => click(ref), [])` */
const click = (ref: RefObject<HTMLInputElement | HTMLButtonElement>) => () => {
  if (!ref.current || ref.current.disabled) return;
  ref.current.click();
};

/** Use like `useMemo(() => stepUp(ref), [])` */
const stepUp = (ref: RefObject<HTMLInputElement>) => (event: KeyboardEvent) => {
  if (!ref.current || ref.current.disabled) return;
  event.preventDefault();
  ref.current.stepUp();
  ref.current.dispatchEvent(inputEvent);
};

/** Use like `useMemo(() => stepDown(ref), [])` */
const stepDown =
  (ref: RefObject<HTMLInputElement>) => (event: KeyboardEvent) => {
    if (!ref.current || ref.current.disabled) return;
    event.preventDefault();
    ref.current.stepDown();
    ref.current.dispatchEvent(inputEvent);
  };

export const useRefsAndHotkeys = () => {
  const {
    flipBoostVelocity: rawVFlip,
    flipParticleVelocity: rawUFlip,
    resetBoostVelocity: rawVReset,
    resetParticleVelocity: rawUReset,
    flipEField: rawEFlip,
    flipBField: rawBFlip,
    rotateFieldsX: rawRotateX,
    rotateFieldsY: rawRotateY,
    rotateFieldsZ: rawRotateZ,
  } = useStore(storeSelector);

  const vFlip = useCallback(() => {
    rawVFlip();
    announceVFlip();
  }, [rawVFlip]);

  const uFlip = useCallback(() => {
    rawUFlip();
    announceUFlip();
  }, [rawUFlip]);

  const vReset = useCallback(() => {
    rawVReset();
    announceVReset();
  }, [rawVReset]);

  const uReset = useCallback(() => {
    rawUReset();
    announceUReset();
  }, [rawUReset]);

  const eFlip = useCallback(() => {
    rawEFlip();
    announceEFlip();
  }, [rawEFlip]);

  const bFlip = useCallback(() => {
    rawBFlip();
    announceBFlip();
  }, [rawBFlip]);

  const rotateX = useCallback(() => {
    rawRotateX();
    announceRotateX();
  }, [rawRotateX]);
  const rotateY = useCallback(() => {
    rawRotateY();
    announceRotateY();
  }, [rawRotateY]);
  const rotateZ = useCallback(() => {
    rawRotateZ();
    announceRotateZ();
  }, [rawRotateZ]);

  // set up camera ref and camera-reset hotkey

  const cameraRef = useRef<OrbitControls>(null);
  const resetCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.reset();
      announceCameraReset();
    }
  }, []);
  useHotkeys(hotkeys.oneKey.resetCamera, resetCamera, {
    enableOnFormTags: true,
  });

  // set up show/hide refs and hotkeys

  const showCompsRef = useRef<HTMLInputElement>(null);
  const toggleComps = useMemo(() => click(showCompsRef), []);
  useHotkeys(hotkeys.oneKey.toggleComps, toggleComps, {
    enableOnFormTags: true,
  });

  const showSRef = useRef<HTMLInputElement>(null);
  const toggleS = useMemo(() => click(showSRef), []);
  useHotkeys(hotkeys.oneKey.toggleS, toggleS, { enableOnFormTags: true });

  const showURef = useRef<HTMLInputElement>(null);
  const toggleU = useMemo(() => click(showURef), []);
  useHotkeys(hotkeys.oneKey.toggleU, toggleU, { enableOnFormTags: true });

  const showFRef = useRef<HTMLInputElement>(null);
  const toggleF = useMemo(() => click(showFRef), []);
  useHotkeys(hotkeys.oneKey.toggleF, toggleF, { enableOnFormTags: true });

  const showARef = useRef<HTMLInputElement>(null);
  const toggleA = useMemo(() => click(showARef), []);
  useHotkeys(hotkeys.oneKey.toggleA, toggleA, { enableOnFormTags: true });

  const hideVRef = useRef<HTMLInputElement>(null);
  const toggleV = useMemo(() => click(hideVRef), []);
  useHotkeys(hotkeys.oneKey.toggleV, toggleV, { enableOnFormTags: true });

  const hideEandBRef = useRef<HTMLInputElement>(null);
  const toggleEandB = useMemo(() => click(hideEandBRef), []);
  useHotkeys(hotkeys.oneKey.toggleEandB, toggleEandB, {
    enableOnFormTags: true,
  });

  const showInvariantsRef = useRef<HTMLInputElement>(null);
  const toggleInvariants = useMemo(() => click(showInvariantsRef), []);
  useHotkeys(hotkeys.oneKey.toggleInvariants, toggleInvariants, {
    enableOnFormTags: true,
  });

  // set up E refs and hotkeys

  const eXRef = useRef<HTMLInputElement>(null);
  const eXUp = useMemo(() => stepUp(eXRef), []);
  const eXDown = useMemo(() => stepDown(eXRef), []);

  const eYRef = useRef<HTMLInputElement>(null);
  const eYUp = useMemo(() => stepUp(eYRef), []);
  const eYDown = useMemo(() => stepDown(eYRef), []);

  const eZRef = useRef<HTMLInputElement>(null);
  const eZUp = useMemo(() => stepUp(eZRef), []);
  const eZDown = useMemo(() => stepDown(eZRef), []);

  useHotkeys(hotkeys.vectorComp.e.x.ArrowUp, eXUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorComp.e.x.ArrowDown, eXDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.e.y.ArrowUp, eYUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorComp.e.y.ArrowDown, eYDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.e.z.ArrowUp, eZUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorComp.e.z.ArrowDown, eZDown, {
    enableOnFormTags: true,
  });

  // set up B refs and hotkeys

  const bXRef = useRef<HTMLInputElement>(null);
  const bXUp = useMemo(() => stepUp(bXRef), []);
  const bXDown = useMemo(() => stepDown(bXRef), []);

  const bYRef = useRef<HTMLInputElement>(null);
  const bYUp = useMemo(() => stepUp(bYRef), []);
  const bYDown = useMemo(() => stepDown(bYRef), []);

  const bZRef = useRef<HTMLInputElement>(null);
  const bZUp = useMemo(() => stepUp(bZRef), []);
  const bZDown = useMemo(() => stepDown(bZRef), []);

  useHotkeys(hotkeys.vectorComp.b.x.ArrowUp, bXUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorComp.b.x.ArrowDown, bXDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.b.y.ArrowUp, bYUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorComp.b.y.ArrowDown, bYDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.b.z.ArrowUp, bZUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorComp.b.z.ArrowDown, bZDown, {
    enableOnFormTags: true,
  });

  // set up v refs and hotkeys (boost velocity)

  const vRRef = useRef<HTMLInputElement>(null);
  const vRUp = useMemo(() => stepUp(vRRef), []);
  const vRDown = useMemo(() => stepDown(vRRef), []);

  const vPhiRef = useRef<HTMLInputElement>(null);
  const vPhiUp = useMemo(() => stepUp(vPhiRef), []);
  const vPhiDown = useMemo(() => stepDown(vPhiRef), []);

  const vThetaRef = useRef<HTMLInputElement>(null);
  const vThetaUp = useMemo(() => stepUp(vThetaRef), []);
  const vThetaDown = useMemo(() => stepDown(vThetaRef), []);

  useHotkeys(hotkeys.vectorComp.v.r.ArrowUp, vRUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorComp.v.r.ArrowDown, vRDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.v.p.ArrowUp, vPhiUp, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.v.p.ArrowDown, vPhiDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.v.t.ArrowUp, vThetaUp, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.v.t.ArrowDown, vThetaDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorReset.v, vReset, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorFlip.v, vFlip, { enableOnFormTags: true });

  // set up u refs and hotkeys (particle velocity)

  const uRRef = useRef<HTMLInputElement>(null);
  const uRUp = useMemo(() => stepUp(uRRef), []);
  const uRDown = useMemo(() => stepDown(uRRef), []);

  const uPhiRef = useRef<HTMLInputElement>(null);
  const uPhiUp = useMemo(() => stepUp(uPhiRef), []);
  const uPhiDown = useMemo(() => stepDown(uPhiRef), []);

  const uThetaRef = useRef<HTMLInputElement>(null);
  const uThetaUp = useMemo(() => stepUp(uThetaRef), []);
  const uThetaDown = useMemo(() => stepDown(uThetaRef), []);

  useHotkeys(hotkeys.vectorComp.u.r.ArrowUp, uRUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorComp.u.r.ArrowDown, uRDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.u.p.ArrowUp, uPhiUp, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.u.p.ArrowDown, uPhiDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.u.t.ArrowUp, uThetaUp, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorComp.u.t.ArrowDown, uThetaDown, {
    enableOnFormTags: true,
  });
  useHotkeys(hotkeys.vectorReset.u, uReset, { enableOnFormTags: true });
  useHotkeys(hotkeys.vectorFlip.u, uFlip, { enableOnFormTags: true });
  useHotkeys(hotkeys.fieldFlip.e, eFlip, { enableOnFormTags: true });
  useHotkeys(hotkeys.fieldFlip.b, bFlip, { enableOnFormTags: true });
  useHotkeys(hotkeys.oneKey.rotateFieldsX, rotateX);
  useHotkeys(hotkeys.oneKey.rotateFieldsY, rotateY);
  useHotkeys(hotkeys.oneKey.rotateFieldsZ, rotateZ);

  // set up ref and hotkeys for particle charge

  const qRef = useRef<HTMLInputElement>(null);
  const qUp = useMemo(() => stepUp(qRef), []);
  const qDown = useMemo(() => stepDown(qRef), []);

  useHotkeys(hotkeys.particle.q.ArrowUp, qUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.particle.q.ArrowDown, qDown, { enableOnFormTags: true });

  // set up ref and hotkeys for particle mass

  const mRef = useRef<HTMLInputElement>(null);
  const mUp = useMemo(() => stepUp(mRef), []);
  const mDown = useMemo(() => stepDown(mRef), []);

  useHotkeys(hotkeys.particle.m.ArrowUp, mUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.particle.m.ArrowDown, mDown, { enableOnFormTags: true });

  return {
    cameraRef,
    showCompsRef,
    showSRef,
    showURef,
    showFRef,
    showARef,
    hideVRef,
    hideEandBRef,
    showInvariantsRef,
    eXRef,
    eYRef,
    eZRef,
    bXRef,
    bYRef,
    bZRef,
    vRRef,
    vPhiRef,
    vThetaRef,
    uRRef,
    uPhiRef,
    uThetaRef,
    qRef,
    mRef,
    vFlip,
    uFlip,
    vReset,
    uReset,
    eFlip,
    bFlip,
    rotateX,
    rotateY,
    rotateZ,
  };
};
