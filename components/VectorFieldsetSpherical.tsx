import { ChangeEvent, Fragment, memo, RefObject, useCallback } from 'react';
import { Color, ColorDark, textColor, textColorDark } from '../helpers/Color';
import { round } from '../helpers/round';
import { SphericalComponents } from '../store/store';
import VectorFieldset from './VectorFieldset';

const trueMod = (a: number, b: number) => ((a % b) + b) % b;
const radToDeg = (n: number) => (n * 180) / Math.PI;
const degToRad = (n: number) => (n * Math.PI) / 180;

const velocityMin = 0;
const velocityMax = 0.9999;
const velocityStep = 0.01;

interface Props {
  color: Color;
  colorDark: ColorDark;
  legend: string;
  r: number;
  phi: number;
  theta: number;
  rDisabled?: boolean;
  phiDisabled?: boolean;
  thetaDisabled?: boolean;
  rRef?: RefObject<HTMLInputElement>;
  phiRef?: RefObject<HTMLInputElement>;
  thetaRef?: RefObject<HTMLInputElement>;
  rSetter?: (newComponent: SphericalComponents[number]) => void;
  phiSetter?: (newComponent: SphericalComponents[number]) => void;
  thetaSetter?: (newComponent: SphericalComponents[number]) => void;
  flipper?: () => void;
  /** If `true`, will keep the `r` component less than 1. */
  isVelocity?: boolean;
  isPrime?: boolean;
  x?: number;
  y?: number;
  z?: number;
  reverseHotkey?: string;
}

const VectorFieldsetSpherical = memo(
  ({
    color,
    colorDark,
    legend,
    r,
    phi,
    theta,
    rRef,
    phiRef,
    thetaRef,
    rSetter,
    phiSetter,
    thetaSetter,
    rDisabled,
    phiDisabled,
    thetaDisabled,
    isVelocity,
    flipper,
    isPrime,
    x,
    y,
    z,
    reverseHotkey,
  }: Props) => {
    const onChangeR = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!rSetter) return;
        let n = e.target.valueAsNumber;
        if (isVelocity) {
          if (n >= 1) n = velocityMax;
        }
        if (n <= 0 || isNaN(n)) n = 0;
        rSetter(n);
      },
      [rSetter, isVelocity],
    );

    const onChangePhi = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!phiSetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        phiSetter(degToRad(n));
      },
      [phiSetter],
    );

    const onChangeTheta = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!thetaSetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        thetaSetter(degToRad(n));
      },
      [thetaSetter],
    );

    return (
      <fieldset className={`${textColor[color]} ${textColorDark[colorDark]}`}>
        <legend>{legend}</legend>
        {flipper && (
          <div>
            <button type="button" onClick={flipper}>
              Reverse direction
              {reverseHotkey ? (
                <>
                  . Hotkey:{' '}
                  {reverseHotkey.split('+').map((s, i, a) => (
                    <Fragment key={i}>
                      <kbd>{s}</kbd>
                      {i === a.length - 1 ? '' : ' + '}
                    </Fragment>
                  ))}
                </>
              ) : (
                <></>
              )}
            </button>
          </div>
        )}
        <div className="flex flex-col gap-3 leading-none">
          {['r', 'φ', 'θ'].map((e, i) => {
            const isR = i === 0;
            const value = isR
              ? round(r)
              : round(trueMod(radToDeg([phi, theta][i - 1]), 360));
            const disabled = [rDisabled, phiDisabled, thetaDisabled][i];
            const useSlider = !disabled;
            const setter = [rSetter, phiSetter, thetaSetter][i];
            const useOnChange = setter && !disabled;
            const onChange =
              useOnChange && [onChangeR, onChangePhi, onChangeTheta][i];
            const ref = !disabled && [rRef, phiRef, thetaRef][i];

            return (
              <div key={i}>
                <label className="flex">
                  <span className="shrink-0">
                    {e} {isPrime && '′'} {isR ? '' : ' (°)'}
                  </span>
                  <span className="flex flex-col gap-2">
                    {useSlider ? (
                      <span className="safari-only-range-wrapper">
                        <input
                          type="range"
                          value={value}
                          {...(isR && isVelocity
                            ? {
                                step: String(velocityStep),
                                min: String(velocityMin),
                                max: String(velocityMax),
                              }
                            : {
                                ...{ step: String(1), min: '0', max: '359' },
                              })}
                          {...(onChange ? { onChange } : {})}
                        />
                      </span>
                    ) : null}
                    <input
                      value={value}
                      type="number"
                      {...(useSlider ? { 'aria-label': e } : {})}
                      {...(isR && isVelocity && !disabled
                        ? {
                            step: String(velocityStep),
                            min: String(velocityMin),
                            max: String(velocityMax),
                          }
                        : {
                            ...(!disabled ? { step: String(5) } : {}),
                          })}
                      {...(disabled ? { disabled } : {})}
                      {...(onChange ? { onChange } : {})}
                      {...(ref ? { ref } : {})}
                    />
                  </span>
                </label>
              </div>
            );
          })}
          {typeof x === 'number' &&
            typeof y === 'number' &&
            typeof z === 'number' && (
              <VectorFieldset
                x={x}
                y={y}
                z={z}
                xDisabled
                yDisabled
                zDisabled
                isPrime={isPrime}
                color={color}
                colorDark={colorDark}
              />
            )}
        </div>
      </fieldset>
    );
  },
);

VectorFieldsetSpherical.displayName = 'VectorFieldsetSpherical';

export default VectorFieldsetSpherical;
