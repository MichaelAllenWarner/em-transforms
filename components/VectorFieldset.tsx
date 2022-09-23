import { ChangeEvent, memo, useCallback } from 'react';
import { Color, textColor } from '../helpers/Color';
import { CartesianComponents } from '../helpers/store';

const round = (n: number) => parseFloat(n.toFixed(10));

const boostVelocityMin = -0.9999;
const boostVelocityMax = 0.9999;
const boostVelocityStep = 0.05;

interface Props {
  color: Color;
  legend: string;
  x: number;
  y: number;
  z: number;
  xDisabled?: boolean;
  yDisabled?: boolean;
  zDisabled?: boolean;
  step?: string;
  min?: string;
  max?: string;
  xSetter?: (newComponent: CartesianComponents[number]) => void;
  ySetter?: (newComponent: CartesianComponents[number]) => void;
  zSetter?: (newComponent: CartesianComponents[number]) => void;
  /** Boost-velocity vector gets special `onChange`-handling as well as its own `step`, `min`, and `max`. */
  isBoostVelocity?: boolean;
}

const VectorFieldset = memo(
  ({
    color,
    legend,
    x,
    y,
    z,
    xSetter,
    ySetter,
    zSetter,
    xDisabled,
    yDisabled,
    zDisabled,
    step,
    min,
    max,
    isBoostVelocity,
  }: Props) => {
    const onChangeX = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!xSetter) return;
        let n = e.target.valueAsNumber;
        if (isBoostVelocity) {
          if (n >= 1) n = boostVelocityMax;
          if (n <= -1) n = boostVelocityMin;
        }
        if (isNaN(n)) n = 0;
        xSetter(n);
      },
      [isBoostVelocity, xSetter]
    );

    const onChangeY = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!ySetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        ySetter(n);
      },
      [ySetter]
    );

    const onChangeZ = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!zSetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        zSetter(n);
      },
      [zSetter]
    );

    return (
      <fieldset className={`${textColor[color]}`}>
        <legend>{legend}</legend>
        {['x', 'y', 'z'].map((e, i) => {
          const value = round([x, y, z][i]);
          const disabled = [xDisabled, yDisabled, zDisabled][i];
          const setter = [xSetter, ySetter, zSetter][i];
          const useOnChange =
            setter && !disabled && (i === 0 || !isBoostVelocity);
          const onChange = useOnChange && [onChangeX, onChangeY, onChangeZ][i];

          return (
            <div key={i}>
              <label>
                {e}-component
                <input
                  value={value}
                  type="number"
                  {...(step || isBoostVelocity
                    ? { step: step || String(boostVelocityStep) }
                    : {})}
                  {...(min || isBoostVelocity
                    ? { min: min || String(boostVelocityMin) }
                    : {})}
                  {...(max || isBoostVelocity
                    ? { max: max || String(boostVelocityMax) }
                    : {})}
                  {...(disabled ? { disabled } : {})}
                  {...(onChange ? { onChange } : {})}
                />
              </label>
            </div>
          );
        })}
      </fieldset>
    );
  }
);

VectorFieldset.displayName = 'VectorFieldset';

export default VectorFieldset;
