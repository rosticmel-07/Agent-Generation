import React from 'react';
import {Composition} from 'remotion';
import {BridgeReel} from './BridgeReel';
import {BridgeLanding150} from './BridgeLanding150';
import {BridgeAdClick} from './BridgeAdClick';
import {BridgeDirectQuestions} from './BridgeDirectQuestions';
import landingPlan from '../data/landing-150.json';
import adClickPlan from '../data/ad-click.json';
import directQuestionsPlan from '../data/direct-questions.json';
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
    id="BridgeAdClick"
    component={BridgeAdClick}
    width={1080}
    height={1920}
    fps={adClickPlan.fps}
    durationInFrames={Math.round(adClickPlan.duration * adClickPlan.fps)}
  />
  <Composition
    id="BridgeDirectQuestions"
    component={BridgeDirectQuestions}
    width={1080}
    height={1920}
    fps={directQuestionsPlan.fps}
    durationInFrames={Math.round(directQuestionsPlan.duration * directQuestionsPlan.fps)}
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
