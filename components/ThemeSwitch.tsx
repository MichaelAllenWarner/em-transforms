import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const labelText = 'Select a theme: ';
const labelStyles = /* tw */ '';
const selectStyles = /* tw */ 'inline-block';
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
        <div>
          <label htmlFor={themeSwitchId} className={labelStyles}>
            {labelText}
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
        </div>
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
          <label className={labelStyles}>{labelText}</label>
          <select tabIndex={-1} className={selectStyles}>
            <option value="">Foobar</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitch;
