import React from 'react';
import { CreateATGism } from './CreateATGism';
import { RandomAtgism } from './RandomAtgism';
import { AlexaInstructionsCard } from './AlexaInstructionsCard';
import { Auth } from '../models/models';

type AtgismProps = {
  auth?: Auth
}

export const Atgism = (props: AtgismProps) => {
  console.info('Atgism props', props);
  const cardStyle = {
    marginTop: '15px'
  }
  return (
    <div>
      <div>
        <AlexaInstructionsCard></AlexaInstructionsCard>
      </div>
      <div style={cardStyle}>
        <RandomAtgism auth={props.auth}/>
      </div>
      <div style={cardStyle}>
        <CreateATGism auth={props.auth}/>
      </div>
    </div>
  );
}
