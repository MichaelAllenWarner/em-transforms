import { memo } from 'react';
import { Color, textColor } from '../helpers/Color';
import { CartesianComponents } from '../helpers/store';

const round = (n: number) => parseFloat(n.toFixed(12));

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
  /** For `onChange` event (if no custom `onChange` is passed in). Will only be used on non-`disabled` inputs. */
  setter?: (newCartesians: CartesianComponents) => void;
  /** Boost-velocity vector gets a special `onChange` event, `step`, `min`, and `max`. */
  isBoostVelocity?: boolean;
}

const VectorFieldSet = memo(
  ({
    color,
    legend,
    x,
    y,
    z,
    setter,
    xDisabled,
    yDisabled,
    zDisabled,
    step,
    min,
    max,
    isBoostVelocity,
  }: Props) => {
    return (
      <fieldset className={`${textColor[color]}`}>
        <legend>{legend}</legend>
        {['x', 'y', 'z'].map((e, i) => {
          const value = round([x, y, z][i]);
          const disabled = [xDisabled, yDisabled, zDisabled][i];

          return (
            <label key={i}>
              {e}-component
              <input
                value={value}
                type="number"
                {...(step || isBoostVelocity ? { step: step || '.05' } : {})}
                {...(min || isBoostVelocity ? { min: min || '-.9999' } : {})}
                {...(max || isBoostVelocity ? { max: max || '.9999' } : {})}
                {...(disabled ? { disabled } : {})}
                {...(setter
                  ? {
                      onChange: (e) => {
                        let n = e.target.valueAsNumber;
                        if (isBoostVelocity) {
                          if (n >= 1) n = 0.9999;
                          if (n <= -1) n = -0.9999;
                        }
                        if (isNaN(n)) n = 0;
                        setter([
                          i === 0 ? n : x,
                          i === 1 ? n : y,
                          i === 2 ? n : z,
                        ]);
                      },
                    }
                  : {})}
              />
            </label>
          );
        })}
      </fieldset>
    );
  }
);

VectorFieldSet.displayName = 'VectorFieldSet';

export default VectorFieldSet;
