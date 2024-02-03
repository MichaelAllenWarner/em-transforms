import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const selectStyles = /* tw */ 'inline-block';

  return (
    <div
      style={{ '--opacity': isHydrated ? '100%' : '0%' } as React.CSSProperties}
      className="opacity-[--opacity] transition-opacity"
    >
      {isHydrated ? (
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={selectStyles}
        >
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      ) : (
        <select
          aria-hidden
          hidden
          tabIndex={-1}
          {...{ inert: '' }}
          className={`${selectStyles} select-none pointer-events-none`}
        >
          <option value=""></option>
        </select>
      )}
    </div>
  );
};

export default ThemeSwitch;
