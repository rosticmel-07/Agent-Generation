import React from 'react';
import {Composition} from 'remotion';
import {BridgeReel} from './BridgeReel';
import './style.css';

export const Root: React.FC = () => (
  <Composition
    id="BridgeReel"
    component={BridgeReel}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={750}
  />
);
