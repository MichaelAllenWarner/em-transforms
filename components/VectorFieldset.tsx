import { ChangeEvent, memo, RefObject, useCallback } from 'react';
import { Color, ColorDark, textColor, textColorDark } from '../helpers/Color';
import { round } from '../helpers/round';
import { CartesianComponents } from '../store/store';

interface Props {
  color: Color;
  colorDark: ColorDark;
  legend?: string;
  x: number;
  y: number;
  z: number;
  xDisabled?: boolean;
  yDisabled?: boolean;
  zDisabled?: boolean;
  xRef?: RefObject<HTMLInputElement>;
  yRef?: RefObject<HTMLInputElement>;
  zRef?: RefObject<HTMLInputElement>;
  step?: string;
  min?: string;
  max?: string;
  xSetter?: (newComponent: CartesianComponents[number]) => void;
  ySetter?: (newComponent: CartesianComponents[number]) => void;
  zSetter?: (newComponent: CartesianComponents[number]) => void;
  isPrime?: boolean;
}

const VectorFieldset = memo(
  ({
    color,
    colorDark,
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
    xRef,
    yRef,
    zRef,
    step,
    min,
    max,
    isPrime,
  }: Props) => {
    const onChangeX = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!xSetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        xSetter(n);
      },
      [xSetter],
    );

    const onChangeY = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!ySetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        ySetter(n);
      },
      [ySetter],
    );

    const onChangeZ = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!zSetter) return;
        let n = e.target.valueAsNumber;
        if (isNaN(n)) n = 0;
        zSetter(n);
      },
      [zSetter],
    );

    const inputs = ['x', 'y', 'z'].map((e, i) => {
      const value = round([x, y, z][i]);
      const disabled = [xDisabled, yDisabled, zDisabled][i];
      const useSlider = !disabled;
      const setter = [xSetter, ySetter, zSetter][i];
      const useOnChange = setter && !disabled;
      const onChange = useOnChange && [onChangeX, onChangeY, onChangeZ][i];
      const ref = !disabled && [xRef, yRef, zRef][i];

      return (
        <div key={i}>
          <label className="flex">
            <span className={`shrink-0 ${!useSlider ? 'leading-normal' : ''}`}>
              {e} {isPrime && '′'}
            </span>
            <span className="flex flex-col gap-2">
              {useSlider ? (
                <span className="safari-only-range-wrapper">
                  <input
                    type="range"
                    value={value}
                    {...(step ? { step } : { step: 0.1 })}
                    {...(min ? { min } : { min: -10 })}
                    {...(max ? { max } : { max: 10 })}
                    {...(onChange ? { onChange } : {})}
                  />
                </span>
              ) : null}
              <input
                value={value}
                type="number"
                {...(useSlider ? { 'aria-label': e } : {})}
                {...(step ? { step } : {})}
                {...(min ? { min } : {})}
                {...(max ? { max } : {})}
                {...(disabled ? { disabled } : {})}
                {...(onChange ? { onChange } : {})}
                {...(ref ? { ref } : {})}
              />
            </span>
          </label>
        </div>
      );
    });

    if (legend) {
      return (
        <fieldset className={`${textColor[color]} ${textColorDark[colorDark]}`}>
          <legend>{legend}</legend>
          <div className="flex flex-col gap-3 leading-none">{inputs}</div>
        </fieldset>
      );
    } else {
      return <>{inputs}</>;
    }
  },
);

VectorFieldset.displayName = 'VectorFieldset';

export default VectorFieldset;
