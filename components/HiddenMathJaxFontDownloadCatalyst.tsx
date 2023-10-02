import { MathJax } from 'better-react-mathjax';

/**
 * This "hidden" MathJax equation makes use of all the app's MathJax fonts.
 * (If equations are added to the app, this should be updated accordingly.)
 * It's hidden visually and also from both keyboard and screen-reader users,
 * but because it does NOT have `display: none` its presence will still
 * force the fonts to download. This is useful because at the time of writing,
 * all the other MathJax equations appear only inside initially-closed
 * `details` elements, which as far as MathJax is concerned is the same
 * as if they were hidden with `display: none` -- i.e., without this workaround,
 * the fonts in question wouldn't download until the user opened those `details`
 * elements, at which point the user would see a flash of not-yet-ready math
 * equations. With this workaround, the equations should always be ready by the
 * time the user opens a `<details>` element. The `sr-only` class hides it
 * visually; the `inert` takes care of the rest on browsers that support it,
 * and for legacy browsers the combination of `aria-hidden` and nested `invisible`
 * should do the trick.
 */
const HiddenMathJaxFontDownloadCatalyst = () => (
  <div
    {...{ inert: '' }}
    aria-hidden
    className="sr-only invisible [&_*]:!invisible"
  >
    <MathJax>{'\\( = \\left (  \\, \\vec u  \\right ) \\)'}</MathJax>
  </div>
);

export default HiddenMathJaxFontDownloadCatalyst;
