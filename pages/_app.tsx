import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MathJaxContext } from 'better-react-mathjax';
import HiddenMathJaxFontDownloadCatalyst from '../components/HiddenMathJaxFontDownloadCatalyst';
import { ThemeProvider } from 'next-themes';
import { ANNOUNCER_ID } from '../helpers/announce';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <MathJaxContext src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js">
        <Component {...pageProps} />
        <HiddenMathJaxFontDownloadCatalyst />
        <div
          id={ANNOUNCER_ID}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      </MathJaxContext>
    </ThemeProvider>
  );
}

export default MyApp;
