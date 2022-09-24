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
          Sorry about that.
        </p>
        <p>A few notes:</p>
        <ul className="ml-4 list-disc">
          <li>Electric and magnetic fields are measured in the same unit.</li>
          <li>
            The speed of light is set to 1, and speed-inputs (the r-components
            for velocity-vectors) must be strictly less than that.
          </li>
          <li>
            Spherical components are of the "math" flavor, where φ is the polar
            angle (with reference to the y-axis) and θ is the azimuthal angle
            (with reference to the z-axis).
          </li>
          <li>
            The Cartesian axes and their labels are fixed. Perhaps in the future
            I'll make them adjustable or have them adapt to the vectors in the
            space, but for now they're static.
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
            you can restore it with the "Reset Camera" button below the
            visualization.
          </li>
        </ul>
      </div>
    </details>
  </div>
);

export default TitleAndInstructions;
