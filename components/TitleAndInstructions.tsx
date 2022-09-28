import { MathJax } from 'better-react-mathjax';

const TitleAndInstructions = () => (
  <div className="space-y-10">
    <h1 className="text-2xl sm:text-3xl">
      Lorentz Transformation of the Electric and Magnetic Fields, Visualized
    </h1>
    <details>
      <summary className="max-w-max cursor-pointer">Instructions</summary>
      <div className="max-w-prose space-y-3 p-4">
        <p>
          This visualization demonstrates how the electric and magnetic fields
          transform under a Lorentz boost.
        </p>
        <p>
          Use the inputs below the visualization to set the Cartesian components
          of the electric- and magnetic-field vectors in the original "unprimed"
          frame, as well as the spherical components of the boost-velocity. The
          electric- and magnetic-field vectors in the "primed" frame are
          calculated and rendered automatically.
        </p>
        <p>
          The Poynting vector in each frame is calculated automatically, too,
          though by default it isn't displayed. You can toggle its visibility in
          the Options, where you'll also find some other settings that might
          interest you. Some of them have corresponding inputs you can control
          (e.g., the velocity-vector of a particle co-located with the fields).
        </p>
        <p>
          The inputs can only accept number-values, even while you're typing the
          number. Since a minus-sign by itself isn't interpreted as a number,
          entering a negative number is a bit cumbersome: you have to type at
          least one digit <em>before</em> inserting the minus sign at the start.
          Same goes for periods—you'll have to type <kbd>0.</kbd> instead of{' '}
          <kbd>.</kbd> for numbers between{' '}
          <MathJax inline>{'\\( 0 \\)'}</MathJax> and{' '}
          <MathJax inline>{'\\( 1 \\)'}</MathJax>.
        </p>
        <p>A few notes:</p>
        <ul className="ml-4 list-disc">
          <li>
            We're using Lorentz–Heaviside units, so electric and magnetic fields
            have the same dimension.
          </li>
          <li>
            The speed of light is set to <MathJax inline>{'\\( 1 \\)'}</MathJax>
            , and speed-inputs (the <MathJax inline>{'\\( r \\)'}</MathJax>
            -components for velocity-vectors) must be strictly less than that.
          </li>
          <li>
            Spherical components are of the "math" flavor, where{' '}
            <MathJax inline>{'\\( \\phi \\)'}</MathJax> is the polar angle (with
            reference to the <MathJax inline>{'\\( y \\)'}</MathJax>-axis) and{' '}
            <MathJax inline>{'\\( \\theta \\)'}</MathJax> is the azimuthal angle
            (with reference to the <MathJax inline>{'\\( z \\)'}</MathJax>
            -axis).
          </li>
          <li>
            The boost-velocity is directed along the{' '}
            <MathJax inline>{'\\( x \\)'}</MathJax>-axis by default. You can
            change that (by adjusting its polar or azimuthal angle), but if you
            do, take care not to misinterpret the calculated Cartesian
            components of a boosted vector—the{' '}
            <MathJax inline>{'\\( x ^ \\prime \\)'}</MathJax>-component will no
            longer be the component whose basis-vector is parallel to the
            boost-axis! There's a button in the Options to reset the
            boost-direction to <MathJax inline>{'\\( +x \\)'}</MathJax>.
          </li>
        </ul>
        <p>Here is how the "camera" works:</p>
        <ul className="ml-4 list-disc">
          <li>
            To orbit, use the left mouse-button (or one-finger move for touch).
          </li>
          <li>
            To zoom, use the mousewheel or the middle mouse-button (or
            two-finger spread/squish for touch).
          </li>
          <li>
            To pan, use the right mouse-button (or two-finger move for touch).
            Panning will change the focal point for orbiting and zooming, but
            you can restore it with the "Reset camera" button in the Options.
          </li>
        </ul>
      </div>
    </details>
  </div>
);

export default TitleAndInstructions;
