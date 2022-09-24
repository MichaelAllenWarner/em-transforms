import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MathJaxContext } from 'better-react-mathjax';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MathJaxContext src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
      <Component {...pageProps} />
    </MathJaxContext>
  );
}

export default MyApp;
