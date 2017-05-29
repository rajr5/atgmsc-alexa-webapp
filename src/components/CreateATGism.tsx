import { createAtgism } from '../services/dataservice';
import { ATGIsmInput, Auth } from '../models/models';
import React from 'react';
import { Card, CardTitle, CardActions, CardHeader, CardText, RaisedButton, CircularProgress, TextField } from 'material-ui';
import { SocialMood, SocialMoodBad, AvReplay, ContentBlock } from 'material-ui/svg-icons';
import { red500, green500, blue500 } from 'material-ui/styles/colors';
const { Grid, Row, Col } = require('react-flexbox-grid');
import { getAuth } from '../services/auth';

export interface CreateAtgismState {
  atgism?: ATGIsmInput;
  loading: boolean;
  isError?: boolean;
  error?: string;
}

type AtgismProps = {
  auth?: Auth
}

// <props, state>
export class CreateATGism extends React.Component<AtgismProps, CreateAtgismState> {

  constructor(props: any) {
    super(props);
    
    this.state = {
      atgism: {
        person: '',
        message: '',
        submittedBy: this.props.auth ? this.props.auth.fullName : ''
      },
      loading: false,
      isError: false,
    };
    this.createATGism = this.createATGism.bind(this);
    this.isFormComplete = this.isFormComplete.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    
  }

  public componentDidMount() {
    console.info('CreateATGism componentDidMount()', this.props);
    this.setState({atgism: {person: '',  message: '', submittedBy: this.props.auth ? this.props.auth.fullName : ''}});
  }

  createATGism() {
    console.log('createATGism()');
    this.setState({loading: true});
    createAtgism(this.state.atgism)
    .then(atgism => {
      console.log('atgism', atgism);
      this.setState({isError: false, loading: false, atgism: { person: '', message: '', submittedBy: '' }});
    })
    .catch(err => {
      console.log(err);
      this.setState({error: 'Error obtaining random atgism :(', isError: true, loading: false});
    });
  }

  handleFormChange(ev: any) {
    const target = ev.target;
    const atgism: ATGIsmInput = this.state.atgism;
    atgism[target.name] = target.value;
    this.setState({
      atgism
    });
  }

  isFormComplete(): boolean {
    return !(this.state.atgism.person.length > 0 && this.state.atgism.message.length > 0 && this.props.auth && this.props.auth.fullName.length > 0);
  }

  public render() {
    return (
      <div>
        <Card>
          <CardHeader
            title="Submit ATGism"
            subtitle="Share some juicy love with the team" />
          <CardText>
            <Grid fluid>
              <Col>
              {!this.props.auth || !this.props.auth.access_token ?
                <Row>
                    <span style={{color: red500}}><ContentBlock color={red500}></ContentBlock><span>Login to enable submitting ATGisms</span></span>
                  </Row> :
                  <span></span>}
                <Row>
                  <TextField name="person" floatingLabelText="Who Says this ATGism" hintText="Persons name or nickname" value={this.state.atgism.person} onChange={this.handleFormChange} disabled={!this.props.auth || !this.props.auth.access_token}/>
                </Row>
                <Row>
                  <TextField name="message" floatingLabelText="ATGism" hintText="Ensure the ATGism uses proper spelling and punctuation." multiLine={true} value={this.state.atgism.message} onChange={this.handleFormChange} disabled={!this.props.auth || !this.props.auth.access_token}/>
                </Row>
                <Row>
                  <TextField name="submittedBy" floatingLabelText="Submitted By" value={this.props.auth ? this.props.auth.fullName : ''} disabled={true}/>
                </Row>
              </Col>
            </Grid>
          </CardText>
          <CardActions>
            <RaisedButton label="Submit" disabled={this.isFormComplete()} icon={<AvReplay color={blue500}></AvReplay>}></RaisedButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}
