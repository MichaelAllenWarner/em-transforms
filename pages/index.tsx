import { Canvas } from '@react-three/fiber';
import useStore, { State } from '../store/store';
import Vector from '../components/Vector';
import Axes from '../components/Axes';
import Head from 'next/head';
import Options from '../components/Options';
import VectorFieldset from '../components/VectorFieldset';
import { Color, ColorDark, textColor, textColorDark } from '../helpers/Color';
import VectorFieldsetSpherical from '../components/VectorFieldsetSpherical';
import ThemeSwitch from '../components/ThemeSwitch';
import Instructions from '../components/Instructions';
import { useRefsAndHotkeys } from '../hooks/useRefsAndHotkeys';
import { getCalculatedQuantities } from '../helpers/getCalculatedQuantities';
import CameraController from '../components/CameraController';
import { useSetStateFromQueryParams } from '../hooks/useSetStateFromQueryParams';
import { useSetQueryParams } from '../hooks/useSetQueryParams';
import { hotkeys } from '../helpers/hotkeys';
import { round } from '../helpers/round';

const axes = <Axes />;

const storeSelector = (state: State) => ({
  eField: state.eField,
  bField: state.bField,
  boostVelocity: state.boostVelocity,
  particleVelocity: state.particleVelocity,
  particleCharge: state.particleCharge,
  particleMass: state.particleMass,
  setEFieldX: state.setEFieldX,
  setEFieldY: state.setEFieldY,
  setEFieldZ: state.setEFieldZ,
  setBFieldX: state.setBFieldX,
  setBFieldY: state.setBFieldY,
  setBFieldZ: state.setBFieldZ,
  setBoostVelocityR: state.setBoostVelocityR,
  setBoostVelocityPhi: state.setBoostVelocityPhi,
  setBoostVelocityTheta: state.setBoostVelocityTheta,
  flipBoostVelocity: state.flipBoostVelocity,
  resetBoostVelocity: state.resetBoostVelocity,
  setParticleVelocityR: state.setParticleVelocityR,
  setParticleVelocityPhi: state.setParticleVelocityPhi,
  setParticleVelocityTheta: state.setParticleVelocityTheta,
  flipParticleVelocity: state.flipParticleVelocity,
  resetParticleVelocity: state.resetParticleVelocity,
  setParticleCharge: state.setParticleCharge,
  setParticleMass: state.setParticleMass,
  showComponentVectors: state.showComponentVectors,
  showPoynting: state.showPoynting,
  showParticleVelocity: state.showParticleVelocity,
  showLorentzForce: state.showLorentzForce,
  showParticleAcceleration: state.showParticleAcceleration,
  hideBoostedQuantities: state.hideBoostedQuantities,
  hideFieldVectors: state.hideFieldVectors,
  showInvariants: state.showInvariants,
});

