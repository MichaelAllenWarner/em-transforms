import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MathJaxContext } from 'better-react-mathjax';
import HiddenMathJaxFontDownloadCatalyst from '../components/HiddenMathJaxFontDownloadCatalyst';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <MathJaxContext src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
        <Component {...pageProps} />
        <HiddenMathJaxFontDownloadCatalyst />
      </MathJaxContext>
    </ThemeProvider>
  );
}

export default MyApp;
