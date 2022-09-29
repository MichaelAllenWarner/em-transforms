import { MathJax } from 'better-react-mathjax';

const TitleAndInstructions = () => (
  <div className="space-y-10">
    <h1 className="text-2xl sm:text-3xl">
      Lorentz Transformation of the Electric and Magnetic Fields, Visualized
    </h1>
    <div className="space-y-4">
      <details>
        <summary>Background for beginners</summary>
        <div className="max-w-prose space-y-3 p-4">
          <p>
            An <em>event</em> is a point in spacetime—a particular location in
            space at a particular moment in time. At every event there's an
            electric-field vector <MathJax inline>{'\\( \\vec E \\)'}</MathJax>{' '}
            and a magnetic-field vector{' '}
            <MathJax inline>{'\\( \\vec B \\)'}</MathJax>. Like many quantities
            in physics, their values depend on your frame of reference. If you
            and your friend are moving relative to one another, you'll measure
            different values for the{' '}
            <MathJax inline>{'\\( \\vec E \\)'}</MathJax> and{' '}
            <MathJax inline>{'\\( \\vec B \\)'}</MathJax> vectors at a given
            event.
          </p>
          <p>
            The purpose of this app is to demonstrate <em>how</em> the values of{' '}
            <MathJax inline>{'\\( \\vec E \\)'}</MathJax> and{' '}
            <MathJax inline>{'\\( \\vec B \\)'}</MathJax> depend on your frame
            of reference. You tell the app what the values of{' '}
            <MathJax inline>{'\\( \\vec E \\)'}</MathJax> and{' '}
            <MathJax inline>{'\\( \\vec B \\)'}</MathJax> are at some event as
            measured in some initial frame of reference (the "unprimed" frame),
            and it will show you their values as measured in <em>another</em>{' '}
            frame of reference (the "primed" frame). The "boost velocity"{' '}
            <MathJax inline>{'\\( \\vec v \\)'}</MathJax>, which you can also
            set, is the velocity of the primed frame relative to the unprimed
            frame.
          </p>
          <p>
            Note that we're working in units where the speed of light{' '}
            <MathJax inline>{'\\( c \\)'}</MathJax> is set to{' '}
            <MathJax inline>{'\\( 1 \\)'}</MathJax>. That might seem strange if
            you've never seen it before, but remember that{' '}
            <MathJax inline>{'\\( c \\)'}</MathJax> is the cosmic speed limit,
            which means that all speeds can be expressed as <em>fractions</em>{' '}
            of <MathJax inline>{'\\( c \\)'}</MathJax>. Setting{' '}
            <MathJax inline>{'\\( c = 1 \\)'}</MathJax> therefore lets us
            express every speed as a fraction of{' '}
            <MathJax inline>{'\\( 1 \\)'}</MathJax>—i.e., as a unitless number
            between <MathJax inline>{'\\( 0 \\)'}</MathJax> and{' '}
            <MathJax inline>{'\\( 1 \\)'}</MathJax>. It also lets us omit{' '}
            <MathJax inline>{'\\( c \\)'}</MathJax> from all of our equations!
            Oh, and we're using the same unit for{' '}
            <MathJax inline>{'\\( \\vec E \\)'}</MathJax> that we're using for{' '}
            <MathJax inline>{'\\( \\vec B \\)'}</MathJax>.
          </p>
          <p>
            Now, the reason we care about the{' '}
            <MathJax inline>{'\\( \\vec E \\)'}</MathJax> and{' '}
            <MathJax inline>{'\\( \\vec B \\)'}</MathJax> vectors is that they
            affect the motion of charged particles. Specifically: if there's a
            particle with charge <MathJax inline>{'\\( q \\)'}</MathJax> at an
            event, then the electric- and magnetic-field vectors at that event
            exert a force on the particle—called the <em>Lorentz force</em>
            —whose value is{' '}
            <MathJax inline>
              {'\\( \\vec F = q( \\vec E + \\vec u \\times \\vec B ) \\)'}
            </MathJax>
            , where <MathJax inline>{'\\( \\vec u \\)'}</MathJax> is the
            particle's velocity (as measured in the reference frame in
            question). As a result, the particle undergoes an acceleration. You
            probably learned that the relationship between acceleration and
            force is simply{' '}
            <MathJax inline>{'\\( \\vec a = \\vec F / m \\)'}</MathJax>, where{' '}
            <MathJax inline>{'\\( m \\)'}</MathJax> is the particle's (constant)
            mass. Einstein showed that that isn't quite right. The relationship
            is actually{' '}
            <MathJax inline>
              {
                '\\( \\vec{a} = \\frac{ \\vec{F} - ( \\vec{F} \\cdot \\vec{u} ) \\vec{u} }{ \\gamma m } \\)'
              }
            </MathJax>
            , with{' '}
            <MathJax inline>
              {'\\( \\gamma = \\frac{ 1 }{ \\sqrt{ 1 - u^2 } } \\)'}
            </MathJax>
            . By the way, a particle's charge and mass are quantities whose
            values <em>don't</em> depend on your frame of reference. Velocity,
            acceleration, and force <em>do</em>.
          </p>
          <p>
            I brought up the particle because this app <em>also</em> lets you
            visualize the velocity, force, and acceleration of a particle at the
            same event as the displayed electric- and magnetic-field vectors
            (see the Options below the visualization). You can specify the
            particle's charge, mass, and ("unprimed") velocity, and you'll see
            the Lorentz force that the field-vectors exert on the particle, as
            well as the particle's resulting acceleration. You'll see all of
            these quantities in both frames by default, but if you'd rather
            study the particle's dynamics in a single frame then you can
            optionally hide the "primed" vectors.
          </p>
          <p>
            Another available option lets you see the Poynting vector in both
            frames. The Poynting vector represents the flow of energy within the
            electric and magnetic fields. It's given by the cross product{' '}
            <MathJax inline>
              {'\\( \\vec S = \\vec E \\times \\vec B \\)'}
            </MathJax>
            .
          </p>
        </div>
      </details>
      <details>
        <summary>Instructions</summary>
        <div className="max-w-prose space-y-3 p-4">
          <p>
            This visualization demonstrates how the electric and magnetic fields
            transform under a Lorentz boost.
          </p>
          <p>
            Use the inputs below the visualization to set the Cartesian
            components of the electric- and magnetic-field vectors in the
            original "unprimed" frame, as well as the spherical components of
            the boost-velocity. The electric- and magnetic-field vectors in the
            "primed" frame are calculated and rendered automatically.
          </p>
          <p>
            The Poynting vector in each frame is calculated automatically, too,
            though by default it isn't displayed. You can toggle its visibility
            in the Options, where you'll also find some other settings that
            might interest you. Some of them have corresponding inputs you can
            control (e.g., the velocity-vector of a particle co-located with the
            fields).
          </p>
          <p>
            The inputs can only accept number-values, even while you're typing
            the number. Since a minus-sign by itself isn't interpreted as a
            number, entering a negative number is a bit cumbersome: you have to
            type at least one digit <em>before</em> inserting the minus sign at
            the start. Same goes for periods—you'll have to type <kbd>0.</kbd>{' '}
            instead of <kbd>.</kbd> for numbers between{' '}
            <MathJax inline>{'\\( 0 \\)'}</MathJax> and{' '}
            <MathJax inline>{'\\( 1 \\)'}</MathJax>.
          </p>
          <p>A few notes:</p>
          <ul className="ml-4 list-disc">
            <li>
              We're using Lorentz–Heaviside units, so electric and magnetic
              fields have the same dimension.
            </li>
            <li>
              The speed of light is set to{' '}
              <MathJax inline>{'\\( 1 \\)'}</MathJax>, and speed-inputs (the{' '}
              <MathJax inline>{'\\( r \\)'}</MathJax>
              -components for velocity-vectors) must be strictly less than that.
            </li>
            <li>
              Spherical components are of the "math" flavor, where{' '}
              <MathJax inline>{'\\( \\phi \\)'}</MathJax> is the polar angle
              (with reference to the <MathJax inline>{'\\( y \\)'}</MathJax>
              -axis) and <MathJax inline>{'\\( \\theta \\)'}</MathJax> is the
              azimuthal angle (with reference to the{' '}
              <MathJax inline>{'\\( z \\)'}</MathJax>
              -axis).
            </li>
            <li>
              The boost-velocity is directed along the{' '}
              <MathJax inline>{'\\( x \\)'}</MathJax>-axis by default. You can
              change that (by adjusting its polar or azimuthal angle), but if
              you do, take care not to misinterpret the calculated Cartesian
              components of a boosted vector—the{' '}
              <MathJax inline>{'\\( x ^ \\prime \\)'}</MathJax>-component will
              no longer be the component whose basis-vector is parallel to the
              boost-axis! There's a button in the Options to reset the
              boost-direction to <MathJax inline>{'\\( +x \\)'}</MathJax>.
            </li>
          </ul>
          <p>Here is how the "camera" works:</p>
          <ul className="ml-4 list-disc">
            <li>
              To orbit, use the left mouse-button (or one-finger move for
              touch).
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
  </div>
);

export default TitleAndInstructions;
