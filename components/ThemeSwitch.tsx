import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const LabelGuts = () => (
  <>
    Theme<span className="sr-only"> (selection takes effect immediately)</span>:
  </>
);
const labelStyles = /* tw */ 'mr-2';
const selectStyles = /* tw */ 'inline-block p-1 rounded-sm border';
const themeSwitchId = 'theme-switch';

const ThemeSwitch = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div
      style={{ '--opacity': isHydrated ? '100%' : '0%' } as React.CSSProperties}
      className="opacity-[--opacity] transition-opacity"
    >
      {isHydrated ? (
        <form>
          <label htmlFor={themeSwitchId} className={labelStyles}>
            <LabelGuts />
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={selectStyles}
            id={themeSwitchId}
          >
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </form>
      ) : (
        /*
          Just an invisible "placeholder" so that the theme-switcher can fade in "smoothly"
          after hydration. (The idea is to take up the same amount of vertical space as the
          real theme-switcher, so that there's no vertical layout-shift.)
        */
        <div
          aria-hidden
          hidden
          {...{ inert: '' }}
          className="block invisible pointer-events-none [&_*]:select-none"
        >
          <label className={labelStyles}>
            <LabelGuts />
          </label>
          <select tabIndex={-1} className={selectStyles}>
            {/* use longest option for best size-match */}
            <option value="">System</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitch;
