import { Canvas } from '@react-three/fiber';
import useStore, { State } from '../store/store';
import Vector from '../components/Vector';
import Axes from '../components/Axes';
import Head from 'next/head';
import Options from '../components/Options';
import VectorFieldset from '../components/VectorFieldset';
import { Color, textColor } from '../helpers/Color';
import VectorFieldsetSpherical from '../components/VectorFieldsetSpherical';
import TitleAndInstructions from '../components/TitleAndInstructions';
import { useRefsAndHotkeys } from '../hooks/useRefsAndHotkeys';
import { getCalculatedQuantities } from '../helpers/getCalculatedQuantities';
import CameraController from '../components/CameraController';
import { useSetStateFromQueryParams } from '../hooks/useSetStateFromQueryParams';
import { useSetQueryParams } from '../hooks/useSetQueryParams';

const titleAndInstructions = <TitleAndInstructions />;
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
  setParticleVelocityR: state.setParticleVelocityR,
  setParticleVelocityPhi: state.setParticleVelocityPhi,
  setParticleVelocityTheta: state.setParticleVelocityTheta,
  flipParticleVelocity: state.flipParticleVelocity,
  setParticleCharge: state.setParticleCharge,
  setParticleMass: state.setParticleMass,
  showComponentVectors: state.showComponentVectors,
  showPoynting: state.showPoynting,
  showParticleVelocity: state.showParticleVelocity,
  showLorentzForce: state.showLorentzForce,
  showParticleAcceleration: state.showParticleAcceleration,
  hideBoostedQuantities: state.hideBoostedQuantities,
  hideFieldVectors: state.hideFieldVectors,
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
    eXRef,
    eYRef,
    eZRef,
    bXRef,
    bYRef,
    bZRef,
    vRRef,
    vPhiRef,
    vThetaRef,
    vResetRef,
    uRRef,
    uPhiRef,
    uThetaRef,
    uResetRef,
    qRef,
    mRef,
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
    flipBoostVelocity,
    setParticleVelocityR,
    setParticleVelocityPhi,
    setParticleVelocityTheta,
    flipParticleVelocity,
    setParticleCharge,
    setParticleMass,
    showComponentVectors,
    showPoynting,
    showParticleVelocity,
    showLorentzForce,
    showParticleAcceleration,
    hideBoostedQuantities,
    hideFieldVectors,
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
        </title>
        <meta
          name="description"
          content="Lorentz boost calculator and visualizer for electric and magnetic field-vectors and particle dynamics."
        />
      </Head>

      {/*
        Needs explicit height (any height will do, apparently), or the canvas continually
        grows vertically for some reason. Also therefore needs visible y-overflow, which
        should be the case by default, but we set it explicitly just to be safe.
      */}
      <main className="container mt-10 flex !h-0 flex-col space-y-10 !overflow-y-visible">
        {titleAndInstructions}

        {/* Needs to be min-height. Not sure why, but it works. */}
        <Canvas className="min-h-[600px] px-6 [&>*]:border">
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
            label="u"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={
              !showParticleVelocity &&
              !showLorentzForce &&
              !showParticleAcceleration
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
            label="u′"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={
              (!showParticleVelocity &&
                !showLorentzForce &&
                !showParticleAcceleration) ||
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
            label="S′"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={!showPoynting || hideBoostedQuantities || hideFieldVectors}
          />
        </Canvas>

        <form
          className="flex flex-wrap gap-8 pb-10"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Options
            cameraRef={cameraRef}
            vResetRef={vResetRef}
            uResetRef={uResetRef}
            showCompsRef={showCompsRef}
            showSRef={showSRef}
            showURef={showURef}
            showFRef={showFRef}
            showARef={showARef}
            hideVRef={hideVRef}
            hideEandBRef={hideEandBRef}
          />

          <VectorFieldsetSpherical
            color={Color.V}
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
            flipper={flipBoostVelocity}
            x={boostVelocityCartesian[0]}
            y={boostVelocityCartesian[1]}
            z={boostVelocityCartesian[2]}
          />

          <VectorFieldset
            color={Color.E}
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
          />

          <VectorFieldset
            color={Color.B}
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
          />

          <VectorFieldsetSpherical
            color={Color.U}
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
            flipper={flipParticleVelocity}
            x={particleVelocityCartesian[0]}
            y={particleVelocityCartesian[1]}
            z={particleVelocityCartesian[2]}
          />

          <fieldset className={textColor[Color.U]}>
            <legend>Particle charge and mass</legend>
            <div>
              <label>
                Charge (q)
                <input
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
              </label>
            </div>
            <div>
              <label>
                Mass (m)
                <input
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
              </label>
            </div>
          </fieldset>

          <VectorFieldset
            color={Color.S}
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
            legend="Boosted particle velocity (u′)"
            r={particleVelocityPrimeSpherical.radius}
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
            legend="Boosted particle acceleration (a′)"
            x={particleAccelerationPrime[0]}
            y={particleAccelerationPrime[1]}
            z={particleAccelerationPrime[2]}
            xDisabled
            yDisabled
            zDisabled
            isPrime
          />
        </form>
      </main>
    </>
  );
};

export default Page;
