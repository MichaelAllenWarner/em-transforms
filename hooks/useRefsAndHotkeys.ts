import { useCallback, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { OrbitControls } from 'three-stdlib';
import shallow from 'zustand/shallow';
import useStore, { State } from '../store/store';

const storeSelector = (state: State) => ({
  flipBoostVelocity: state.flipBoostVelocity,
  flipParticleVelocity: state.flipParticleVelocity,
});

const inputEvent = new Event('input', { bubbles: true });

export const useRefsAndHotkeys = () => {
  const { flipBoostVelocity, flipParticleVelocity } = useStore(
    storeSelector,
    shallow
  );

  // set up camera-reset hotkey

  const cameraRef = useRef<OrbitControls>(null);
  useHotkeys('k', () => {
    if (!cameraRef.current) return;
    cameraRef.current.reset();
  });

  // set up show/hide hotkeys

  const showCompsRef = useRef<HTMLInputElement>(null);
  const toggleComps = useCallback(() => {
    if (!showCompsRef.current || showCompsRef.current.disabled) return;
    showCompsRef.current.click();
  }, []);
  useHotkeys('c', toggleComps);

  const showSRef = useRef<HTMLInputElement>(null);
  const toggleS = useCallback(() => {
    if (!showSRef.current || showSRef.current.disabled) return;
    showSRef.current.click();
  }, []);
  useHotkeys('s', toggleS);

  const showURef = useRef<HTMLInputElement>(null);
  const toggleU = useCallback(() => {
    if (!showURef.current || showURef.current.disabled) return;
    showURef.current.click();
  }, []);
  useHotkeys('w', toggleU);

  const showFRef = useRef<HTMLInputElement>(null);
  const toggleF = useCallback(() => {
    if (!showFRef.current || showFRef.current.disabled) return;
    showFRef.current.click();
  }, []);
  useHotkeys('f', toggleF);

  const showARef = useRef<HTMLInputElement>(null);
  const toggleA = useCallback(() => {
    if (!showARef.current || showARef.current.disabled) return;
    showARef.current.click();
  }, []);
  useHotkeys('a', toggleA);

  const hideVRef = useRef<HTMLInputElement>(null);
  const toggleV = useCallback(() => {
    if (!hideVRef.current || hideVRef.current.disabled) return;
    hideVRef.current.click();
  }, []);
  useHotkeys('h', toggleV);

  // set up E hotkeys

  const eXRef = useRef<HTMLInputElement>(null);
  const eXUp = useCallback((event: KeyboardEvent) => {
    if (!eXRef.current) return;
    event.preventDefault();
    eXRef.current.stepUp();
    eXRef.current.dispatchEvent(inputEvent);
  }, []);
  const eXDown = useCallback((event: KeyboardEvent) => {
    if (!eXRef.current) return;
    event.preventDefault();
    eXRef.current.stepDown();
    eXRef.current.dispatchEvent(inputEvent);
  }, []);

  const eYRef = useRef<HTMLInputElement>(null);
  const eYUp = useCallback((event: KeyboardEvent) => {
    if (!eYRef.current) return;
    event.preventDefault();
    eYRef.current.stepUp();
    eYRef.current.dispatchEvent(inputEvent);
  }, []);
  const eYDown = useCallback((event: KeyboardEvent) => {
    if (!eYRef.current) return;
    event.preventDefault();
    eYRef.current.stepDown();
    eYRef.current.dispatchEvent(inputEvent);
  }, []);

  const eZRef = useRef<HTMLInputElement>(null);
  const eZUp = useCallback((event: KeyboardEvent) => {
    if (!eZRef.current) return;
    event.preventDefault();
    eZRef.current.stepUp();
    eZRef.current.dispatchEvent(inputEvent);
  }, []);
  const eZDown = useCallback((event: KeyboardEvent) => {
    if (!eZRef.current) return;
    event.preventDefault();
    eZRef.current.stepDown();
    eZRef.current.dispatchEvent(inputEvent);
  }, []);

  useHotkeys('e+x+up', eXUp);
  useHotkeys('e+x+down', eXDown);
  useHotkeys('e+y+up', eYUp);
  useHotkeys('e+y+down', eYDown);
  useHotkeys('e+z+up', eZUp);
  useHotkeys('e+z+down', eZDown);

  // set up B hotkeys

  const bXRef = useRef<HTMLInputElement>(null);
  const bXUp = useCallback((event: KeyboardEvent) => {
    if (!bXRef.current) return;
    event.preventDefault();
    bXRef.current.stepUp();
    bXRef.current.dispatchEvent(inputEvent);
  }, []);
  const bXDown = useCallback((event: KeyboardEvent) => {
    if (!bXRef.current) return;
    event.preventDefault();
    bXRef.current.stepDown();
    bXRef.current.dispatchEvent(inputEvent);
  }, []);

  const bYRef = useRef<HTMLInputElement>(null);
  const bYUp = useCallback((event: KeyboardEvent) => {
    if (!bYRef.current) return;
    event.preventDefault();
    bYRef.current.stepUp();
    bYRef.current.dispatchEvent(inputEvent);
  }, []);
  const bYDown = useCallback((event: KeyboardEvent) => {
    if (!bYRef.current) return;
    event.preventDefault();
    bYRef.current.stepDown();
    bYRef.current.dispatchEvent(inputEvent);
  }, []);

  const bZRef = useRef<HTMLInputElement>(null);
  const bZUp = useCallback((event: KeyboardEvent) => {
    if (!bZRef.current) return;
    event.preventDefault();
    bZRef.current.stepUp();
    bZRef.current.dispatchEvent(inputEvent);
  }, []);
  const bZDown = useCallback((event: KeyboardEvent) => {
    if (!bZRef.current) return;
    event.preventDefault();
    bZRef.current.stepDown();
    bZRef.current.dispatchEvent(inputEvent);
  }, []);

  useHotkeys('b+x+up', bXUp);
  useHotkeys('b+x+down', bXDown);
  useHotkeys('b+y+up', bYUp);
  useHotkeys('b+y+down', bYDown);
  useHotkeys('b+z+up', bZUp);
  useHotkeys('b+z+down', bZDown);

  // set up v hotkeys (boost velocity)

  const vRRef = useRef<HTMLInputElement>(null);
  const vRUp = useCallback((event: KeyboardEvent) => {
    if (!vRRef.current) return;
    event.preventDefault();
    vRRef.current.stepUp();
    vRRef.current.dispatchEvent(inputEvent);
  }, []);
  const vRDown = useCallback((event: KeyboardEvent) => {
    if (!vRRef.current) return;
    event.preventDefault();
    vRRef.current.stepDown();
    vRRef.current.dispatchEvent(inputEvent);
  }, []);

  const vPhiRef = useRef<HTMLInputElement>(null);
  const vPhiUp = useCallback((event: KeyboardEvent) => {
    if (!vPhiRef.current) return;
    event.preventDefault();
    vPhiRef.current.stepUp();
    vPhiRef.current.dispatchEvent(inputEvent);
  }, []);
  const vPhiDown = useCallback((event: KeyboardEvent) => {
    if (!vPhiRef.current) return;
    event.preventDefault();
    vPhiRef.current.stepDown();
    vPhiRef.current.dispatchEvent(inputEvent);
  }, []);

  const vThetaRef = useRef<HTMLInputElement>(null);
  const vThetaUp = useCallback((event: KeyboardEvent) => {
    if (!vThetaRef.current) return;
    event.preventDefault();
    vThetaRef.current.stepUp();
    vThetaRef.current.dispatchEvent(inputEvent);
  }, []);
  const vThetaDown = useCallback((event: KeyboardEvent) => {
    if (!vThetaRef.current) return;
    event.preventDefault();
    vThetaRef.current.stepDown();
    vThetaRef.current.dispatchEvent(inputEvent);
  }, []);

  const vResetRef = useRef<HTMLButtonElement>(null);
  const vReset = useCallback(() => {
    if (!vResetRef.current) return;
    vResetRef.current.click();
  }, []);

  useHotkeys('v+r+up', vRUp);
  useHotkeys('v+r+down', vRDown);
  useHotkeys('v+p+up', vPhiUp);
  useHotkeys('v+p+down', vPhiDown);
  useHotkeys('v+t+up', vThetaUp);
  useHotkeys('v+t+down', vThetaDown);
  useHotkeys('v+0', vReset);
  useHotkeys('v+-', flipBoostVelocity);

  // set up u hotkeys (particle velocity)

  const uRRef = useRef<HTMLInputElement>(null);
  const uRUp = useCallback((event: KeyboardEvent) => {
    if (!uRRef.current) return;
    event.preventDefault();
    uRRef.current.stepUp();
    uRRef.current.dispatchEvent(inputEvent);
  }, []);
  const uRDown = useCallback((event: KeyboardEvent) => {
    if (!uRRef.current) return;
    event.preventDefault();
    uRRef.current.stepDown();
    uRRef.current.dispatchEvent(inputEvent);
  }, []);

  const uPhiRef = useRef<HTMLInputElement>(null);
  const uPhiUp = useCallback((event: KeyboardEvent) => {
    if (!uPhiRef.current) return;
    event.preventDefault();
    uPhiRef.current.stepUp();
    uPhiRef.current.dispatchEvent(inputEvent);
  }, []);
  const uPhiDown = useCallback((event: KeyboardEvent) => {
    if (!uPhiRef.current) return;
    event.preventDefault();
    uPhiRef.current.stepDown();
    uPhiRef.current.dispatchEvent(inputEvent);
  }, []);

  const uThetaRef = useRef<HTMLInputElement>(null);
  const uThetaUp = useCallback((event: KeyboardEvent) => {
    if (!uThetaRef.current) return;
    event.preventDefault();
    uThetaRef.current.stepUp();
    uThetaRef.current.dispatchEvent(inputEvent);
  }, []);
  const uThetaDown = useCallback((event: KeyboardEvent) => {
    if (!uThetaRef.current) return;
    event.preventDefault();
    uThetaRef.current.stepDown();
    uThetaRef.current.dispatchEvent(inputEvent);
  }, []);

  const uResetRef = useRef<HTMLButtonElement>(null);
  const uReset = useCallback(() => {
    if (!uResetRef.current) return;
    uResetRef.current.click();
  }, []);

  useHotkeys('u+r+up', uRUp);
  useHotkeys('u+r+down', uRDown);
  useHotkeys('u+p+up', uPhiUp);
  useHotkeys('u+p+down', uPhiDown);
  useHotkeys('u+t+up', uThetaUp);
  useHotkeys('u+t+down', uThetaDown);
  useHotkeys('u+0', uReset);
  useHotkeys('u+-', flipParticleVelocity);

  // set up hotkeys for particle charge

  const qRef = useRef<HTMLInputElement>(null);
  const qUp = useCallback((event: KeyboardEvent) => {
    if (!qRef.current) return;
    event.preventDefault();
    qRef.current.stepUp();
    qRef.current.dispatchEvent(inputEvent);
  }, []);
  const qDown = useCallback((event: KeyboardEvent) => {
    if (!qRef.current) return;
    event.preventDefault();
    qRef.current.stepDown();
    qRef.current.dispatchEvent(inputEvent);
  }, []);

  useHotkeys('q+up', qUp);
  useHotkeys('q+down', qDown);

  // set up hotkeys for particle mass

  const mRef = useRef<HTMLInputElement>(null);
  const mUp = useCallback((event: KeyboardEvent) => {
    if (!mRef.current) return;
    event.preventDefault();
    mRef.current.stepUp();
    mRef.current.dispatchEvent(inputEvent);
  }, []);
  const mDown = useCallback((event: KeyboardEvent) => {
    if (!mRef.current) return;
    event.preventDefault();
    mRef.current.stepDown();
    mRef.current.dispatchEvent(inputEvent);
  }, []);

  useHotkeys('m+up', mUp);
  useHotkeys('m+down', mDown);

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
