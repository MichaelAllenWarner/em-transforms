import { ChangeEvent, memo, useCallback } from 'react';
import { Color, textColor } from '../helpers/Color';
import { SphericalComponents } from '../helpers/store';

const round = (n: number) => parseFloat(n.toFixed(10));
const radToDeg = (n: number) => (n * 180) / Math.PI;
const degToRad = (n: number) => (n * Math.PI) / 180;
const trueMod = (a: number, b: number) => ((a % b) + b) % b;

const velocityMin = 0;
const velocityMax = 0.9999;
const velocityStep = 0.01;

interface Props {
  color: Color;
  legend: string;
  r: number;
  phi: number;
  theta: number;
  rDisabled?: boolean;
  phiDisabled?: boolean;
  thetaDisabled?: boolean;
  rSetter?: (newComponent: SphericalComponents[number]) => void;
  phiSetter?: (newComponent: SphericalComponents[number]) => void;
  thetaSetter?: (newComponent: SphericalComponents[number]) => void;
  flipper?: () => void;
  /** If `true`, will keep the `r` component less than 1. */
  isVelocity?: boolean;
}

const VectorFieldsetSpherical = memo(
  ({
    color,
    legend,
    r,
    phi,
    theta,
    rSetter,
    phiSetter,
    thetaSetter,
    rDisabled,
    phiDisabled,
    thetaDisabled,
    isVelocity,
    flipper,
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
      [rSetter, isVelocity]
    );

    const onChangePhi = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!phiSetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        phiSetter(degToRad(n));
      },
      [phiSetter]
    );

    const onChangeTheta = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!thetaSetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        thetaSetter(degToRad(n));
      },
      [thetaSetter]
    );

    return (
      <fieldset className={`${textColor[color]}`}>
        <legend>{legend}</legend>
        {flipper && (
          <div>
            <button type="button" onClick={flipper}>
              Reverse direction
            </button>
          </div>
        )}
        {['r', 'φ', 'θ'].map((e, i) => {
          const value =
            i === 0
              ? round(r)
              : round(trueMod(radToDeg([phi, theta][i - 1]), 360));
          const disabled = [rDisabled, phiDisabled, thetaDisabled][i];
          const setter = [rSetter, phiSetter, thetaSetter][i];
          const useOnChange = setter && !disabled;
          const onChange =
            useOnChange && [onChangeR, onChangePhi, onChangeTheta][i];

          return (
            <div key={i}>
              <label>
                {e}-component
                <input
                  value={value}
                  type="number"
                  {...(i === 0 && isVelocity
                    ? {
                        step: String(velocityStep),
                        min: String(velocityMin),
                        max: String(velocityMax),
                      }
                    : {
                        step: String(5),
                      })}
                  {...(disabled ? { disabled } : {})}
                  {...(onChange ? { onChange } : {})}
                />
                {i > 0 ? '°' : ''}
              </label>
            </div>
          );
        })}
      </fieldset>
    );
  }
);

VectorFieldsetSpherical.displayName = 'VectorFieldsetSpherical';

export default VectorFieldsetSpherical;
