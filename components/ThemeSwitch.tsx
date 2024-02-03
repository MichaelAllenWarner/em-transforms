import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

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
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      ) : (
        <select>
          <option value=""></option>
        </select>
      )}
    </div>
  );
};

export default ThemeSwitch;
