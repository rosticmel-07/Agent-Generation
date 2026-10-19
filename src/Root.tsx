import React from 'react';
import {Composition} from 'remotion';
import {BridgeReel} from './BridgeReel';
import {BridgeLanding150} from './BridgeLanding150';
import {BridgeAdClick} from './BridgeAdClick';
import {BridgeDirectQuestions} from './BridgeDirectQuestions';
import {BridgeTwoOffers} from './BridgeTwoOffers';
import {BridgePhotosChoice} from './BridgePhotosChoice';
import {BridgeCleaning} from './BridgeCleaning';
import {BridgeCleaningPremium} from './BridgeCleaningPremium';
import {BridgeAutoService} from './BridgeAutoService';
import autoServicePlan from '../data/auto-service.json';
import landingPlan from '../data/landing-150.json';
import adClickPlan from '../data/ad-click.json';
import directQuestionsPlan from '../data/direct-questions.json';
import twoOffersPlan from '../data/two-offers.json';
import photosChoicePlan from '../data/photos-choice.json';
import cleaningPlan from '../data/cleaning.json';
import cleaningPremiumPlan from '../data/cleaning-premium.json';
import './style.css';

export const Root: React.FC = () => (
  <>
  <Composition id="BridgeAutoService" component={BridgeAutoService} width={1080} height={1920}
    fps={autoServicePlan.fps} durationInFrames={Math.round(autoServicePlan.duration * autoServicePlan.fps)}/>
  <Composition
    id="BridgeCleaningPremium"
    component={BridgeCleaningPremium}
    width={1080}
    height={1920}
    fps={cleaningPremiumPlan.fps}
    durationInFrames={Math.round(cleaningPremiumPlan.duration * cleaningPremiumPlan.fps)}
  />
  <Composition
    id="BridgeCleaning"
    component={BridgeCleaning}
    width={1080}
    height={1920}
    fps={cleaningPlan.fps}
    durationInFrames={Math.round(cleaningPlan.duration * cleaningPlan.fps)}
  />
  <Composition
    id="BridgePhotosChoice"
    component={BridgePhotosChoice}
    width={1080}
    height={1920}
    fps={photosChoicePlan.fps}
    durationInFrames={Math.round(photosChoicePlan.duration * photosChoicePlan.fps)}
  />
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
    id="BridgeTwoOffers"
    component={BridgeTwoOffers}
    width={1080}
    height={1920}
    fps={twoOffersPlan.fps}
    durationInFrames={Math.round(twoOffersPlan.duration * twoOffersPlan.fps)}
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
