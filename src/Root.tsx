import React from 'react';
import {Composition} from 'remotion';
import {BridgeReel} from './BridgeReel';
import {BridgeLanding150} from './BridgeLanding150';
import landingPlan from '../data/landing-150.json';
import './style.css';

export const Root: React.FC = () => (
  <>
  <Composition
    id="BridgeLanding150"
    component={BridgeLanding150}
    width={1080}
    height={1920}
    fps={landingPlan.fps}
    durationInFrames={Math.round(landingPlan.duration * landingPlan.fps)}
  />
  <Composition
    id="BridgeReel"
    component={BridgeReel}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={750}
  />
  </>
);
