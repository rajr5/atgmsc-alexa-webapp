import { createAtgism } from '../services/dataservice';
import { ATGIsmInput, Auth } from '../models/models';
import React from 'react';
import { Card, CardTitle, CardActions, CardHeader, CardText, RaisedButton } from 'material-ui';

export const AlexaInstructionsCard = () => {

  const cardStyle = {
    marginTop: '15px'
  }
  return (
    <Card>
      <CardHeader
        title="Adding the ATG MSC Skill to your Alexa"
        subtitle="Voice control is the way to go"
        actAsExpander={true}
        showExpandableButton={true}/>
      <CardText expandable={true}>
        <strong>Instructions for adding the ATG MSC skill to your Alexa</strong>
        <ol>
          <li>Open the Alexa app on your phone or tablet</li>
          <li>Open the menu and select <strong>Skills</strong></li>
          <li>In the search bar, type <strong>ATG MSC</strong></li>
          <li>Select <strong>Enable Skill</strong></li>
        </ol>
        <p>After adding the skill, you can invoke the skill by saying on of the following commands:</p>
        <ul>
          <li>Alexa, ask ATG MSC to tell me an ATGism</li>
          <li>Alexa, ask ATG MSC what the dress code is today</li>
          <li>Alexa, ask ATG MSC what the dress code is tomorrow</li>
        </ul>
      </CardText>
    </Card>
  );
}

