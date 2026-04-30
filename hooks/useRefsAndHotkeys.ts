import { RefObject, useCallback, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { OrbitControls } from 'three-stdlib';
import useStore, { State } from '../store/store';
import { useShallow } from 'zustand/react/shallow';
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

const click = (ref: RefObject<HTMLInputElement | HTMLButtonElement | null>) => () => {
  if (!ref.current || ref.current.disabled) return;
  ref.current.click();
};

const stepUp = (ref: RefObject<HTMLInputElement | null>) => (event: KeyboardEvent) => {
  if (!ref.current || ref.current.disabled) return;
  event.preventDefault();
  ref.current.stepUp();
  ref.current.dispatchEvent(inputEvent);
};

const stepDown =
  (ref: RefObject<HTMLInputElement | null>) => (event: KeyboardEvent) => {
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
  } = useStore(useShallow(storeSelector));

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
  const toggleComps = useCallback(() => click(showCompsRef)(), []);
  useHotkeys(hotkeys.oneKey.toggleComps, toggleComps, {
    enableOnFormTags: true,
  });

  const showSRef = useRef<HTMLInputElement>(null);
  const toggleS = useCallback(() => click(showSRef)(), []);
  useHotkeys(hotkeys.oneKey.toggleS, toggleS, { enableOnFormTags: true });

  const showURef = useRef<HTMLInputElement>(null);
  const toggleU = useCallback(() => click(showURef)(), []);
  useHotkeys(hotkeys.oneKey.toggleU, toggleU, { enableOnFormTags: true });

  const showFRef = useRef<HTMLInputElement>(null);
  const toggleF = useCallback(() => click(showFRef)(), []);
  useHotkeys(hotkeys.oneKey.toggleF, toggleF, { enableOnFormTags: true });

  const showARef = useRef<HTMLInputElement>(null);
  const toggleA = useCallback(() => click(showARef)(), []);
  useHotkeys(hotkeys.oneKey.toggleA, toggleA, { enableOnFormTags: true });

  const hideVRef = useRef<HTMLInputElement>(null);
  const toggleV = useCallback(() => click(hideVRef)(), []);
  useHotkeys(hotkeys.oneKey.toggleV, toggleV, { enableOnFormTags: true });

  const hideEandBRef = useRef<HTMLInputElement>(null);
  const toggleEandB = useCallback(() => click(hideEandBRef)(), []);
  useHotkeys(hotkeys.oneKey.toggleEandB, toggleEandB, {
    enableOnFormTags: true,
  });

  const showInvariantsRef = useRef<HTMLInputElement>(null);
  const toggleInvariants = useCallback(() => click(showInvariantsRef)(), []);
  useHotkeys(hotkeys.oneKey.toggleInvariants, toggleInvariants, {
    enableOnFormTags: true,
  });

  // set up E refs and hotkeys

  const eXRef = useRef<HTMLInputElement>(null);
  const eXUp = useCallback((e: KeyboardEvent) => stepUp(eXRef)(e), []);
  const eXDown = useCallback((e: KeyboardEvent) => stepDown(eXRef)(e), []);

  const eYRef = useRef<HTMLInputElement>(null);
  const eYUp = useCallback((e: KeyboardEvent) => stepUp(eYRef)(e), []);
  const eYDown = useCallback((e: KeyboardEvent) => stepDown(eYRef)(e), []);

  const eZRef = useRef<HTMLInputElement>(null);
  const eZUp = useCallback((e: KeyboardEvent) => stepUp(eZRef)(e), []);
  const eZDown = useCallback((e: KeyboardEvent) => stepDown(eZRef)(e), []);

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
  const bXUp = useCallback((e: KeyboardEvent) => stepUp(bXRef)(e), []);
  const bXDown = useCallback((e: KeyboardEvent) => stepDown(bXRef)(e), []);

  const bYRef = useRef<HTMLInputElement>(null);
  const bYUp = useCallback((e: KeyboardEvent) => stepUp(bYRef)(e), []);
  const bYDown = useCallback((e: KeyboardEvent) => stepDown(bYRef)(e), []);

  const bZRef = useRef<HTMLInputElement>(null);
  const bZUp = useCallback((e: KeyboardEvent) => stepUp(bZRef)(e), []);
  const bZDown = useCallback((e: KeyboardEvent) => stepDown(bZRef)(e), []);

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
  const vRUp = useCallback((e: KeyboardEvent) => stepUp(vRRef)(e), []);
  const vRDown = useCallback((e: KeyboardEvent) => stepDown(vRRef)(e), []);

  const vPhiRef = useRef<HTMLInputElement>(null);
  const vPhiUp = useCallback((e: KeyboardEvent) => stepUp(vPhiRef)(e), []);
  const vPhiDown = useCallback((e: KeyboardEvent) => stepDown(vPhiRef)(e), []);

  const vThetaRef = useRef<HTMLInputElement>(null);
  const vThetaUp = useCallback((e: KeyboardEvent) => stepUp(vThetaRef)(e), []);
  const vThetaDown = useCallback((e: KeyboardEvent) => stepDown(vThetaRef)(e), []);

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
  const uRUp = useCallback((e: KeyboardEvent) => stepUp(uRRef)(e), []);
  const uRDown = useCallback((e: KeyboardEvent) => stepDown(uRRef)(e), []);

  const uPhiRef = useRef<HTMLInputElement>(null);
  const uPhiUp = useCallback((e: KeyboardEvent) => stepUp(uPhiRef)(e), []);
  const uPhiDown = useCallback((e: KeyboardEvent) => stepDown(uPhiRef)(e), []);

  const uThetaRef = useRef<HTMLInputElement>(null);
  const uThetaUp = useCallback((e: KeyboardEvent) => stepUp(uThetaRef)(e), []);
  const uThetaDown = useCallback((e: KeyboardEvent) => stepDown(uThetaRef)(e), []);

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
  const qUp = useCallback((e: KeyboardEvent) => stepUp(qRef)(e), []);
  const qDown = useCallback((e: KeyboardEvent) => stepDown(qRef)(e), []);

  useHotkeys(hotkeys.particle.q.ArrowUp, qUp, { enableOnFormTags: true });
  useHotkeys(hotkeys.particle.q.ArrowDown, qDown, { enableOnFormTags: true });

  // set up ref and hotkeys for particle mass

  const mRef = useRef<HTMLInputElement>(null);
  const mUp = useCallback((e: KeyboardEvent) => stepUp(mRef)(e), []);
  const mDown = useCallback((e: KeyboardEvent) => stepDown(mRef)(e), []);

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
