import { RefObject, useCallback, useMemo, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { OrbitControls } from 'three-stdlib';
import { shallow } from 'zustand/shallow';
import useStore, { State } from '../store/store';
import { hotkeys } from '../helpers/hotkeys';

const storeSelector = (state: State) => ({
  flipBoostVelocity: state.flipBoostVelocity,
  flipParticleVelocity: state.flipParticleVelocity,
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
  const { flipBoostVelocity: vFlip, flipParticleVelocity: uFlip } = useStore(
    storeSelector,
    shallow
  );

  // set up camera ref and camera-reset hotkey

  const cameraRef = useRef<OrbitControls>(null);
  const resetCamera = useCallback(() => cameraRef.current?.reset(), []);
  useHotkeys(hotkeys.oneKey.resetCamera, resetCamera);

  // set up show/hide refs and hotkeys

  const showCompsRef = useRef<HTMLInputElement>(null);
  const toggleComps = useMemo(() => click(showCompsRef), []);
  useHotkeys(hotkeys.oneKey.toggleComps, toggleComps);

  const showSRef = useRef<HTMLInputElement>(null);
  const toggleS = useMemo(() => click(showSRef), []);
  useHotkeys(hotkeys.oneKey.toggleS, toggleS);

  const showURef = useRef<HTMLInputElement>(null);
  const toggleU = useMemo(() => click(showURef), []);
  useHotkeys(hotkeys.oneKey.toggleU, toggleU);

  const showFRef = useRef<HTMLInputElement>(null);
  const toggleF = useMemo(() => click(showFRef), []);
  useHotkeys(hotkeys.oneKey.toggleF, toggleF);

  const showARef = useRef<HTMLInputElement>(null);
  const toggleA = useMemo(() => click(showARef), []);
  useHotkeys(hotkeys.oneKey.toggleA, toggleA);

  const hideVRef = useRef<HTMLInputElement>(null);
  const toggleV = useMemo(() => click(hideVRef), []);
  useHotkeys(hotkeys.oneKey.toggleV, toggleV);

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

  useHotkeys(hotkeys.vectorComp.e.x.up, eXUp);
  useHotkeys(hotkeys.vectorComp.e.x.down, eXDown);
  useHotkeys(hotkeys.vectorComp.e.y.up, eYUp);
  useHotkeys(hotkeys.vectorComp.e.y.down, eYDown);
  useHotkeys(hotkeys.vectorComp.e.z.up, eZUp);
  useHotkeys(hotkeys.vectorComp.e.z.down, eZDown);

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

  useHotkeys(hotkeys.vectorComp.b.x.up, bXUp);
  useHotkeys(hotkeys.vectorComp.b.x.down, bXDown);
  useHotkeys(hotkeys.vectorComp.b.y.up, bYUp);
  useHotkeys(hotkeys.vectorComp.b.y.down, bYDown);
  useHotkeys(hotkeys.vectorComp.b.z.up, bZUp);
  useHotkeys(hotkeys.vectorComp.b.z.down, bZDown);

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

  const vResetRef = useRef<HTMLButtonElement>(null);
  const vReset = useMemo(() => click(vResetRef), []);

  useHotkeys(hotkeys.vectorComp.v.r.up, vRUp);
  useHotkeys(hotkeys.vectorComp.v.r.down, vRDown);
  useHotkeys(hotkeys.vectorComp.v.p.up, vPhiUp);
  useHotkeys(hotkeys.vectorComp.v.p.down, vPhiDown);
  useHotkeys(hotkeys.vectorComp.v.t.up, vThetaUp);
  useHotkeys(hotkeys.vectorComp.v.t.down, vThetaDown);
  useHotkeys(hotkeys.vectorReset.v, vReset);
  useHotkeys(hotkeys.vectorFlip.v, vFlip);

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

  const uResetRef = useRef<HTMLButtonElement>(null);
  const uReset = useMemo(() => click(uResetRef), []);

  useHotkeys(hotkeys.vectorComp.u.r.up, uRUp);
  useHotkeys(hotkeys.vectorComp.u.r.down, uRDown);
  useHotkeys(hotkeys.vectorComp.u.p.up, uPhiUp);
  useHotkeys(hotkeys.vectorComp.u.p.down, uPhiDown);
  useHotkeys(hotkeys.vectorComp.u.t.up, uThetaUp);
  useHotkeys(hotkeys.vectorComp.u.t.down, uThetaDown);
  useHotkeys(hotkeys.vectorReset.u, uReset);
  useHotkeys(hotkeys.vectorFlip.u, uFlip);

  // set up ref and hotkeys for particle charge

  const qRef = useRef<HTMLInputElement>(null);
  const qUp = useMemo(() => stepUp(qRef), []);
  const qDown = useMemo(() => stepDown(qRef), []);

  useHotkeys(hotkeys.particle.q.up, qUp);
  useHotkeys(hotkeys.particle.q.down, qDown);

  // set up ref and hotkeys for particle mass

  const mRef = useRef<HTMLInputElement>(null);
  const mUp = useMemo(() => stepUp(mRef), []);
  const mDown = useMemo(() => stepDown(mRef), []);

  useHotkeys(hotkeys.particle.m.up, mUp);
  useHotkeys(hotkeys.particle.m.down, mDown);

  return {
    cameraRef,
    showCompsRef,
    showSRef,
    showURef,
    showFRef,
    showARef,
    hideVRef,
    eXRef,
    eYRef,
    eZRef,
    bXRef,
    bYRef,
    bZRef,
    vRRef,
    vPhiRef,
    vThetaRef,
    vResetRef,
    uRRef,
    uPhiRef,
    uThetaRef,
    uResetRef,
    qRef,
    mRef,
  };
};
