import { MathJax } from 'better-react-mathjax';

const TitleAndInstructions = () => (
  <div className="space-y-10">
    <h1 className="text-2xl sm:text-3xl">
      Lorentz Transformation of the Electric and Magnetic Fields, Visualized
    </h1>
    <div className="space-y-4 [&_summary+div]:max-w-prose [&_summary+div]:space-y-5 [&_summary+div]:p-4">
      <details>
        <summary>Background for those who need it</summary>
        <div>
          <p>
            (The reader is assumed to have some familiarity with vectors,
            including the dot product and the cross product.)
          </p>
          <p>
            An <em>event</em> is a point in spacetime—a particular location in
            space at a particular moment in time. At every event there's an
            electric-field vector <MathJax inline>{'\\( \\vec E \\)'}</MathJax>{' '}
            and a magnetic-field vector{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec B \\)'}</MathJax>.
            </span>{' '}
            Like many quantities in physics, their values depend on your frame
            of reference. If you and your friend are moving relative to one
            another, you'll measure different values for the{' '}
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
            measured in some inertial frame of reference (the "unprimed" frame),
            and it will show you their values as measured in <em>another</em>{' '}
            inertial frame of reference (the "primed" frame). The "boost
            velocity"{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec v \\)'}</MathJax>,
            </span>{' '}
            which you can also set, is the velocity of the primed frame relative
            to the unprimed frame.
          </p>
          <p>
            Note that we're working in units where the speed of light{' '}
            <MathJax inline>{'\\( c \\)'}</MathJax> is set to{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( 1 \\)'}</MathJax>.
            </span>{' '}
            That might seem strange if you've never seen it before, but remember
            that <MathJax inline>{'\\( c \\)'}</MathJax> is the cosmic speed
            limit, which means that all speeds can be expressed as{' '}
            <em>fractions</em> of{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( c \\)'}</MathJax>.
            </span>{' '}
            Setting <MathJax inline>{'\\( c = 1 \\)'}</MathJax> therefore lets
            us express every speed as a fraction of{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( 1 \\)'}</MathJax>—
            </span>
            i.e., as a unitless number between{' '}
            <MathJax inline>{'\\( 0 \\)'}</MathJax> and{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( 1 \\)'}</MathJax>.
            </span>{' '}
            It also lets us omit <MathJax inline>{'\\( c \\)'}</MathJax> from
            all of our equations! Oh, and we're using the same unit for{' '}
            <MathJax inline>{'\\( \\vec E \\)'}</MathJax> that we're using for{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec B \\)'}</MathJax>.
            </span>
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
            <span className="whitespace-nowrap">
              <MathJax inline>
                {'\\( \\vec F = q( \\vec E + \\vec u \\times \\vec B ) \\)'}
              </MathJax>
              ,
            </span>{' '}
            where <MathJax inline>{'\\( \\vec u \\)'}</MathJax> is the
            particle's velocity (as measured in the reference frame in
            question). As a result, the particle undergoes an acceleration. You
            probably learned that the relationship between acceleration and
            force is simply{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec a = \\vec F / m \\)'}</MathJax>,
            </span>{' '}
            where <MathJax inline>{'\\( m \\)'}</MathJax> is the particle's
            (constant) mass. Einstein showed that that isn't quite right. The
            relationship is actually{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>
                {
                  '\\( \\vec{a} = \\frac{ \\vec{F} - ( \\vec{F} \\cdot \\vec{u} ) \\vec{u} }{ \\gamma m } \\)'
                }
              </MathJax>
              ,
            </span>{' '}
            with{' '}
            <MathJax inline>
              {'\\( \\gamma = \\frac{ 1 }{ \\sqrt{ 1 - u^2 } } \\)'}
            </MathJax>
            (where <MathJax inline>{'\\( u \\)'}</MathJax> is the magnitude of{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec u \\)'}</MathJax>).
            </span>{' '}
            By the way, a particle's charge and mass are quantities whose values{' '}
            <em>don't</em> depend on your frame of reference. The values of
            velocity, acceleration, and force <em>do</em>.
          </p>
          <p>
            I brought up the particle because this app also lets you visualize
            the velocity, force, and acceleration of a particle at the same
            event as the displayed electric- and magnetic-field vectors (see the
            Options below the visualization). You can specify the particle's
            charge, mass, and ("unprimed") velocity, and you'll see the Lorentz
            force that the field-vectors exert on the particle, as well as the
            particle's resulting acceleration. You'll see all of these
            quantities in both frames by default, but if you'd rather study the
            particle's dynamics in a single frame then you can optionally hide
            the "primed" vectors.
          </p>
          <p>
            Another available option lets you see the Poynting vector in both
            frames. The Poynting vector represents the flow of energy within the
            electric and magnetic fields. It's given by the cross product{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>
                {'\\( \\vec S = \\vec E \\times \\vec B \\)'}
              </MathJax>
              .
            </span>
          </p>
        </div>
      </details>
      <details>
        <summary>Instructions</summary>
        <div>
          <p>
            This visualization demonstrates how the electric- and magnetic-field
            vectors at an event (a point in spacetime) transform under a Lorentz
            boost.
          </p>
          <p>
            Use the inputs below the visualization to set the Cartesian
            components of the electric- and magnetic-field vectors in the
            original "unprimed" inertial frame, as well as the spherical
            components of the boost-velocity. The electric- and magnetic-field
            vectors in the "primed" inertial frame are calculated and rendered
            automatically.
          </p>
          <p>
            The Poynting vector in each frame is calculated automatically, too,
            though by default it isn't displayed. You can toggle its visibility
            in the Options, where you'll also find some other settings that
            might interest you. Some of them have corresponding inputs you can
            control (the charge, mass, and velocity of a particle co-located
            with the field vectors).
          </p>
          <p>
            The inputs can only accept number-values, even while you're typing
            the number. Since a minus-sign by itself isn't interpreted as a
            number, entering a negative number is a bit cumbersome: you have to
            type at least one digit <em>before</em> inserting the minus sign at
            the start. Same goes for periods—you'll have to type <kbd>0.</kbd>{' '}
            instead of <kbd>.</kbd> for numbers between{' '}
            <MathJax inline>{'\\( 0 \\)'}</MathJax> and{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( 1 \\)'}</MathJax>.
            </span>
          </p>
          <p>A few notes:</p>
          <ul>
            <li>
              We're using Lorentz–Heaviside units, so electric and magnetic
              fields have the same dimension.
            </li>
            <li>
              The speed of light is set to{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( 1 \\)'}</MathJax>,
              </span>{' '}
              and speed-inputs (the{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( r \\)'}</MathJax>
                -components
              </span>{' '}
              for velocity-vectors) must be strictly less than that.
            </li>
            <li>
              Spherical components are of the "math" flavor, where{' '}
              <MathJax inline>{'\\( \\phi \\)'}</MathJax> is the polar angle
              (with reference to the{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( y \\)'}</MathJax>
                -axis)
              </span>{' '}
              and <MathJax inline>{'\\( \\theta \\)'}</MathJax> is the azimuthal
              angle (with reference to the{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( z \\)'}</MathJax>
                -axis).
              </span>
            </li>
            <li>
              The boost-velocity is directed along the{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( x \\)'}</MathJax>-axis
              </span>{' '}
              by default. You can change that (by adjusting its polar or
              azimuthal angle), but if you do, take care not to misinterpret the
              calculated Cartesian components of a boosted vector—the{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( x ^ \\prime \\)'}</MathJax>-component
              </span>{' '}
              will no longer be the component whose basis-vector is parallel to
              the boost-axis! There's a button in the Options to reset the
              boost-direction to{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( +x \\)'}</MathJax>.
              </span>
            </li>
          </ul>
          <p>Here is how the "camera" works:</p>
          <ul>
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
      <details>
        <summary>Formulas used</summary>
        <div>
          <p>
            The most elegant way to express how quantities transform under
            Lorentz boosts is with manifestly covariant math. In making this
            app, however, I had no choice but to get my hands dirty with the
            transformation formulas for non-covariant quantities. I've found
            that using the boost <em>rapidity</em> (as opposed to the boost
            velocity <MathJax inline>{'\\( \\vec v \\)'}</MathJax> and Lorentz
            factor{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>
                {'\\( \\gamma = \\frac{1}{ \\sqrt{ 1 - v ^2 } } \\)'}
              </MathJax>
              )
            </span>{' '}
            makes the formulas easier on the eyes and mind.
          </p>
          <p>
            Below are the transformation formulas I used. The quantity{' '}
            <MathJax inline>{'\\( \\hat v \\)'}</MathJax> is the <em>unit</em>{' '}
            vector in the direction of the boost velocity{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec v \\)'}</MathJax>,
            </span>{' '}
            and the aforementioned boost rapidity is{' '}
            <MathJax inline>{'\\( \\eta = \\tanh ^{-1} v \\)'}</MathJax> (that's
            the inverse hyperbolic tangent, and{' '}
            <MathJax inline>{'\\(  v \\)'}</MathJax> is the magnitude of{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec v \\)'}</MathJax>).
            </span>
          </p>
          <ul>
            <li>
              <MathJax inline>
                {
                  '\\( \\vec E ^ \\prime = \\cosh \\eta \\, \\vec E + \\sinh \\eta \\, ( \\hat v \\times \\vec B ) - 2 \\sinh ^2 \\frac{\\eta}{2} \\, ( \\hat v \\cdot \\vec E ) \\hat v \\)'
                }
              </MathJax>
            </li>
            <li>
              <MathJax inline>
                {
                  '\\( \\vec B ^ \\prime = \\cosh \\eta \\, \\vec B - \\sinh \\eta \\, ( \\hat v \\times \\vec E ) - 2 \\sinh ^2 \\frac{\\eta}{2} \\, ( \\hat v \\cdot \\vec B ) \\hat v \\)'
                }
              </MathJax>
            </li>
            <li>
              <MathJax inline>
                {
                  '\\( \\vec u ^ \\prime = \\dfrac{ \\vec u + \\left ( 2 \\sinh ^2 \\frac{ \\eta }{ 2 } \\, ( \\hat v \\cdot \\vec u ) - \\sinh \\eta \\right ) \\hat v }{ \\cosh \\eta - \\sinh \\eta \\, ( \\hat v \\cdot \\vec u ) } \\)'
                }
              </MathJax>
            </li>
          </ul>
          <p>(I didn't say they were pretty!)</p>
          <p>
            It follows from the definition of{' '}
            <MathJax inline>{'\\( \\eta \\)'}</MathJax> that{' '}
            <MathJax inline>{'\\( \\cosh \\eta = \\gamma \\)'}</MathJax> and
            that{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\sinh \\eta = \\gamma v \\)'}</MathJax>.
            </span>{' '}
            To write the formulas in their more familiar "non-rapidity" form,
            make those substitutions, use{' '}
            <MathJax inline>{'\\( \\vec v = v \\hat v \\)'}</MathJax> and the
            identity{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>
                {'\\( 2 \\sinh ^2 \\frac{ \\eta }{ 2 } = \\cosh \\eta - 1 \\)'}
              </MathJax>
              ,
            </span>{' '}
            and simplify.
          </p>
          <p>
            I didn't have to transform any of the other quantities, since I
            could calculate them in the "primed" frame from boosted quantities
            I'd already obtained.
          </p>
        </div>
      </details>
      <details>
        <summary>Observations</summary>
        <div>
          <p>Here are some interesting things to note:</p>
          <ul>
            <li>
              The quantities{' '}
              <MathJax inline>{'\\( \\vec E \\cdot \\vec B \\)'}</MathJax> and{' '}
              <MathJax inline>{'\\( E^2 - B^2 \\)'}</MathJax> are invariant,
              meaning that their values don't change under a boost. So if the
              vectors are perpendicular in one inertial frame, then they're
              perpendicular in all inertial frames; and if they share a
              magnitude in one inertial frame, then they share a magnitude in
              all inertial frames. A light wave is characterized by both of
              these properties, so a light wave in one inertial frame is a light
              wave in all inertial frames, as of course it must be.
            </li>
            <li>
              Under a Lorentz boost, only the components of{' '}
              <MathJax inline>{'\\( \\vec E \\)'}</MathJax> and{' '}
              <MathJax inline>{'\\( \\vec B \\)'}</MathJax> that are{' '}
              <em>perpendicular</em> to the boost-velocity{' '}
              <MathJax inline>{'\\( \\vec v \\)'}</MathJax> change. The
              components that are <em>parallel</em> to{' '}
              <MathJax inline>{'\\( \\vec v \\)'}</MathJax> retain their value.
            </li>
            <li>
              Under a Lorentz boost, <em>all</em> components of a
              velocity-vector{' '}
              <span className="whitespace-nowrap">
                (<MathJax inline>{'\\( \\vec u \\)'}</MathJax>)
              </span>{' '}
              generally change. This differs from the Galilean/Newtonian model,
              where only the velocity-component <em>parallel</em> to the
              boost-axis changes.
            </li>
            <li>
              The force and acceleration vectors generally aren't parallel.
            </li>
            <li>
              When a force acts on a particle, the component of force that's
              parallel to the particle's velocity is invariant under a
              "longitudinal" boost, by which I mean a Lorentz boost that's
              parallel to the particle's velocity. In other words, if you set
              the particle-velocity{' '}
              <MathJax inline>{'\\( \\vec u \\)'}</MathJax> to be parallel to
              the boost-velocity{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( \\vec v \\)'}</MathJax>,
              </span>{' '}
              then you'll find that the component of{' '}
              <MathJax inline>{'\\( \\vec F \\)'}</MathJax> that's parallel to
              those vectors is equal to the corresponding component of{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( \\vec F ^ \\prime \\)'}</MathJax>.
              </span>{' '}
              So try setting both <MathJax inline>{'\\( \\vec v \\)'}</MathJax>{' '}
              and <MathJax inline>{'\\( \\vec u \\)'}</MathJax> to point along
              the{' '}
              <span className="whitespace-nowrap">
                <MathJax inline>{'\\( x \\)'}</MathJax>-axis
              </span>{' '}
              (by using the "Reset" buttons in the Options, or simply by
              reloading the page); <MathJax inline>{'\\( F_x \\)'}</MathJax> and{' '}
              <MathJax inline>{'\\( F ^ \\prime _x \\)'}</MathJax> should then
              have the same value.
            </li>
          </ul>
        </div>
      </details>
    </div>
  </div>
);

export default TitleAndInstructions;
