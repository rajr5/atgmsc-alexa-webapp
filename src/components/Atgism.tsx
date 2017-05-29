import React from 'react';
import { CreateATGism } from './CreateATGism';
import { RandomAtgism } from './RandomAtgism';
import { AlexaInstructionsCard } from './AlexaInstructionsCard';
import { Auth } from '../models/models';

type AtgismProps = {
  auth?: Auth;
  createAlert: (message: string, actionText?: string, autoHideDuration?: number) => void;
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
        <RandomAtgism auth={props.auth} createAlert={props.createAlert}/>
      </div>
      <div style={cardStyle}>
        <CreateATGism auth={props.auth} createAlert={props.createAlert}/>
      </div>
    </div>
  );
}