const Page = () => {
  useSetStateFromQueryParams();
  useSetQueryParams();

  const {
    cameraRef,
    showCompsRef,
    showSRef,
    showURef,
    showFRef,
    showARef,
    hideVRef,
    hideEandBRef,
    showInvariantsRef,
    eXRef,
    eYRef,
    eZRef,
    bXRef,
    bYRef,
    bZRef,
    vRRef,
    vPhiRef,
    vThetaRef,
    uRRef,
    uPhiRef,
    uThetaRef,
    qRef,
    mRef,
    vFlip,
    uFlip,
    vReset,
    eFlip,
    bFlip,
    uReset,
    rotateX,
    rotateY,
    rotateZ,
  } = useRefsAndHotkeys();

  const {
    eField,
    bField,
    boostVelocity,
    particleVelocity,
    particleCharge,
    particleMass,
    setEFieldX,
    setEFieldY,
    setEFieldZ,
    setBFieldX,
    setBFieldY,
    setBFieldZ,
    setBoostVelocityR,
    setBoostVelocityPhi,
    setBoostVelocityTheta,
    setParticleVelocityR,
    setParticleVelocityPhi,
    setParticleVelocityTheta,
    setParticleCharge,
    setParticleMass,
    showComponentVectors,
    showPoynting,
    showParticleVelocity,
    showLorentzForce,
    showParticleAcceleration,
    hideBoostedQuantities,
    hideFieldVectors,
    showInvariants,
  } = useStore(storeSelector);

  const {
    boostVelocityCartesian,
    boostUnit,
    ePrime,
    bPrime,
    particleVelocityCartesian,
    particleVelocityPrime,
    lorentzForce,
    lorentzForcePrime,
    particleAcceleration,
    particleAccelerationPrime,
    poynting,
    poyntingPrime,
    particleVelocityPrimeSpherical,
    eDotB,
    eSqMinusBSq,
    eDotBPrime,
    eSqMinusBSqPrime,
  } = getCalculatedQuantities({
    boostVelocity,
    eField,
    bField,
    particleVelocity,
    particleCharge,
    particleMass,
  });

  return (
    <>
      <Head>
        <title>
          Lorentz Transformation of the Electric and Magnetic Fields, Visualized
          in 3D
        </title>
        <meta
          name="description"
          content="Lorentz boost calculator and visualizer for electric and magnetic field-vectors and particle dynamics."
        />
      </Head>

      <main className="container mt-10 flex flex-col gap-10">
        <div className="flex flex-col gap-6 mx-auto max-w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-5xl">
            Lorentz Transformation of the Electric and Magnetic Fields,
            Visualized in 3D
          </h1>

          <noscript className="block">
            <div className="border p-4 inline-block">
              <p>
                <strong>
                  JavaScript is currently disabled in your browser. To use this
                  app, you'll have to enable JavaScript and reload the page.
                </strong>
              </p>
            </div>
          </noscript>

          <ThemeSwitch />

          <div className="lg:600-h:hidden xl:!block xl:800-h:!hidden">
            <Instructions />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative h-[calc(600rem/16)] lg:600-h:sticky xl:h-[calc(800rem/16)] xl:!static xl:800-h:!sticky top-0">
            <Canvas className="px-6 xl:px-0 [&>*]:border">
              <CameraController ref={cameraRef} />

              <ambientLight />

              {axes}

              <Vector
                x={eField[0]}
                y={eField[1]}
                z={eField[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.E}
                colorDark={ColorDark.E}
                label="E"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={hideFieldVectors}
              />

              <Vector
                x={bField[0]}
                y={bField[1]}
                z={bField[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.B}
                colorDark={ColorDark.B}
                label="B"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={hideFieldVectors}
              />

              <Vector
                x={particleVelocityCartesian[0]}
                y={particleVelocityCartesian[1]}
                z={particleVelocityCartesian[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.U}
                colorDark={ColorDark.U}
                label="u"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={
                  !showParticleVelocity &&
                  ((!showLorentzForce && !showParticleAcceleration) ||
                    hideFieldVectors)
                }
              />

              <Vector
                x={particleVelocityPrime[0]}
                y={particleVelocityPrime[1]}
                z={particleVelocityPrime[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.UPrime}
                colorDark={ColorDark.UPrime}
                label="u′"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={
                  (!showParticleVelocity &&
                    ((!showLorentzForce && !showParticleAcceleration) ||
                      hideFieldVectors)) ||
                  hideBoostedQuantities
                }
              />

              <Vector
                x={lorentzForce[0]}
                y={lorentzForce[1]}
                z={lorentzForce[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.F}
                colorDark={ColorDark.F}
                label="F"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={
                  (!showLorentzForce && !showParticleAcceleration) ||
                  hideFieldVectors
                }
              />

              <Vector
                x={lorentzForcePrime[0]}
                y={lorentzForcePrime[1]}
                z={lorentzForcePrime[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.FPrime}
                colorDark={ColorDark.FPrime}
                label="F′"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={
                  (!showLorentzForce && !showParticleAcceleration) ||
                  hideBoostedQuantities ||
                  hideFieldVectors
                }
              />

              <Vector
                x={particleAcceleration[0]}
                y={particleAcceleration[1]}
                z={particleAcceleration[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.A}
                colorDark={ColorDark.A}
                label="a"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={!showParticleAcceleration || hideFieldVectors}
              />

              <Vector
                x={particleAccelerationPrime[0]}
                y={particleAccelerationPrime[1]}
                z={particleAccelerationPrime[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.APrime}
                colorDark={ColorDark.APrime}
                label="a′"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={
                  !showParticleAcceleration ||
                  hideBoostedQuantities ||
                  hideFieldVectors
                }
              />

              <Vector
                x={boostVelocityCartesian[0]}
                y={boostVelocityCartesian[1]}
                z={boostVelocityCartesian[2]}
                color={Color.V}
                colorDark={ColorDark.V}
                label="v"
                hide={hideBoostedQuantities}
              />

              <Vector
                x={ePrime[0]}
                y={ePrime[1]}
                z={ePrime[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.EPrime}
                colorDark={ColorDark.EPrime}
                label="E′"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={hideBoostedQuantities || hideFieldVectors}
              />

              <Vector
                x={bPrime[0]}
                y={bPrime[1]}
                z={bPrime[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.BPrime}
                colorDark={ColorDark.BPrime}
                label="B′"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={hideBoostedQuantities || hideFieldVectors}
              />

              <Vector
                x={poynting[0]}
                y={poynting[1]}
                z={poynting[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.S}
                colorDark={ColorDark.S}
                label="S"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={!showPoynting || hideFieldVectors}
              />

              <Vector
                x={poyntingPrime[0]}
                y={poyntingPrime[1]}
                z={poyntingPrime[2]}
                boostUnitX={boostUnit[0]}
                boostUnitY={boostUnit[1]}
                boostUnitZ={boostUnit[2]}
                color={Color.SPrime}
                colorDark={ColorDark.SPrime}
                label="S′"
                showComponentVectors={
                  showComponentVectors && !hideBoostedQuantities
                }
                hide={
                  !showPoynting || hideBoostedQuantities || hideFieldVectors
                }
              />
            </Canvas>
            {showInvariants && !hideFieldVectors && (
              <div
                aria-hidden="true"
                {...{ inert: '' }}
                className="absolute top-2 right-2 mr-6 xl:mr-0 text-sm font-mono bg-black/50 text-white px-2 py-1 rounded pointer-events-none"
              >
                <div className="flex flex-col gap-2">
                  <div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;E · B = {round(eDotB)}</div>
                    <div>&nbsp;&nbsp;E′ · B′ = {round(eDotBPrime)}</div>
                  </div>
                  <div>
                    <div>&nbsp;&nbsp;E² − B² = {round(eSqMinusBSq)}</div>
                    <div>E′² − B′² = {round(eSqMinusBSqPrime)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="hidden lg:600-h:block xl:!hidden xl:800-h:!block">
              <Instructions stickyVersion />
            </div>
            <form
              className="flex flex-wrap gap-8 pb-10"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Options
                cameraRef={cameraRef}
                showCompsRef={showCompsRef}
                showSRef={showSRef}
                showURef={showURef}
                showFRef={showFRef}
                showARef={showARef}
                hideVRef={hideVRef}
                hideEandBRef={hideEandBRef}
                showInvariantsRef={showInvariantsRef}
                rotateX={rotateX}
                rotateY={rotateY}
                rotateZ={rotateZ}
              />

              <VectorFieldsetSpherical
                color={Color.V}
                colorDark={ColorDark.V}
                legend="Boost velocity (v)"
                r={boostVelocity[0]}
                phi={boostVelocity[1]}
                theta={boostVelocity[2]}
                rSetter={setBoostVelocityR}
                phiSetter={setBoostVelocityPhi}
                thetaSetter={setBoostVelocityTheta}
                rRef={vRRef}
                phiRef={vPhiRef}
                thetaRef={vThetaRef}
                isVelocity
                flipper={vFlip}
                resetter={vReset}
                x={boostVelocityCartesian[0]}
                y={boostVelocityCartesian[1]}
                z={boostVelocityCartesian[2]}
                reverseHotkey={hotkeys.vectorFlip.v}
                resetHotkey={hotkeys.vectorReset.v}
              />

              <VectorFieldset
                color={Color.E}
                colorDark={ColorDark.E}
                legend="Original electric field (E)"
                x={eField[0]}
                y={eField[1]}
                z={eField[2]}
                step="0.1"
                xSetter={setEFieldX}
                ySetter={setEFieldY}
                zSetter={setEFieldZ}
                xRef={eXRef}
                yRef={eYRef}
                zRef={eZRef}
                flipper={eFlip}
                reverseHotkey={hotkeys.fieldFlip.e}
              />

              <VectorFieldset
                color={Color.B}
                colorDark={ColorDark.B}
                legend="Original magnetic field (B)"
                x={bField[0]}
                y={bField[1]}
                z={bField[2]}
                step="0.1"
                xSetter={setBFieldX}
                ySetter={setBFieldY}
                zSetter={setBFieldZ}
                xRef={bXRef}
                yRef={bYRef}
                zRef={bZRef}
                flipper={bFlip}
                reverseHotkey={hotkeys.fieldFlip.b}
              />

              <VectorFieldsetSpherical
                color={Color.U}
                colorDark={ColorDark.U}
                legend="Original particle velocity (u)"
                r={particleVelocity[0]}
                phi={particleVelocity[1]}
                theta={particleVelocity[2]}
                rRef={uRRef}
                phiRef={uPhiRef}
                thetaRef={uThetaRef}
                isVelocity
                rSetter={setParticleVelocityR}
                phiSetter={setParticleVelocityPhi}
                thetaSetter={setParticleVelocityTheta}
                flipper={uFlip}
                resetter={uReset}
                x={particleVelocityCartesian[0]}
                y={particleVelocityCartesian[1]}
                z={particleVelocityCartesian[2]}
                reverseHotkey={hotkeys.vectorFlip.u}
                resetHotkey={hotkeys.vectorReset.u}
              />

              <fieldset
                className={`${textColor[Color.U]} ${textColorDark[ColorDark.U]}`}
              >
                <legend>Particle charge and mass</legend>
                <div className="mt-2 flex flex-col gap-3 leading-none">
                  <div>
                    <label className="flex">
                      <span className="shrink-0">Charge (q)</span>
                      <span className="flex flex-col gap-2">
                        <span className="safari-only-range-wrapper">
                          <input
                            type="range"
                            value={particleCharge}
                            step="0.1"
                            min="-10"
                            max="10"
                            onChange={(e) => {
                              let n = e.target.valueAsNumber;
                              if (isNaN(n)) n = 1;
                              setParticleCharge(n);
                            }}
                          />
                        </span>
                        <input
                          aria-label="Charge (q)"
                          ref={qRef}
                          type="number"
                          step="0.1"
                          value={particleCharge}
                          onChange={(e) => {
                            let n = e.target.valueAsNumber;
                            if (isNaN(n)) n = 1;
                            setParticleCharge(n);
                          }}
                        />
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex">
                      <span className="shrink-0">Mass (m)</span>
                      <span className="flex flex-col gap-2">
                        <span className="safari-only-range-wrapper">
                          <input
                            type="range"
                            value={particleMass}
                            step="0.1"
                            min="0.1"
                            max="10"
                            onChange={(e) => {
                              let n = e.target.valueAsNumber;
                              if (n <= 0) n = 0.1;
                              if (isNaN(n)) n = 1;
                              setParticleMass(n);
                            }}
                          />
                        </span>
                        <input
                          aria-label="Mass (m)"
                          ref={mRef}
                          type="number"
                          step="0.1"
                          value={particleMass}
                          onChange={(e) => {
                            let n = e.target.valueAsNumber;
                            if (n <= 0) n = 0.1;
                            if (isNaN(n)) n = 1;
                            setParticleMass(n);
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>
              </fieldset>

              <VectorFieldset
                color={Color.S}
                colorDark={ColorDark.S}
                legend="Original Poynting vector (S)"
                x={poynting[0]}
                y={poynting[1]}
                z={poynting[2]}
                xDisabled
                yDisabled
                zDisabled
              />

              <VectorFieldset
                color={Color.F}
                colorDark={ColorDark.F}
                legend="Original Lorentz force (F)"
                x={lorentzForce[0]}
                y={lorentzForce[1]}
                z={lorentzForce[2]}
                xDisabled
                yDisabled
                zDisabled
              />

              <VectorFieldset
                color={Color.A}
                colorDark={ColorDark.A}
                legend="Original particle acceleration (a)"
                x={particleAcceleration[0]}
                y={particleAcceleration[1]}
                z={particleAcceleration[2]}
                xDisabled
                yDisabled
                zDisabled
              />

              <VectorFieldset
                color={Color.EPrime}
                colorDark={ColorDark.EPrime}
                legend="Boosted electric field (E′)"
                x={ePrime[0]}
                y={ePrime[1]}
                z={ePrime[2]}
                xDisabled
                yDisabled
                zDisabled
                isPrime
              />

              <VectorFieldset
                color={Color.BPrime}
                colorDark={ColorDark.BPrime}
                legend="Boosted magnetic field (B′)"
                x={bPrime[0]}
                y={bPrime[1]}
                z={bPrime[2]}
                xDisabled
                yDisabled
                zDisabled
                isPrime
              />

              <VectorFieldsetSpherical
                color={Color.UPrime}
                colorDark={ColorDark.UPrime}
                legend="Boosted particle velocity (u′)"
                r={particleVelocityPrimeSpherical.r}
                phi={particleVelocityPrimeSpherical.phi}
                theta={particleVelocityPrimeSpherical.theta}
                isVelocity
                rDisabled
                phiDisabled
                thetaDisabled
                isPrime
                x={particleVelocityPrime[0]}
                y={particleVelocityPrime[1]}
                z={particleVelocityPrime[2]}
              />

              <VectorFieldset
                color={Color.SPrime}
                colorDark={ColorDark.SPrime}
                legend="Boosted Poynting vector (S′)"
                x={poyntingPrime[0]}
                y={poyntingPrime[1]}
                z={poyntingPrime[2]}
                xDisabled
                yDisabled
                zDisabled
                isPrime
              />

              <VectorFieldset
                color={Color.FPrime}
                colorDark={ColorDark.FPrime}
                legend="Boosted Lorentz force (F′)"
                x={lorentzForcePrime[0]}
                y={lorentzForcePrime[1]}
                z={lorentzForcePrime[2]}
                xDisabled
                yDisabled
                zDisabled
                isPrime
              />

              <VectorFieldset
                color={Color.APrime}
                colorDark={ColorDark.APrime}
                legend="Boosted particle acceleration (a′)"
                x={particleAccelerationPrime[0]}
                y={particleAccelerationPrime[1]}
                z={particleAccelerationPrime[2]}
                xDisabled
                yDisabled
                zDisabled
                isPrime
              />

              <fieldset>
                <legend>Field invariants</legend>
                <div className="mt-2 flex flex-col gap-3 leading-none">
                  {[
                    { label: 'E · B', ariaLabel: 'E dot B', value: eDotB },
                    {
                      label: 'E′ · B′',
                      ariaLabel: 'E prime dot B prime',
                      value: eDotBPrime,
                    },
                    {
                      label: 'E² − B²',
                      ariaLabel: 'E squared minus B squared',
                      value: eSqMinusBSq,
                    },
                    {
                      label: 'E′² − B′²',
                      ariaLabel: 'E prime squared minus B prime squared',
                      value: eSqMinusBSqPrime,
                    },
                  ].map(({ label, ariaLabel, value }) => (
                    <div key={label}>
                      <label className="flex">
                        <span
                          aria-hidden="true"
                          className="shrink-0 leading-normal"
                        >
                          {label}
                        </span>
                        <input
                          aria-label={ariaLabel}
                          type="number"
                          value={round(value)}
                          disabled
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
