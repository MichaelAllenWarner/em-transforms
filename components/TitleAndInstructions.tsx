import MathJaxInline from './MathJaxInline';
import ThemeSwitch from './ThemeSwitch';

const TitleAndInstructions = () => (
  <div className="space-y-6 mx-auto max-w-full">
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-5xl">
      Lorentz Transformation of the Electric and Magnetic Fields, Visualized in
      3D
    </h1>
    <noscript className="block">
      <div className="border p-4 inline-block">
        <p>
          <strong>
            JavaScript is currently disabled in your browser. To use this app,
            you'll have to enable JavaScript and reload the page.
          </strong>
        </p>
      </div>
    </noscript>
    <ThemeSwitch />
    <div className="space-y-4 [&_summary+div]:max-w-prose [&_summary+div]:space-y-5 [&_ul+p]:mt-3 [&_li>ul]:mt-3 [&_li>p:last-child]:mb-4 [&_summary+div]:p-4">
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
            electric-field vector <MathJaxInline content={'\\( \\vec E \\)'} />{' '}
            and a magnetic-field vector{' '}
            <MathJaxInline content={'\\( \\vec B \\).'} /> Like many quantities
            in physics, their values depend on your frame of reference. If you
            and your friend are moving relative to one another, you'll measure
            different values for the{' '}
            <MathJaxInline content={'\\( \\vec E \\)'} /> and{' '}
            <MathJaxInline content={'\\( \\vec B \\)'} /> vectors at a given
            event.
          </p>
          <p>
            The purpose of this app is to demonstrate <em>how</em> the values of{' '}
            <MathJaxInline content={'\\( \\vec E \\)'} /> and{' '}
            <MathJaxInline content={'\\( \\vec B \\)'} /> depend on your frame
            of reference. You tell the app what the values of{' '}
            <MathJaxInline content={'\\( \\vec E \\)'} /> and{' '}
            <MathJaxInline content={'\\( \\vec B \\)'} /> are at some event as
            measured in some inertial frame of reference (the "unprimed" frame),
            and it will show you their values as measured in <em>another</em>{' '}
            inertial frame of reference (the "primed" frame). The "boost
            velocity" <MathJaxInline content={'\\( \\vec v \\),'} /> which you
            can also set, is the velocity of the primed frame relative to the
            unprimed frame.
          </p>
          <p>
            Note that we're working in units where the speed of light{' '}
            <MathJaxInline content={'\\( c \\)'} /> is set to{' '}
            <MathJaxInline content={'\\( 1 \\).'} /> That might seem strange if
            you've never seen it before, but remember that{' '}
            <MathJaxInline content={'\\( c \\)'} /> is the cosmic speed limit,
            which means that all speeds can be expressed as <em>fractions</em>{' '}
            of <MathJaxInline content={'\\( c \\).'} /> Setting{' '}
            <MathJaxInline content={'\\( c = 1 \\)'} /> therefore lets us
            express every speed as a fraction of{' '}
            <MathJaxInline content={'\\( 1 \\)—'} />
            i.e., as a unitless number between{' '}
            <MathJaxInline content={'\\( 0 \\)'} /> and{' '}
            <MathJaxInline content={'\\( 1 \\).'} /> It also lets us omit{' '}
            <MathJaxInline content={'\\( c \\)'} /> from all of our equations!
            Oh, and we're using the same unit for{' '}
            <MathJaxInline content={'\\( \\vec E \\)'} /> that we're using for{' '}
            <MathJaxInline content={'\\( \\vec B \\).'} />
          </p>
          <p>
            Now, the reason we care about the{' '}
            <MathJaxInline content={'\\( \\vec E \\)'} /> and{' '}
            <MathJaxInline content={'\\( \\vec B \\)'} /> vectors is that they
            affect the motion of charged particles. Specifically: if there's a
            particle with charge <MathJaxInline content={'\\( q \\)'} /> at an
            event, then the electric- and magnetic-field vectors at that event
            exert a force on the particle—called the <em>Lorentz force</em>
            —whose value is{' '}
            <MathJaxInline
              content={
                '\\( \\vec F = q( \\vec E + \\vec u \\times \\vec B ) \\),'
              }
            />{' '}
            where <MathJaxInline content={'\\( \\vec u \\)'} /> is the
            particle's velocity (as measured in the reference frame in
            question). As a result, the particle undergoes an acceleration. You
            probably learned that the relationship between acceleration and
            force is simply{' '}
            <MathJaxInline content={'\\( \\vec a = \\vec F / m \\),'} /> where{' '}
            <MathJaxInline content={'\\( m \\)'} /> is the particle's (constant)
            mass. Einstein showed that that isn't quite right. The relationship
            is actually{' '}
            <MathJaxInline
              content={
                '\\( \\vec{a} = \\frac{ \\vec{F} - ( \\vec{F} \\cdot \\vec{u} ) \\vec{u} }{ \\gamma m } \\),'
              }
            />{' '}
            with{' '}
            <MathJaxInline
              content={'\\( \\gamma = \\frac{ 1 }{ \\sqrt{ 1 - u^2 } } \\)'}
            />
            (where <MathJaxInline content={'\\( u \\)'} /> is the magnitude of{' '}
            <MathJaxInline content={'\\( \\vec u \\)).'} /> By the way, a
            particle's charge and mass are quantities whose values{' '}
            <em>don't</em> depend on your frame of reference. The values of
            velocity, acceleration, and force <em>do</em>.
          </p>
          <p>
            I brought up the particle because this app also lets you visualize
            the velocity, force, and acceleration of a particle at the same
            event as the displayed electric- and magnetic-field vectors (see the{' '}
            <a href="#options">Options</a>). You can specify the particle's
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
            <MathJaxInline
              content={'\\( \\vec S = \\vec E \\times \\vec B \\).'}
            />
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
            Use the sliders, input-boxes, or corresponding{' '}
            <a href="#hotkeys">hotkeys</a>
            to set the Cartesian components of the electric- and magnetic-field
            vectors in the original "unprimed" inertial frame, as well as the
            direction and magnitude of the boost-velocity. The electric- and
            magnetic-field vectors in the "primed" inertial frame are calculated
            and rendered automatically.
          </p>
          <p>
            The Poynting vector in each frame is calculated automatically, too,
            though by default it isn't displayed in the visualization. You can
            toggle its visibility in the <a href="#options">Options</a>, where
            you'll also find some other settings that might interest you. Some
            of them have corresponding sliders and inputs you can control, like
            the charge, mass, and velocity of a particle co-located with the
            field-vectors. You can even suppress the field-vectors altogether
            (and all vectors derived from them), effectively turning the app
            into a "velocity-transformation visualizer," since then only the
            velocity-vectors can be displayed. Regardless of what's displayed in
            the visualization, however, <em>all</em> derived values are always
            calculated and shown in corresponding disabled inputs at the bottom.
          </p>
          <p>
            The sliders are the most convenient way to control the parameters.
            The hotkeys can be handy, too. But if you need to enter a value that
            lies outside of a slider's range or in between the slider's "steps,"
            then you can reach for the accompanying input box. Note that these
            inputs can only accept number-values, even while you're typing the
            number. Since a minus-sign by itself isn't interpreted as a number,
            entering a negative number is a bit cumbersome: you have to type at
            least one digit <em>before</em> inserting the minus sign at the
            start. Same goes for periods—you'll have to type <kbd>0.</kbd>{' '}
            instead of <kbd>.</kbd> for numbers between{' '}
            <MathJaxInline content={'\\( 0 \\)'} /> and{' '}
            <MathJaxInline content={'\\( 1 \\).'} />
          </p>
          <p>A few notes:</p>
          <ul>
            <li>
              This app works fine on mobile devices, but it's best viewed on a
              wider screen, so that the Options and inputs can fit side-by-side
              with the visualization.
            </li>
            <li>
              We're using Heaviside–Lorentz units, so electric and magnetic
              fields have the same dimension.
            </li>
            <li>
              Each velocity (boost or particle) is specified with three
              parameters: <MathJaxInline content={'\\( r \\),'} />{' '}
              <MathJaxInline content={'\\( \\phi \\),'} /> and{' '}
              <MathJaxInline content={'\\( \\theta \\).'} />
              <ul>
                <li>
                  The <MathJaxInline content={'\\( r \\)-parameter'} /> sets the
                  speed, from <MathJaxInline content={'\\( 0 \\)'} /> to{' '}
                  <MathJaxInline content={'\\( 1 \\)'} /> (with the speed of
                  light defined as <MathJaxInline content={'\\( 1 \\)).'} />
                </li>
                <li>
                  The <MathJaxInline content={'\\( \\phi \\)-'} /> and{' '}
                  <MathJaxInline content={'\\( \\theta \\)-parameters'} /> set
                  the direction. Note that these spherical coordinates are not
                  the usual ones used in physics. Rather,{' '}
                  <MathJaxInline content={'\\( \\phi \\)'} /> is the polar angle
                  with reference to the{' '}
                  <MathJaxInline content={'\\( y \\)-axis,'} /> and{' '}
                  <MathJaxInline content={'\\( \\theta \\)'} /> is the azimuthal
                  angle with reference to the{' '}
                  <MathJaxInline content={'\\( z \\)-axis.'} /> (The software
                  I'm using adopts this peculiar variant of the "math"
                  convention, and it's easiest to just stick with it.)
                </li>
              </ul>
              <p>
                Aside: I avoid the word <em>components</em> here because,
                mathematically speaking, we're constructing these velocities as{' '}
                <em>position vectors</em>, and position vectors in spherical
                coordinates only have a radial component. Technically the
                input-parameters specify the <em>coordinates of a point</em>,
                and then we "build" the velocity as a vector from the origin to
                that location.
              </p>
            </li>
            <li>
              The boost-velocity is directed along the{' '}
              <MathJaxInline content={'\\( x \\)-axis'} /> by default. You can
              change that (by adjusting its polar or azimuthal angle), but if
              you do, take care not to misinterpret the calculated Cartesian
              components of a boosted vector—the{' '}
              <MathJaxInline content={'\\( x ^ \\prime \\)-component'} /> will
              no longer be the component whose basis-vector is parallel to the
              boost-axis! There's a button in the Options to reset the
              boost-direction to <MathJaxInline content={'\\( +x \\).'} />
            </li>
          </ul>
          <p>
            You might notice that the URL changes as you fiddle with the inputs
            and Options. This is intentional, and it allows you to share or
            bookmark configurations of interest. The state of the camera is
            encoded in the URL, too.
          </p>
        </div>
      </details>
      <details>
        <summary>Camera controls for 3D visualization</summary>
        <div>
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
        <summary id="hotkeys">Hotkeys</summary>
        <div>
          <p>
            You can use the keyboard to control the input-parameters and many of
            the Options. (Disclaimer: I can't guarantee that all hotkeys work in
            all browsers on all operating systems. On my Mac, they do work in
            every browser I've tested: Safari, Chrome, Firefox, and Edge.)
          </p>
          <p>
            To increase or decrease a vector-component (or, in the case of a
            velocity, its magnitude or one of its direction-parameters):
          </p>
          <ol>
            <li>
              hold the key for the vector's name (<kbd>e</kbd> for the electric
              field, <kbd>b</kbd> for the magnetic field, <kbd>v</kbd> for the
              boost velocity, or <kbd>u</kbd> for the particle velocity);
            </li>
            <li>
              hold the key for the input you're changing (<kbd>x</kbd>,{' '}
              <kbd>y</kbd>, or <kbd>z</kbd> for a Cartesian component of the
              electric or magnetic field, and <kbd>r</kbd>, <kbd>p</kbd> [for
              phi], or <kbd>t</kbd> [for theta] for the appropriate parameter of
              a velocity);
            </li>
            <li>
              and press either the up- or down-arrow (<kbd>↑</kbd> or{' '}
              <kbd>↓</kbd>).
            </li>
          </ol>
          <p>
            For example, to decrease the{' '}
            <MathJaxInline content={'\\( E_x \\)'} /> component, press{' '}
            <kbd>e</kbd> + <kbd>x</kbd> + <kbd>↓</kbd>. And to increase the{' '}
            <MathJaxInline content={'\\( \\phi \\)-parameter'} /> for{' '}
            <MathJaxInline content={'\\( \\vec u \\),'} /> press <kbd>u</kbd> +{' '}
            <kbd>p</kbd> + <kbd>↑</kbd>.
          </p>
          <p>
            The velocity-vectors have a couple of additional controls. To
            reverse the direction of the boost velocity, press <kbd>v</kbd> +{' '}
            <kbd>-</kbd>. To reverse the direction of the particle velocity,
            press <kbd>u</kbd> + <kbd>-</kbd>. To reset the direction of the
            boost velocity (to the <MathJaxInline content={'\\( +x \\)'} />{' '}
            direction), press <kbd>v</kbd> + <kbd>0</kbd>. To reset the
            direction of the particle velocity (to the{' '}
            <MathJaxInline content={'\\( -x \\)'} /> direction), press{' '}
            <kbd>u</kbd> + <kbd>0</kbd>.
          </p>
          <p>
            The particle's charge can be increased with <kbd>q</kbd> +{' '}
            <kbd>↑</kbd> and decreased with <kbd>q</kbd> + <kbd>↓</kbd>. Use{' '}
            <kbd>m</kbd> + <kbd>↑</kbd> and <kbd>m</kbd> + <kbd>↓</kbd> to
            control the particle's mass.
          </p>
          <p>
            The show/hide settings in the Options have the following hotkeys:
          </p>
          <ul>
            <li>
              <kbd>c</kbd> toggles the component-vectors parallel and
              perpendicular to the boost-velocity;
            </li>
            <li>
              <kbd>s</kbd> toggles the Poynting vector;
            </li>
            <li>
              <kbd>w</kbd> (not <kbd>u</kbd>!) toggles the particle velocity;
            </li>
            <li>
              <kbd>f</kbd> toggles the Lorentz force;
            </li>
            <li>
              <kbd>a</kbd> toggles the particle acceleration;
            </li>
            <li>
              <kbd>h</kbd> toggles the boost-velocity and the boosted
              quantities;
            </li>
            <li>
              <kbd>d</kbd> toggles the field-vectors and quantities derived from
              them.
            </li>
          </ul>
          <p>
            Use <kbd>k</kbd> to reset the camera.
          </p>
        </div>
      </details>
      <details>
        <summary>Formulas used</summary>
        <div>
          <p>
            The most elegant way to express how quantities transform under
            Lorentz boosts is with a manifestly covariant formulation. In making
            this app, however, I had no choice but to get my hands dirty with
            the transformation formulas for non-covariant quantities. I've found
            that using the boost <em>rapidity</em> (as opposed to the boost
            velocity <MathJaxInline content={'\\( \\vec v \\)'} /> and Lorentz
            factor{' '}
            <MathJaxInline
              content={'\\( \\gamma = \\frac{1}{ \\sqrt{ 1 - v ^2 } } \\))'}
            />{' '}
            makes the formulas easier to digest.
          </p>
          <p>
            Below are the transformation formulas I used. The quantity{' '}
            <MathJaxInline content={'\\( \\hat v \\)'} /> is the <em>unit</em>{' '}
            vector in the direction of the boost velocity{' '}
            <MathJaxInline content={'\\( \\vec v \\),'} /> and the
            aforementioned boost rapidity is{' '}
            <MathJaxInline content={'\\( \\eta = \\tanh ^{-1} v \\)'} /> (that's
            the inverse hyperbolic tangent, and{' '}
            <MathJaxInline content={'\\(  v \\)'} /> is the magnitude of{' '}
            <MathJaxInline content={'\\( \\vec v \\)).'} />
          </p>
          <ul>
            <li>
              <MathJaxInline
                content={
                  '\\( \\vec E ^ \\prime = \\cosh \\eta \\, \\vec E + \\sinh \\eta \\, ( \\hat v \\times \\vec B ) - 2 \\sinh ^2 \\frac{\\eta}{2} \\, ( \\hat v \\cdot \\vec E ) \\hat v \\)'
                }
              />
            </li>
            <li>
              <MathJaxInline
                content={
                  '\\( \\vec B ^ \\prime = \\cosh \\eta \\, \\vec B - \\sinh \\eta \\, ( \\hat v \\times \\vec E ) - 2 \\sinh ^2 \\frac{\\eta}{2} \\, ( \\hat v \\cdot \\vec B ) \\hat v \\)'
                }
              />
            </li>
            <li>
              <MathJaxInline
                content={
                  '\\( \\vec u ^ \\prime = \\dfrac{ \\vec u + \\left ( 2 \\sinh ^2 \\frac{ \\eta }{ 2 } \\, ( \\hat v \\cdot \\vec u ) - \\sinh \\eta \\right ) \\hat v }{ \\cosh \\eta - \\sinh \\eta \\, ( \\hat v \\cdot \\vec u ) } \\)'
                }
              />
            </li>
          </ul>
          <p>(I didn't say they were pretty!)</p>
          <p>
            It follows from the definition of{' '}
            <MathJaxInline content={'\\( \\eta \\)'} /> that{' '}
            <MathJaxInline content={'\\( \\cosh \\eta = \\gamma \\)'} /> and
            that <MathJaxInline content={'\\( \\sinh \\eta = \\gamma v \\).'} />{' '}
            To write the formulas in their more familiar "non-rapidity" form,
            make those substitutions, use{' '}
            <MathJaxInline content={'\\( \\vec v = v \\hat v \\)'} /> and the
            identity{' '}
            <MathJaxInline
              content={
                '\\( 2 \\sinh ^2 \\frac{ \\eta }{ 2 } = \\cosh \\eta - 1 \\),'
              }
            />{' '}
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
              <MathJaxInline content={'\\( \\vec E \\cdot \\vec B \\)'} /> and{' '}
              <MathJaxInline content={'\\( E^2 - B^2 \\)'} /> are invariant,
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
              <MathJaxInline content={'\\( \\vec E \\)'} /> and{' '}
              <MathJaxInline content={'\\( \\vec B \\)'} /> that are{' '}
              <em>perpendicular</em> to the boost-velocity{' '}
              <MathJaxInline content={'\\( \\vec v \\)'} /> change. The
              components that are <em>parallel</em> to{' '}
              <MathJaxInline content={'\\( \\vec v \\)'} /> retain their value.
            </li>
            <li>
              Under a Lorentz boost, <em>all</em> components of a
              velocity-vector <MathJaxInline content={'(\\( \\vec u \\))'} />{' '}
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
              <MathJaxInline content={'\\( \\vec u \\)'} /> to be parallel to
              the boost-velocity <MathJaxInline content={'\\( \\vec v \\),'} />{' '}
              then you'll find that the component of{' '}
              <MathJaxInline content={'\\( \\vec F \\)'} /> that's parallel to
              those vectors is equal to the corresponding component of{' '}
              <MathJaxInline content={'\\( \\vec F ^ \\prime \\).'} /> So try
              setting both <MathJaxInline content={'\\( \\vec v \\)'} /> and{' '}
              <MathJaxInline content={'\\( \\vec u \\)'} /> to point along the{' '}
              <MathJaxInline content={'\\( x \\)-axis'} /> (by using the "Reset"
              buttons in the Options, say);{' '}
              <MathJaxInline content={'\\( F_x \\)'} /> and{' '}
              <MathJaxInline content={'\\( F ^ \\prime _x \\)'} /> should then
              have the same value.
            </li>
          </ul>
        </div>
      </details>
    </div>
  </div>
);

export default TitleAndInstructions;
