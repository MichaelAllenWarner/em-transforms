import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MathJaxContext src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
      <Component {...pageProps} />
      {/*
        Just here to force the app's needed MathJax fonts to download on page-load
        (otherwise they won't download until the user opens a `<details>` element
        that uses them, at which point the user will see a flash of untyped math
        while the fonts download).
      */}
      <div aria-hidden className="sr-only">
        <MathJax>{'\\( = \\left (  \\, \\vec u  \\right ) \\)'}</MathJax>
      </div>
    </MathJaxContext>
  );
}

export default MyApp;
